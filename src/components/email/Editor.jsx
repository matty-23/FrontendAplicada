import React, { useState, useRef } from 'react';
import Toolbar from './Toolbar';
import './Editor.css'; 

export default function EmailEditor() {
  const editorRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState("");

  const handleInput = () => {
    if (editorRef.current) {
      setHtmlContent(editorRef.current.innerHTML);
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      setHtmlContent("");
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