import { useState } from 'react';
import { useCorreo } from './useCorreo';

export function useEmailForm() {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [finalAttachments, setFinalAttachments] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const { loading, error, enviarNotificacion } = useCorreo();
  

  const handleSend = async () => {
    if (!recipients.trim()) return alert("Por favor, ingresa al menos un destinatario.");
    if (!body || !body.trim() || body === '<p><br></p>') return alert("El cuerpo del mensaje no puede estar vacío.");

    const arrayDestinatarios = recipients.split(',').map(email => email.trim()).filter(email => email !== '');

    try {
      let archivosProcesados = null;
      if (finalAttachments.length > 0) {
        archivosProcesados = await convertirArchivosABase64(finalAttachments);
      }
      
      await enviarNotificacion(arrayDestinatarios, subject, body, archivosProcesados);
      alert("¡Correo enviado con éxito!");
      
      setRecipients(''); 
      setSubject(''); 
      setBody(''); 
      setFinalAttachments([]);
      setIsMinimized(true);
    } catch (err) {
      alert(error || "Error al enviar el correo. Revisa la consola.");
    }
  };

  return {
    states: { recipients, subject, body, finalAttachments, isMinimized, loading },
    setters: { setRecipients, setSubject, setBody, setFinalAttachments, setIsMinimized },
    handleSend
  };
}

const convertirArchivosABase64 = async (archivos) => {
  return Promise.all(
    archivos.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({ nombre: file.name, tipo: file.type, contenido: reader.result });
        reader.onerror = (error) => reject(error);
      });
    })
  );
};