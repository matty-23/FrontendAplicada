import { useUsuario } from "../hooks/useUsuario"
import "./infoUsuario.css";

export function InfoUsuario() {
    const { usuario, imagen } = useUsuario();

    //Falta cambiar esto por las verdaderas variables
    return (
        <div className="userCard">
            <div className="userImage">
                {"initials"}
            </div>

            <div className="userInfo">
                <div className="userRol">
                    {"Invitado"}
                </div>
                <div className="userEmail">
                    {"Usuario"}
                </div>
            </div>
        </div>
    );
}