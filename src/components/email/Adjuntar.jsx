import React, { useState } from 'react';
import './Adjuntar.css'; // Importamos su propio CSS

export function Adjuntar({ onAttachmentsChange }) {
    const [attachments, setAttachments] = useState([]); 

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newAttachments = [...attachments, ...files];
        setAttachments(newAttachments);
        onAttachmentsChange(newAttachments); 
    };

    const removeAttachment = (indexToRemove) => {
        const newAttachments = attachments.filter((_, index) => index !== indexToRemove);
        setAttachments(newAttachments);
        onAttachmentsChange(newAttachments); 
    };

    return (
        <div className="adjuntar-container">
            <div className="email-footer">
                <div className="attachment-wrapper">
                    <input
                        type="file"
                        id="file-upload"
                        multiple
                        onChange={handleFileChange}
                        className="file-input-hidden"
                    />
                    <label htmlFor="file-upload" className="v2-btn-secondary">
                        <i className="fa-solid fa-paperclip"></i> Adjuntar
                    </label>
                </div>
            </div>

            {/* 2. Lista de archivos adjuntos */}
            {attachments.length > 0 && (
                <div className="email-attachments-list">
                    {attachments.map((file, index) => (
                        <div key={index} className="attachment-chip">
                            <span className="attachment-name">{file.name}</span>
                            <button
                                type="button" // Importante para que no envíe el formulario por error
                                className="attachment-remove"
                                onClick={() => removeAttachment(index)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}