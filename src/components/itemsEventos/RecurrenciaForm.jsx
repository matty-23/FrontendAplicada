import { useRecurrencia } from "../../hooks/Evento/useRecurrencia";
import "./RecurrenciaForm.css";

const DIAS_SEMANA = [
  { valor: 0, nombre: "L" },
  { valor: 1, nombre: "M" },
  { valor: 2, nombre: "X" },
  { valor: 3, nombre: "J" },
  { valor: 4, nombre: "V" },
  { valor: 5, nombre: "S" },
  { valor: 6, nombre: "D" },
];

export default function RecurrenciaForm({
  recurrenciaInicial,
  onChange,
}) {
  const {
    recurrencia,
    actualizarTipo,
    actualizarFrecuencia,
    toggleDiaSemana,
    actualizarConfiguracion,
  } = useRecurrencia(recurrenciaInicial);

  const cambiarTipo = (tipo) => {
    actualizarTipo(tipo);

    onChange?.({
      ...recurrencia,
      tipo,
      diasSemana:
        tipo === "semanal"
          ? recurrencia.diasSemana
          : [],
    });
  };

  const cambiarFrecuencia = (e) => {
    const valor = Math.max(
      1,
      Number(e.target.value) || 1
    );

    actualizarFrecuencia(valor);

    onChange?.({
      ...recurrencia,
      frecuencia: valor,
    });
  };

  const cambiarDia = (dia) => {
    toggleDiaSemana(dia);

    const diasActualizados =
      recurrencia.diasSemana.includes(dia)
        ? recurrencia.diasSemana.filter(
            (d) => d !== dia
          )
        : [...recurrencia.diasSemana, dia].sort();

    onChange?.({
      ...recurrencia,
      diasSemana: diasActualizados,
    });
  };

  const cambiarConfiguracion = (campo, valor) => {
    actualizarConfiguracion({
      [campo]: valor,
    });

    onChange?.({
      ...recurrencia,
      configuracion: {
        ...recurrencia.configuracion,
        [campo]: valor,
      },
    });
  };

  return (
    <div className="recurrencia-form">

      {/* Tipo */}
      <div className="recurrencia-field">
        <label>
          Recurrencia
        </label>

        <select
          className="v2-select"
          value={recurrencia.tipo}
          onChange={(e) =>
            cambiarTipo(e.target.value)
          }
        >
          <option value="no-repetir">
            No repetir
          </option>

          <option value="diaria">
            Diariamente
          </option>

          <option value="semanal">
            Semanalmente
          </option>

          <option value="cada-x">
            Cada X días
          </option>
        </select>
      </div>

      {/* DIARIA */}
      {recurrencia.tipo === "diaria" && (
        <div className="recurrencia-config">

          <div className="recurrencia-field">
            <label>
              Repetir cada
            </label>

            <div className="recurrencia-input-group">
              <input
                type="number"
                min="1"
                className="v2-search"
                value={recurrencia.frecuencia}
                onChange={cambiarFrecuencia}
              />

              <span>
                día
                {recurrencia.frecuencia !== 1
                  ? "s"
                  : ""}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* SEMANAL */}
      {recurrencia.tipo === "semanal" && (
        <div className="recurrencia-config">

          <div className="recurrencia-field">
            <label>
              Repetir cada
            </label>

            <div className="recurrencia-input-group">
              <input
                type="number"
                min="1"
                className="v2-search"
                value={recurrencia.frecuencia}
                onChange={cambiarFrecuencia}
              />

              <span>
                semana
                {recurrencia.frecuencia !== 1
                  ? "s"
                  : ""}
              </span>
            </div>
          </div>

          <div className="recurrencia-field">
            <label>
              Repetir los días
            </label>

            <div className="recurrencia-dias">

              {DIAS_SEMANA.map((dia) => {
                const seleccionado =
                  recurrencia.diasSemana.includes(
                    dia.valor
                  );

                return (
                  <button
                    key={dia.valor}
                    type="button"
                    className={`recurrencia-dia ${
                      seleccionado
                        ? "seleccionado"
                        : ""
                    }`}
                    onClick={() =>
                      cambiarDia(dia.valor)
                    }
                  >
                    {dia.nombre}
                  </button>
                );
              })}

            </div>

            {recurrencia.diasSemana.length === 0 && (
              <span className="recurrencia-hint">
                Seleccioná al menos un día.
              </span>
            )}
          </div>

        </div>
      )}

      {/* CADA X */}
      {recurrencia.tipo === "cada-x" && (
        <div className="recurrencia-config">

          <div className="recurrencia-field">
            <label>
              Repetir cada
            </label>

            <div className="recurrencia-input-group">
              <input
                type="number"
                min="1"
                className="v2-search"
                value={recurrencia.frecuencia}
                onChange={cambiarFrecuencia}
              />

              <span>
                días
              </span>
            </div>
          </div>

        </div>
      )}

      {/* CONFIGURACIÓN OPCIONAL */}
      {recurrencia.tipo !== "no-repetir" && (
        <div className="recurrencia-field">
          <label>
            Finalización de recurrencia
          </label>

          <select
            className="v2-select"
            value={
              recurrencia.configuracion
                ?.tipoFin || "sin-fecha"
            }
            onChange={(e) =>
              cambiarConfiguracion(
                "tipoFin",
                e.target.value
              )
            }
          >
            <option value="sin-fecha">
              Sin fecha de finalización
            </option>

            <option value="fecha">
              Finalizar en una fecha
            </option>

            <option value="cantidad">
              Después de cierta cantidad
            </option>
          </select>
        </div>
      )}

      {/* FECHA FIN */}
      {recurrencia.tipo !== "no-repetir" &&
        recurrencia.configuracion?.tipoFin ===
          "fecha" && (
          <div className="recurrencia-field">
            <label>
              Fecha de finalización
            </label>

            <input
              type="date"
              className="v2-search"
              value={
                recurrencia.configuracion
                  ?.fechaFin || ""
              }
              onChange={(e) =>
                cambiarConfiguracion(
                  "fechaFin",
                  e.target.value
                )
              }
            />
          </div>
        )}

      {/* CANTIDAD */}
      {recurrencia.tipo !== "no-repetir" &&
        recurrencia.configuracion?.tipoFin ===
          "cantidad" && (
          <div className="recurrencia-field">
            <label>
              Cantidad de repeticiones
            </label>

            <input
              type="number"
              min="1"
              className="v2-search"
              value={
                recurrencia.configuracion
                  ?.cantidad || 1
              }
              onChange={(e) =>
                cambiarConfiguracion(
                  "cantidad",
                  Math.max(
                    1,
                    Number(e.target.value) || 1
                  )
                )
              }
            />
          </div>
        )}

    </div>
  );
}