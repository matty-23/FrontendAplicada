import { useCallback, useState } from "react";

export function useCalendarioDragDrop({ actualizarOcurrencia, onSuccess }) {
  // Estado para el modal flotante sobre el calendario
  const [promptDragDrop, setPromptDragDrop] = useState({
    activo: false,
    info: null, // Contiene info.event de FullCalendar y su función revert()
  });

  const formatLocal = useCallback((fecha) => {
    if (!fecha) return null;
    const tzOffset = fecha.getTimezoneOffset() * 60000;
    return new Date(fecha.getTime() - tzOffset).toISOString().slice(0, 16);
  }, []);

  const aplicarCambio = async (info, decision) => {
    const eventoFC = info.event;
    const { idEvento, idOcurrencia, isRecurrente, instanciaOriginal } = eventoFC.extendedProps;
    
    if (!idEvento || !idOcurrencia) {
      info.revert();
      return;
    }

    const datosCambio = {
      fechaInicio: formatLocal(eventoFC.start),
      fechaFinalizacion: eventoFC.end ? formatLocal(eventoFC.end) : formatLocal(eventoFC.start),
      allDay: eventoFC.allDay,
    };

    try {
      if (isRecurrente) {
        datosCambio.tipo = decision === "SOLO_ESTE" ? "MODIFICADA" : "NORMAL";
        datosCambio.isModificada = true;
        // Referencia cruzada sugerida para el backend
        if (decision === "SOLO_ESTE") datosCambio.fechaInstanciaOriginal = instanciaOriginal;
      }

      await actualizarOcurrencia(idEvento, idOcurrencia, datosCambio);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al actualizar la ocurrencia:", error);
      info.revert(); // Regresa el bloque a su posición original si falla
    }
  };

  const procesarDecision = async (decision) => {
    if (promptDragDrop.info) {
      await aplicarCambio(promptDragDrop.info, decision);
    }
    setPromptDragDrop({ activo: false, info: null });
  };

  const cancelarModificacion = () => {
    promptDragDrop.info?.revert();
    setPromptDragDrop({ activo: false, info: null });
  };

  const handleEventModification = useCallback((info) => {
    const isRecurrente = info.event.extendedProps?.isRecurrente;
    
    if (isRecurrente) {
      // Si es recurrente, detenemos la acción y abrimos el Prompt
      setPromptDragDrop({ activo: true, info });
    } else {
      // Si no es recurrente, aplicamos directamente
      aplicarCambio(info, "SOLO_ESTE");
    }
  }, []);


  return {
    handleEventDrop: handleEventModification,
    handleEventResize: handleEventModification,
    promptDragDrop,
    procesarDecision,
    cancelarModificacion,
  };

}