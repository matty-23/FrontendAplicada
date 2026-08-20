export default function SearchInput({ placeholder, value, onChange }) {
  return (
    <div className="v2-search">
      <i className="fa-solid fa-magnifying-glass"></i>
      <input 
        type="text" 
        placeholder={placeholder || "Buscar..."} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
}