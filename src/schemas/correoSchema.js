import * as z from "zod";
export const emailSchema = z.object({
  recipients: z.string().min(1, "Ingresa al menos un destinatario."),
  subject: z.string().optional(),
  
  body: z.string()
    .refine((val) => {
      const sinTags = val.replace(/<[^>]*>?/gm, '');
      const sinEspaciosHTML = sinTags.replace(/&nbsp;/g, '');
      return sinEspaciosHTML.trim().length > 0;
    }, { 
      message: "El cuerpo del mensaje no puede estar vacío." 
    })
});