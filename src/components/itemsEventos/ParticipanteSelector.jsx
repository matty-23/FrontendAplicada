import { useState, useRef, useEffect, useMemo } from 'react';
import useUsuarioSearch from '../../hooks/useUsuarioSearch';
import './ParticipanteSelector.css';

export default function ParticipantesSelector({
  value = [],
  onChange,
}) {
  const {
    usuarios,
    usuariosFiltrados,
    buscar,
    cargando,
  } = useUsuarioSearch();

  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [query, setQuery] = useState('');

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const participantesIds = Array.isArray(value) ? value : [];

  const participantesSeleccionados = useMemo(() => {
    return participantesIds
      .map((id) =>
        usuarios.find((usuario) => usuario.id === id)
      )
      .filter(Boolean);
  }, [participantesIds, usuarios]);

  const usuariosDisponibles = usuariosFiltrados.filter(
    (usuario) => !participantesIds.includes(usuario.id)
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

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

    onChange([
      ...participantesIds,
      usuario.id,
    ]);

    setQuery('');
    inputRef.current?.focus();
  };

  const handleRemoveParticipante = (usuarioId) => {
    onChange(
      participantesIds.filter(
        (id) => id !== usuarioId
      )
    );
  };

  return (
    <div className="participantes-selector">

      <div className="participantes-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="v2-search participantes-input"
          placeholder="Buscar participantes..."
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

      {mostrarDropdown && (
        <div
          ref={dropdownRef}
          className="participantes-dropdown"
        >
          {usuariosDisponibles.length > 0 ? (
            <ul className="participantes-list">
              {usuariosDisponibles.map((usuario) => (
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
          ) : (
            <div className="participantes-empty">
              {query
                ? 'No se encontraron usuarios'
                : 'Escribe para buscar'}
            </div>
          )}
        </div>
      )}

      {participantesSeleccionados.length > 0 && (
        <div className="participantes-selected">

          <div className="participantes-selected-header">
            <span className="participantes-selected-count">
              {participantesSeleccionados.length}{' '}
              {participantesSeleccionados.length === 1
                ? 'participante seleccionado'
                : 'participantes seleccionados'}
            </span>
          </div>

          <div className="participantes-badges">
            {participantesSeleccionados.map((usuario) => (
              <div
                key={usuario.id}
                className="participante-badge"
              >
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
                  onClick={() =>
                    handleRemoveParticipante(usuario.id)
                  }
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