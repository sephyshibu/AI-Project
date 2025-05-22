import React, { useState } from "react";
import axiosInstance from '../axios/axios';
import { useNavigate } from "react-router";

interface Signupform{
    name:string,
    email:string,
    password:string,
    confirmpassword:string,
    phone:string,
    

}


const Signup:React.FC=()=>{
    const[formdata,setformdata]=useState<Signupform>({
        name:"",
        email:"",
        password:"",
        confirmpassword:"",
        phone:""
    })

    const[loading,setloading]=useState(false)
    const[error,seterror]=useState<Partial<Signupform>>({})
    const navigate=useNavigate()

    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setformdata((prev)=>({
            ...prev,
            [e.target.name]: e.target.value

        }))
        
    }

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault()
        seterror({})
        setloading(true)

        let formErrors:any={}
        let isValid=true

        if (!formdata.name) {
          formErrors.name = "Username is required";
          isValid = false;
      } else if (!/^[A-Za-z ]+$/.test(formdata.name)) {
          formErrors.name = "Username must only contain letters and spaces.";
          isValid = false;
      }
      
        // Email validation (valid email format)
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!formdata.email) {
            formErrors.email = 'Email is required.';
            isValid = false;
        } else if (!emailPattern.test(formdata.email)) {
            formErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }


        // Password validation (at least 6 characters, one uppercase, one lowercase, one special character)
         const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
        if (!formdata.password) {
            formErrors.password = 'Password is required.';
            isValid = false;
        } else if (!passwordPattern.test(formdata.password)) {
            formErrors.password = 'Password must be at least 6 characters long and include one uppercase letter, one lowercase letter, and one special character.';
            isValid = false;
        }
      // Confirm password validation
        if (formdata.confirmpassword !== formdata.password) {
            formErrors.confirmpassword = 'Passwords do not match.';
            isValid = false;
        }

        if (!formdata.phone) {
            formErrors.phone = 'Phone number is required.';
            isValid = false;
        } else if (!/^\d{10}$/.test(formdata.phone)) {
            formErrors.phone = 'Phone number must be exactly 10 digits.';
            isValid = false;
        }

        // If any validation fails, set error messages
        seterror(formErrors);

        // If any validation fails, return early
        if (!isValid) {
          setloading(false); 
           return
        }

        try {
            const response=await axiosInstance.post('/signup',formdata)
      
            navigate('/otp',{state:{details:formdata}})
            console.log(response?.data?.message)
            
        } catch (error:any) {
            console.error("signup errror",error)
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

            <h2 className="text-2xl font-bold text-center text-[#0A1D56] mb-6">USER SIGNUP</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Left Side Image */}
          
              <input
                type="name"
                name="name"
                placeholder="Enter Username"
                value={formdata.name}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A9FF]"
              />
                 {error.name && <p className="text-red-500 text-center text-sm">{error.name}</p>}
          
             

              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formdata.email}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A9FF]"
              />
                

         
              {error.email && <p className="text-red-500 text-center text-sm">{error.email}</p>}

              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formdata.password}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A9FF]"
                />
               

           
              {error.password && <p className="text-red-500 text-center text-sm">{error.password}</p>}
              <input
                type="password"
                name="confirmpassword"
                placeholder="Enter Confirmpassword"
                value={formdata.confirmpassword}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A9FF]"
              />
              {error.confirmpassword&& <p className="text-red-500 text-center text-sm">{error.confirmpassword}</p>}
              <input
                type="phone"
                name="phone"
                placeholder="Enter Phonenumber"
                value={formdata.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A9FF]"
              />

              {error.phone && <p className="text-red-500 text-center text-sm">{error.phone}</p>}

  
             
  
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00A9FF] hover:bg-[#008BD1] text-white font-semibold py-3 rounded-md transition duration-300 transform hover:scale-105"
              >
                {loading ? "Signing in..." : "SignUp"}
              </button>
              <div className="text-center text-sm text-gray-600 mt-3">
              
                <a href="/" className="hover:underline">Already have account?</a>
              </div>
              
            </form>
          </div>
  
         
        </div>
  
        {/* Footer */}
        <div className="absolute bottom-0 mb-4 flex flex-col items-center text-white text-xs">
          <p>© 2025 HomePro</p>
        </div>
      </div>
    )
}
export default Signup