import React, { useState, useRef } from 'react';
import Toolbar from './Toolbar';
import './Editor.css'; 

export default function EmailEditor({ onChange }) {
  const editorRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState("");

  const handleInput = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      
    if (onChange) {
        onChange(content);
      }
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      setHtmlContent("");
      if (onChange) {
        onChange(""); 
      }
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
        style={{flex: 1, overflowY: 'auto', minHeight: '150px', border: '1px solid #ccc', padding: '15px', outline: 'none' }}
      />
    </div>
  );
}