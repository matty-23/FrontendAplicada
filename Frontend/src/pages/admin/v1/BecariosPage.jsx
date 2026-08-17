import Sidebar from "../../../components/admin/Sidebar";

const becarios = [
  { id: 1, nombre: "Lionel Messi",  horasPend: 16, horasApro: 16, selected: true },
  { id: 2, nombre: "Juan Paco",     horasPend: 12, horasApro: 20, selected: false },
  { id: 3, nombre: "Steve Rogers",  horasPend: 8,  horasApro: 24, selected: false },
];

export default function BecariosPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div className="header-info">
            <span className="breadcrumb">Sistema / Gestión / Becarios</span>
            <h1>Gestión de Becarios</h1>
            <p>Monitoreo de horas, actividades y estado de los integrantes.</p>
          </div>
          <div className="header-actions">
            <div className="search-bar">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Búsqueda rápida..." />
            </div>
            <button className="icon-btn"><i className="fa-regular fa-bell"></i></button>
          </div>
        </header>

        <div className="page-container">
          <div className="stats-row">
            <div className="stat-box stat-primary">
              <div className="stat-icon"><i className="fa-solid fa-user-check"></i></div>
              <div className="stat-info row-layout">
                <span className="stat-label text-white">Becario<br/>Seleccionado</span>
                <span className="stat-number text-white" style={{fontSize:"22px"}}>Lionel Messi</span>
              </div>
            </div>
            <div className="stat-box stat-secondary">
              <div className="stat-icon"><i className="fa-regular fa-clock"></i></div>
              <div className="stat-info row-layout">
                <span className="stat-label">Horas a<br/>Aprobar</span>
                <span className="stat-number">4</span>
              </div>
            </div>
            <div className="stat-box stat-secondary">
              <div className="stat-icon"><i className="fa-regular fa-star"></i></div>
              <div className="stat-info row-layout">
                <span className="stat-label">Horas<br/>Extras</span>
                <span className="stat-number">10</span>
              </div>
            </div>
          </div>

          <div className="filters-card transparent-bg">
            <div className="search-bar search-bar-large border-dark">
              <input type="text" placeholder="Filtrar becario..." />
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
            </div>
            <div className="filter-actions">
              <button className="btn-filter border-dark text-dark">Estado: Todos <i className="fa-solid fa-arrow-down"></i></button>
              <button className="btn-filter border-dark text-dark">Nombre: A - Z <i className="fa-solid fa-arrow-down"></i></button>
            </div>
          </div>

          <div className="becarios-grid">
            {becarios.map((b) => (
              <div className={`becario-card${b.selected ? " selected" : ""}`} key={b.id}>
                <div className="bc-header">
                  <div className="avatar-circle"><i className="fa-solid fa-user"></i></div>
                  <span className="bc-name">{b.nombre}</span>
                  <div className="bc-status">Estado: <span className="dot-status green"></span></div>
                </div>
                <div className="bc-hours-row">
                  <div className="bc-hour-box"><span>Horas pendientes:</span><strong>{b.horasPend}</strong></div>
                  <div className="bc-hour-box"><span>Horas aprobadas:</span><strong>{b.horasApro}</strong></div>
                </div>
                <div className="bc-actions">
                  <button className="btn-sm-outline">Ver detalles</button>
                  <button className="btn-sm-primary">Ver Horas</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

