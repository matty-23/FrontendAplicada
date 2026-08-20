export default function KpiCard({ label, value, icon, colorClass, trend, trendUp, sub }) {
  return (
    <div className={`v2-kpi ${colorClass}`}>
      <div className="flex justify-between items-center" style={{ marginBottom: 14 }}>
        <div className="v2-kpi-icon">
          <i className={`fa-solid ${icon}`}></i>
        </div>
        
        {/* Renderiza la tendencia si existe */}
        {trend && (
          <span className={`v2-kpi-trend ${trendUp ? "trend-up" : "trend-down"}`}>
            <i className={`fa-solid ${trendUp ? "fa-arrow-trend-up" : "fa-arrow-trend-down"}`}></i>
            {trend}
          </span>
        )}
      </div>
      
      <div className="v2-kpi-val">{value}</div>
      <div className="v2-kpi-label">{label}</div>
      
      {/* Renderiza el subtítulo inferior si existe */}
      {sub && (
        <div style={{ fontSize: 11, color: "var(--green-500)", fontWeight: 600, marginTop: 5 }}>
          {sub}
        </div>
      )}
    </div>
  );
}