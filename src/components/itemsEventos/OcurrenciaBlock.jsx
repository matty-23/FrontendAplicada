import { useMemo } from 'react';
import EncargadoSelector from './EncargadoSelector';
import ParticipantesSelector from './ParticipanteSelector';
import './OcurrenciaBlock.css';

export default function OcurrenciaBlock({
  index,
  data,
  onChange,
  onRemove,
  canDelete = true,
  usuariosDisponibles = [],
}) {
  const handleChange = (field, value) => {
    onChange(index, {
      ...data, [field]: value,
    });
  };

  return (
    <div className="ocurrencia-block">
      {/* Header */}
      <div className="ocurrencia-header">
        <h4 className="ocurrencia-title">
          <i className="fa-regular fa-calendar-check"></i>
          Ocurrencia {index + 1}
        </h4>

        {canDelete && (
          <button
            type="button"
            className="ocurrencia-delete"
            onClick={() => onRemove(index)}
            title="Eliminar ocurrencia"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        )}
      </div>

      {/* Campos de fecha y lugar */}
      <div className="v2-grid-2">
        {/* Fecha de inicio */}
        <div className="ocurrencia-field">
          <label>Inicio</label>
          <input
            type="datetime-local"
            className="v2-search"
            required
            value={data.fechaInicio || ''}
            onChange={(e) =>
              handleChange('fechaInicio', e.target.value)
            }
          />
        </div>

        {/* Fecha de finalización */}
        <div className="ocurrencia-field">
          <label>Finalización</label>
          <input
            type="datetime-local"
            className="v2-search"
            required
            value={data.fechaFinalizacion || ''}
            onChange={(e) =>
              handleChange('fechaFinalizacion', e.target.value)
            }
          />
        </div>

        {/* Lugar */}
        <div className="ocurrencia-field">
          <label>Lugar (Opcional)</label>
          <input
            type="text"
            className="v2-search"
            placeholder="Ej: Aula Magna"
            value={data.lugar || ''}
            onChange={(e) => handleChange('lugar', e.target.value)}
          />
        </div>

        {/* Cantidad de personas */}
        <div className="ocurrencia-field">
          <label>Cant. Personas</label>
          <input
            type="number"
            min="0"
            className="v2-search"
            value={data.cantidadPersonas ?? 0}
            onChange={(e) =>
              handleChange(
                'cantidadPersonas',
                e.target.value === '' ? 0 : Number(e.target.value)
              )
            }
          />
        </div>
      </div>

      {/* Selector de Encargado */}
      <div className="ocurrencia-field ocurrencia-field-full">
        <label>
          <i className="fa-solid fa-user-tie"></i>
          Encargado
        </label>
        <EncargadoSelector
          value={data.id_encargado}
          onChange={(id) => {
            onChange(index, {
              ...data,
              id_encargado: id,
            });
          }}
        />
      </div>

      {/* Selector de Participantes */}
      <div className="ocurrencia-field ocurrencia-field-full">
        <label>
          <i className="fa-solid fa-users"></i>
          Participantes
        </label>
        <ParticipantesSelector
          value={data.participantes}
          usuariosSeleccionados={data.participantesSeleccionados || []}
          onChange={(nuevosIds, nuevosUsuarios) => {
            onChange(index, {
              ...data,
              participantes: nuevosIds,
              participantesSeleccionados: nuevosUsuarios,
            });
          }}
        />
      </div>
    </div>
  );
}