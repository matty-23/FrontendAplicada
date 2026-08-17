import SidebarV2 from "../../../components/admin/v2/SidebarV2";

const PENDIENTES = [
  {nombre:"Reserva de Aula 1",         when:"Hoy — 11:00",  tipo:"tl-orange", icon:"fa-clock"},
  {nombre:"Uso de Proyector",          when:"Hoy — 14:30",  tipo:"tl-blue",   icon:"fa-clock", sel:true},
  {nombre:"Permiso Especial Becario",  when:"Hoy — 16:00",  tipo:"tl-orange", icon:"fa-clock"},
  {nombre:"Solicitud Evento UX",       when:"Jue — 09:00",  tipo:"tl-orange", icon:"fa-clock"},
];
const ACEPTADAS = [
  {nombre:"Jornada de Puertas Abiertas", when:"12/08", tipo:"tl-green", icon:"fa-circle-check"},
  {nombre:"Reserva Laboratorio B",       when:"10/08", tipo:"tl-green", icon:"fa-circle-check"},
  {nombre:"Mantenimiento de Servidores", when:"05/08", tipo:"tl-green", icon:"fa-circle-check"},
];
const DIAS = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

export default function SolicitudesPageV2() {
  const prevDays = [27,28,29,30,31];
  const days = Array.from({length:31},(_,i)=>i+1);
  const eventDays = [2,5,10,11,12,17];
  return (
    <div className="v2">
      <SidebarV2 />
      <div className="v2-main">
        <header className="v2-topbar">
          <div className="v2-topbar-left">
            <span className="v2-topbar-bc">Principal / Solicitudes</span>
            <span className="v2-topbar-title">Solicitudes</span>
          </div>
          <div className="v2-topbar-right">
            <div className="v2-search"><i className="fa-solid fa-magnifying-glass"></i><input placeholder="Buscar solicitud..." /></div>
            <select className="v2-select"><option>Esta semana</option></select>
          </div>
        </header>
        <div className="v2-content">
          <div className="v2-sol-layout">
            {/* Columna izquierda: timelines */}
            <div style={{display:"flex",flexDirection:"column",gap:20}}>

              {/* Pendientes */}
              <div className="v2-card">
                <div className="v2-card-head">
                  <div>
                    <div className="v2-card-title">Pendientes de revisión</div>
                    <div className="v2-card-sub">4 solicitudes esperando acción</div>
                  </div>
                  <span className="v2-badge b-pending">4 pendientes</span>
                </div>
                <div className="v2-card-body" style={{paddingTop:14}}>
                  <div className="v2-timeline">
                    {PENDIENTES.map((s,i)=>(
                      <div className="v2-tl-item" key={i}>
                        {i < PENDIENTES.length-1 && <div className="v2-tl-line"></div>}
                        <div className={`v2-tl-dot ${s.tipo}`}><i className={`fa-solid ${s.icon}`}></i></div>
                        <div className={`v2-tl-content${s.sel?" selected-item":""}`} style={s.sel?{borderColor:"var(--blue-500)",background:"var(--blue-50)"}:{}}>
                          <div className="v2-tl-name">{s.nombre}</div>
                          <div className="v2-tl-sub">{s.when}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Aceptadas */}
              <div className="v2-card">
                <div className="v2-card-head">
                  <div className="v2-card-title">Solicitudes aceptadas</div>
                  <span className="v2-badge b-active">3 aprobadas</span>
                </div>
                <div className="v2-card-body" style={{paddingTop:14}}>
                  <div className="v2-timeline">
                    {ACEPTADAS.map((s,i)=>(
                      <div className="v2-tl-item" key={i}>
                        {i < ACEPTADAS.length-1 && <div className="v2-tl-line"></div>}
                        <div className={`v2-tl-dot ${s.tipo}`}><i className={`fa-solid ${s.icon}`}></i></div>
                        <div className="v2-tl-content">
                          <div className="v2-tl-name">{s.nombre}</div>
                          <div className="v2-tl-sub">{s.when}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha: mini calendario */}
            <div className="v2-card" style={{height:"fit-content"}}>
              <div className="v2-card-body">
                <div className="v2-cal-mini-head">
                  <button className="v2-icon-btn" style={{width:30,height:30}}><i className="fa-solid fa-chevron-left"></i></button>
                  <h3>Agosto 2026</h3>
                  <button className="v2-icon-btn" style={{width:30,height:30}}><i className="fa-solid fa-chevron-right"></i></button>
                </div>
                <div className="v2-cal-mini-grid">
                  {DIAS.map(d=><div className="v2-cal-mini-dname" key={d}>{d}</div>)}
                  {prevDays.map(d=><div className="v2-cal-mini-day prev" key={"p"+d}>{d}</div>)}
                  {days.map(d=>(
                    <div className={`v2-cal-mini-day${d===17?" today":""}${eventDays.includes(d)&&d!==17?" has-event":""}`} key={d}>{d}</div>
                  ))}
                </div>
                <div style={{marginTop:20,borderTop:"1px solid var(--gray-100)",paddingTop:14}}>
                  <div style={{fontSize:12,fontWeight:700,color:"var(--gray-500)",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.5px"}}>Leyenda</div>
                  {[
                    {color:"var(--orange-500)",lbl:"Solicitudes pendientes"},
                    {color:"var(--green-500)", lbl:"Eventos confirmados"},
                    {color:"var(--blue-800)",  lbl:"Hoy"},
                  ].map(l=>(
                    <div key={l.lbl} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:l.color,flexShrink:0}}></div>
                      <span style={{fontSize:12,color:"var(--gray-500)"}}>{l.lbl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
