import { useNavigate } from "react-router-dom";

export function useSeccion() {
    const navigate = useNavigate();

    const perfil = () => { navigate("/user/Perfil"); };

    const configuracion = () => { navigate("/user/Configuracion"); };

    return {perfil, configuracion}
}