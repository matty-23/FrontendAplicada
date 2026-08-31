import OcurrenciaCard from "./OcurrenciaCard";
import RecurrenciaForm from "../Recurrencia/RecurrenciaForm";
import "./OcurrenciasList.css";

export default function OcurrenciasList({ ocurrencias, onChange, onEliminar, onAgregar, onSeparar, soloLectura = false,
  isEditing, esRecurrente, recurrenciaRRule, onToggleRecurrencia, onChangeRRule, }) {

  const ocurrenciasAMostrar = esRecurrente
    ? [ocurrencias[0]] // Obligamos a que sea 1 sola
    : [...ocurrencias].sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));

  return (
    <div className="ocurrencias-list">
      <div className="ocurrencias-list-header">
        <div>
          <h3>Programación</h3>
          <span>
            {ocurrenciasAMostrar.length} {ocurrenciasAMostrar.length === 1 ? "día" : "días"}
          </span>
        </div>
      </div>
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
            fechaInicio={ocurrenciasAMostrar[0]?.fechaInicio}
          />
        </div>
      )}
      <div className="ocurrencias-list-items">
        {ocurrenciasAMostrar.map((ocurrencia, index) => (
          <OcurrenciaCard
            key={ocurrencia.idLocal}
            ocurrencia={ocurrencia}
            index={index}
            tituloAlternativo={esRecurrente ? "Datos base de la repetición" : undefined}
            onChange={onChange}
            onEliminar={esRecurrente ? () => { } : onEliminar}
            onSeparar={onSeparar}
            soloLectura={soloLectura}
            esRecurrente={esRecurrente}
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
          Agregar fecha aislada
        </button>
      )}


    </div>
  );
}