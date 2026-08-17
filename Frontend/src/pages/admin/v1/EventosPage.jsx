import Sidebar from "../../../components/admin/Sidebar";

export default function EventosPage() {
  const eventos = [
    { id: 1, titulo: "Jornada UX/UI",  fecha: "15/06/2026", responsable: "Juan Perez",     estado: "Pendiente" },
    { id: 2, titulo: "ExpoTech",       fecha: "22/06/2026", responsable: "Maria Lopez",    estado: "Pendiente" },
    { id: 3, titulo: "DevDay",         fecha: "01/07/2026", responsable: "Pedro Martinez", estado: "Pendiente" },
    { id: 4, titulo: "Hackathon 2026", fecha: "15/07/2026", responsable: "Ana García",     estado: "Activo" },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div className="header-info">
            <span className="breadcrumb">Sistema / Gestión / Eventos</span>
            <h1>Gestión de Eventos</h1>
          </div>
          <div className="header-actions">
            <button className="btn-primary-action">
              <i className="fa-solid fa-plus"></i> Nuevo Evento
            </button>
          </div>
        </header>

        <div className="page-container">
          <div className="stats-row">
            <div className="stat-box stat-primary">
              <div className="stat-icon"><i className="fa-solid fa-ticket"></i></div>
              <div className="stat-info">
                <span className="stat-label">Eventos Activos</span>
                <span className="stat-number">1</span>
              </div>
            </div>
            <div className="stat-box stat-secondary">
              <div className="stat-icon"><i className="fa-solid fa-clipboard-check"></i></div>
              <div className="stat-info">
                <span className="stat-label">Eventos a Aprobar</span>
                <span className="stat-number">3</span>
              </div>
            </div>
          </div>

          <div className="filters-card">
            <div className="search-bar search-bar-large">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Buscar evento por nombre o fecha..." />
            </div>
            <div className="filter-actions">
              <button className="btn-filter">Estado: <strong>Todos</strong> <i className="fa-solid fa-chevron-down"></i></button>
              <button className="btn-filter">Ordenar: <strong>A - Z</strong> <i className="fa-solid fa-chevron-down"></i></button>
            </div>
          </div>

          <div className="events-list">
            {eventos.map((e) => (
              <div className="event-card" key={e.id}>
                <div className="event-info-wrapper">
                  <h3 className="event-title">{e.titulo}</h3>
                  <div className="event-details-row">
                    <span className="event-detail"><i className="fa-regular fa-calendar-days"></i> {e.fecha}</span>
                    <span className="event-detail"><i className="fa-regular fa-user"></i> {e.responsable}</span>
                  </div>
                </div>
                <div className="event-status">
                  <span className={`status-badge ${e.estado === "Activo" ? "badge-active" : "badge-pending"}`}>{e.estado}</span>
                </div>
                <div className="event-action">
                  <button className="btn-detalles">Ver detalles <i className="fa-solid fa-arrow-right"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

