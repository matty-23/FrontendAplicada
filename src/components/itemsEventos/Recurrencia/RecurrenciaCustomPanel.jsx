import { DIAS_SEMANA, UNIDADES_FRECUENCIA } from "./recurrenciaConstants";
import { RecurrenciaFinalizacion } from "./RecurrenciaFinalizacion";
import "./RecurrenciaCustomPanel.css";

export default function RecurrenciaCustomPanel({
  customFreq,
  setCustomFreq,
  customInterval,
  setCustomInterval,
  customDias,
  toggleDia,
  endType,
  setEndType,
  endCount,
  setEndCount,
  endDate,
  setEndDate,
}) {
  return (
    <div className="custom-panel-container">
      {/* FRECUENCIA E INTERVALO */}
      <div className="v2-grid-2">
        <div className="recurrencia-field">
          <label>Frecuencia</label>
          <select 
            className="v2-select" 
            value={customFreq} 
            onChange={(e) => setCustomFreq(e.target.value)}
          >
            <option value="DAILY">Diaria</option>
            <option value="WEEKLY">Semanal</option>
            <option value="MONTHLY">Mensual</option>
            <option value="YEARLY">Anual</option>
          </select>
        </div>

        <div className="recurrencia-field">
          <label>Intervalo (repetir cada...)</label>
          <div className="interval-wrapper">
            <input
              type="number"
              min="1"
              className="v2-search interval-input"
              value={customInterval}
              onChange={(e) => setCustomInterval(Math.max(1, Number(e.target.value)))}
            />
            <span className="interval-text">
              {UNIDADES_FRECUENCIA[customFreq]}
            </span>
          </div>
        </div>
      </div>

      {/* DÍAS DE LA SEMANA */}
      {customFreq === "WEEKLY" && (
        <div className="recurrencia-field dias-semana-container">
          <label>Repetir los días</label>
          <div className="recurrencia-dias">
            {DIAS_SEMANA.map((dia) => (
              <button
                key={dia.val}
                type="button"
                className={`recurrencia-dia ${customDias.includes(dia.val) ? "seleccionado" : ""}`}
                onClick={() => toggleDia(dia.val)}
              >
                {dia.lbl}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FINALIZACIÓN */}
      <RecurrenciaFinalizacion 
        endType={endType}
        setEndType={setEndType}
        endDate={endDate}
        setEndDate={setEndDate}
        endCount={endCount}
        setEndCount={setEndCount}
      />
    </div>
  );
}