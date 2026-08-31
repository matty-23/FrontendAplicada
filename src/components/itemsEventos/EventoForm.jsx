// components/itemsEventos/EventoForm.jsx
import Card from "../Card";
import EventoGeneralForm from "./EventoGeneralForm";
import OcurrenciasList from "./OcurrenciasList";

export default function EventoForm({
  evento,
  ocurrencias,
  onEventoChange,
  onOcurrenciaChange,
  onAgregarOcurrencia,
  onEliminarOcurrencia,
  onSepararOcurrencia,
  soloLectura = false,
  isEditing,
  esRecurrente,
  recurrenciaRRule,
  onToggleRecurrencia,
  onChangeRRule
}) {
  return (
    <div className="crear-evento-form-content">
      <Card title="Detalles Generales">
        <EventoGeneralForm
          evento={evento}
          onChange={onEventoChange} 
          disabled={soloLectura}
        />
      </Card>
      
      <Card title="Programación y Lugares">
        <OcurrenciasList
          ocurrencias={ocurrencias}
          valoresGenerales={evento}
          onChange={onOcurrenciaChange}
          onAgregar={onAgregarOcurrencia}
          onEliminar={onEliminarOcurrencia}
          onSeparar={onSepararOcurrencia}
          soloLectura={soloLectura}
          /* Pasamos las props hacia abajo */
          isEditing={isEditing}
          esRecurrente={esRecurrente}
          recurrenciaRRule={recurrenciaRRule}
          onToggleRecurrencia={onToggleRecurrencia}
          onChangeRRule={onChangeRRule}
        />
      </Card>
    </div>
  );
}