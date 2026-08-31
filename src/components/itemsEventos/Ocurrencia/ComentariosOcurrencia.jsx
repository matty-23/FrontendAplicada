export default function ComentariosOcurrencia({
  comentarios = [],
  onChange,
}) {
  return (
    <div className="comentarios-ocurrencia">
      <div>
        <i className="fa-regular fa-comment"></i>
        Comentarios ({comentarios.length})
      </div>

      {/* En T4.1 dejamos preparada
          la integración. */}
    </div>
  );
}