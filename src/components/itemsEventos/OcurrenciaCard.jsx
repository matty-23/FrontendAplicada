import { useState } from "react";
import EncargadoSelector from "./EncargadoSelector";
import ParticipantesSelector from "./ParticipanteSelector";
import "./OcurrenciaCard.css";

function formatearRangoFechas(inicioStr, finStr) {
  if (!inicioStr) return "Sin fecha";
  
  const fInicio = new Date(`${inicioStr.split("T")[0]}T00:00:00`);
  let texto = fInicio.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });

  if (finStr && inicioStr.split("T")[0] !== finStr.split("T")[0]) {
    const fFin = new Date(`${finStr.split("T")[0]}T00:00:00`);
    texto += ` al ${fFin.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" })}`;
  }
  return texto;
}

export default function OcurrenciaCard({ ocurrencia, index, onChange, onEliminar, onSeparar }) {
  const [expandida, setExpandida] = useState(false);

  const cambiar = (campo, valor) => {
    onChange(ocurrencia.idLocal, { [campo]: valor });
  };

  // Saber si es un rango de varios días
  const esRango = () => {
    if (!ocurrencia.fechaInicio || !ocurrencia.fechaFinalizacion) return false;
    const fechaI = ocurrencia.fechaInicio.split("T")[0];
    const fechaF = ocurrencia.fechaFinalizacion.split("T")[0];
    return fechaI !== fechaF;
  };

  return (
    <div className={`ocurrencia-card ${expandida ? "expanded" : ""}`}>
      {/* ================= HEADER / RESUMEN ================= */}
      <div
        className="ocurrencia-card-header"
        onClick={() => setExpandida(!expandida)}
      >
        <div className="ocurrencia-card-header-main">
          <div className="ocurrencia-card-icon">
            <i className="fa-regular fa-calendar-check" />
          </div>
          <div className="ocurrencia-card-summary">
            <div className="ocurrencia-card-title">
              Programación {index !== undefined ? `#${index + 1}` : ""}
            </div>
            <div className="ocurrencia-card-date">
              {formatearRangoFechas(ocurrencia.fechaInicio, ocurrencia.fechaFinalizacion)}
            </div>
            <div className="ocurrencia-card-place">
              {ocurrencia.lugar || "Sin lugar asignado"} · {ocurrencia.cantidadPersonas || 0} personas
            </div>
          </div>
        </div>

        <div className="ocurrencia-card-header-actions">
          <button
            type="button"
            className="ocurrencia-card-action delete"
            onClick={(e) => {
              e.stopPropagation();
              onEliminar(ocurrencia.idLocal);
            }}
            title="Eliminar"
          >
            <i className="fa-solid fa-trash-can" />
          </button>
          <button type="button" className="ocurrencia-card-action">
            <i className={`fa-solid fa-chevron-down ocurrencia-card-chevron`} />
          </button>
        </div>
      </div>

      {/* ================= CONTENIDO EXPANDIDO ================= */}
      {expandida && (
        <div className="ocurrencia-card-content">
          <div className="ocurrencia-card-fields">
            <div className="ocurrencia-card-field">
              <label>Inicio</label>
              <input
                type="datetime-local"
                className="v2-search"
                value={ocurrencia.fechaInicio ? ocurrencia.fechaInicio : ""}
                onChange={(e) => cambiar("fechaInicio", e.target.value)}
              />
            </div>
            <div className="ocurrencia-card-field">
              <label>Finalización</label>
              <input
                type="datetime-local"
                className="v2-search"
                value={ocurrencia.fechaFinalizacion ? ocurrencia.fechaFinalizacion : ""}
                onChange={(e) => cambiar("fechaFinalizacion", e.target.value)}
              />
            </div>
            <div className="ocurrencia-card-field">
              <label>Lugar</label>
              <input
                type="text"
                className="v2-search"
                value={ocurrencia.lugar || ""}
                placeholder="Ej: Aula Magna"
                onChange={(e) => cambiar("lugar", e.target.value)}
              />
            </div>
            <div className="ocurrencia-card-field">
              <label>Cantidad de personas</label>
              <input
                type="number"
                min="0"
                className="v2-search"
                value={ocurrencia.cantidadPersonas ?? 0}
                onChange={(e) => cambiar("cantidadPersonas", Number(e.target.value))}
              />
            </div>

            <div className="ocurrencia-card-field ocurrencia-card-field-full">
              <label>
                <i className="fa-solid fa-user-tie" /> Encargado
              </label>
              <EncargadoSelector
                value={ocurrencia.id_encargado}
                onChange={(id) => cambiar("id_encargado", id)}
              />
            </div>

            <div className="ocurrencia-card-field ocurrencia-card-field-full">
              <label>
                <i className="fa-solid fa-users" /> Participantes
              </label>
              <ParticipantesSelector
                value={ocurrencia.participantes}
                usuariosSeleccionados={ocurrencia.participantesSeleccionados || []}
                onChange={(ids, usuarios) => {
                  onChange(ocurrencia.idLocal, {
                    participantes: ids,
                    participantesSeleccionados: usuarios,
                  });
                }}
              />
            </div>
          </div>

          {/* ================= SEPARAR RANGO ================= */}
          {esRango() && (
            <div style={{
              marginTop: "20px",
              padding: "12px 14px",
              background: "#f8fafc",
              border: "1px dashed #cbd5e1",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#475569" }}>
                <i className="fa-solid fa-layer-group"></i>
                <span>Este bloque agrupa varios días. Edita todo junto o sepáralo.</span>
              </div>
              <button
                type="button"
                className="v2-btn-secondary"
                style={{ height: "32px", fontSize: "12px", padding: "0 12px" }}
                onClick={() => onSeparar(ocurrencia.idLocal)}
              >
                <i className="fa-solid fa-object-ungroup" style={{ marginRight: "6px" }} />
                Separar días
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}