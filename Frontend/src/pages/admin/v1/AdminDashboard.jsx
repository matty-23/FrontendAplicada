import Sidebar from "../../../components/admin/Sidebar";
import "../../../dashboard.css";


export default function AdminDashboard() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div className="header-title">
            <h1>Panel General</h1>
            <p>Resumen de actividades y estado del sistema</p>
          </div>
          <div className="header-actions">
            <div className="search-bar">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input type="text" placeholder="Buscar en el sistema..." />
            </div>
            <button className="icon-btn">
              <i className="fa-regular fa-bell"></i>
            </button>
          </div>
        </header>

        <div className="widgets-grid">
          <div className="widget-container">
            <h2 className="widget-title">Calendario</h2>
            <div className="widget-card dashboard-widget">
              <div className="calendar-days">
                <span className="day active">L</span>
                <span className="day">M</span>
                <span className="day">M</span>
                <span className="day">J</span>
                <span className="day">V</span>
                <span className="day">S</span>
                <span className="day">D</span>
              </div>
            </div>
          </div>

          <div className="widget-container">
            <h2 className="widget-title">Horas Becarios</h2>
            <div className="widget-card dashboard-widget">
              <div className="scrollable-content">
                {["Becario 1","Becario 2","Becario 3","Becario 4"].map((b) => (
                  <div className="list-item" key={b}>
                    <div className="avatar-circle"><i className="fa-solid fa-user"></i></div>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="widget-container">
            <h2 className="widget-title">Solicitudes pendientes</h2>
            <div className="widget-card dashboard-widget">
              <div className="scrollable-content">
                {["Permiso Especial","Reserva de Equipo","Cambio de Turno"].map((s) => (
                  <div className="message-group" key={s}>
                    <div className="message-box">
                      <span className="msg-title">{s}</span>
                      <button className="btn-revisar">Revisar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="widget-container">
            <h2 className="widget-title">Disponibilidad de Equipos</h2>
            <div className="widget-card dashboard-widget">
              <div className="scrollable-content">
                {[
                  {name:"Proyector Aula 1",busy:false},
                  {name:"Laptop B",busy:true},
                  {name:"Cámara Reflex",busy:false},
                  {name:"Kit Luces",busy:false},
                  {name:"Micrófono Corbatero",busy:true},
                  {name:"Trípode Manfrotto",busy:false},
                ].map((e) => (
                  <div className="list-item" key={e.name}>
                    <span>{e.name}</span>
                    <span className={`status-dot${e.busy?" busy":""}`}></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

