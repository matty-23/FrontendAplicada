import * as z from "zod";

export const loginSchema = z.object({
    correo: z.email("Email inválido").refine(email => email.endsWith("@uap.edu.ar"),"El email debe pertenecer a uap.edu.ar"),

    contraseña: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(20,"La contraseña debe tener como maximo 20 caracteres")
        .regex(/[A-Z]/, "Debe contener una mayúscula")
        .regex(/[a-z]/, "Debe contener una minúscula")
        .regex(/[0-9]/, "Debe contener un número")
});
