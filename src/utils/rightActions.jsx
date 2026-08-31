
export function rightActions(placeholder,ruta){ 
    <button
      className="v2-btn-primary"
      onClick={() => nav({ruta})}
    >
      <i className="fa-solid fa-plus"></i>
      {placeholder}
    </button>
};