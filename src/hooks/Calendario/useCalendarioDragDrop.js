import { useCallback } from "react";

export function useCalendarioDragDrop({ actualizarEvento, }) {

  // Convierte una Date a ISO.
  const convertirAISO = useCallback((fecha) => {
    if (!fecha) return null;
    return fecha.toISOString();
  }, []);


  // Determina si el cambio viene de la vista mensual.
  const esVistaMensual = useCallback((info) => {
    return info.view.type === "dayGridMonth";
  }, []);

  // Construye los datos que vamos a enviar al backend.
  const construirDatosCambio = useCallback(
    (info) => {
      const mensual = esVistaMensual(info);
      // VISTA MES
      if (mensual) {
        return {
          fechaInicio: convertirAISO(info.event.start),
          fechaFinalizacion: info.event.end ? convertirAISO(info.event.end) : null,
          allDay: true,
        };
      }

      // ==============================
      // VISTA SEMANA / DÍA
      // ==============================

      return {
        fechaInicio: convertirAISO(
          info.event.start
        ),

        fechaFinalizacion: info.event.end
          ? convertirAISO(info.event.end)
          : null,

        allDay: false,
      };
    },
    [
      convertirAISO,
      esVistaMensual,
    ]
  );

  //Cuando se arrastra un evento a otra fecha/hora.
  const handleEventDrop = useCallback(
    async (info) => {
      const evento = info.event;
      const eventoId = evento.extendedProps?.id || evento.id;
      if (!eventoId) {
        console.error("No se encontró el ID del evento.");
        info.revert();
        return;
      }
      const datosCambio = construirDatosCambio(info);
      try {
        await actualizarEvento(eventoId, datosCambio);
      } catch (error) {
        console.error("Error al mover el evento:", error);
        info.revert();
      }
    },
    [
      actualizarEvento,
      construirDatosCambio,
    ]
  );

  // Cuando se modifica la duración de un evento.

  const handleEventResize = useCallback(
    async (info) => {
      const evento = info.event;
      const eventoId = evento.extendedProps?.id || evento.id;
      if (!eventoId) {
        console.error("No se encontró el ID del evento.");
        info.revert();
        return;
      }

      const datosCambio = {
        fechaInicio: convertirAISO(evento.start),
        fechaFinalizacion: evento.end ? convertirAISO(evento.end) : null,
        allDay: evento.allDay,
      };

      try {
        await actualizarEvento(eventoId, datosCambio);
      } catch (error) {
        console.error("Error al redimensionar el evento:", error);
        info.revert();
      }
    },[actualizarEvento, convertirAISO,]);

  return {
    handleEventDrop,
    handleEventResize,
  };
}