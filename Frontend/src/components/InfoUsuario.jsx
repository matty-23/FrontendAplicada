import { useUsuario } from "../hooks/useUsuario"
export function InfoUsuario(){
    const {usuario,imagen} = useUsuario();
    
    return(
        <h1>{usuario.nombre}</h1>
    );
}