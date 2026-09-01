import { useState, useEffect } from "react";
import "./RecurrenciaForm.css"; // Usa tus estilos existentes

const PATRONES_PREDEFINIDOS = {
  DAILY: "FREQ=DAILY",
  WEEKLY_MO: "FREQ=WEEKLY;BYDAY=MO",
  MONTHLY_LAST_MO: "FREQ=MONTHLY;BYDAY=-1MO",
  YEARLY_AUG_31: "FREQ=YEARLY;BYMONTH=8;BYMONTHDAY=31",
  WEEKDAYS: "FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR",
  CUSTOM: "CUSTOM",
};

// Formatea la fecha de un input "YYYY-MM-DD" al formato UTC "YYYYMMDDThhmmssZ" que requiere Google Calendar
const formatUntilDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  // Compensamos el offset para evitar que caiga en el día anterior por la zona horaria
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  
  // Establecemos el fin de ese día en UTC
  return `${yyyy}${mm}${dd}T235959Z`;
};

export default function RecurrenciaForm({
  isEditing,
  esRecurrente,
  recurrenciaRRule, // Puede servirte luego si decides hacer "reverse-parsing" del RRule
  onToggleRecurrencia,
  onChangeRRule,
}) {
  const [selectValue, setSelectValue] = useState(PATRONES_PREDEFINIDOS.DAILY);
  
  // Estados para el Módulo Personalizado
  const [customFreq, setCustomFreq] = useState("WEEKLY");
  const [customInterval, setCustomInterval] = useState(1);
  const [customDias, setCustomDias] = useState([]);
  
  // Estados para las Reglas de Finalización
  const [endType, setEndType] = useState("never"); // 'never', 'count', 'until'
  const [endCount, setEndCount] = useState(10);
  const [endDate, setEndDate] = useState("");

  // 1. Sincronizar el selector predefinido
  useEffect(() => {
    if (selectValue !== "CUSTOM" && esRecurrente) {
      onChangeRRule(selectValue);
    }
  }, [selectValue, esRecurrente]);

  // 2. Generar el RRule Avanzado Dinámicamente
  useEffect(() => {
    if (selectValue === "CUSTOM") {
      let rule = `FREQ=${customFreq};INTERVAL=${customInterval}`;
      
      // Agrega días si es semanal
      if (customFreq === "WEEKLY" && customDias.length > 0) {
        rule += `;BYDAY=${customDias.join(",")}`;
      }

      // Agrega la condición de fin
      if (endType === "count" && endCount > 0) {
        rule += `;COUNT=${endCount}`;
      } else if (endType === "until" && endDate) {
        rule += `;UNTIL=${formatUntilDate(endDate)}`;
      }

      onChangeRRule(rule);
    }
  }, [customFreq, customInterval, customDias, endType, endCount, endDate, selectValue]);

  const toggleDiaPersonalizado = (dia) => {
    setCustomDias((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  return (
    <div className="recurrencia-form">
      {/* CHECKBOX (Solo en creación) */}
      {!isEditing && (
        <div className="recurrencia-field" style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}>
          <input
            type="checkbox"
            id="checkbox-recurrencia"
            checked={esRecurrente}
            onChange={(e) => onToggleRecurrencia(e.target.checked)}
            style={{ width: "auto", cursor: "pointer", accentColor: "var(--blue-800)" }}
          />
          <label htmlFor="checkbox-recurrencia" style={{ cursor: "pointer", margin: 0 }}>
            Evento Recurrente
          </label>
        </div>
      )}

      {/* SELECTOR Y CONFIGURACIÓN */}
      {esRecurrente && (
        <div className="recurrencia-config">
          <div className="recurrencia-field">
            <label>Patrón de repetición</label>
            <select
              className="v2-select"
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
            >
              <option value={PATRONES_PREDEFINIDOS.DAILY}>Todos los días</option>
              <option value={PATRONES_PREDEFINIDOS.WEEKLY_MO}>Cada semana, el lunes</option>
              <option value={PATRONES_PREDEFINIDOS.MONTHLY_LAST_MO}>Todos los meses, el último lunes</option>
              <option value={PATRONES_PREDEFINIDOS.YEARLY_AUG_31}>Anualmente, el 31 de agosto</option>
              <option value={PATRONES_PREDEFINIDOS.WEEKDAYS}>Todos los días hábiles (Lun-Vie)</option>
              <option value="CUSTOM">Personalizado…</option>
            </select>
          </div>

          {/* MÓDULO PERSONALIZADO AVANZADO */}
          {selectValue === "CUSTOM" && (
            <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--gray-200)" }}>
              
              {/* FRECUENCIA E INTERVALO */}
              <div className="v2-grid-2">
                <div className="recurrencia-field">
                  <label>Frecuencia</label>
                  <select className="v2-select" value={customFreq} onChange={(e) => setCustomFreq(e.target.value)}>
                    <option value="DAILY">Diaria</option>
                    <option value="WEEKLY">Semanal</option>
                    <option value="MONTHLY">Mensual</option>
                    <option value="YEARLY">Anual</option>
                  </select>
                </div>
                <div className="recurrencia-field">
                  <label>Intervalo (repetir cada...)</label>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="number"
                      min="1"
                      className="v2-search"
                      value={customInterval}
                      onChange={(e) => setCustomInterval(Math.max(1, Number(e.target.value)))}
                      style={{ width: "80px" }}
                    />
                    <span style={{ fontSize: "13px", color: "var(--gray-600)" }}>
                      {customFreq === "DAILY" ? "día(s)" : customFreq === "WEEKLY" ? "semana(s)" : customFreq === "MONTHLY" ? "mes(es)" : "año(s)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* DÍAS DE LA SEMANA (Solo si es semanal) */}
              {customFreq === "WEEKLY" && (
                <div className="recurrencia-field" style={{ marginTop: "16px" }}>
                  <label>Repetir los días</label>
                  <div className="recurrencia-dias">
                    {[
                      { val: "MO", lbl: "L" }, { val: "TU", lbl: "M" }, { val: "WE", lbl: "X" },
                      { val: "TH", lbl: "J" }, { val: "FR", lbl: "V" }, { val: "SA", lbl: "S" }, { val: "SU", lbl: "D" }
                    ].map((dia) => (
                      <button
                        key={dia.val}
                        type="button"
                        className={`recurrencia-dia ${customDias.includes(dia.val) ? "seleccionado" : ""}`}
                        onClick={() => toggleDiaPersonalizado(dia.val)}
                      >
                        {dia.lbl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* REGLAS DE FINALIZACIÓN */}
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px dashed var(--gray-200)" }}>
                <div className="recurrencia-field">
                  <label>Termina</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
                    
                    {/* Opción 1: Nunca */}
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "normal" }}>
                      <input 
                        type="radio" 
                        name="endType" 
                        value="never" 
                        checked={endType === "never"} 
                        onChange={() => setEndType("never")} 
                        style={{ accentColor: "var(--blue-800)" }}
                      />
                      Nunca
                    </label>

                    {/* Opción 2: El (Fecha específica) */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "normal" }}>
                        <input 
                          type="radio" 
                          name="endType" 
                          value="until" 
                          checked={endType === "until"} 
                          onChange={() => setEndType("until")} 
                          style={{ accentColor: "var(--blue-800)" }}
                        />
                        El
                      </label>
                      <input
                        type="date"
                        className="v2-search"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={endType !== "until"}
                        style={{ opacity: endType !== "until" ? 0.5 : 1, padding: "4px 8px" }}
                      />
                    </div>

                    {/* Opción 3: Después de X ocurrencias */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "normal" }}>
                        <input 
                          type="radio" 
                          name="endType" 
                          value="count" 
                          checked={endType === "count"} 
                          onChange={() => setEndType("count")} 
                          style={{ accentColor: "var(--blue-800)" }}
                        />
                        Después de
                      </label>
                      <input
                        type="number"
                        min="1"
                        className="v2-search"
                        value={endCount}
                        onChange={(e) => setEndCount(Math.max(1, Number(e.target.value)))}
                        disabled={endType !== "count"}
                        style={{ width: "60px", opacity: endType !== "count" ? 0.5 : 1, padding: "4px 8px" }}
                      />
                      <span style={{ fontSize: "13px", color: "var(--gray-600)", opacity: endType !== "count" ? 0.5 : 1 }}>ocurrencias</span>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}