import Login from "./pages/LoginPage.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

function App() {
  
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        </Routes>
  </BrowserRouter>
  )
}

export default App
