import { formatearRangoFechas } from "../../../utils/ocurrenciaUtils";

export default function OcurrenciaCardHeader({ocurrencia, index,expandida,soloLectura,onToggle,onEliminar,}) {
  return (
    <div className="ocurrencia-card-header" onClick={onToggle}>
      <div className="ocurrencia-card-header-main">
        <div className="ocurrencia-card-icon">
          <i className="fa-regular fa-calendar-check" />
        </div>

        <div className="ocurrencia-card-summary">
          <div className="ocurrencia-card-title">
            Programación {index !== undefined ? `#${index + 1}` : ""}
          </div>

          <div className="ocurrencia-card-date">
            {formatearRangoFechas(ocurrencia.fechaInicio, ocurrencia.fechaFinalizacion)}
          </div>

          <div className="ocurrencia-card-place">
            {ocurrencia.lugar || "Sin lugar asignado"} · {ocurrencia.cantidadPersonas || 0} personas
          </div>
        </div>
      </div>

      <div className="ocurrencia-card-header-actions">
        {!soloLectura && (
          <button
            type="button"
            className="ocurrencia-card-action delete"
            onClick={(e) => {
              e.stopPropagation();
              onEliminar(ocurrencia.idLocal);
            }}
            title="Eliminar"
          >
            <i className="fa-solid fa-trash-can" />
          </button>
        )}

        <button type="button" className="ocurrencia-card-action">
          <i className={`fa-solid fa-chevron-down ocurrencia-card-chevron ${expandida ? "rotated" : ""}`} />
        </button>
      </div>
    </div>
  );
}