import Sidebar from "../../../components/admin/Sidebar";

export default function SolicitudesPage() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div className="header-info flex-row align-center">
            <i className="fa-solid fa-arrow-left back-icon"></i>
            <h1>Solicitudes</h1>
          </div>
          <div className="header-actions">
            <div className="search-bar search-bar-large">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Buscar solicitud..." />
              <i className="fa-solid fa-sliders text-muted cursor-pointer"></i>
            </div>
          </div>
        </header>

        <div className="solicitudes-layout">
          <div className="solicitudes-col">
            <h2 className="section-title">Solicitudes pendientes</h2>
            <div className="widget-card tall-card">
              <div className="scrollable-content">
                <h3 className="group-title">Semana actual</h3>
                {[
                  { nombre: "Reserva de Aula 1", sel: false },
                  { nombre: "Uso de Proyector", sel: true },
                  { nombre: "Permiso Especial Becario", sel: false },
                ].map((s) => (
                  <div className={`req-item${s.sel ? " selected-item" : ""}`} key={s.nombre}>
                    <div className="req-info">
                      <i className="fa-regular fa-clock text-muted"></i>
                      <span>{s.nombre}</span>
                    </div>
                    <button className={`btn-outline-action${s.sel ? " checked" : ""}`}></button>
                  </div>
                ))}
                <h3 className="group-title mt-20">Semana siguiente</h3>
                <div className="req-item">
                  <div className="req-info">
                    <i className="fa-regular fa-clock text-muted"></i>
                    <span>Solicitud Evento UX</span>
                  </div>
                  <button className="btn-outline-action"></button>
                </div>
              </div>
            </div>

            <h2 className="section-title mt-30">Solicitudes aceptadas</h2>
            <div className="widget-card" style={{padding: "18px"}}>
              {[
                { nombre: "Jornada de Puertas Abiertas", fecha: "12/08" },
                { nombre: "Reserva Laboratorio B", fecha: "10/08" },
                { nombre: "Mantenimiento de Servidores", fecha: "05/08" },
              ].map((s) => (
                <div className="req-item accepted" key={s.nombre}>
                  <div className="req-info">
                    <i className="fa-solid fa-circle-check text-success"></i>
                    <span>{s.nombre}</span>
                  </div>
                  <span className="badge-date">{s.fecha}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="solicitudes-col">
            <div className="calendar-widget widget-card">
              <div className="calendar-header">
                <button className="btn-icon"><i className="fa-solid fa-chevron-left"></i></button>
                <h3>Agosto 2026</h3>
                <button className="btn-icon"><i className="fa-solid fa-chevron-right"></i></button>
              </div>
              <div className="calendar-grid">
                {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map((d) => (
                  <div className="day-name" key={d}>{d}</div>
                ))}
                {[27,28,29,30,31].map((d) => <div className="calendar-day text-muted" key={"prev"+d}>{d}</div>)}
                {Array.from({length: 31}, (_,i) => i+1).map((d) => (
                  <div className="calendar-day" key={d}>
                    {d}
                    {d === 2 && <div className="cal-event event-standard">Seminario</div>}
                    {d === 10 && <div className="cal-event event-request">Lab B</div>}
                    {d === 11 && <><div className="cal-event event-request">Aula 1</div><div className="cal-event event-selected">Proyector</div></>}
                    {d === 17 && <div className="cal-event event-request">Evento UX</div>}
                  </div>
                ))}
              </div>
              <div className="calendar-legend">
                <span className="legend-item"><span className="dot dot-standard"></span> Eventos</span>
                <span className="legend-item"><span className="dot dot-request"></span> Solicitudes</span>
                <span className="legend-item"><span className="dot dot-selected"></span> Seleccionada</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

