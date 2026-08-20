import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

<<<<<<< HEAD
    const {manejoBotonLogin,gda,ga}=useAuth();
=======
  // Si ya tiene sesión válida, lo mandamos directo adentro
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);
>>>>>>> origin/fix/EventoMultidia

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/admin'); 
    } catch (err) {
      // Ahora este catch sí se va a ejecutar y mostrará el error en pantalla
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verificá las credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h3>Iniciar Sesión</h3>
        {error && <div className="error-box">{error}</div>}
        
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            value={formData.password} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            required 
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Conectando al BFF...' : 'Iniciar sesión'}
        </button>
      </form>
    </div>
  );
};
export default LoginPage;