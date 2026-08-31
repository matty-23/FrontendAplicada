import { useRRule } from "../../../hooks/Evento/useRRule";
import RecurrenciaCustomPanel from "./RecurrenciaCustomPanel";
import "./RecurrenciaForm.css";

export default function RecurrenciaForm({
  esRecurrente,
  onToggleRecurrencia,
  onChangeRRule,
  fechaInicio
}) {
  const hookData = useRRule(esRecurrente, onChangeRRule, fechaInicio);

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
              {Object.entries(hookData.patrones).map(([key, patron]) => (
                <option key={key} value={patron}>
                  {hookData.labels[key]}
                </option>
              ))}
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