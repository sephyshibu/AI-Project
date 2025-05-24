import { BrowserRouter as Router, Routes,Route,Navigate } from 'react-router'

import Login from '../components/Admin/login'
import Dashboard from '../components/Admin/dashboard'
const AdminRouter=()=>{
 


  return (
    <>


      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/admindashboard' element={<Dashboard />}/>
        
      </Routes>

    </>
    
  
  )
}

export default AdminRouter
