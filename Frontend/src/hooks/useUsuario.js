import { loginSchema } from "../schemas/authSchema";
import { authService } from "../services/authService";

//Literalmente el service
const auth = new authService();

export function useUsuario() {

    const manejoBotonLogin = (async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        const datos = {
            correo: form.get("correo"),
            contraseña: form.get("contraseña")
        };

        //Le pasamos los datos al esquema que comprueba si cumplen con las condiciones 
        const resultado = loginSchema.safeParse(datos);

        if (!resultado.success) {
            console.log(resultado.error.issues);
            return;
        }

        const respuesta = await auth.login(datos.correo, datos.contraseña);
        //Terminar despues el flujo cuando sepamos que devuelve bff
    
    });

    const manejoBotonRegister=({});
    //falta terminar cerrar sesion. Volver cuando se entienda mejor
    const manejoBotonLogout = (async()=>{
        const cerrarSesion=await auth.logout();
        return cerrarSesion;
    });

    return (manejoBotonLogin,manejoBotonLogout,manejoBotonRegister);
}