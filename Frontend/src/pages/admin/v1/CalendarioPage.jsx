import Sidebar from "../../../components/admin/Sidebar";

const DAYS = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

export default function CalendarioPage() {
  const cells = [
    { empty: true }, { empty: true },
    ...Array.from({length:31}, (_,i) => ({ day: i+1, active: i+1 === 17 })),
    { empty: true }, { empty: true },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div className="header-info">
            <span className="breadcrumb">Sistema / Principal / Calendario</span>
            <h1>Calendario General</h1>
            <p>Planificación de reservas, eventos y horarios.</p>
          </div>
          <div className="header-actions">
            <div className="view-toggles">
              <button className="toggle-btn active">Mes</button>
              <button className="toggle-btn">Semana</button>
              <button className="toggle-btn">Día</button>
            </div>
            <button className="btn-primary-action"><i className="fa-solid fa-plus"></i> Añadir</button>
          </div>
        </header>

        <div className="page-container full-height-container">
          <div className="calendar-massive-view widget-card">
            <div className="cal-view-header">
              <h2>Agosto 2026</h2>
              <div className="cal-controls">
                <button className="btn-sm-outline">Hoy</button>
                <button className="btn-icon"><i className="fa-solid fa-chevron-left"></i></button>
                <button className="btn-icon"><i className="fa-solid fa-chevron-right"></i></button>
              </div>
            </div>
            <div className="cal-view-body">
              <div className="cal-massive-grid">
                {DAYS.map((d) => <div className="c-day-head" key={d}>{d}</div>)}
                {cells.map((c, i) =>
                  c.empty
                    ? <div className="c-day-cell empty" key={`e${i}`}></div>
                    : <div className={`c-day-cell${c.active ? " active-day" : ""}`} key={c.day}>{c.day}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

