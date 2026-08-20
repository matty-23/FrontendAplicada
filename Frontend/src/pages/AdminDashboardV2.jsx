import { useEffect, useRef } from "react";
import DashboardLayout from "../components/DashboardLayout";
import KpiCard from "../components/KpiCard";
import Card from "../components/Card";

const KPIS = [
  { label: "Eventos activos", val: "4", trend: "+1", icon: "fa-ticket", cls: "k-blue", up: true },
  { label: "Solicitudes pend.", val: "7", trend: "-2", icon: "fa-file-lines", cls: "k-yellow", up: false },
  { label: "Becarios activos", val: "12", trend: "+3", icon: "fa-users-graduate", cls: "k-green", up: true },
  { label: "Equipos disponibles", val: "9", trend: "=", icon: "fa-boxes-stacked", cls: "k-orange", up: null },
];

const FEED = [
  { icon: "fa-ticket", cls: "fi-blue", title: "ExpoTech aprobado", sub: "Hace 15 min", time: "09:14" },
  { icon: "fa-file-lines", cls: "fi-yellow", title: "Reserva Aula 1 — solicitud nueva", sub: "Hace 40 min", time: "08:49" },
  { icon: "fa-users-graduate", cls: "fi-green", title: "Lionel Messi registró 4 hs", sub: "Hace 1 h", time: "08:30" },
  { icon: "fa-boxes-stacked", cls: "fi-orange", title: "Laptop B marcada En Reparación", sub: "Hace 2 h", time: "07:45" },
  { icon: "fa-ticket", cls: "fi-blue", title: "DevDay 01/07 — pendiente revisión", sub: "Ayer", time: "Ayer" },
];

export default function AdminDashboardV2() {
  const chartRef = useRef(null);
  const chInstance = useRef(null);

  useEffect(() => {
    let dead = false;
    (async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);
      if (dead || !chartRef.current) return;
      if (chInstance.current) chInstance.current.destroy();
      chInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
          datasets: [
            { label: "Solicitudes", data: [3, 7, 5, 9, 6, 4, 7], borderColor: "#003C71", backgroundColor: "rgba(0,60,113,0.08)", borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: "#003C71" },
            { label: "Eventos", data: [1, 2, 2, 3, 2, 1, 2], borderColor: "#FEDD00", backgroundColor: "rgba(254,221,0,0.1)", borderWidth: 2.5, fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: "#FEDD00" },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top", align: "end", labels: { boxWidth: 10, font: { size: 12, family: "Inter" } } } }, scales: { y: { beginAtZero: true, grid: { color: "#f1f5f9" }, border: { display: false }, ticks: { font: { size: 11 } } }, x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 } } } } },
      });
    })();
    return () => { dead = true; chInstance.current?.destroy(); };
  }, []);

  const rightActions = (
    <>
      <div className="v2-search"><i className="fa-solid fa-magnifying-glass"></i><input placeholder="Buscar..." /></div>
      <button className="v2-icon-btn"><i className="fa-regular fa-bell"></i></button>
      <button className="v2-icon-btn"><i className="fa-regular fa-circle-question"></i></button>
    </>
  );

  return (
    <DashboardLayout breadcrumb="Sistema / Principal" title="Panel General" rightActions={rightActions}>
      <div className="v2-kpi-row">
        {KPIS.map(k => (
          <KpiCard key={k.label} label={k.label} value={k.val} icon={k.icon} colorClass={k.cls} trend={k.trend} trendUp={k.up} />
        ))}
      </div>

      <div className="v2-grid-6040 mb-22">
        <Card 
          title="Actividad semanal" 
          subtitle="Solicitudes y eventos — semana actual"
          headActions={<select className="v2-select"><option>Esta semana</option></select>}
          bodyStyle={{ height: 240 }}
        >
          <div className="v2-chart-area"><canvas ref={chartRef}></canvas></div>
        </Card>

        <Card 
          title="Actividad reciente" 
          headActions={<button className="v2-btn-ghost">Ver todo <i className="fa-solid fa-arrow-right"></i></button>}
          bodyStyle={{ padding: "0 22px" }}
        >
          <div className="v2-feed">
            {FEED.map((f, i) => (
              <div className="v2-feed-item" key={i}>
                <div className={`v2-feed-icon ${f.cls}`}><i className={`fa-solid ${f.icon}`}></i></div>
                <div className="v2-feed-body">
                  <div className="v2-feed-title">{f.title}</div>
                  <div className="v2-feed-sub">{f.sub}</div>
                </div>
                <div className="v2-feed-time">{f.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card 
        title="Solicitudes pendientes de revisión" 
        headActions={<button className="v2-btn-primary"><i className="fa-solid fa-arrow-right"></i> Ver todas</button>}
      >
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {["Reserva Aula 1", "Uso Proyector", "Permiso Especial Becario", "Solicitud Evento UX"].map((s) => (
            <div key={s} style={{ background: "var(--gray-50)", border: "1.5px solid var(--gray-200)", borderRadius: 10, padding: "12px 18px", display: "flex", alignItems: "center", gap: 12, minWidth: 200, cursor: "pointer", transition: "var(--t)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--orange-500)", flexShrink: 0 }}></div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--gray-800)", flex: 1 }}>{s}</span>
              <button className="v2-btn-ghost" style={{ padding: "4px 10px", fontSize: 11 }}>Revisar</button>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}