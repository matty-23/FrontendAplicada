import { useState, useEffect, useCallback } from 'react';
import usuarioService from '../services/usuarioService';

const ROLES_PERMITIDOS = [
  'empleado',
  'administrador',
  'becario',
  'voluntario'
];

export const useUsuarioSearch = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  // Cargar todos los usuarios al montar
  useEffect(() => {
    const cargarUsuarios = async () => {
      setCargando(true);
      setError(null);
      try {
        const datos = await usuarioService.obtenerUsuarios();
        // Filtrar solo usuarios con roles permitidos
        const usuariosValidos = (datos || []).filter((u) =>
          ROLES_PERMITIDOS.includes(u.rol)
        );
        setUsuarios(usuariosValidos);
        setUsuariosFiltrados(usuariosValidos);
      } catch (err) {
        setError(err.message);
        console.error('Error al cargar usuarios:', err);
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, []);

  // Filtrar usuarios según el query
 const buscar = useCallback(async (searchQuery) => {
  setQuery(searchQuery);

  if (!searchQuery || searchQuery.trim().length === 0) {
    setUsuariosFiltrados(usuarios);
    return;
  }

  try {
    setCargando(true);

    const datos = await usuarioService.obtenerUsuarios({
      busqueda: searchQuery,
      rol: ROLES_PERMITIDOS,
      skip: 0,
      limit: 30,
    });

    setUsuariosFiltrados(datos.data ?? datos ?? []);
  } catch (err) {
    setError(err.message);
  } finally {
    setCargando(false);
  }
}, [usuarios]);

  return {
    usuarios,
    usuariosFiltrados,
    cargando,
    error,
    query,
    buscar,
  };
};

export default useUsuarioSearch;