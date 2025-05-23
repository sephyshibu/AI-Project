import React, { useState ,useEffect} from "react";
import { useDispatch } from "react-redux";
import { loginuser } from '../features/UserSlice';
import { addtoken } from "../features/TokenSlice";
import { useNavigate } from "react-router";
import { GoogleOAuthProvider,GoogleLogin ,type CredentialResponse} from "@react-oauth/google";
import { gapi } from "gapi-script";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../axios/axios";

interface LoginForm{
    email:string,
    password:string
}

interface GooglePayload{
    email:string,
    sub:string,
    name:string
}

const Login:React.FC=()=>{
    const clientId="699319272981-124dj113d9a2aqbmo2s756u6152bher2.apps.googleusercontent.com"

    const[formdata,setformdata]=useState<LoginForm>({
        email:"",
        password:""
    })
    const [loading, setloading]=useState(false);
    const[error,seterror]=useState<string |null>(null)
    // const [msg, setMsg] = useState<string>('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        navigate("/videoupload"); // Redirect to home if user is logged in
      }
    }, [navigate]);

    
    useEffect(()=>{

        function start(){
            gapi.client.init({
                clientId:clientId,
                scope:""
            })
        } 

        gapi.load('client:auth2', start)
    },[])

    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setformdata((prev)=>
           ( {...prev,[e.target.name]:e.target.value}))

    }

    const handleGoogleLogin=async(credentialresponse:CredentialResponse)=>{
        console.log("fdaa")
        if(credentialresponse?.credential){
            try {
                console.log(credentialresponse);

                const credential=jwtDecode<GooglePayload>(credentialresponse.credential)
                console.log(credential)

                const{email, sub, name}=credential

                console.log(email)
                const response=await axiosInstance.post('/googlelogin',{email,sub, name})
                console.log(response?.data)
                const userId=response.data.user._id
                localStorage.setItem("userId",userId)
                navigate('/');
            } catch (err: any) {
                if (err.response && err.response.data && err.response.data.message) {
                  seterror(err.response.data.message); // Server's custom message
                } else {
                  seterror('Something went wrong. Please try again.');
                }
                
              }
        }

    }
 

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault()
        seterror(null)
        setloading(true)

        if(!formdata.email && !formdata.password){
            seterror("email and password is required")
            return
        }

        if(!formdata.email){
            seterror("Email is required")
            return
        }
        if(!formdata.password){
            seterror("password is required")
            return
        }
        
        try {
            const{email,password}=formdata
            const response=await axiosInstance.post('/login',{email,password})
            dispatch(loginuser(response.data.user))
            dispatch(addtoken({token:response.data.token}))
            console.log(response)
            console.log("login data",response.data)
            const userId=response.data.user._id
            localStorage.setItem("userId",userId)
            seterror('');
            navigate('/');
      


        } catch (error:any) {
            console.error("login errror",error)
            seterror(error.response?.data?.message ||"Something went wrong")   
        }
        finally {
            setloading(false);
          }
    }



    return(
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A1D56] relative overflow-hidden px-4">
      
        
       
  
        {/* Main Content */}
        <div className="flex items-center justify-center gap-8 mt-32">
          
          
  
          {/* Center Login Card */}
          <div className="bg-white rounded-2xl shadow-lg p-20 w-[400px] lg:w-[500px]">

          <h2 className="text-2xl font-bold text-center text-[#0A1D56] mb-6">USER LOGIN</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="email"
                name="email"
                placeholder="Enter Username"
                value={formdata.email}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A9FF]"
              />
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formdata.password}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A9FF]"
              />
  
              {error && <p className="text-red-500 text-center text-sm">{error}</p>}
  
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00A9FF] hover:bg-[#008BD1] text-white font-semibold py-3 rounded-md transition duration-300 transform hover:scale-105"
              >
                {loading ? "Logging in..." : "LOGIN"}
              </button>

              <GoogleOAuthProvider clientId={clientId}>
                <div>
                    <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={()=>{
                                seterror("google login failed")
                            }}
                        />
                </div>
              </GoogleOAuthProvider>
  
              <div className="text-center text-sm text-gray-600 mt-3">
               
                <a href="/signup" className="hover:underline">Don't have an account?</a>
              </div>
            </form>
          </div>
  

          
        </div>
  
      
      </div>
    );
  };

export default Login