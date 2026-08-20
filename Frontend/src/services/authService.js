const getApiUrl = () => import.meta.env.VITE_API_URL;

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${getApiUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

if (!response.ok) {
  const error = await response.text();
  console.log('ERROR LOGIN:', response.status, error);
  throw new Error(error);
}

    return response.json();
  },

  register: async (datosUsuario) => {
    const response = await fetch(`${getApiUrl()}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(datosUsuario),
    });

    if (!response.ok) {
      throw new Error('Error al registrar usuario');
    }

    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${getApiUrl()}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      return false;
    }

    return response.json();
  },

  // Verifica la sesión consultando la ruta protegida /auth/perfil
  getSession: async () => {
    const response = await fetch(`${getApiUrl()}/auth/perfil`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  },
};