import { useState } from 'react';
import { loginSchema } from "../schemas/authSchema";
import { useNavigate } from "react-router-dom";
import { useContexto } from "./useContext";
//Literalmente el service
export function useAuth() {
    const navigate = useNavigate();
    const { login, logout } = useContexto();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const manejoBotonLogin = async (e) => {
        e.preventDefault();
        setError(null); 
        setIsLoading(true); 

        const form = new FormData(e.currentTarget);
        const datos = {
            correo: form.get("correo"), 
            contraseña: form.get("contraseña")
        };

        const resultado = loginSchema.safeParse(datos);

        if (!resultado.success) {
            setError(resultado.error.issues[0].message);
            setIsLoading(false); 
            return;
        }

        try {
            await login(datos.correo, datos.contraseña);
            navigate(`/Inicio`);
        } catch (err) {
            setError("Correo o contraseña incorrectos.");
        } finally {
            setIsLoading(false);
        }
    };

    const manejoBotonLogout = async () => {
        await logout();
        navigate('/');
    };

    return { manejoBotonLogin, manejoBotonLogout, isLoading, error };
}