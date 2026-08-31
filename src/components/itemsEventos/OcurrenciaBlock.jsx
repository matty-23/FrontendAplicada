import { useMemo } from 'react';
import EncargadoSelector from './EncargadoSelector';
import ParticipantesSelector from './ParticipanteSelector';
import './OcurrenciaBlock.css';

export default function OcurrenciaBlock({
  index,
  data,
  onChange,
  onRemove,
  canDelete = true,
  usuariosDisponibles = [],
}) {
  const handleChange = (field, value) => {
    onChange(index, {
      ...data, [field]: value,
    });
  };

  // --- LÓGICA PARA SEPARAR FECHA Y HORA ---
  const fechaI = data.fechaInicio ? data.fechaInicio.split("T")[0] : "";
  const horaI = data.fechaInicio && data.fechaInicio.includes("T") 
    ? data.fechaInicio.split("T")[1].substring(0, 5) 
    : "00:00";
    
  const fechaF = data.fechaFinalizacion ? data.fechaFinalizacion.split("T")[0] : "";
  const horaF = data.fechaFinalizacion && data.fechaFinalizacion.includes("T") 
    ? data.fechaFinalizacion.split("T")[1].substring(0, 5) 
    : "23:59";

  const handleDateChange = (tipo, nuevaFecha) => {
    if (!nuevaFecha) {
      handleChange(`fecha${tipo}`, "");
      return;
    }
    const h = tipo === "Inicio" ? horaI : horaF;
    const finalTime = data.allDay ? (tipo === "Inicio" ? "00:00" : "23:59") : h;
    handleChange(`fecha${tipo}`, `${nuevaFecha}T${finalTime}`);
  };

  const handleTimeChange = (tipo, nuevaHora) => {
    const f = tipo === "Inicio" ? fechaI : fechaF;
    if (!f) return;
    handleChange(`fecha${tipo}`, `${f}T${nuevaHora}`);
  };

  const handleAllDayToggle = (e) => {
    const checked = e.target.checked;
    handleChange("allDay", checked);
    
    // Forzar inicio a 00:00 y fin a 23:59 si se marca todo el día
    if (checked) {
      if (fechaI) handleChange("fechaInicio", `${fechaI}T00:00`);
      if (fechaF) handleChange("fechaFinalizacion", `${fechaF}T23:59`);
    }
  };

  return (
    <div className="ocurrencia-block">
      {/* Header */}
      <div className="ocurrencia-header">
        <h4 className="ocurrencia-title">
          <i className="fa-regular fa-calendar-check"></i>
          Ocurrencia {index + 1}
        </h4>
        {canDelete && (
          <button
            type="button"
            className="ocurrencia-delete"
            onClick={() => onRemove(index)}
            title="Eliminar ocurrencia"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        )}
      </div>

      {/* Campos de fecha y lugar */}
      <div className="v2-grid-2">
        {/* CHECKBOX TODO EL DÍA */}
        <div className="ocurrencia-field ocurrencia-field-full" style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            id={`blockAllDay-${index}`}
            checked={data.allDay || false}
            onChange={handleAllDayToggle}
            style={{ width: "auto", cursor: "pointer", accentColor: "var(--blue-800)" }}
          />
          <label htmlFor={`blockAllDay-${index}`} style={{ cursor: "pointer", margin: 0 }}>
            Todo el día
          </label>
        </div>

        {/* Fecha de inicio */}
        <div className="ocurrencia-field">
          <label>Inicio</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="date"
              className="v2-search"
              required
              value={fechaI}
              onChange={(e) => handleDateChange("Inicio", e.target.value)}
            />
            {!data.allDay && (
              <input
                type="time"
                className="v2-search"
                required
                value={horaI}
                onChange={(e) => handleTimeChange("Inicio", e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Fecha de finalización */}
        <div className="ocurrencia-field">
          <label>Finalización</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="date"
              className="v2-search"
              required
              value={fechaF}
              onChange={(e) => handleDateChange("Finalizacion", e.target.value)}
            />
            {!data.allDay && (
              <input
                type="time"
                className="v2-search"
                required
                value={horaF}
                onChange={(e) => handleTimeChange("Finalizacion", e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Lugar */}
        <div className="ocurrencia-field">
          <label>Lugar (Opcional)</label>
          <input
            type="text"
            className="v2-search"
            placeholder="Ej: Aula Magna"
            value={data.lugar || ''}
            onChange={(e) => handleChange('lugar', e.target.value)}
          />
        </div>

        {/* Cantidad de personas */}
        <div className="ocurrencia-field">
          <label>Cant. Personas</label>
          <input
            type="number"
            min="0"
            className="v2-search"
            value={data.cantidadPersonas ?? 0}
            onChange={(e) =>
              handleChange(
                'cantidadPersonas',
                e.target.value === '' ? 0 : Number(e.target.value)
              )
            }
          />
        </div>
      </div>

      {/* Selector de Encargado */}
      <div className="ocurrencia-field ocurrencia-field-full">
        <label>
          <i className="fa-solid fa-user-tie"></i>
          Encargado
        </label>
        <EncargadoSelector
          value={data.id_encargado}
          onChange={(id) => {
            handleChange('id_encargado', id);
          }}
        />
      </div>

      {/* Selector de Participantes */}
      <div className="ocurrencia-field ocurrencia-field-full">
        <label>
          <i className="fa-solid fa-users"></i>
          Participantes
        </label>
        <ParticipantesSelector
          value={data.participantes}
          usuariosSeleccionados={data.participantesSeleccionados || []}
          onChange={(nuevosIds, nuevosUsuarios) => {
            onChange(index, {
              ...data,
              participantes: nuevosIds,
              participantesSeleccionados: nuevosUsuarios,
            });
          }}
        />
      </div>
    </div>
  );
}