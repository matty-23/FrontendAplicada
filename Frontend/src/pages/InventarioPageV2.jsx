import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import KpiCard from "../components/KpiCard";

const INV = [
  { nombre: "Proyector Epson", codigo: "P-104", estado: "Disponible", tipo: "b-active", icono: "fa-video" },
  { nombre: "Laptop Dell XPS", codigo: "L-221", estado: "En Reparación", tipo: "b-repair", icono: "fa-laptop" },
  { nombre: "Cámara Canon DSLR", codigo: "C-099", estado: "Disponible", tipo: "b-active", icono: "fa-camera" },
  { nombre: "Micrófono Condensador", codigo: "M-012", estado: "Disponible", tipo: "b-active", icono: "fa-microphone" },
  { nombre: "Monitor LG Ultrawide", codigo: "MO-301", estado: "Disponible", tipo: "b-active", icono: "fa-desktop" },
  { nombre: "Trípode Manfrotto", codigo: "T-055", estado: "En uso", tipo: "b-inactive", icono: "fa-camera-rotate" },
];

export default function InventarioPageV2() {
  const [q, setQ] = useState("");
  const filtered = INV.filter(i => i.nombre.toLowerCase().includes(q.toLowerCase()));

  const rightActions = (
    <>
      <div className="v2-search"><i className="fa-solid fa-magnifying-glass"></i><input placeholder="Buscar activo..." value={q} onChange={e => setQ(e.target.value)} /></div>
      <button className="v2-btn-secondary"><i className="fa-solid fa-file-export"></i> CSV</button>
      <button className="v2-btn-primary"><i className="fa-solid fa-plus"></i> Nuevo</button>
    </>
  );

  return (
    <DashboardLayout breadcrumb="Gestión / Inventario" title="Control de Inventario" rightActions={rightActions}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 22 }}>
        <KpiCard label="Total activos" value="6" icon="fa-boxes-stacked" colorClass="k-blue" />
        <KpiCard label="Disponibles" value="4" icon="fa-circle-check" colorClass="k-green" />
        <KpiCard label="En reparación" value="1" icon="fa-wrench" colorClass="k-orange" />
        <KpiCard label="En uso" value="1" icon="fa-clock" colorClass="k-yellow" />
      </div>

      <div className="v2-filter-row">
        <div className="v2-tabs" style={{ marginBottom: 0 }}>
          {["Todos", "Disponibles", "En uso", "En reparación"].map(t => (
            <button className={`v2-tab${t === "Todos" ? " active" : ""}`} key={t}>{t}</button>
          ))}
        </div>
        <select className="v2-select"><option>Categoría</option></select>
      </div>

      <div className="v2-inv-grid">
        {filtered.map(item => (
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
    </DashboardLayout>
  );
}