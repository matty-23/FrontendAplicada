import { useState } from 'react';
import { useCorreo } from './useCorreo';
import { emailSchema } from '../schemas/correoSchema';
import { convertirArchivosABase64 } from '../utils/convertirArchivo';

export function useEmailForm() {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [finalAttachments, setFinalAttachments] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const [formErrors, setFormErrors] = useState({}); 
  const { loading, error, enviarNotificacion } = useCorreo();

  const handleSend = async () => {
    setFormErrors({}); 
    
    const validacion = emailSchema.safeParse({ recipients, subject, body });

    if (!validacion.success) {
      const fieldErrors = {};
      
      validacion.error.issues.forEach((issue) => {
        const campo = issue.path[0];
        
        if (campo && !fieldErrors[campo]) {
          fieldErrors[campo] = issue.message; 
        }
      });
      
      setFormErrors(fieldErrors);
      return; 
    }

    try {
      const arrayDestinatarios = recipients.split(',').map(email => email.trim()).filter(email => email !== '');
      
      let archivosProcesados = null;
      if (finalAttachments.length > 0) {
        archivosProcesados = await convertirArchivosABase64(finalAttachments);
      }
      
      await enviarNotificacion(arrayDestinatarios, subject, body, archivosProcesados);
      
      setRecipients(''); 
      setSubject(''); 
      setBody(''); 
      setFinalAttachments([]);
      setIsMinimized(true);

    } catch (err) {
      console.error("Error del servidor:", err);
    }
  };

  return {
    states: { recipients, subject, body, finalAttachments, isMinimized, loading, formErrors },
    setters: { setRecipients, setSubject, setBody, setFinalAttachments, setIsMinimized, setFormErrors },
    handleSend
  };
}

