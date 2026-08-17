import SidebarV2 from "../../../components/admin/v2/SidebarV2";

const BECARIOS = [
  { id:1, nombre:"Lionel Messi",  iniciales:"LM", horasPend:16, horasApro:32, total:48, selected:true  },
  { id:2, nombre:"Juan Paco",     iniciales:"JP", horasPend:12, horasApro:20, total:48, selected:false },
  { id:3, nombre:"Steve Rogers",  iniciales:"SR", horasPend:8,  horasApro:28, total:48, selected:false },
];

export default function BecariosPageV2() {
  return (
    <div className="v2">
      <SidebarV2 />
      <div className="v2-main">
        <header className="v2-topbar">
          <div className="v2-topbar-left">
            <span className="v2-topbar-bc">Gestión / Becarios</span>
            <span className="v2-topbar-title">Gestión de Becarios</span>
          </div>
          <div className="v2-topbar-right">
            <div className="v2-search"><i className="fa-solid fa-magnifying-glass"></i><input placeholder="Filtrar becario..." /></div>
            <button className="v2-icon-btn"><i className="fa-regular fa-bell"></i></button>
          </div>
        </header>
        <div className="v2-content">
          {/* KPIs resumen */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18,marginBottom:22}}>
            {[
              {label:"Total becarios",  val:"3",  cls:"k-blue",   icon:"fa-users-graduate"},
              {label:"Horas a aprobar", val:"36", cls:"k-yellow", icon:"fa-clock"},
              {label:"Horas extras",    val:"10", cls:"k-green",  icon:"fa-star"},
              {label:"Activos hoy",     val:"3",  cls:"k-orange", icon:"fa-circle-check"},
            ].map(k=>(
              <div className={`v2-kpi ${k.cls}`} key={k.label}>
                <div style={{marginBottom:12}}><div className="v2-kpi-icon"><i className={`fa-solid ${k.icon}`}></i></div></div>
                <div className="v2-kpi-val">{k.val}</div>
                <div className="v2-kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Filter row */}
          <div className="v2-filter-row">
            <div className="v2-tabs" style={{marginBottom:0}}>
              {["Todos","Activos","Inactivos"].map(t=>(
                <button className={`v2-tab${t==="Todos"?" active":""}`} key={t}>{t}</button>
              ))}
            </div>
            <div className="flex gap-8">
              <select className="v2-select"><option>Nombre: A-Z</option></select>
            </div>
          </div>

          {/* Cards */}
          <div className="v2-bc-grid">
            {BECARIOS.map(b=>{
              const pct = Math.round((b.horasApro/b.total)*100);
              return (
                <div className={`v2-bc-card${b.selected?" selected":""}`} key={b.id}>
                  <div className="v2-bc-avatar">
                    {b.iniciales}
                    <div className="v2-bc-online"></div>
                  </div>
                  <div>
                    <div className="v2-bc-name">{b.nombre}</div>
                    <div className="v2-bc-role">Becario activo</div>
                  </div>
                  <div className="v2-bc-stats">
                    <div className="v2-bc-stat">
                      <div className="v2-bc-stat-val">{b.horasPend}</div>
                      <div className="v2-bc-stat-lbl">Pendientes</div>
                    </div>
                    <div className="v2-bc-stat">
                      <div className="v2-bc-stat-val">{b.horasApro}</div>
                      <div className="v2-bc-stat-lbl">Aprobadas</div>
                    </div>
                  </div>
                  <div className="v2-bc-progress">
                    <div className="v2-bc-progress-head">
                      <span>Progreso ({pct}%)</span>
                      <span>{b.horasApro}/{b.total} hs</span>
                    </div>
                    <div className="v2-progress-track">
                      <div className="v2-progress-fill" style={{width:`${pct}%`}}></div>
                    </div>
                  </div>
                  <div className="v2-bc-actions">
                    <button className="v2-btn-ghost">Detalle</button>
                    <button className="v2-bc-btn-main">Ver Horas</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
