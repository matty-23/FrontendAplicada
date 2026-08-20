import Login from "./pages/LoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EventosPage from "./pages/Eventos/EventosPage.jsx";
import SolicitudesPage from "./pages/SolicitudesPage.jsx";
import CalendarioPage from "./pages/CalendarioPage.jsx";
import BecariosPage from "./pages/BecariosPage.jsx";
import InventarioPage from "./pages/InventarioPage.jsx";
import EstadisticasPage from "./pages/EstadisticasPage.jsx";
import CrearEventoPage from "./pages/Eventos/CrearEventoPage.jsx"
import EventoDetallePage from "./pages/Eventos/EventoDetallePage.jsx";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/userContext.jsx';
import "./styles/dashboard.css";
import './App.css';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* Versión 2 (Nueva versión moderna por defecto) */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/eventos" element={<EventosPage/>} />
          <Route path="/admin/eventos/crear" element={<CrearEventoPage />} />
          <Route path="/admin/eventos/editar/:id" element={<CrearEventoPage />} />
           <Route path="/admin/eventos/:id" element={<EventoDetallePage />} />
          <Route path="/admin/solicitudes" element={<SolicitudesPage />} />
          <Route path="/admin/calendario" element={<CalendarioPage />} />
          <Route path="/admin/becarios" element={<BecariosPage />} />
          <Route path="/admin/inventario" element={<InventarioPage />} />
          <Route path="/admin/estadisticas" element={<EstadisticasPage />} />

        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

