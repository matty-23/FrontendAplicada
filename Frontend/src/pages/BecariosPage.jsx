import DashboardLayout from "../components/DashboardLayout";
import KpiCard from "../components/KpiCard";

const BECARIOS = [
  { id: 1, nombre: "Lionel Messi", iniciales: "LM", horasPend: 16, horasApro: 32, total: 48, selected: true },
  { id: 2, nombre: "Juan Paco", iniciales: "JP", horasPend: 12, horasApro: 20, total: 48, selected: false },
  { id: 3, nombre: "Steve Rogers", iniciales: "SR", horasPend: 8, horasApro: 28, total: 48, selected: false },
];

export default function BecariosPageV2() {
  const rightActions = (
    <>
      <div className="v2-search"><i className="fa-solid fa-magnifying-glass"></i><input placeholder="Filtrar becario..." /></div>
      <button className="v2-icon-btn"><i className="fa-regular fa-bell"></i></button>
    </>
  );

  return (
    <DashboardLayout breadcrumb="Gestión / Becarios" title="Gestión de Becarios" rightActions={rightActions}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 22 }}>
        <KpiCard label="Total becarios" value="3" icon="fa-users-graduate" colorClass="k-blue" />
        <KpiCard label="Horas a aprobar" value="36" icon="fa-clock" colorClass="k-yellow" />
        <KpiCard label="Horas extras" value="10" icon="fa-star" colorClass="k-green" />
        <KpiCard label="Activos hoy" value="3" icon="fa-circle-check" colorClass="k-orange" />
      </div>

      <div className="v2-filter-row">
        <div className="v2-tabs" style={{ marginBottom: 0 }}>
          {["Todos", "Activos", "Inactivos"].map(t => (
            <button className={`v2-tab${t === "Todos" ? " active" : ""}`} key={t}>{t}</button>
          ))}
        </div>
        <div className="flex gap-8">
          <select className="v2-select"><option>Nombre: A-Z</option></select>
        </div>
      </div>

      <div className="v2-bc-grid">
        {BECARIOS.map(b => {
          const pct = Math.round((b.horasApro / b.total) * 100);
          return (
            <div className={`v2-bc-card${b.selected ? " selected" : ""}`} key={b.id}>
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
                  <div className="v2-progress-fill" style={{ width: `${pct}%` }}></div>
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
    </DashboardLayout>
  );
}