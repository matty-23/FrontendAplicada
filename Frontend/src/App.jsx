import Login from "./pages/LoginPage.jsx";
import { SideBar } from "./components/SideBar.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext.jsx';
//import './App.css'

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SideBar/>} />
          <Route path="/Inicio" element={<Dashboard/>}></Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
