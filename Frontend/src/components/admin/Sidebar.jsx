import { useNavigate, useLocation } from "react-router-dom";
import "../../dashboard.css";

const NAV_ITEMS = [
  {
    section: "PRINCIPAL",
    items: [
      { label: "Dashboard",    icon: "fa-solid fa-border-all",     path: "/admin" },
      { label: "Solicitudes",  icon: "fa-regular fa-file-lines",   path: "/admin/solicitudes" },
      { label: "Calendario",   icon: "fa-regular fa-calendar",     path: "/admin/calendario" },
    ],
  },
  {
    section: "GESTIÓN",
    items: [
      { label: "Eventos",       icon: "fa-solid fa-ticket",          path: "/admin/eventos" },
      { label: "Becarios",      icon: "fa-solid fa-users-graduate",  path: "/admin/becarios" },
      { label: "Inventario",    icon: "fa-solid fa-boxes-stacked",   path: "/admin/inventario" },
      { label: "Estadísticas",  icon: "fa-solid fa-chart-simple",    path: "/admin/estadisticas" },
    ],
  },
  {
    section: "SISTEMA",
    items: [
      { label: "Configuración", icon: "fa-solid fa-gear", path: "/admin/configuracion" },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="brand-logo">
        <img src="/Logo_white.png" alt="Logo UAP" className="brand-logo-img" />
      </div>


      <div className="profile-card">
        <div className="profile-icon-wrapper">
          <i className="fa-solid fa-user profile-icon"></i>
        </div>
        <div className="profile-info">
          <span className="profile-name">Administrador</span>
          <span className="profile-email">admin@sistema.com</span>
        </div>
      </div>

      {NAV_ITEMS.map((group) => (
        <div className="nav-section" key={group.section}>
          <h3 className="nav-subtitle">{group.section}</h3>
          <ul className="nav-menu">
            {group.items.map((item) => {
              const isV1 = location.pathname.startsWith("/v1");
              const targetPath = isV1 ? `/v1${item.path}` : item.path;
              const isActive = location.pathname === targetPath || location.pathname === item.path;
              return (
                <li
                  key={item.path}
                  className={`nav-item${isActive ? " active" : ""}`}
                  onClick={() => navigate(targetPath)}
                >
                  <span className="nav-text">{item.label}</span>
                  <i className={item.icon}></i>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

    </aside>
  );
}
