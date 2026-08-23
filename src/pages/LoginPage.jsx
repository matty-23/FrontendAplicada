import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContexto } from '../hooks/useContext';
import { useAuth } from '../hooks/useAuth';

export const LoginPage = () => {
  const { manejoBotonLogin, manejoBotonLogout, isLoading, error } = useAuth();
  const { user } = useContexto(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin'); 
    }
  }, [user, navigate]);

  return (
    <div className="login-box">
      <h2 className="login-title">Iniciar Sesión</h2>
      {error && <div className="error-box">{error}</div>}
      <form onSubmit={manejoBotonLogin} className="login-form">

        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            name="correo"
            required
          />
        </div>

        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            name="contraseña"
            required
          />
        </div>

<button type="submit" disabled={isLoading} className="login-button">
  {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
</button>

      </form>
    </div>
  );
};
export default LoginPage;