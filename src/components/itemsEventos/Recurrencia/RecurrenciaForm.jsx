import { useRRule } from "../../../hooks/Evento/useRRule";
import RecurrenciaCustomPanel from "./RecurrenciaCustomPanel";
import "./RecurrenciaForm.css";
import { TIPOS_RECURRENCIA, DIAS_SEMANA } from "./recurrenciaConstants";
export default function RecurrenciaForm({
  esRecurrente,
  onToggleRecurrencia,
  onChangeRRule,
  initialRule,
}) {
  const {
    tipo, setTipo,
    diasSemana, toggleDiaSemana,
    diasMes, toggleDiaMes,
    intervalo, setIntervalo,
  } = useRRule(esRecurrente, initialRule, onChangeRRule);

  const renderDiasMes = () => {
    const dias = Array.from({ length: 31 }, (_, i) => i + 1);
    return (
      <div className="recurrencia-mes-grid">
        {dias.map(dia => (
          <button
            key={dia}
            type="button"
            className={`recurrencia-dia-chip ${diasMes.includes(dia) ? "seleccionado" : ""}`}
            onClick={() => toggleDiaMes(dia)}
          >
            {dia}
          </button>
        ))}
      </div>
    );
  };

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
        <label htmlFor="checkbox-recurrencia" style={{ cursor: "pointer", margin: 0, fontSize: "14px" }}>
          Evento Recurrente
        </label>
      </div>

      {esRecurrente && (
        <div className="recurrencia-config animated-panel">
          {/* TABS DE SELECCIÓN */}
          <div className="recurrencia-tipos-group">
            {TIPOS_RECURRENCIA.map(t => (
              <button
                key={t.id}
                type="button"
                className={`recurrencia-tipo-btn ${tipo === t.id ? "active" : ""}`}
                onClick={() => setTipo(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* PANELES DINÁMICOS */}
          <div className="recurrencia-panel-content">
            {tipo === "WEEKLY" && (
              <div className="recurrencia-field fade-in">
                <label>Repetir los días:</label>
                <div className="recurrencia-dias">
                  {DIAS_SEMANA.map((dia) => (
                    <button
                      key={dia.val}
                      type="button"
                      className={`recurrencia-dia-chip ${diasSemana.includes(dia.val) ? "seleccionado" : ""}`}
                      onClick={() => toggleDiaSemana(dia.val)}
                    >
                      {dia.lbl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tipo === "MONTHLY" && (
              <div className="recurrencia-field fade-in">
                <label>Seleccionar días del mes:</label>
                {renderDiasMes()}
              </div>
            )}

            {tipo === "CUSTOM" && (
              <div className="recurrencia-field fade-in" style={{ flexDirection: "row", alignItems: "center", gap: "10px" }}>
                <label style={{ margin: 0 }}>Repetir cada</label>
                <input
                  type="number"
                  min="1"
                  className="v2-search"
                  style={{ width: "80px", textAlign: "center" }}
                  value={intervalo}
                  onChange={(e) => setIntervalo(Math.max(1, Number(e.target.value)))}
                />
                <label style={{ margin: 0 }}>días</label>
              </div>
            )}

            {tipo === "YEARLY" && (
              <div className="recurrencia-hint fade-in">
                <i className="fa-solid fa-circle-info"></i> La fecha específica de repetición se define en la configuración del horario inferior.
              </div>
            )}

            {tipo === "DAILY" && (
               <div className="recurrencia-hint fade-in">
                <i className="fa-solid fa-check"></i> El evento se repetirá todos los días en los horarios especificados debajo.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}