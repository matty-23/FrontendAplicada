import EncargadoSelector from "./EncargadoSelector";
import ParticipantesSelector from "./ParticipanteSelector";

export default function OcurrenciaCardFields({
  ocurrencia,
  soloLectura,
  fechaI,
  fechaF,
  horaI,
  horaF,
  onDateChange,
  onTimeChange,
  onAllDayChange,
  onChange,
}) {
  return (
    <div className="ocurrencia-card-fields">
      
      {/* CHECKBOX TODO EL DÍA */}
      <div className="ocurrencia-card-field ocurrencia-card-field-full ocurrencia-card-allday">
        <input
          type="checkbox"
          id={`allDay-${ocurrencia.idLocal}`}
          checked={ocurrencia.allDay || false}
          disabled={soloLectura}
          onChange={onAllDayChange}
          className="ocurrencia-allday-checkbox"
        />
        <label htmlFor={`allDay-${ocurrencia.idLocal}`} className="ocurrencia-allday-label">
          Todo el día
        </label>
      </div>

      {/* FECHAS */}
      <div className="ocurrencia-card-field">
        <label>Fecha de inicio</label>
        <input
          type="date"
          className="v2-search"
          value={fechaI}
          disabled={soloLectura}
          onChange={(e) => onDateChange("Inicio", e.target.value)}
        />
      </div>
      
      <div className="ocurrencia-card-field">
        <label>Fecha de finalización</label>
        <input
          type="date"
          className="v2-search"
          value={fechaF}
          disabled={soloLectura}
          onChange={(e) => onDateChange("Finalizacion", e.target.value)}
        />
      </div>

      {/* HORAS */}
      {!ocurrencia.allDay && (
        <>
          <div className="ocurrencia-card-field">
            <label>Hora de inicio</label>
            <input
              type="time"
              className="v2-search"
              value={horaI}
              disabled={soloLectura}
              onChange={(e) => onTimeChange("Inicio", e.target.value)}
            />
          </div>
          <div className="ocurrencia-card-field">
            <label>Hora de finalización</label>
            <input
              type="time"
              className="v2-search"
              value={horaF}
              disabled={soloLectura}
              onChange={(e) => onTimeChange("Finalizacion", e.target.value)}
            />
          </div>
        </>
      )}

      {/* LUGAR */}
      <div className="ocurrencia-card-field">
        <label>Lugar</label>
        <input
          type="text"
          className="v2-search"
          value={ocurrencia.lugar || ""}
          placeholder="Ej: Aula Magna"
          disabled={soloLectura}
          onChange={(e) => onChange("lugar", e.target.value)}
        />
      </div>

      {/* CANTIDAD */}
      <div className="ocurrencia-card-field">
        <label>Cantidad de personas</label>
        <input
          type="number"
          min="0"
          className="v2-search"
          value={ocurrencia.cantidadPersonas ?? 0}
          disabled={soloLectura}
          onChange={(e) => onChange("cantidadPersonas", Number(e.target.value))}
        />
      </div>

      {/* ENCARGADO */}
      <div className="ocurrencia-card-field ocurrencia-card-field-full">
        <label>
          <i className="fa-solid fa-user-tie" /> Encargado
        </label>
        <EncargadoSelector
          value={ocurrencia.id_encargado}
          disabled={soloLectura}
          onChange={(id) => onChange("id_encargado", id)}
        />
      </div>

      {/* PARTICIPANTES */}
      <div className="ocurrencia-card-field ocurrencia-card-field-full">
        <label>
          <i className="fa-solid fa-users" /> Participantes
        </label>
        <ParticipantesSelector
          value={ocurrencia.participantes}
          usuariosSeleccionados={ocurrencia.participantesSeleccionados || []}
          disabled={soloLectura}
          onChange={(ids, usuarios) => {
            if (soloLectura) return;
            onChange("participantes", ids);
            onChange("participantesSeleccionados", usuarios);
          }}
        />
      </div>

    </div>
  );
}
