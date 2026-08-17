import { useNavigate, useLocation } from "react-router-dom";
import "../../../dashboard-v2.css";


const NAV = [
  { section: "PRINCIPAL", items: [
    { label: "Dashboard",   icon: "fa-solid fa-border-all",     path: "/v2/admin",              badge: null },
    { label: "Solicitudes", icon: "fa-regular fa-file-lines",   path: "/v2/admin/solicitudes",  badge: "4" },
    { label: "Calendario",  icon: "fa-regular fa-calendar",     path: "/v2/admin/calendario",   badge: null },
  ]},
  { section: "GESTIÓN", items: [
    { label: "Eventos",      icon: "fa-solid fa-ticket",         path: "/v2/admin/eventos",      badge: "2" },
    { label: "Becarios",     icon: "fa-solid fa-users-graduate", path: "/v2/admin/becarios",     badge: null },
    { label: "Inventario",   icon: "fa-solid fa-boxes-stacked",  path: "/v2/admin/inventario",   badge: null },
    { label: "Estadísticas", icon: "fa-solid fa-chart-simple",   path: "/v2/admin/estadisticas", badge: null },
  ]},
  { section: "SISTEMA", items: [
    { label: "Configuración", icon: "fa-solid fa-gear", path: "/v2/admin/config", badge: null },
  ]},
];

export default function SidebarV2() {
  const nav = useNavigate();
  const loc = useLocation();

  return (
    <aside className="v2-sidebar">
      <div className="v2-sidebar-top">
        <div className="v2-logo">
          <img src="/Logo_white.png" alt="Logo UAP" />
          <span className="v2-logo-tag">Admin</span>
        </div>
      </div>


      <nav className="v2-nav">
        {NAV.map((g) => (
          <div className="v2-nav-section" key={g.section}>
            <span className="v2-nav-label">{g.section}</span>
            {g.items.map((item) => {
              const isActive = loc.pathname === item.path || loc.pathname === item.path.replace('/v2', '');
              return (
                <div
                  key={item.path}
                  className={`v2-nav-item${isActive ? " active" : ""}`}
                  onClick={() => nav(item.path)}
                >
                  <i className={item.icon}></i>
                  <span style={{flex:1}}>{item.label}</span>
                  {item.badge && <span className="v2-nav-badge">{item.badge}</span>}
                </div>
              );
            })}

          </div>
        ))}
      </nav>

      <div className="v2-sidebar-bottom">
        <div className="v2-user-card">
          <div className="v2-user-avatar">A</div>
          <div className="v2-user-info">
            <div className="v2-user-name">Administrador</div>
            <div className="v2-user-role">admin@sistema.com</div>
          </div>
          <i className="fa-solid fa-arrow-right-from-bracket v2-user-logout"></i>
        </div>
      </div>
    </aside>
  );
}
