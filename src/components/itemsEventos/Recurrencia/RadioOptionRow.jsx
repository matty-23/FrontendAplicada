export function RadioOptionRow ({ label, value, currentEndType, onChange, children }) {
  const isSelected = currentEndType === value;

  return (
    <div className="end-condition-row">
      <label className="end-condition-label">
        <input
          type="radio"
          className="end-condition-radio"
          value={value}
          checked={isSelected}
          onChange={() => onChange(value)}
        />
        {label}
      </label>
      {children}
    </div>
  );
};
