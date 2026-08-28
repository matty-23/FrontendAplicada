import React from 'react';
import './Toolbar.css';

const FORMAT_BUTTONS = [
  { cmd: 'bold', label: 'B', className: 'bold', title: 'Negrita' },
  { cmd: 'italic', label: 'I', className: 'italic', title: 'Cursiva' },
  { cmd: 'underline', label: 'S', className: 'underline', title: 'Subrayado' },
];

const ALIGN_BUTTONS = [
  { value: 'justifyLeft', title: 'Izquierda', icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 3h12v1.5H2V3zm0 3h8v1.5H2V6zm0 3h12v1.5H2V9zm0 3h6v1.5H2V12z" /></svg> },
  { value: 'justifyCenter', title: 'Centro', icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 3h12v1.5H2V3zm2 3h8v1.5H4V6zm-2 3h12v1.5H2V9zm3 3h6v1.5H5V12z" /></svg> },
  { value: 'justifyRight', title: 'Derecha', icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 3h12v1.5H2V3zm6 3h6v1.5H8V6zm-6 3h12v1.5H2V9zm4 3h8v1.5H6V12z" /></svg> },
];

const LIST_BUTTONS = [
  { cmd: 'insertUnorderedList', title: 'Lista con viñetas', icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="4.5" r="1.2" /><rect x="6" y="3.8" width="8" height="1.4" rx="0.7" /><circle cx="3" cy="8.5" r="1.2" /><rect x="6" y="7.8" width="8" height="1.4" rx="0.7" /><circle cx="3" cy="12.5" r="1.2" /><rect x="6" y="11.8" width="6" height="1.4" rx="0.7" /></svg> },
  { cmd: 'insertOrderedList', title: 'Lista numerada', icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><text x="1.5" y="6" fontSize="5.5" fontFamily="sans-serif" fontWeight="500">1.</text><rect x="6" y="3.8" width="8" height="1.4" rx="0.7" /><text x="1.5" y="10" fontSize="5.5" fontFamily="sans-serif" fontWeight="500">2.</text><rect x="6" y="7.8" width="8" height="1.4" rx="0.7" /><text x="1.5" y="14" fontSize="5.5" fontFamily="sans-serif" fontWeight="500">3.</text><rect x="6" y="11.8" width="6" height="1.4" rx="0.7" /></svg> },
];

const BLOCK_TYPES = [
  { tag: '<p>', label: 'Párrafo' },
  { tag: '<h3>', label: 'Título' },
  { tag: '<blockquote>', label: 'Cita' },
];

const Sep = () => <div className="tb-sep" />;

const TbBtn = ({ title, onClick, className = '', children }) => (
  <button
    className={`tb-btn ${className}`}
    title={title}
    onMouseDown={(e) => { e.preventDefault(); onClick?.(); }}
  >
    {children}
  </button>
);

const Toolbar = ({ onClear }) => {
  // Ejecuta cualquier comando de formato nativo
  const applyCommand = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
  };

  return (
    <div className="toolbar" onMouseDown={(e) => e.preventDefault()}>

      {/* Selector de tipo de texto */}
      <div className="toolbar-group">
        <select
          className="tb-select"
          onChange={(e) => applyCommand('formatBlock', e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          defaultValue="<p>"
        >
          {BLOCK_TYPES.map(({ tag, label }) => (
            <option key={tag} value={tag}>{label}</option>
          ))}
        </select>
      </div>

      <Sep />

      {/* Negrita, Cursiva, Subrayado */}
      <div className="toolbar-group">
        {FORMAT_BUTTONS.map(({ cmd, label, className, title }) => (
          <TbBtn key={cmd} title={title} className={`tb-btn-text ${className}`} onClick={() => applyCommand(cmd)}>
            {label}
          </TbBtn>
        ))}
      </div>

      <Sep />

      {/* Alineación */}
      <div className="toolbar-group">
        {ALIGN_BUTTONS.map(({ value, title, icon }) => (
          <TbBtn key={value} title={title} onClick={() => applyCommand(value)}>
            {icon}
          </TbBtn>
        ))}
      </div>

      <Sep />

      <TbBtn title="Reducir sangría" onClick={() => applyCommand('outdent')}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="2" y1="4" x2="14" y2="4" />
          <polyline points="6,8 2,10 6,12" />
          <line x1="14" y1="10" x2="2" y2="10" />
        </svg>
      </TbBtn>
      {/* Listas e Indentación */}
      <div className="toolbar-group">
        {LIST_BUTTONS.map(({ cmd, title, icon }) => (
          <TbBtn key={cmd} title={title} onClick={() => applyCommand(cmd)}>
            {icon}
          </TbBtn>
        ))}

        <TbBtn title="Indentar" onClick={() => applyCommand('indent')}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="2" y1="4" x2="14" y2="4" /><polyline points="6,8 10,10 6,12" /><line x1="10" y1="10" x2="2" y2="10" />
          </svg>
        </TbBtn>
      </div>

      <Sep />

      {/* Eliminar (Ahora limpia todo el editor) */}
      <div className="toolbar-group">
        <TbBtn
          title="Limpiar correo"
          className="danger"
          onClick={onClear}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="3,4 13,4" /><path d="M5,4 V3 Q5,2 6,2 h4 Q11,2 11,3 V4" />
            <line x1="6" y1="7" x2="6" y2="12" /><line x1="8" y1="7" x2="8" y2="12" /><line x1="10" y1="7" x2="10" y2="12" />
            <path d="M4,4 l0.7,9 Q4.8,14 6,14 h4 Q11.2,14 11.3,13 L12,4" />
          </svg>
        </TbBtn>
      </div>

    </div>
  );
};

export default Toolbar;