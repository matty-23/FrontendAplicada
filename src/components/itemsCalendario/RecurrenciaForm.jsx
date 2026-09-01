// components/calendario/RecurrenciaForm.jsx (NUEVO)
export function RecurrenciaForm({ recurrencia, onUpdate }) {
  const diasSemana = [
    { valor: 1, etiqueta: "Lunes" },
    { valor: 2, etiqueta: "Martes" },
    { valor: 3, etiqueta: "Miércoles" },
    { valor: 4, etiqueta: "Jueves" },
    { valor: 5, etiqueta: "Viernes" },
    { valor: 6, etiqueta: "Sábado" },
    { valor: 0, etiqueta: "Domingo" },
  ];

  return (
    <div className="recurrencia-form">
      <label>Repetición</label>

      <select
        value={recurrencia.tipo}
        onChange={(e) => onUpdate({ tipo: e.target.value })}
      >
        <option value="no-repetir">No repetir</option>
        <option value="diaria">Todos los días</option>
        <option value="semanal">Cada semana</option>
        <option value="cada-x">Cada X días</option>
        <option value="personalizada">Personalizada</option>
      </select>

      {/* Mostrar campos según tipo */}
      
      {recurrencia.tipo === "semanal" && (
        <div className="recurrencia-diasemana">
          <label>Días de la semana</label>
          <div className="dias-selector">
            {diasSemana.map(({ valor, etiqueta }) => (
              <label key={valor}>
                <input
                  type="checkbox"
                  checked={recurrencia.diasSemana.includes(valor)}
                  onChange={(e) => {
                    // Lógica de toggle
                  }}
                />
                {etiqueta}
              </label>
            ))}
          </div>
        </div>
      )}

      {recurrencia.tipo === "cada-x" && (
        <div className="recurrencia-intervalo">
          <label>Cada</label>
          <input
            type="number"
            min="1"
            value={recurrencia.frecuencia}
            onChange={(e) => 
              onUpdate({ frecuencia: parseInt(e.target.value) })
            }
          />
          <span>días</span>
        </div>
      )}
    </div>
  );
}