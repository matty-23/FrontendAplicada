import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { VentanaCorreo } from '../components/email/VentanaCorreo';
import { useCorreo } from '../hooks/useCorreo';
import '../styles/EmailPage.css';

export function EmailPage() {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [finalAttachments, setFinalAttachments] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const { loading, error, enviarNotificacion } = useCorreo();

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

  const handleSend = async () => {
    if (!recipients.trim()) return alert("Por favor, ingresa al menos un destinatario.");
    if (!body || !body.trim() || body === '<p><br></p>') return alert("El cuerpo del mensaje no puede estar vacío.");

    const arrayDestinatarios = recipients.split(',').map(email => email.trim()).filter(email => email !== '');

    try {
      let archivosProcesados = null;
      if (finalAttachments.length > 0) archivosProcesados = await convertirArchivosABase64(finalAttachments);
      
      await enviarNotificacion(arrayDestinatarios, subject, body, archivosProcesados);
      alert("¡Correo enviado con éxito!");
      
      setRecipients(''); setSubject(''); setBody(''); setFinalAttachments([]);
      setIsMinimized(true); // Ocultamos la ventana
    } catch (err) {
      alert(error || "Error al enviar el correo. Revisa la consola.");
    }
  };

  const rightActions = (
    <button className="v2-btn-primary" onClick={handleSend} disabled={loading}>
      <i className={loading ? "fa-solid fa-spinner fa-spin" : "fa-regular fa-paper-plane"}></i> 
      {loading ? " Enviando..." : " Enviar"}
    </button>
  );

  return (
    <DashboardLayout breadcrumb="Sistema / Correo" title="Nuevo Mensaje" rightActions={rightActions}>
      <div className="email-view-wrapper">
        
        <VentanaCorreo
          isMinimized={isMinimized}
          setIsMinimized={setIsMinimized}
          recipients={recipients}
          setRecipients={setRecipients}
          subject={subject}
          setSubject={setSubject}
          setBody={setBody}
          setFinalAttachments={setFinalAttachments}
        />

      </div>
    </DashboardLayout>
  );
}