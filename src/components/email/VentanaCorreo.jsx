import React, { useState, useEffect, useRef } from 'react';
import EmailEditor from './Editor';
import { Adjuntar } from './Adjuntar';
import { EncabezadoCorreo } from './EncabezadoCorreo';

export function VentanaCorreo({isMinimized,setIsMinimized,recipients,setRecipients,subject,setSubject,setBody,setFinalAttachments,formErrors,setFormErrors}) {
  const [position, setPosition] = useState({ top: 120, left: 320 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (isMinimized) return; 
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isMinimized) return;
    
    let newTop = e.clientY - dragOffset.current.y;
    let newLeft = e.clientX - dragOffset.current.x;

    newTop = Math.max(0, Math.min(newTop, window.innerHeight - 50)); 
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 150));

    setPosition({ top: newTop, left: newLeft });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      className={`email-page-container ${isMinimized ? 'minimized' : ''}`}
      style={!isMinimized ? { top: `${position.top}px`, left: `${position.left}px` } : {}}
    >
      <div className="window-header" onMouseDown={handleMouseDown}>
        <span className="window-title">Nuevo Mensaje</span>
        <div className="window-actions">
          <button 
            type="button" 
            className="window-btn"
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} 
            title={isMinimized ? "Restaurar" : "Minimizar"}
          >
            <i className={isMinimized ? "fa-regular fa-window-restore" : "fa-solid fa-minus"}></i>
          </button>
        </div>
      </div>

      <div className="window-body">
        
        <div className="input-group">
          <EncabezadoCorreo 
            label="Destinatarios" 
            id="recipients" 
            value={recipients} 
            onChange={(e) => {setRecipients(e.target.value);if (formErrors.recipients) setFormErrors({ ...formErrors, recipients: null });}} 
            placeholder="ej. contacto@empresa.com" 
          />
          {formErrors.recipients && <span style={{color: 'red', fontSize: '12px'}}>{formErrors.recipients}</span>}
        </div>

        <EncabezadoCorreo label="Asunto" id="subject" value={subject} 
          onChange={(e) => setSubject(e.target.value)} placeholder="Asunto" />
        
        <div className="email-editor-section">
          <EmailEditor onChange={(html) => {
            setBody(html);
            if (formErrors.body) setFormErrors({ ...formErrors, body: null });
          }} />
          {formErrors.body && <span style={{color: 'red', fontSize: '12px'}}>{formErrors.body}</span>}
        </div>
        
        <Adjuntar onAttachmentsChange={(files) => setFinalAttachments(files)} />
      </div>
    </div>
  );
}