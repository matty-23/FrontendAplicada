import "./OcurrenciaBlock.css";

export default function OcurrenciaBlock({
  index,
  data,
  onChange,
  onRemove,
  canDelete = true
}) {
  const handleChange = (field, value) => {
    onChange(index, {
      ...data,
      [field]: value
    });
  };

  const handleParticipantesChange = (value) => {
    const participantes = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    handleChange("participantes", participantes);
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

      {/* Campos */}
      <div className="v2-grid-2">
        {/* Fecha de inicio */}
        <div className="ocurrencia-field">
          <label>Inicio</label>
          <input
            type="datetime-local"
            className="v2-search"
            required
            value={data.fechaInicio || ""}
            onChange={(e) => handleChange("fechaInicio", e.target.value)}
          />
        </div>

        {/* Fecha de finalización */}
        <div className="ocurrencia-field">
          <label>Finalización</label>
          <input
            type="datetime-local"
            className="v2-search"
            required
            value={data.fechaFinalizacion || ""}
            onChange={(e) => handleChange("fechaFinalizacion", e.target.value)}
          />
        </div>

        {/* Lugar */}
        <div className="ocurrencia-field">
          <label>Lugar (Opcional)</label>
          <input
            type="text"
            className="v2-search"
            placeholder="Ej: Aula Magna"
            value={data.lugar || ""}
            onChange={(e) => handleChange("lugar", e.target.value)}
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
                "cantidadPersonas",
                e.target.value === "" ? 0 : Number(e.target.value)
              )
            }
          />
        </div>

        {/* Encargado */}
        <div className="ocurrencia-field">
          <label>ID Encargado</label>
          <input
            type="text"
            className="v2-search"
            placeholder="ID del responsable"
            value={data.id_encargado || ""}
            onChange={(e) => handleChange("id_encargado", e.target.value)}
          />
        </div>

        {/* Participantes */}
        <div className="ocurrencia-field">
          <label>IDs Participantes (separados por coma)</label>
          <input
            type="text"
            className="v2-search"
            placeholder="id1, id2, id3..."
            value={Array.isArray(data.participantes) ? data.participantes.join(", ") : ""}
            onChange={(e) => handleParticipantesChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}