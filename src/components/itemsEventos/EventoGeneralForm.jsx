
export default function EventoGeneralForm({ evento,onChange,}) {

  const handleChange = (campo, valor) => {onChange(campo, valor);};

  return (
    <div className="crear-evento-detalles">

      {/* Nombre */}
      <div className="crear-evento-field crear-evento-field-full">
        <label>
          Nombre del Evento
        </label>

        <input
          type="text"
          required
          className="v2-search"
          placeholder="Ej: Jornada de Puertas Abiertas"
          value={evento.titulo || ""}
          onChange={(e) =>
            handleChange("titulo", e.target.value)
          }
        />
      </div>

      {/* Categoría */}
      <div className="crear-evento-field">
        <label>
          Categoría
        </label>

        <select
          className="v2-select"
          value={evento.categoria || "Academico"}
          onChange={(e) =>
            handleChange("categoria", e.target.value)
          }
        >
          <option value="Academico">
            Académico
          </option>

          <option value="Institucional">
            Institucional
          </option>

          <option value="Recreativo">
            Recreativo
          </option>
        </select>
      </div>

      {/* Estado */}
      <div className="crear-evento-field">
        <label>
          Estado
        </label>

        <select
          className="v2-select"
          value={evento.estado || "Pendiente"}
          onChange={(e) =>
            handleChange("estado", e.target.value)
          }
        >
          <option value="Pendiente">
            Pendiente
          </option>

          <option value="En revisión">
            En revisión
          </option>

          <option value="Activo">
            Activo
          </option>
        </select>
      </div>

    </div>
  );
}
