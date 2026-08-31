import { useRRule, PATRONES_PREDEFINIDOS } from "../../../hooks/Evento/useRRule";
import RecurrenciaCustomPanel from "./RecurrenciaCustomPanel";
import "./RecurrenciaForm.css";

export default function RecurrenciaForm({
  esRecurrente,
  onToggleRecurrencia,
  onChangeRRule,
}) {
  const hookData = useRRule(esRecurrente, onChangeRRule);

  return (
    <div className="recurrencia-form">
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

      {esRecurrente && (
        <div className="recurrencia-config">
          <div className="recurrencia-field">
            <label>Patrón de repetición</label>
            <select
              className="v2-select"
              value={hookData.selectValue}
              onChange={(e) => hookData.setSelectValue(e.target.value)}
            >
              <option value={PATRONES_PREDEFINIDOS.DAILY}>Todos los días</option>
              <option value={PATRONES_PREDEFINIDOS.WEEKLY_MO}>Cada semana, el lunes</option>
              <option value={PATRONES_PREDEFINIDOS.MONTHLY_LAST_MO}>Todos los meses, el último lunes</option>
              <option value={PATRONES_PREDEFINIDOS.YEARLY_AUG_31}>Anualmente, el 31 de agosto</option>
              <option value={PATRONES_PREDEFINIDOS.WEEKDAYS}>Todos los días hábiles (Lun-Vie)</option>
              <option value="CUSTOM">Personalizado…</option>
            </select>
          </div>

          {hookData.selectValue === "CUSTOM" && (
            <RecurrenciaCustomPanel hookData={hookData} />
          )}
        </div>
      )}
    </div>
  );
}