const getApiUrl = () => import.meta.env.VITE_API_URL;

export class authService {
  constructor() { }

  async login(correo, contraseña) {
    const response = await fetch(`${getApiUrl()}/usuarios/login`, {
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
  }

  async logout() {
    const response = await fetch(`${getApiUrl()}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.f);
    return response.ok;
  }

  // Verifica la sesión consultando la ruta protegida /auth/perfil
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