import DashboardLayout from "../components/DashboardLayout";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const EVENTS = { 5: ["ev-yellow", "Examen"], 11: ["ev-orange", "Solicitud"], 12: ["ev-green", "Jornada"], 17: ["ev-blue", "Evento UX"], 22: ["ev-yellow", "Workshop"], 28: ["ev-green", "TechTalks"] };

export default function CalendarioPageV2() {
  const empty = [null, null];
  const cells = [...empty, ...Array.from({ length: 31 }, (_, i) => i + 1), null, null];

  const rightActions = (
    <>
      <div style={{ display: "flex", background: "var(--gray-100)", borderRadius: 9, padding: 3, gap: 2 }}>
        {["Mes", "Semana", "Día"].map((v, i) => <button key={v} className="v2-tab" style={i === 0 ? { background: "white", color: "var(--blue-800)", boxShadow: "var(--shadow-xs)" } : { border: "none", background: "transparent" }}>{v}</button>)}
      </div>
      <button className="v2-btn-primary"><i className="fa-solid fa-plus"></i> Añadir</button>
    </>
  );

  return (
    <DashboardLayout breadcrumb="Principal / Calendario" title="Calendario General" rightActions={rightActions}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div className="v2-cal-full" style={{ flex: 1 }}>
          <div className="v2-cal-full-head">
            <h2>Agosto 2026</h2>
            <div className="v2-cal-controls">
              <button className="v2-btn-secondary" style={{ padding: "6px 14px", fontSize: 12 }}>Hoy</button>
              <button className="v2-icon-btn" style={{ width: 32, height: 32 }}><i className="fa-solid fa-chevron-left"></i></button>
              <button className="v2-icon-btn" style={{ width: 32, height: 32 }}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </div>
          <div className="v2-cal-body">
            <div className="v2-cal-grid">
              {DAYS.map(d => <div className="v2-cal-dhead" key={d}>{d}</div>)}
              {cells.map((c, i) =>
                c === null
                  ? <div className="v2-cal-cell empty" key={"e" + i}></div>
                  : <div className={`v2-cal-cell${c === 17 ? " today" : ""}`} key={c}>
                      {c}
                      {EVENTS[c] && <div className={`v2-cal-ev ${EVENTS[c][0]}`}>{EVENTS[c][1]}</div>}
                    </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}