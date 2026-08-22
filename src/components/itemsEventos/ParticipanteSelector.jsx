import { useState, useRef, useEffect } from 'react';
import useUsuarioSearch from '../../hooks/useUsuarioSearch';
import './ParticipanteSelector.css';

export default function ParticipantesSelector({
  value = [],
  onChange,
  usuariosSeleccionados = [],
}) {
  const { usuariosFiltrados, buscar, cargando } = useUsuarioSearch();
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // IDs de usuarios ya seleccionados
  const participantesIds = Array.isArray(value) ? value : [];

  // Cerrar dropdown al hacer clic fuera
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const valor = e.target.value;
    setQuery(valor);
    buscar(valor);
  };

  const handleSelectUsuario = (usuario) => {
    if (!participantesIds.includes(usuario.id)) {
      onChange([...participantesIds, usuario.id]);
    }
    setQuery('');
    inputRef.current?.focus();
  };

  const handleRemoveParticipante = (usuarioId) => {
    onChange(participantesIds.filter((id) => id !== usuarioId));
  };

  // Filtrar usuarios ya seleccionados del dropdown
  const usuariosDisponibles = usuariosFiltrados.filter(
    (u) => !participantesIds.includes(u.id)
  );

  return (
    <div className="participantes-selector">
      {/* Input de búsqueda */}
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

      {/* Dropdown de búsqueda */}
      {mostrarDropdown && (
        <div ref={dropdownRef} className="participantes-dropdown">
          {usuariosDisponibles.length > 0 ? (
            <ul className="participantes-list">
              {usuariosDisponibles.map((usuario) => (
                <li key={usuario.id} className="participantes-item">
                  <button
                    type="button"
                    className="participantes-item-btn"
                    onClick={() => handleSelectUsuario(usuario)}
                  >
                    <div className="participantes-item-info">
                      <span className="participantes-nombre">
                        {usuario.nombre}
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
              ))}
            </ul>
          ) : usuariosSeleccionados.length > 0 && query === '' ? (
            <div className="participantes-empty">
              Todos los usuarios disponibles están seleccionados
            </div>
          ) : (
            <div className="participantes-empty">
              {query
                ? 'No se encontraron usuarios disponibles'
                : 'Escribe para buscar participantes'}
            </div>
          )}
        </div>
      )}

      {/* Lista de participantes seleccionados */}
      {usuariosSeleccionados.length > 0 && (
        <div className="participantes-selected">
          <div className="participantes-selected-header">
            <span className="participantes-selected-count">
              {usuariosSeleccionados.length}{' '}
              {usuariosSeleccionados.length === 1
                ? 'participante'
                : 'participantes'}{' '}
              seleccionado{usuariosSeleccionados.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="participantes-badges">
            {usuariosSeleccionados.map((usuario) => (
              <div key={usuario.id} className="participante-badge">
                <div className="participante-badge-info">
                  <span className="participante-badge-nombre">
                    {usuario.nombre}
                  </span>
                  <span className="participante-badge-rol">
                    {usuario.rol}
                  </span>
                </div>
                <button
                  type="button"
                  className="participante-badge-remove"
                  onClick={() => handleRemoveParticipante(usuario.id)}
                  title={`Remover ${usuario.nombre}`}
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}