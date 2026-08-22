import { useState, useRef, useEffect } from 'react';
import useUsuarioSearch from '../../hooks/useUsuarioSearch';
import './EncargadoSelector.css';

export default function EncargadoSelector({
  value = '',
  onChange,
  usuarioSeleccionado = null,
}) {
  const { usuariosFiltrados, buscar, cargando } = useUsuarioSearch();
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

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
    setMostrarDropdown(true);
  };

  const handleSelectUsuario = (usuario) => {
    onChange(usuario.id);
    setQuery(usuario.nombre);
    setMostrarDropdown(false);
  };

  const handleLimpiar = (e) => {
    e.preventDefault();
    onChange('');
    setQuery('');
  };

  return (
    <div className="encargado-selector">
      <div className="encargado-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="v2-search encargado-input"
          placeholder="Buscar encargado (nombre, email, rol)..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setMostrarDropdown(true)}
          autoComplete="off"
        />

        {value && (
          <button
            type="button"
            className="encargado-clear-btn"
            onClick={handleLimpiar}
            title="Limpiar selección"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        )}

        {cargando && (
          <div className="encargado-spinner">
            <i className="fa-solid fa-spinner fa-spin"></i>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {mostrarDropdown && (
        <div ref={dropdownRef} className="encargado-dropdown">
          {usuariosFiltrados.length > 0 ? (
            <ul className="encargado-list">
              {usuariosFiltrados.map((usuario) => (
                <li key={usuario.id} className="encargado-item">
                  <button
                    type="button"
                    className="encargado-item-btn"
                    onClick={() => handleSelectUsuario(usuario)}
                  >
                    <div className="encargado-item-info">
                      <span className="encargado-nombre">
                        {usuario.nombre}
                      </span>
                      <span className="encargado-email">
                        {usuario.email}
                      </span>
                    </div>
                    <span className="encargado-rol">
                      {usuario.rol}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="encargado-empty">
              {query ? 'No se encontraron usuarios' : 'Escribe para buscar'}
            </div>
          )}
        </div>
      )}

      {/* Mostrar usuario seleccionado */}
      {usuarioSeleccionado && (
        <div className="encargado-selected">
          <i className="fa-solid fa-check-circle"></i>
          <div className="encargado-selected-info">
            <span className="encargado-selected-nombre">
              {usuarioSeleccionado.nombre}
            </span>
            <span className="encargado-selected-rol">
              {usuarioSeleccionado.rol}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}