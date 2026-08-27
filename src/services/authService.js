const getApiUrl = () => import.meta.env.VITE_BFF_URL;

export class authService {
  async login(correo, contraseña) {
    try {
      const url = `${getApiUrl()}/auth/login`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: correo,
          password: contraseña,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || 'Error al iniciar sesión');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      const response = await fetch(`${getApiUrl()}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cerrar sesión');
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async getSession() {
    const response = await fetch(`${getApiUrl()}/auth/perfil`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }
};