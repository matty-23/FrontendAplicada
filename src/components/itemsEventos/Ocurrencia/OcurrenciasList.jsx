import OcurrenciaCard from "./OcurrenciaCard";
import RecurrenciaForm from "../Recurrencia/RecurrenciaForm"; // <-- IMPORTAMOS EL FORM AQUÍ

export default function OcurrenciasList({
  ocurrencias,
  onChange,
  onEliminar,
  onAgregar,
  onSeparar,
  soloLectura = false,
  /* Props de Recurrencia */
  isEditing,
  esRecurrente,
  recurrenciaRRule,
  onToggleRecurrencia,
  onChangeRRule
}) {
  const ordenadas = [...ocurrencias].sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));

  return (
    <div className="ocurrencias-list">
      <div className="ocurrencias-list-header">
        <div>
          <h3>Programación</h3>
          <span>{ordenadas.length} {ordenadas.length === 1 ? "día" : "días"}</span>
        </div>
      </div>

      <div className="ocurrencias-list-items">
        {ordenadas.map((ocurrencia, index) => (
          <OcurrenciaCard
            key={ocurrencia.idLocal}
            ocurrencia={ocurrencia}
            index={index}
            onChange={onChange}
            onEliminar={onEliminar}
            onSeparar={onSeparar}
            soloLectura={soloLectura}
          // Ya no le pasamos las props de recurrencia al Card individual
          />
        ))}
      </div>

      {/* 1. RESTAURAMOS EL BOTÓN PARA AGREGAR MÚLTIPLES BLOQUES */}
      {!soloLectura && !esRecurrente && (
        <button
          type="button"
          className="crear-evento-add-ocurrencia v2-btn-ghost"
          onClick={onAgregar}
        >
          <i className="fa-solid fa-plus" />
          Agregar otra fecha
        </button>
      )}

      {/* 2. RECURRENCIA GLOBAL AL EVENTO (Siempre visible) */}
      {!soloLectura && (
        <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--gray-200)" }}>
          <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--gray-800)", marginBottom: "16px" }}>
            <i className="fa-solid fa-rotate" style={{ marginRight: "8px", color: "var(--blue-500)" }}></i>
            Regla de Repetición
          </h4>
          <RecurrenciaForm
            isEditing={isEditing}
            esRecurrente={esRecurrente}
            recurrenciaRRule={recurrenciaRRule}
            onToggleRecurrencia={onToggleRecurrencia}
            onChangeRRule={onChangeRRule}
          />
        </div>
      )}
    </div>
  );
}