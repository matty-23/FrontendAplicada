import { useUsuario } from "../hooks/useUsuario"
import "./infoUsuario";

export function InfoUsuario(){
    const {usuario,imagen} = useUsuario();
    
    return(
        <div>
            <div className="userCard">
                <p>{"matias"}</p>
            </div>
        </div>
    );
}