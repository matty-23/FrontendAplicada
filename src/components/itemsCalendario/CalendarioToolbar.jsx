
export default function CalendarioToolbar({
  titulo,
  vistaActual,
  VISTAS,
  onHoy,
  onAnterior,
  onSiguiente,
  onCambiarVista,
}) {
  return (
    <div className="v2-cal-full-head">
      <h2>{titulo}</h2>

      <div className="v2-cal-controls">
        {/* Ir a hoy */}
        <button
          type="button"
          className="v2-btn-secondary"
          onClick={onHoy}
        >
          Hoy
        </button>

        {/* Cambio de vista */}
        <div className="v2-calendar-view-tabs">
          {Object.entries(VISTAS).map(([valor, nombre]) => (
            <button
              key={valor}
              type="button"
              className={`v2-tab ${
                vistaActual === valor ? "active" : ""
              }`}
              onClick={() => onCambiarVista(valor)}
            >
              {nombre}
            </button>
          ))}
        </div>

        {/* Navegación */}
        <button
          type="button"
          className="v2-icon-btn"
          onClick={onAnterior}
          aria-label="Período anterior"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        <button
          type="button"
          className="v2-icon-btn"
          onClick={onSiguiente}
          aria-label="Período siguiente"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
