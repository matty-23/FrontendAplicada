import { useNavigate } from "react-router-dom";
import { useState,useEffect } from 'react';
import { useUsuario } from "../hooks/useUsuario" 

function Login() {

    const [manejoBotonLogin]=useUsuario();


    return (
        <div>
            <div className="login-box">
                <h2 className="login-title">Iniciar Sesión</h2>

                <form onSubmit={manejoBotonLogin} className="login-form">

                    <div className="input-group">
                        <label>Correo del usuario</label>
                        <input
                            type="email"
                            name="correo"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="contraseña"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" >
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