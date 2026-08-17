import Login from "./pages/LoginPage.jsx";

// V1 Pages (Base)
import AdminDashboardV1 from "./pages/admin/v1/AdminDashboard.jsx";
import EventosPageV1 from "./pages/admin/v1/EventosPage.jsx";
import SolicitudesPageV1 from "./pages/admin/v1/SolicitudesPage.jsx";
import CalendarioPageV1 from "./pages/admin/v1/CalendarioPage.jsx";
import BecariosPageV1 from "./pages/admin/v1/BecariosPage.jsx";
import InventarioPageV1 from "./pages/admin/v1/InventarioPage.jsx";
import EstadisticasPageV1 from "./pages/admin/v1/EstadisticasPage.jsx";

// V2 Pages (Modern & Efficient)
import AdminDashboardV2 from "./pages/admin/v2/AdminDashboardV2.jsx";
import EventosPageV2 from "./pages/admin/v2/EventosPageV2.jsx";
import SolicitudesPageV2 from "./pages/admin/v2/SolicitudesPageV2.jsx";
import CalendarioPageV2 from "./pages/admin/v2/CalendarioPageV2.jsx";
import BecariosPageV2 from "./pages/admin/v2/BecariosPageV2.jsx";
import InventarioPageV2 from "./pages/admin/v2/InventarioPageV2.jsx";
import EstadisticasPageV2 from "./pages/admin/v2/EstadisticasPageV2.jsx";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/userContext.jsx';
import './App.css';
import './dashboard.css';
import './dashboard-v2.css';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* Versión 2 (Nueva versión moderna por defecto) */}
          <Route path="/admin" element={<AdminDashboardV2 />} />
          <Route path="/admin/eventos" element={<EventosPageV2 />} />
          <Route path="/admin/solicitudes" element={<SolicitudesPageV2 />} />
          <Route path="/admin/calendario" element={<CalendarioPageV2 />} />
          <Route path="/admin/becarios" element={<BecariosPageV2 />} />
          <Route path="/admin/inventario" element={<InventarioPageV2 />} />
          <Route path="/admin/estadisticas" element={<EstadisticasPageV2 />} />

          {/* Rutas explícitas /v2/admin/* */}
          <Route path="/v2/admin" element={<AdminDashboardV2 />} />
          <Route path="/v2/admin/eventos" element={<EventosPageV2 />} />
          <Route path="/v2/admin/solicitudes" element={<SolicitudesPageV2 />} />
          <Route path="/v2/admin/calendario" element={<CalendarioPageV2 />} />
          <Route path="/v2/admin/becarios" element={<BecariosPageV2 />} />
          <Route path="/v2/admin/inventario" element={<InventarioPageV2 />} />
          <Route path="/v2/admin/estadisticas" element={<EstadisticasPageV2 />} />

          {/* Versión 1 (Base intacta) */}
          <Route path="/v1/admin" element={<AdminDashboardV1 />} />
          <Route path="/v1/admin/eventos" element={<EventosPageV1 />} />
          <Route path="/v1/admin/solicitudes" element={<SolicitudesPageV1 />} />
          <Route path="/v1/admin/calendario" element={<CalendarioPageV1 />} />
          <Route path="/v1/admin/becarios" element={<BecariosPageV1 />} />
          <Route path="/v1/admin/inventario" element={<InventarioPageV1 />} />
          <Route path="/v1/admin/estadisticas" element={<EstadisticasPageV1 />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

