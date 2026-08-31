import OcurrenciaCard from "./OcurrenciaCard";
import RecurrenciaForm from "../Recurrencia/RecurrenciaForm";
import "./OcurrenciasList.css";

export default function OcurrenciasList({ocurrencias,onChange,onEliminar,onAgregar,onSeparar,soloLectura = false,
  isEditing,esRecurrente,recurrenciaRRule,onToggleRecurrencia,onChangeRRule,}) {
    
  const ordenadas = [...ocurrencias].sort(
    (a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio)
  );

  return (
    <div className="ocurrencias-list">
      <div className="ocurrencias-list-header">
        <div>
          <h3>Programación</h3>
          <span>
            {ordenadas.length} {ordenadas.length === 1 ? "día" : "días"}
          </span>
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
          />
        ))}
      </div>

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

      {!soloLectura && (
        <div className="ocurrencias-list-recurrencia">
          <h4 className="ocurrencias-list-recurrencia-title">
            <i className="fa-solid fa-rotate" />
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