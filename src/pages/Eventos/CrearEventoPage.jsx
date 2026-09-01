import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import EventoForm from "../../components/itemsEventos/EventoForm";
import { useEventoForm } from "../../hooks/Evento/useEventoForm";
import '../../styles/CrearEventoPage.css';

export default function CrearEventoPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Usamos el hook unificado que ya maneja la lógica de RRule y validaciones
  const {
    evento,
    ocurrencias,
    isEditing,
    actualizarCampoEvento,
    agregarOcurrencia,
    actualizarOcurrencia,
    eliminarOcurrencia,
    separarOcurrencia,
    esRecurrente,
    recurrenciaRRule,
    setRecurrenciaRRule,
    handleToggleRecurrencia,
    guardarEvento
  } = useEventoForm(id);

  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (guardando) return;

    setGuardando(true);
    try {
      await guardarEvento(); // Esto ya empaqueta el campo recurrenciaRRule
      navigate("/admin/eventos");
    } catch (err) {
      console.error("Error al guardar:", err);
      alert(err.message || "Hubo un error al guardar el evento.");
      setGuardando(false);
    }
  };

  return (
    <DashboardLayout
      breadcrumb={isEditing ? "Gestión / Eventos / Editar" : "Gestión / Eventos / Crear"}
      title={isEditing ? "Editar Evento" : "Nuevo Evento"}
      rightActions={
        <div className="crear-evento-actions">
          <button
            type="button"
            className="v2-btn-secondary"
            onClick={() => navigate("/admin/eventos")}
            disabled={guardando}
          >
            Cancelar 
          </button>

          <button
            type="submit"
            form="evento-form"
            className="v2-btn-primary"
            disabled={guardando}
          >
            <i className={guardando ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-save"}></i>
            {guardando ? " Guardando..." : isEditing ? " Guardar Cambios" : " Guardar Evento"}
          </button>
        </div>
      }
    >
      <form id="evento-form" onSubmit={handleGuardar}>
        <EventoForm
          evento={evento}
          ocurrencias={ocurrencias}
          onEventoChange={actualizarCampoEvento}
          onOcurrenciaChange={actualizarOcurrencia}
          onAgregarOcurrencia={agregarOcurrencia}
          onEliminarOcurrencia={eliminarOcurrencia}
          onSepararOcurrencia={separarOcurrencia}
          /* Props de Recurrencia */
          isEditing={isEditing}
          esRecurrente={esRecurrente}
          recurrenciaRRule={recurrenciaRRule}
          onToggleRecurrencia={handleToggleRecurrencia}
          onChangeRRule={setRecurrenciaRRule}
        />
      </form>
    </DashboardLayout>
  );
}