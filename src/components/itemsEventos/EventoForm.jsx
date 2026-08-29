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
}) {
  return (
    <div className="crear-evento-form-content">

      <Card title="Detalles Generales">
        <EventoGeneralForm
          evento={evento}
          onChange={onEventoChange}
        />
      </Card>

      <Card title="Programación y Lugares">
        <OcurrenciasList
          ocurrencias={ocurrencias}
          valoresGenerales={evento}
          onChange={onOcurrenciaChange}
          onAgregar={onAgregarOcurrencia}
          onEliminar={onEliminarOcurrencia}
        />
      </Card>

    </div>
  );
}