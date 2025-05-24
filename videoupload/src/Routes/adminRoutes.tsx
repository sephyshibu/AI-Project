import { BrowserRouter as Router, Routes,Route,Navigate } from 'react-router'

import Login from '../components/Admin/login'
import Dashboard from '../components/Admin/dashboard'
function App() {
 


  return (
    <>

    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/admin/admindashboard' element={<Dashboard />}/>
        
      </Routes>
    </Router>
    </>
    
  
  )
}

export default App
