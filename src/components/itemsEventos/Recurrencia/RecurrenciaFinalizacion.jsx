import { RadioOptionRow } from "./RadioOptionRow";
import "./RecurrenciaCustomPanel.css";

export function RecurrenciaFinalizacion({
  endType,
  setEndType,
  endDate,
  setEndDate,
  endCount,
  setEndCount,
}) {
  return (
    <div className="custom-panel-divider">
      <div className="recurrencia-field">
        <label>Termina</label>
        
        <div className="end-condition-group">
          <RadioOptionRow 
            label="Nunca" 
            value="never" 
            currentEndType={endType} 
            onChange={setEndType} 
          />

          <RadioOptionRow 
            label="El" 
            value="until" 
            currentEndType={endType} 
            onChange={setEndType}
          >
            <input 
              type="date" 
              className="v2-search end-condition-input" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              disabled={endType !== "until"} 
            />
          </RadioOptionRow>

          <RadioOptionRow 
            label="Después de" 
            value="count" 
            currentEndType={endType} 
            onChange={setEndType}
          >
            <input 
              type="number" 
              min="1" 
              className="v2-search end-count-input" 
              value={endCount} 
              onChange={(e) => setEndCount(Math.max(1, Number(e.target.value)))} 
              disabled={endType !== "count"} 
            />
            <span className={`interval-text ${endType !== "count" ? "disabled-option-text" : ""}`}>
              ocurrencias
            </span>
          </RadioOptionRow>
        </div>
      </div>
    </div>
  );
}