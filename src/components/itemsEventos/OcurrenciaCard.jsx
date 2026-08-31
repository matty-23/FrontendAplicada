import { useState } from "react";
import EncargadoSelector from "./EncargadoSelector";
import ParticipantesSelector from "./ParticipanteSelector";
import "./OcurrenciaCard.css";

function formatearRangoFechas(inicioStr, finStr) {
  if (!inicioStr) return "Sin fecha";

  const fInicio = new Date(`${inicioStr.split("T")[0]}T00:00:00`);

  let texto = fInicio.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  if (
    finStr &&
    inicioStr.split("T")[0] !== finStr.split("T")[0]
  ) {
    const fFin = new Date(`${finStr.split("T")[0]}T00:00:00`);

    texto += ` al ${fFin.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })}`;
  }

  return texto;
}

export default function OcurrenciaCard({
  ocurrencia,
  index,
  onChange,
  onEliminar,
  onSeparar,
  soloLectura = false,
}) {
  const [expandida, setExpandida] = useState(false);

  const cambiar = (campo, valor) => {
    if (soloLectura) return;
    onChange(ocurrencia.idLocal, {
      [campo]: valor,
    });
  };

  // --- LÓGICA PARA SEPARAR FECHA Y HORA ---
  const fechaI = ocurrencia.fechaInicio ? ocurrencia.fechaInicio.split("T")[0] : "";
  const horaI = ocurrencia.fechaInicio && ocurrencia.fechaInicio.includes("T")
    ? ocurrencia.fechaInicio.split("T")[1].substring(0, 5)
    : "00:00";

  const fechaF = ocurrencia.fechaFinalizacion ? ocurrencia.fechaFinalizacion.split("T")[0] : "";
  const horaF = ocurrencia.fechaFinalizacion && ocurrencia.fechaFinalizacion.includes("T")
    ? ocurrencia.fechaFinalizacion.split("T")[1].substring(0, 5)
    : "23:59";

  const handleDateChange = (tipo, nuevaFecha) => {
    if (!nuevaFecha) {
      cambiar(`fecha${tipo}`, "");
      return;
    }
    const h = tipo === "Inicio" ? horaI : horaF;
    const finalTime = ocurrencia.allDay ? (tipo === "Inicio" ? "00:00" : "23:59") : h;
    cambiar(`fecha${tipo}`, `${nuevaFecha}T${finalTime}`);
  };

  const handleTimeChange = (tipo, nuevaHora) => {
    const f = tipo === "Inicio" ? fechaI : fechaF;
    if (!f) return;
    cambiar(`fecha${tipo}`, `${f}T${nuevaHora}`);
  };

  const handleAllDayToggle = (e) => {
    const checked = e.target.checked;
    cambiar("allDay", checked);

    // Si se activa "Todo el día", forzamos los horarios de inicio y fin en el estado
    if (checked) {
      if (fechaI) cambiar("fechaInicio", `${fechaI}T00:00`);
      if (fechaF) cambiar("fechaFinalizacion", `${fechaF}T23:59`);
    }
  };

  const esRango = () => {
    if (
      !ocurrencia.fechaInicio ||
      !ocurrencia.fechaFinalizacion
    ) {
      return false;
    }

    const fechaI = ocurrencia.fechaInicio.split("T")[0];
    const fechaF = ocurrencia.fechaFinalizacion.split("T")[0];

    return fechaI !== fechaF;
  };

  return (
    <div
      className={`ocurrencia-card ${expandida ? "expanded" : ""
        } ${soloLectura ? "solo-lectura" : ""}`}
    >
      {/* ================= HEADER ================= */}

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
              Programación{" "}
              {index !== undefined
                ? `#${index + 1}`
                : ""}
            </div>

            <div className="ocurrencia-card-date">
              {formatearRangoFechas(
                ocurrencia.fechaInicio,
                ocurrencia.fechaFinalizacion
              )}
            </div>

            <div className="ocurrencia-card-place">
              {ocurrencia.lugar ||
                "Sin lugar asignado"}{" "}
              ·{" "}
              {ocurrencia.cantidadPersonas || 0}{" "}
              personas
            </div>

          </div>
        </div>

        <div className="ocurrencia-card-header-actions">

          {/* Eliminar solamente en edición */}
          {!soloLectura && (
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
          )}

          <button
            type="button"
            className="ocurrencia-card-action"
          >
            <i
              className={`fa-solid fa-chevron-down ocurrencia-card-chevron ${expandida ? "rotated" : ""
                }`}
            />
          </button>

        </div>
      </div>

      {/* ================= CONTENIDO ================= */}

      {expandida && (
        <div className="ocurrencia-card-content">
            {/* INICIO */}
            <div className="ocurrencia-card-fields">
            {/* CHECKBOX TODO EL DÍA */}
            <div className="ocurrencia-card-field ocurrencia-card-field-full" style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                id={`allDay-${ocurrencia.idLocal}`}
                checked={ocurrencia.allDay || false}
                disabled={soloLectura}
                onChange={handleAllDayToggle}
                style={{ width: "auto", cursor: "pointer", accentColor: "var(--blue-800)" }}
              />
              <label htmlFor={`allDay-${ocurrencia.idLocal}`} style={{ cursor: "pointer", margin: 0 }}>
                Todo el día
              </label>
            </div>

            {/* FILA DE FECHAS */}
            <div className="ocurrencia-card-field">
              <label>Fecha de inicio</label>
              <input
                type="date"
                className="v2-search"
                value={fechaI}
                disabled={soloLectura}
                onChange={(e) => handleDateChange("Inicio", e.target.value)}
              />
            </div>
            <div className="ocurrencia-card-field">
              <label>Fecha de finalización</label>
              <input
                type="date"
                className="v2-search"
                value={fechaF}
                disabled={soloLectura}
                onChange={(e) => handleDateChange("Finalizacion", e.target.value)}
              />
            </div>

            {/* FILA DE HORAS (Condicional) */}
            {!ocurrencia.allDay && (
              <>
                <div className="ocurrencia-card-field">
                  <label>Hora de inicio</label>
                  <input
                    type="time"
                    className="v2-search"
                    value={horaI}
                    disabled={soloLectura}
                    onChange={(e) => handleTimeChange("Inicio", e.target.value)}
                  />
                </div>
                <div className="ocurrencia-card-field">
                  <label>Hora de finalización</label>
                  <input
                    type="time"
                    className="v2-search"
                    value={horaF}
                    disabled={soloLectura}
                    onChange={(e) => handleTimeChange("Finalizacion", e.target.value)}
                  />
                </div>
              </>
            )}

            {/* LUGAR */}
              <div className="ocurrencia-card-field">
                <label>Lugar</label>

                <input
                  type="text"
                  className="v2-search"
                  value={
                    ocurrencia.lugar || ""
                  }
                  placeholder="Ej: Aula Magna"
                  disabled={soloLectura}
                  onChange={(e) =>
                    cambiar(
                      "lugar",
                      e.target.value
                    )
                  }
                />
              </div>

              {/* CANTIDAD */}
              <div className="ocurrencia-card-field">
                <label>
                  Cantidad de personas
                </label>

                <input
                  type="number"
                  min="0"
                  className="v2-search"
                  value={
                    ocurrencia.cantidadPersonas ?? 0
                  }
                  disabled={soloLectura}
                  onChange={(e) =>
                    cambiar(
                      "cantidadPersonas",
                      Number(e.target.value)
                    )
                  }
                />
              </div>

              {/* ENCARGADO */}
              <div className="ocurrencia-card-field ocurrencia-card-field-full">

                <label>
                  <i className="fa-solid fa-user-tie" />{" "}
                  Encargado
                </label>

                <EncargadoSelector
                  value={ocurrencia.id_encargado}
                  disabled={soloLectura}
                  onChange={(id) =>
                    cambiar(
                      "id_encargado",
                      id
                    )
                  }
                />

              </div>

              {/* PARTICIPANTES */}
              <div className="ocurrencia-card-field ocurrencia-card-field-full">

                <label>
                  <i className="fa-solid fa-users" />{" "}
                  Participantes
                </label>

                <ParticipantesSelector
                  value={ocurrencia.participantes}
                  usuariosSeleccionados={
                    ocurrencia.participantesSeleccionados ||
                    []
                  }
                  disabled={soloLectura}
                  onChange={(ids, usuarios) => {

                    if (soloLectura) return;

                    onChange(
                      ocurrencia.idLocal,
                      {
                        participantes: ids,
                        participantesSeleccionados:
                          usuarios,
                      }
                    );
                  }}
                />

              </div>

            </div>

            {/* ================= SEPARAR RANGO ================= */}

            {esRango() && !soloLectura && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "12px 14px",
                  background: "#f8fafc",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: "#475569",
                  }}
                >
                  <i className="fa-solid fa-layer-group"></i>

                  <span>
                    Este bloque agrupa varios días.
                    Edita todo junto o sepáralo.
                  </span>
                </div>

                <button
                  type="button"
                  className="v2-btn-secondary"
                  style={{
                    height: "32px",
                    fontSize: "12px",
                    padding: "0 12px",
                  }}
                  onClick={() =>
                    onSeparar(
                      ocurrencia.idLocal
                    )
                  }
                >
                  <i
                    className="fa-solid fa-object-ungroup"
                    style={{
                      marginRight: "6px",
                    }}
                  />

                  Separar días
                </button>

              </div>
            )}

          </div>
      )}
        </div>
      );
}
