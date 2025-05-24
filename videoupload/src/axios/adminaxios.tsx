import axios,{AxiosError,type InternalAxiosRequestConfig} from 'axios';
import { persistor, store } from '../app/store';
import { cleanAdmin } from '../features/AdminSlice';
import { adminaddtoken,cleartoken } from '../features/AdminTokenSlice';

// Axios instance
const axiosInstanceadmin = axios.create({
    baseURL: import.meta.env.VITE_ADMin_PORT,
    withCredentials: true,
  });

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
  }
  axiosInstanceadmin.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
      const state = store.getState();
      const token = state.admintoken?.admintoken;
      const admin=state.admin?.admin
      console.log("Token being sent in asdmin:", token);


  
      console.log("admin in axios", admin);
      console.log("admin axios token", token);
      console.log("admin state", state);
  
      if (typeof token !== 'string') {
        console.error("Token is not a string:", token);
      }
  
      if (token) {
        console.log("if(token)", token);
        config.headers['Authorization'] = `Bearer ${token}`;
      }

       if (admin && admin._id) {
        config.headers['admin-id'] = admin._id;
      }  

      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
)

// Response Interceptor
axiosInstanceadmin.interceptors.response.use(
    (response) => response, // Forward successful responses
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        console.log('401 error detected:', error.response);
        originalRequest._retry = true;
  
        try {
           console.log('Triggering token refresh...');
          const response = await axiosInstanceadmin.post<{ admintoken: string }>('/refresh', {}, { withCredentials: true });
          const { admintoken } = response.data;
  
          console.log("response axios ", admintoken);
          store.dispatch(adminaddtoken({ admintoken })); // Update Redux with new token
  
          axiosInstanceadmin.defaults.headers.common['Authorization'] = `Bearer ${admintoken}`;
          originalRequest.headers['Authorization'] = `Bearer ${admintoken}`;
  
          return axiosInstanceadmin(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          // store.dispatch(logoutuser());
          
          store.dispatch(cleanAdmin()); // custom action to clear user
          store.dispatch(cleartoken()); 
          localStorage.removeItem("adminId");
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      }
       if (error.response?.status === 403) {
        const data = error.response.data as { message: string; action?: string };
        console.log("403 Error:", data); // 👈 Add this
        if (data?.action === 'blocked') {
         
          store.dispatch(cleanAdmin()); // custom action to clear user
          store.dispatch(cleartoken()); 
          localStorage.removeItem('adminId')
         
          window.location.href = '/'

          // Optionally: You can logout the user or redirect to login page if needed
        }
      }
      return Promise.reject(error);
    }
  );

  export default axiosInstanceadmin