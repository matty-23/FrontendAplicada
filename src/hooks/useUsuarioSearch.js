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

  useEffect(() => {
    const cargarUsuarios = async () => {
      setCargando(true);
      setError(null);

      try {
        const respuesta = await usuarioService.obtenerUsuarios();

        const datos = Array.isArray(respuesta)
          ? respuesta
          : respuesta.data ?? respuesta.usuarios ?? [];

        const usuariosValidos = datos.filter((u) =>
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

  const buscar = useCallback((searchQuery) => {
    if (!searchQuery?.trim()) {
      setUsuariosFiltrados(usuarios);
      return;
    }

    const texto = searchQuery.trim().toLowerCase();

    const resultados = usuarios.filter((usuario) => {
      const nombre = usuario.nombre?.toLowerCase() || '';
      const apellido = usuario.apellido?.toLowerCase() || '';
      const email = usuario.email?.toLowerCase() || '';
      const rol = usuario.rol?.toLowerCase() || '';

      return (
        nombre.includes(texto) ||
        apellido.includes(texto) ||
        email.includes(texto) ||
        rol.includes(texto)
      );
    });

    setUsuariosFiltrados(resultados);
  }, [usuarios]);

  return {
    usuarios,
    usuariosFiltrados,
    cargando,
    error,
    buscar,
  };
};

export default useUsuarioSearch;