import Login from "./pages/LoginPage.jsx";

// V2 Pages (Modern & Efficient)
import AdminDashboardV2 from "./pages/AdminDashboardV2.jsx";
import EventosPage from "./pages/Eventos/EventosPage.jsx";
import SolicitudesPageV2 from "./pages/SolicitudesPageV2.jsx";
import CalendarioPageV2 from "./pages/CalendarioPageV2.jsx";
import BecariosPageV2 from "./pages/BecariosPageV2.jsx";
import InventarioPageV2 from "./pages/InventarioPageV2.jsx";
import EstadisticasPageV2 from "./pages/EstadisticasPageV2.jsx";
import CrearEventoPage from "./pages/Eventos/CrearEventoPage.jsx"
import EventoDetallePage from "./pages/Eventos/EventoDetallePage.jsx";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from '../../context/userContext.jsx';
import './App.css';
import './dashboard-v2.css';
import { SideBar } from "./components/SideBar.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
//import './App.css'

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* Versión 2 (Nueva versión moderna por defecto) */}
          <Route path="/admin" element={<AdminDashboardV2 />} />
          <Route path="/admin/eventos" element={<EventosPage/>} />
          <Route path="/admin/eventos/crear" element={<CrearEventoPage />} />
          <Route path="/admin/eventos/editar/:id" element={<CrearEventoPage />} />
           <Route path="/admin/eventos/:id" element={<EventoDetallePage />} />
          <Route path="/admin/solicitudes" element={<SolicitudesPageV2 />} />
          <Route path="/admin/calendario" element={<CalendarioPageV2 />} />
          <Route path="/admin/becarios" element={<BecariosPageV2 />} />
          <Route path="/admin/inventario" element={<InventarioPageV2 />} />
          <Route path="/admin/estadisticas" element={<EstadisticasPageV2 />} />

        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

