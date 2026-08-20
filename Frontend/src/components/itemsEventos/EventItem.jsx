import "./EventItem.css";

export default function EventItem({
  id,
  titulo,
  fecha,
  responsable,
  estado,
  tipo,
  isSelected,
  onSelect,
  onEdit,
  onView
}) {
  const badgeClass =
    tipo === "green"
      ? "b-active"
      : tipo === "blue"
        ? "b-review"
        : "b-pending";

  const handleSelect = () => {
    onSelect(id);
  };

  const handleEdit = () => {
    onEdit(id);
  };

  const handleView = () => {
    onView(id);
  };

  return (
    <div
      className={`v2-event-item ${isSelected ? "event-item-selected" : ""}`}
    >
      {/* Tira de color lateral */}
      <div className={`v2-event-strip strip-${tipo}`}></div>

      {/* Checkbox */}
      <div className="event-item-checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
        />
      </div>

      {/* Información del evento */}
      <div className="v2-event-body">
        <div className="v2-event-name">
          {titulo}
        </div>

        <div className="v2-event-meta">
          <span className="v2-event-meta-it">
            <i className="fa-regular fa-calendar-days"></i>
            {fecha}
          </span>

          <span className="v2-event-meta-it">
            <i className="fa-regular fa-user"></i>
            {responsable}
          </span>
        </div>
      </div>

      {/* Estado */}
      <div className="v2-event-status">
        <span className={`v2-badge ${badgeClass}`}>
          {estado}
        </span>
      </div>

      {/* Acciones */}
      <div className="v2-event-action">
        <button
          type="button"
          className="v2-btn-ghost event-edit-button"
          onClick={handleEdit}
        >
          <i className="fa-solid fa-pen"></i>
          Editar
        </button>

        <button
          type="button"
          className="v2-btn-ghost"
          onClick={handleView}
        >
          Ver
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}