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
  onSepararOcurrencia, // Añadido opcionalmente por si se pasa en el futuro
  soloLectura = false, // Añadido valor por defecto para evitar errores de "undefined"
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
        />
      </Card>
    </div>
  );
}