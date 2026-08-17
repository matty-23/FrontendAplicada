import { useState } from "react";
import SidebarV2 from "../../../components/admin/v2/SidebarV2";

const EVENTOS = [
  { id:1, titulo:"Jornada UX/UI",   fecha:"15/06/2026", responsable:"Juan Perez",     estado:"Pendiente", tipo:"orange" },
  { id:2, titulo:"ExpoTech",        fecha:"22/06/2026", responsable:"Maria Lopez",    estado:"Pendiente", tipo:"orange" },
  { id:3, titulo:"DevDay",          fecha:"01/07/2026", responsable:"Pedro Martinez", estado:"Pendiente", tipo:"orange" },
  { id:4, titulo:"Hackathon 2026",  fecha:"15/07/2026", responsable:"Ana García",     estado:"Activo",    tipo:"green"  },
  { id:5, titulo:"TechTalks #3",    fecha:"28/07/2026", responsable:"Luis Mora",      estado:"En revisión",tipo:"blue"  },
];

const TABS = ["Todos","Pendientes","En revisión","Activos"];

export default function EventosPageV2() {
  const [tab, setTab] = useState("Todos");
  const filtered = EVENTOS.filter(e =>
    tab === "Todos" ? true :
    tab === "Pendientes" ? e.estado === "Pendiente" :
    tab === "En revisión" ? e.estado === "En revisión" :
    e.estado === "Activo"
  );
  return (
    <div className="v2">
      <SidebarV2 />
      <div className="v2-main">
        <header className="v2-topbar">
          <div className="v2-topbar-left">
            <span className="v2-topbar-bc">Gestión / Eventos</span>
            <span className="v2-topbar-title">Gestión de Eventos</span>
          </div>
          <div className="v2-topbar-right">
            <div className="v2-search"><i className="fa-solid fa-magnifying-glass"></i><input placeholder="Buscar evento..." /></div>
            <button className="v2-btn-primary"><i className="fa-solid fa-plus"></i> Nuevo</button>
          </div>
        </header>

        <div className="v2-content">
          {/* KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,marginBottom:22}}>
            {[
              {label:"Eventos activos",  val:"1", icon:"fa-ticket",         cls:"k-blue"},
              {label:"Pendientes apro.", val:"3", icon:"fa-clock",           cls:"k-yellow"},
              {label:"En revisión",      val:"1", icon:"fa-magnifying-glass",cls:"k-orange"},
            ].map(k=>(
              <div className={`v2-kpi ${k.cls}`} key={k.label}>
                <div className="flex justify-between items-center" style={{marginBottom:12}}>
                  <div className="v2-kpi-icon"><i className={`fa-solid ${k.icon}`}></i></div>
                </div>
                <div className="v2-kpi-val">{k.val}</div>
                <div className="v2-kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs + lista */}
          <div className="v2-card">
            <div className="v2-card-head">
              <div className="v2-tabs" style={{marginBottom:0}}>
                {TABS.map(t=>(
                  <button className={`v2-tab${t===tab?" active":""}`} key={t} onClick={()=>setTab(t)}>{t}</button>
                ))}
              </div>
              <div className="flex gap-8">
                <select className="v2-select"><option>Ordenar: A-Z</option></select>
              </div>
            </div>
            <div className="v2-card-body">
              <div className="v2-event-list">
                {filtered.map(e=>(
                  <div className="v2-event-item" key={e.id}>
                    <div className={`v2-event-strip strip-${e.tipo}`}></div>
                    <div className="v2-event-body">
                      <div className="v2-event-name">{e.titulo}</div>
                      <div className="v2-event-meta">
                        <span className="v2-event-meta-it"><i className="fa-regular fa-calendar-days"></i>{e.fecha}</span>
                        <span className="v2-event-meta-it"><i className="fa-regular fa-user"></i>{e.responsable}</span>
                      </div>
                    </div>
                    <div className="v2-event-status">
                      <span className={`v2-badge ${e.tipo==="green"?"b-active":e.tipo==="blue"?"b-review":"b-pending"}`}>{e.estado}</span>
                    </div>
                    <div className="v2-event-action">
                      <button className="v2-btn-ghost">Ver <i className="fa-solid fa-arrow-right"></i></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
