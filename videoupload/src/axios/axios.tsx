import axios,{AxiosError,type InternalAxiosRequestConfig} from 'axios';
import { store,persistor } from '../app/store';
import { addtoken } from '../features/TokenSlice';


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",

    withCredentials: true,
    
  });

console.log("Base URL is:", import.meta.env.VITE_API_BASE_URL);

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
  }
axiosInstance.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
      const state = store.getState();
      const token = state.token?.token;
      const user = state.user?.user;
  
      console.log("user in axios", user);
      console.log("axios token", token);
      console.log("state", state);
  
      if (typeof token !== 'string') {
        console.error("Token is not a string:", token);
      }
  
      if (token) {
        console.log("if(token)", token);
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      if (user && user._id) {
        config.headers['user-id'] = user._id; // 👈 Set userId in headers
      }
  
      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
)
// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response, // Forward successful responses
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        console.log('401 error detected:', error.response);
        originalRequest._retry = true;
  
        try {
          console.log('Triggering token refresh...');
          const response = await axiosInstance.post<{ token: string }>('/refresh', {}, { withCredentials: true });
          const { token } = response.data;
          
          console.log("response axios ", token);
          store.dispatch(addtoken({ token })); // Update Redux with new token
  
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
  
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // store.dispatch(logoutuser());
        //   toast.error("Session expired. Please login again.");
          await persistor.purge();
          localStorage.removeItem("userId");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
      if (error.response?.status === 403) {
        const data = error.response.data as { message: string; action?: string };
        console.log("403 Error:", data); // 👈 Add this
        if (data?.action === 'blocked') {
        //   toast.error(data.message || "You are blocked by admin!");
           await persistor.purge();
          localStorage.removeItem("userId");
          window.location.href = "/login";

          // Optionally: You can logout the user or redirect to login page if needed
        }
      }
      return Promise.reject(error);
    }
  );

  export default axiosInstance