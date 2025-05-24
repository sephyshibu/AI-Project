import { BrowserRouter as Router, Routes,Route,Navigate } from 'react-router'

import Login from '../components/Login'
import VideoUI from '../components/VideoUI'
import Signup from '../components/Signup'
function App() {
 


  return (
    <>

    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/videoupload' element={<VideoUI />}/>
      </Routes>
    </Router>
    </>
    
  
  )
}

export default App
