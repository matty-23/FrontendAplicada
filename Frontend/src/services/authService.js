const getApiUrl = () => import.meta.env.VITE_API_URL;

export class authService {
    constructor(){}

    login(correo, contraseña) {
        const response = await fetch(`${getApiUrl()}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contraseña }),
      credentials: 'include', 
    });

    if (!response.ok) throw new Error('Credenciales inválidas');
    return response.json(); 
  }
    

}
