import React from 'react';

import { useNavigate } from 'react-router';

import { logoutadmin } from '../../features/AdminSlice';
import { cleartoken } from '../../features/AdminTokenSlice';
import { useDispatch } from 'react-redux';




const Header: React.FC = () => {
   
    const adminemail=localStorage.getItem('admin-email')
    const navigate=useNavigate()
    const dispatch=useDispatch()
   
   const handleLogOut=async()=>{
        if(adminemail){
        localStorage.removeItem('admin-email')
        
        localStorage.removeItem('persist:admin');
        localStorage.removeItem('admintoken');

        dispatch(logoutadmin());
        dispatch(cleartoken());
        // await persistor.purge()
        navigate('/admin')
        }else{
        navigate('/admin/admindashboard')
        }
    }

    

    return (
      <nav className="bg-[#0A2342] text-white py-2 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">Transcripta IQ</div> {/* Added title */}
        

       
        <div className="flex items-center space-x-6">
       
          <button
            type='button'
            onClick={handleLogOut}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out" // Styled button
          >
            {adminemail ? "LogOut" : "Login"} {/* Changed text to My Profile */}
          </button>
          </div>
      </div>
    </nav>
    )
  };
  
  export default Header;