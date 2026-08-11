//import { useNavigate } from "react-router-dom";

function Login() {
    return (
        <div>
        <div className="login-box">
            <h2 className="login-title">Iniciar Sesión</h2>

            <form className="login-form">

                <div className="input-group">
                    <label>Nombre de Usuario</label>
                    <input
                        type="text"
                        name="username"
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        required
                    />
                </div>

                <button type="submit" className="btn-primary">
                    Ingresar
                </button>
            </form>

            <p className="login-hint">
                ¿No tienes cuenta? <span className="register-link" >
                    Regístrate
                </span>
            </p>
        </div>
        </div>);
}

export default Login;