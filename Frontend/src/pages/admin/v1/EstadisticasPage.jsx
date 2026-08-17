import { useEffect, useRef } from "react";
import Sidebar from "../../../components/admin/Sidebar";

export default function EstadisticasPage() {
  const areaRef     = useRef(null);
  const pieRef      = useRef(null);
  const doughnutRef = useRef(null);
  const chartsRef   = useRef([]);

  useEffect(() => {
    let destroyed = false;

    const loadCharts = async () => {
      const { Chart, registerables } = await import("chart.js");
      Chart.register(...registerables);

      if (destroyed) return;

      chartsRef.current.forEach((c) => c.destroy());
      chartsRef.current = [];

      const blue = "#4e79a7", yellow = "#f28e2b", teal = "#76b7b2", red = "#e15759";
      const pieData = {
        labels: ["Item 1 (55)", "Item 2 (20)", "Item 3 (98)", "Item 4 (42)"],
        datasets: [{ data: [55,20,98,42], backgroundColor: [red,yellow,blue,teal], borderWidth: 0 }],
      };
      const pieOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "right", labels: { boxWidth: 12, font: { size: 10 } } } } };

      chartsRef.current.push(new Chart(areaRef.current, {
        type: "line",
        data: {
          labels: ["Item 1","Item 2","Item 3","Item 4"],
          datasets: [
            { label: "Dato 2", data: [20,55,83,5], borderColor: "#6D6E70", backgroundColor: "rgba(109,110,112,0.2)", borderWidth: 2, fill: true, tension: 0, pointBackgroundColor: "#6D6E70" },
            { label: "Dato 1", data: [76,65,90,35], borderColor: yellow, backgroundColor: "rgba(242,142,43,0.2)", borderWidth: 2, fill: true, tension: 0, pointBackgroundColor: yellow },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top", align: "end" } }, scales: { y: { beginAtZero: true, max: 90 } } },
      }));

      chartsRef.current.push(new Chart(pieRef.current, { type: "pie", data: pieData, options: pieOptions }));
      chartsRef.current.push(new Chart(doughnutRef.current, { type: "doughnut", data: pieData, options: pieOptions }));
    };

    loadCharts();
    return () => { destroyed = true; chartsRef.current.forEach((c) => c.destroy()); };
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div className="header-info flex-row align-center gap-15">
            <i className="fa-solid fa-arrow-left back-icon"></i>
            <div>
              <span className="breadcrumb">Sistema / Gestión / Estadísticas</span>
              <h1>Estadísticas</h1>
            </div>
          </div>
          <div className="header-actions">
            <div className="search-bar search-bar-large border-dark">
              <i className="fa-solid fa-magnifying-glass text-muted"></i>
              <input type="text" placeholder="Buscar métricas..." />
              <i className="fa-solid fa-sliders text-muted cursor-pointer"></i>
            </div>
          </div>
        </header>

        <div className="page-container flex-fill">
          <div className="controls-row justify-between mb-30">
            <div className="filter-group">
              <select className="custom-select border-dark"><option>Categoría</option></select>
              <select className="custom-select border-dark"><option>SubCategoría</option></select>
              <select className="custom-select border-dark"><option>Fecha</option></select>
              <select className="custom-select border-dark"><option>FormaDatos</option></select>
            </div>
            <button className="btn-primary-outline border-dark">Mostrar</button>
          </div>

          <div className="stats-dashboard-grid">
            <div className="widget-card chart-card main-chart-area border-none">
              <canvas ref={areaRef}></canvas>
            </div>
            <div className="side-charts-col">
              <div className="widget-card chart-card side-chart border-none">
                <canvas ref={pieRef}></canvas>
              </div>
              <div className="widget-card chart-card side-chart border-none">
                <canvas ref={doughnutRef}></canvas>
              </div>
              <button className="btn-comparar border-dark">Comparar</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

