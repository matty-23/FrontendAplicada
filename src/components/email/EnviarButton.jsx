export function EnviarButton({ onClick, loading }) {
  return (
    <button className="v2-btn-primary" onClick={onClick} disabled={loading}>
      <i className={loading ? "fa-solid fa-spinner fa-spin" : "fa-regular fa-paper-plane"}></i> 
      {loading ? " Enviando..." : " Enviar"}
    </button>
  );
}