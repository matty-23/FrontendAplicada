import Login from "./pages/LoginPage.jsx";
import { InfoUsuario } from "./components/InfoUsuario.jsx";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/userContext.jsx';
import './App.css'

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<InfoUsuario/>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
