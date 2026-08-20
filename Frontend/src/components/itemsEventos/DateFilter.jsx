export default function DateFilter({ value, onChange }) {
  return (
    <div className="v2-search" style={{ width: 'auto' }}>
      <i className="fa-regular fa-calendar-days"></i>
      <input 
        type="date" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
      />
    </div>
  );
}