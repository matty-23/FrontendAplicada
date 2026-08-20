export default function EventItem({ 
  id, titulo, fecha, responsable, estado, tipo, 
  isSelected, onSelect, onEdit, onView 
}) {
  const badgeClass = tipo === "green" ? "b-active" : tipo === "blue" ? "b-review" : "b-pending";

  return (
    <div 
      className="v2-event-item"
      style={{ 
        // Modificamos la grilla para agregar una columna extra para el checkbox
        gridTemplateColumns: "4px auto 1fr auto auto",
        // Si está seleccionado, le damos un fondo y borde azul sutil
        ...(isSelected ? { borderColor: "var(--blue-500)", background: "var(--blue-50)" } : {}) 
      }}
    >
      {/* Tira de color lateral */}
      <div className={`v2-event-strip strip-${tipo}`}></div>
      
      {/* Nueva columna: Checkbox */}
      <div style={{ padding: "0 0 0 16px", display: "flex", alignItems: "center" }}>
        <input 
          type="checkbox" 
          style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--blue-800)" }}
          checked={isSelected}
          onChange={() => onSelect(id)}
        />
      </div>

      <div className="v2-event-body" style={{ paddingLeft: "12px" }}>
        <div className="v2-event-name">{titulo}</div>
        <div className="v2-event-meta">
          <span className="v2-event-meta-it">
            <i className="fa-regular fa-calendar-days"></i>{fecha}
          </span>
          <span className="v2-event-meta-it">
            <i className="fa-regular fa-user"></i>{responsable}
          </span>
        </div>
      </div>
      
      <div className="v2-event-status">
        <span className={`v2-badge ${badgeClass}`}>{estado}</span>
      </div>
      
      {/* Columna de Acciones Actualizada */}
      <div className="v2-event-action" style={{ display: "flex", gap: "8px" }}>
        <button 
          className="v2-btn-ghost" 
          onClick={() => onEdit(id)}
          style={{ color: "var(--gray-600)", borderColor: "transparent" }}
        >
          <i className="fa-solid fa-pen"></i> Editar
        </button>
        <button 
          className="v2-btn-ghost" 
          onClick={() => onView(id)}
        >
          Ver <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}