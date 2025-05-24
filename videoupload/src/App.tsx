import { BrowserRouter as Router, Routes,Route,Navigate } from 'react-router'
import './App.css'
import UserRouter from './Routes/userRoutes'
import AdminRouter from './Routes/adminRoutes'
function App() {
 


  return (
    <>

    <Router>
      <Routes>
        <Route path='/*' element={<UserRouter/>}/>
        <Route path='/admin/*' element={<AdminRouter />}/>

      </Routes>
    </Router>
    </>
    
  
  )
}

export default App
