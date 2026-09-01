import OcurrenciaCard from "./OcurrenciaCard";
import RecurrenciaForm from "../Recurrencia/RecurrenciaForm";
import "./OcurrenciasList.css";

export default function OcurrenciasList({ ocurrencias, onChange, onEliminar, onAgregar, onSeparar, soloLectura = false,
  isEditing, esRecurrente, recurrenciaRRule, onToggleRecurrencia, onChangeRRule, }) {

  let ocurrenciasAMostrar = esRecurrente
    ? ocurrencias.filter(o => o.tipo !== "EXCEPCION" && o.tipo !== "MODIFICADA")
    : [...ocurrencias].sort((a, b) => new Date(a.fechaInicio || 0) - new Date(b.fechaInicio || 0));
  if (esRecurrente && ocurrenciasAMostrar.length === 0 && ocurrencias.length > 0) {
    ocurrenciasAMostrar = [ocurrencias[0]];
  }

  const isYearly = recurrenciaRRule?.includes("FREQ=YEARLY");
  return (
    <div className="ocurrencias-list">
      {!soloLectura && (
        <div className="ocurrencias-list-recurrencia">
          <RecurrenciaForm
            isEditing={isEditing}
            esRecurrente={esRecurrente}
            initialRule={recurrenciaRRule}
            onToggleRecurrencia={onToggleRecurrencia}
            onChangeRRule={onChangeRRule}
          />
        </div>
      )}

      <div className="ocurrencias-list-header" style={{ marginTop: esRecurrente ? "24px" : "0" }}>
        <div>
          <h3>{esRecurrente ? "Horarios y Detalles" : "Programación"}</h3>
          <span>
            {ocurrenciasAMostrar.length} {ocurrenciasAMostrar.length === 1 ? (esRecurrente ? "horario" : "día") : (esRecurrente ? "horarios" : "días")}
          </span>
        </div>
      </div>

      <div className="ocurrencias-list-items">
        {ocurrenciasAMostrar.map((ocurrencia, index) => (
          <OcurrenciaCard
            key={ocurrencia.idLocal || index}
            ocurrencia={ocurrencia}
            index={index}
            onChange={onChange}
            onEliminar={onEliminar}
            onSeparar={onSeparar}
            soloLectura={soloLectura}
            esRecurrente={esRecurrente}
            isYearly={isYearly}
          />
        ))}
      </div>

      {!soloLectura && (
        <button
          type="button"
          className="crear-evento-add-ocurrencia v2-btn-ghost"
          onClick={onAgregar}
        >
          <i className="fa-solid fa-plus" />
          {esRecurrente ? "Agregar otro horario" : "Agregar fecha aislada"}
        </button>
      )}
    </div>
  );
}