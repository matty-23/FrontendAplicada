import { useState } from "react";
import SidebarV2 from "../../../components/admin/v2/SidebarV2";

const ICONOS = { Proyector:"fa-video", Laptop:"fa-laptop", Camara:"fa-camera", Microfono:"fa-microphone", Monitor:"fa-desktop", Tripode:"fa-camera-rotate" };
const INV = [
  {nombre:"Proyector Epson",       codigo:"P-104",  estado:"Disponible",    tipo:"b-active",   icono:"fa-video"},
  {nombre:"Laptop Dell XPS",       codigo:"L-221",  estado:"En Reparación", tipo:"b-repair",   icono:"fa-laptop"},
  {nombre:"Cámara Canon DSLR",     codigo:"C-099",  estado:"Disponible",    tipo:"b-active",   icono:"fa-camera"},
  {nombre:"Micrófono Condensador", codigo:"M-012",  estado:"Disponible",    tipo:"b-active",   icono:"fa-microphone"},
  {nombre:"Monitor LG Ultrawide",  codigo:"MO-301", estado:"Disponible",    tipo:"b-active",   icono:"fa-desktop"},
  {nombre:"Trípode Manfrotto",     codigo:"T-055",  estado:"En uso",        tipo:"b-inactive", icono:"fa-camera-rotate"},
];

export default function InventarioPageV2() {
  const [q, setQ] = useState("");
  const filtered = INV.filter(i=>i.nombre.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="v2">
      <SidebarV2 />
      <div className="v2-main">
        <header className="v2-topbar">
          <div className="v2-topbar-left">
            <span className="v2-topbar-bc">Gestión / Inventario</span>
            <span className="v2-topbar-title">Control de Inventario</span>
          </div>
          <div className="v2-topbar-right">
            <div className="v2-search"><i className="fa-solid fa-magnifying-glass"></i><input placeholder="Buscar activo..." value={q} onChange={e=>setQ(e.target.value)}/></div>
            <button className="v2-btn-secondary"><i className="fa-solid fa-file-export"></i> CSV</button>
            <button className="v2-btn-primary"><i className="fa-solid fa-plus"></i> Nuevo</button>
          </div>
        </header>
        <div className="v2-content">
          {/* KPIs */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:18,marginBottom:22}}>
            {[
              {label:"Total activos",    val:"6",  cls:"k-blue",   icon:"fa-boxes-stacked"},
              {label:"Disponibles",      val:"4",  cls:"k-green",  icon:"fa-circle-check"},
              {label:"En reparación",    val:"1",  cls:"k-orange", icon:"fa-wrench"},
              {label:"En uso",           val:"1",  cls:"k-yellow", icon:"fa-clock"},
            ].map(k=>(
              <div className={`v2-kpi ${k.cls}`} key={k.label}>
                <div style={{marginBottom:12}}><div className="v2-kpi-icon"><i className={`fa-solid ${k.icon}`}></i></div></div>
                <div className="v2-kpi-val">{k.val}</div>
                <div className="v2-kpi-label">{k.label}</div>
              </div>
            ))}
          </div>

          <div className="v2-filter-row">
            <div className="v2-tabs" style={{marginBottom:0}}>
              {["Todos","Disponibles","En uso","En reparación"].map(t=>(
                <button className={`v2-tab${t==="Todos"?" active":""}`} key={t}>{t}</button>
              ))}
            </div>
            <select className="v2-select"><option>Categoría</option></select>
          </div>

          <div className="v2-inv-grid">
            {filtered.map(item=>(
              <div className="v2-inv-card" key={item.codigo}>
                <div className="v2-inv-icon"><i className={`fa-solid ${item.icono}`}></i></div>
                <div className="v2-inv-name">{item.nombre}</div>
                <div className="v2-inv-code">#{item.codigo}</div>
                <div className="v2-inv-foot">
                  <span className={`v2-badge ${item.tipo}`}>{item.estado}</span>
                  <i className="fa-solid fa-expand v2-inv-action"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
