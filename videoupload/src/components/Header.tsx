// import React ,{useState,useEffect}from 'react';
// import {persistor} from '../app/store'
// import { useNavigate } from 'react-router';

// import { logoutuser } from '../features/UserSlice';
// import { cleartoken } from '../features/TokenSlice';
// import { useDispatch } from 'react-redux';

// // const socket: Socket = io('http://localhost:3000', {
// //   transports: ['websocket'], // force WebSocket only
// // });


// const Header: React.FC = () => {
//    const [unreadCounts, setUnreadCounts] = useState<{ bookingId: string; count: number; technicianName: string }[]>([]);

//     const [showDropdown, setShowDropdown] = useState(false);
//     const userId=localStorage.getItem('userId')
//     const navigate=useNavigate()
//     const dispatch=useDispatch()
   
//     const handleLoginLogout=async()=>{
//         if(userId){
//             localStorage.removeItem('userId')
//             localStorage.removeItem('persist:user');
//                 localStorage.removeItem('usertoken');

//                 dispatch(logoutuser());
//                 dispatch(cleartoken())
       
//             await persistor.purge()
//             navigate('/')
//         }else{
//             navigate('/')
//         }
//     }


    

//     return (
//       <nav className="bg-[#0A2342] text-white py-2 px-6 shadow-md">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
   
        

       
//         <div className="flex items-center space-x-6">
       
//           <button type='button' onClick={handleLoginLogout}>
//             {userId?"LogOut":"Login"}
//           </button>
//           </div>
//       </div>
//     </nav>
//     )
//   };
  
//   export default Header;
  

import React ,{useState,useEffect}from 'react';
import {persistor} from '../app/store'
import { useNavigate } from 'react-router';

import { logoutuser } from '../features/UserSlice';
import { cleartoken } from '../features/TokenSlice';
import { useDispatch } from 'react-redux';

// const socket: Socket = io('http://localhost:3000', {
//   transports: ['websocket'], // force WebSocket only
// });


const Header: React.FC = () => {
   const [unreadCounts, setUnreadCounts] = useState<{ bookingId: string; count: number; technicianName: string }[]>([]);

    const [showDropdown, setShowDropdown] = useState(false);
    const userId=localStorage.getItem('userId')
    const navigate=useNavigate()
    const dispatch=useDispatch()
   
    const handleLoginLogout=async()=>{
        if(userId){
            localStorage.removeItem('userId')
            localStorage.removeItem('persist:user');
                localStorage.removeItem('usertoken');

                dispatch(logoutuser());
                dispatch(cleartoken())
       
            await persistor.purge()
            navigate('/')
        }else{
            navigate('/')
        }
    }


    

    return (
      <nav className="bg-[#0A2342] text-white py-2 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">Transcripta IQ</div> {/* Added title */}
        

       
        <div className="flex items-center space-x-6">
       
          <button
            type='button'
            onClick={handleLoginLogout}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition duration-300 ease-in-out" // Styled button
          >
            {userId ? "LogOut" : "Login"} {/* Changed text to My Profile */}
          </button>
          </div>
      </div>
    </nav>
    )
  };
  
  export default Header;