import React, { useState, useRef } from 'react';
import Toolbar from './email/Toolbar';
import './email/Editor.css'; 

export default function EmailEditor({ onChange }) {
  const editorRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState("");

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setHtmlContent(content);
      // 2. Ejecuta el onChange para pasarle el texto al padre
      if (onChange) onChange(content); 
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      setHtmlContent("");
      if (onChange) onChange(""); 
    }
  };

  return (
    <div className="email-composer-container">
      <Toolbar onClear={handleClear} />
      <div 
        className="email-editor-area"
        contentEditable={true}
        ref={editorRef}
        onInput={handleInput}
        placeholder="Escribe tu correo aquí..."
        style={{ minHeight: '300px', border: '1px solid #ccc', padding: '15px', outline: 'none' }}
      />
    </div>
  );
}