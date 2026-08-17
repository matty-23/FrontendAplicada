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

  register(){}

  logout(){
    const response = await fetch(`${getApiUrl()}/auth/logout`, {
      method: 'POST',
      credentials: 'include', 
    });

    if(response.f);
    return response.ok;
  }

  //Para saber si la sesion es valida todavia 
  getSession() {
  const response = await fetch(`${getApiUrl()}/api/auth/get-session`,{
      method: 'GET',
      credentials: "include",
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}
    

}
