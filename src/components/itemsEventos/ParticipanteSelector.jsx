import { useState, useRef, useEffect } from "react";
import useUsuarioSearch from "../../hooks/useUsuarioSearch";
import "./ParticipanteSelector.css";

export default function ParticipantesSelector({
  value = [],
  onChange,
}) {
  const { usuariosFiltrados, buscar, cargando } = useUsuarioSearch();

  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [query, setQuery] = useState("");

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const participantesIds = Array.isArray(value) ? value : [];

  /*
   * Usuarios que conocemos actualmente.
   * Sirve para mostrar los tags seleccionados.
   */
  const usuariosSeleccionados = usuariosFiltrados.filter((usuario) =>
    participantesIds.includes(usuario.id)
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setMostrarDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleInputChange = (e) => {
    const valor = e.target.value;

    setQuery(valor);

    buscar(valor);

    setMostrarDropdown(true);
  };

  const handleSelectUsuario = (usuario) => {
    if (participantesIds.includes(usuario.id)) {
      return;
    }

    const nuevosIds = [
      ...participantesIds,
      usuario.id
    ];

    const nuevosUsuarios = [
      ...usuariosSeleccionados,
      usuario
    ];

    onChange(nuevosIds, nuevosUsuarios);
  };

  const handleRemoveParticipante = (usuarioId) => {
    const nuevosIds = participantesIds.filter(
      (id) => id !== usuarioId
    );

    const nuevosUsuarios = usuariosSeleccionados.filter(
      (usuario) => usuario.id !== usuarioId
    );

    onChange(nuevosIds, nuevosUsuarios);
  };

  return (
    <div className="participantes-selector">

      {/* INPUT */}
      <div className="participantes-input-wrapper">

        <input
          ref={inputRef}
          type="text"
          className="v2-search participantes-input"
          placeholder="Buscar participantes por nombre, email o rol..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setMostrarDropdown(true)}
          autoComplete="off"
        />

        {cargando && (
          <div className="participantes-spinner">
            <i className="fa-solid fa-spinner fa-spin"></i>
          </div>
        )}

      </div>

      {/* DROPDOWN */}
      {mostrarDropdown && (
        <div
          ref={dropdownRef}
          className="participantes-dropdown"
        >

          {usuariosFiltrados.length > 0 ? (

            <ul className="participantes-list">

              {usuariosFiltrados.map((usuario) => {

                const seleccionado =
                  participantesIds.includes(usuario.id);

                return (
                  <li
                    key={usuario.id}
                    className="participantes-item"
                  >

                    <button
                      type="button"
                      className="participantes-item-btn"
                      onClick={() =>
                        handleSelectUsuario(usuario)
                      }
                      disabled={seleccionado}
                    >

                      <div className="participantes-item-info">

                        <span className="participantes-nombre">
                          {usuario.nombre}{" "}
                          {usuario.apellido}
                        </span>

                        <span className="participantes-email">
                          {usuario.email}
                        </span>

                      </div>

                      <span className="participantes-rol">
                        {usuario.rol}
                      </span>

                    </button>

                  </li>
                );
              })}

            </ul>

          ) : (

            <div className="participantes-empty">
              {query
                ? "No se encontraron usuarios"
                : "Escribe para buscar"}
            </div>

          )}

        </div>
      )}

      {/* TAGS */}
      {/* TAGS */}
      {usuariosSeleccionados.length > 0 && (
        <div className="participantes-selected">

          <div className="participantes-selected-header">
            <span className="participantes-selected-count">
              {usuariosSeleccionados.length}{" "}
              {usuariosSeleccionados.length === 1
                ? "participante"
                : "participantes"}{" "}
              seleccionado
              {usuariosSeleccionados.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="participantes-badges">

            {usuariosSeleccionados.map((usuario) => (
              <div
                key={usuario.id}
                className="participante-badge"
              >
                <div className="participante-badge-info">
                  <span className="participante-badge-nombre">
                    {usuario.nombre} {usuario.apellido}
                  </span>

                  <span className="participante-badge-rol">
                    {usuario.rol}
                  </span>
                </div>

                <button
                  type="button"
                  className="participante-badge-remove"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveParticipante(usuario.id);
                  }}
                  title="Eliminar participante"
                >
                  ×
                </button>
              </div>
            ))}

          </div>
        </div>
      )}
    </div>
  );
}