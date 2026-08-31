export default function OcurrenciaCardSeparar({ onSeparar }) {
  return (
    <div className="ocurrencia-card-separar-container">
      <div className="ocurrencia-card-separar-info">
        <i className="fa-solid fa-layer-group"></i>
        <span>
          Este bloque agrupa varios días. Edita todo junto o sepáralo.
        </span>
      </div>

      <button
        type="button"
        className="v2-btn-secondary ocurrencia-card-separar-btn"
        onClick={onSeparar}
      >
        <i className="fa-solid fa-object-ungroup"></i>
        Separar días
      </button>
    </div>
  );
}