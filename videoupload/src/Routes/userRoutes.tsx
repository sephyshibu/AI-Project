import { BrowserRouter as Router, Routes,Route,Navigate } from 'react-router'

import Login from '../components/Login'
import VideoUI from '../components/VideoUI'
import Signup from '../components/Signup'
const UserRouter=()=>{
 


  return (
    <>


      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/videoupload' element={<VideoUI />}/>
      </Routes>

    </>
    
  
  )
}

export default UserRouter
