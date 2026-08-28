import React from 'react';
import './EncabezadoCorreo.css';

export function EncabezadoCorreo({ label, id, value, onChange, placeholder }) {
  return (
    <div className="encabezado-group">
      <label htmlFor={id} className="encabezado-label">{label}</label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="encabezado-input"
      />
    </div>
  );
}