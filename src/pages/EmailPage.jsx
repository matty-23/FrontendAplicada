import React, { useState } from 'react';
import EmailComposer from '../components/email/Editor'; 
import DashboardLayout from '../components/DashboardLayout'; // Importamos tu layout
import '../styles/EmailPage.css'; 

export function EmailPage() {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSend = () => {
    console.log("Enviando correo...", {
      Destinatarios: recipients,
      Asunto: subject,
      CuerpoHTML: body,
      Archivos: attachments
    });
  };

  // Reutilizamos el estilo de botones de tu proyecto para el TopBar
  const rightActions = (
    <button className="v2-btn-primary" onClick={handleSend}>
      <i className="fa-regular fa-paper-plane"></i> Enviar
    </button>
  );

  return (
    // Usamos tu Layout nativo en lugar del header manual
    <DashboardLayout breadcrumb="Sistema / Correo" title="Nuevo Mensaje" rightActions={rightActions}>
      
      <div className="email-page-container">
        <div className="email-form-group">
          <label htmlFor="recipients">Para:</label>
          <input 
            type="text" 
            id="recipients" 
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="ejemplo@correo.com, otro@correo.com" 
          />
        </div>

        <div className="email-form-group">
          <label htmlFor="subject">Asunto:</label>
          <input 
            type="text" 
            id="subject" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Escribe el asunto del correo" 
          />
        </div>

        <div className="email-editor-section">
          <EmailComposer onChange={(html) => setBody(html)} />
        </div>

        {attachments.length > 0 && (
          <div className="email-attachments-list">
            {attachments.map((file, index) => (
              <div key={index} className="attachment-chip">
                <span className="attachment-name">{file.name}</span>
                <button className="attachment-remove" onClick={() => removeAttachment(index)}>✕</button>
              </div>
            ))}
          </div>
        )}

        <div className="email-footer" style={{ borderTop: 'none', background: 'transparent' }}>
          <div className="attachment-wrapper">
            <input 
              type="file" 
              id="file-upload" 
              multiple 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            <label htmlFor="file-upload" className="v2-btn-secondary">
              <i className="fa-solid fa-paperclip"></i> Adjuntar
            </label>
          </div>
        </div>
      </div>
      
    </DashboardLayout>
  );
}