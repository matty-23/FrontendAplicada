export default function OcurrenciaBlock({ index, data, onChange, onRemove }) {
  const handleChange = (field, value) => {
    onChange(index, { ...data, [field]: value });
  };

  return (
    <div style={{ 
      border: "1px solid var(--gray-200)", 
      borderRadius: "var(--radius)", 
      padding: "20px", 
      marginBottom: "16px",
      background: "var(--gray-50)",
      position: "relative"
    }}>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <h4 style={{ margin: 0, color: "var(--blue-800)", fontSize: "14px" }}>
          <i className="fa-regular fa-calendar-check" style={{ marginRight: "8px" }}></i>
          Ocurrencia {index + 1}
        </h4>
        {index > 0 && (
          <button 
            type="button"
            className="v2-btn-ghost" 
            style={{ color: "var(--red-500)", padding: "4px 8px" }}
            onClick={() => onRemove(index)}
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        )}
      </div>

      <div className="v2-grid-2">
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--gray-600)" }}>Inicio</label>
          <input 
            type="datetime-local" 
            className="v2-search" 
            style={{ width: "100%", background: "white" }}
            value={data.fechaInicio}
            onChange={(e) => handleChange("fechaInicio", e.target.value)}
          />
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--gray-600)" }}>Finalización</label>
          <input 
            type="datetime-local" 
            className="v2-search" 
            style={{ width: "100%", background: "white" }}
            value={data.fechaFinalizacion}
            onChange={(e) => handleChange("fechaFinalizacion", e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--gray-600)" }}>Lugar (Opcional)</label>
          <input 
            type="text" 
            className="v2-search" 
            placeholder="Ej: Aula Magna"
            style={{ width: "100%", background: "white" }}
            value={data.lugar}
            onChange={(e) => handleChange("lugar", e.target.value)}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--gray-600)" }}>Cant. Personas</label>
          <input 
            type="number" 
            min="0"
            className="v2-search" 
            style={{ width: "100%", background: "white" }}
            value={data.cantidadPersonas}
            onChange={(e) => handleChange("cantidadPersonas", Number(e.target.value))}
          />
        </div>

        {/* NUEVO: Campo para Encargado */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--gray-600)" }}>ID Encargado</label>
          <input 
            type="text" 
            className="v2-search" 
            placeholder="ID del responsable"
            style={{ width: "100%", background: "white" }}
            value={data.id_encargado || ""}
            onChange={(e) => handleChange("id_encargado", e.target.value)}
          />
        </div>

        {/* NUEVO: Campo para Participantes (Múltiples) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--gray-600)" }}>IDs Participantes (separados por coma)</label>
          <input 
            type="text" 
            className="v2-search" 
            placeholder="id1, id2, id3..."
            style={{ width: "100%", background: "white" }}
            // Convertimos el array a string para el input
            value={(data.participantes || []).join(", ")}
            onChange={(e) => {
              // Convertimos el string separado por comas de vuelta a un array limpio
              const arr = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
              handleChange("participantes", arr);
            }}
          />
        </div>
      </div>
    </div>
  );
}