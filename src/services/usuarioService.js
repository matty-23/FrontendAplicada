const BFF_URL = import.meta.env.VITE_BFF_URL ?? 'http://localhost:3001';

export class usuarioService {
  constructor() { }

  async obtenerUsuarios(filtros = {}) {
    try {
      const params = new URLSearchParams();

      Object.entries(filtros).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;

        if (Array.isArray(value)) {
          value.forEach((item) => {
            params.append(key, String(item));
          });
        } else {
          params.append(key, String(value));
        }
      });

      const queryString = params.toString();

      const url = `${BFF_URL}/api/usuario/filtros${queryString ? `?${queryString}` : ''
        }`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error al obtener usuarios: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error en obtenerUsuarios:', error);
      throw error;
    }
  }

  // Filtrar usuarios por nombre, email o rol (búsqueda suave)
  async filtrarUsuarios(filtros) {
    try {
      const queryParams = new URLSearchParams();

      if (filtros.nombre) queryParams.append('nombre', filtros.nombre);
      if (filtros.email) queryParams.append('email', filtros.email);
      if (filtros.rol) queryParams.append('rol', filtros.rol);
      if (filtros.query) queryParams.append('query', filtros.query);

      const url = `${BFF_URL}/api/usuario/filtros?${queryParams.toString()}`;

      console.log('=== FILTRAR USUARIOS ===');
      console.log('Filtros enviados:', filtros);
      console.log('URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      console.log('Status:', response.status);
      console.log('StatusText:', response.statusText);
      console.log('Headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Respuesta error:', errorText);

        throw new Error(`Error al filtrar usuarios: ${response.status}`);
      }

      const data = await response.json();

      console.log('Respuesta JSON:', data);
      console.log('========================');

      return data;
    } catch (error) {
      console.error('Error en filtrarUsuarios:', error);
      throw error;
    }
  }

  // Búsqueda rápida en caché local (recomendado para mejor UX)
  async buscarUsuariosLocal(query, usuariosCache) {
    if (!query || query.trim().length === 0) return [];

    const queryLower = query.toLowerCase();

    return usuariosCache.filter((usuario) => {
      const nombre = (usuario.nombre || '').toLowerCase();
      const email = (usuario.email || '').toLowerCase();
      const rol = (usuario.rol || '').toLowerCase();

      return (
        nombre.includes(queryLower) ||
        email.includes(queryLower) ||
        rol.includes(queryLower)
      );
    });
  }

  // Obtener usuario por ID
  async obtenerUsuarioById(id) {
    try {
      const response = await fetch(`${BFF_URL}/api/usuario/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error al obtener usuario: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error en obtenerUsuarioById:', error);
      throw error;
    }
  }

  // Eliminar usuario
  async eliminarUsuario(id) {
    try {
      const response = await fetch(`${BFF_URL}/api/usuario/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar usuario: ${response.status}`);
      }

      return response.status === 204 ? null : response.json();
    } catch (error) {
      console.error('Error en eliminarUsuario:', error);
      throw error;
    }
  }

  // Actualizar usuario
  async actualizarUsuario(id, datos) {
    try {
      const response = await fetch(`${BFF_URL}/api/usuario/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar usuario: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error en actualizarUsuario:', error);
      throw error;
    }
  }
}

export default new usuarioService();