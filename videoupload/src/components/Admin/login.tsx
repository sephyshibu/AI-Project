import React, { useState,useEffect } from "react";
import axiosInstanceadmin from "../../axios/adminaxios";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { adminaddtoken } from "../../features/AdminTokenSlice";
import { loginadmin } from "../../features/AdminSlice";

interface LoginForm{
    email:string,
    password:string
}


const Login:React.FC=()=>{
    const[formdata,setformdata]=useState<LoginForm>({
        email:"",
        password:""
    })
    const dispatch =useDispatch();
    const navigate = useNavigate();
    const [loading, setloading]=useState(false);
    const[error,seterror]=useState<string |null>(null)
        
  useEffect(() => {
  const adminemail = localStorage.getItem('admin-email');
  const currentPath = window.location.pathname;
  
  if (adminemail && currentPath === '/admin') {
    navigate('/admin/admindashboard'); 
  }
}, [navigate]);


    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setformdata((prev)=>
           ( {...prev,[e.target.name]:e.target.value}))

    }


    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault()
        seterror(null)
        setloading(true)

        if(!formdata.email && !formdata.password){
            seterror("email and password is required")
            setloading(false)
            return
        }

        if(!formdata.email){
            seterror("Email is required")
            setloading(false)
            return
        }
        if(!formdata.password){
            seterror("password is required")
            setloading(false)
            return
        }
        
        try {
            const{email,password}=formdata
            const response=await axiosInstanceadmin.post('/login',{email,password})
            console.log("response", response)
            dispatch(loginadmin(response.data.admin))
            dispatch(adminaddtoken({admintoken:response.data.token}))
            console.log(response)
            console.log("login data",response.data)
            const adminemail=response.data.admin
            localStorage.setItem("admin-email",adminemail)
            seterror('');
            navigate('/admin/admindashboard');
      


        } catch (error:any) {
            console.error("login errror",error)
            seterror(error.response?.data?.message ||"Something went wrong")   
        }
        finally {
            setloading(false);
          }
    }



    return(
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#8EB69B] relative overflow-hidden px-4">
      

        {/* Main Content */}
        <div className="flex items-center justify-center gap-8 mt-32">
          
         
  
          {/* Center Login Card */}
          <div className="bg-white rounded-2xl shadow-lg p-20 max-w-full">
            <h2 className="text-2xl font-bold text-center text-[#0A1D56] mb-6">Admin LOGIN</h2>
            
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
                className="w-full bg-[#163] hover:bg-[#235347] text-white font-semibold py-3 rounded-md transition duration-300 transform hover:scale-105"
              >
                {loading ? "Logging in..." : "LOGIN"}
              </button>

              
              
            </form>
          </div>
  
          
        </div>
  
        {/* Footer */}
        <div className="absolute bottom-0 mb-4 flex flex-col items-center text-white text-xs">
          <p>© 2025 HomePro</p>
        </div>
      </div>
    );
  };

export default Login

