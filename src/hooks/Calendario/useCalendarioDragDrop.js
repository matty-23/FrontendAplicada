import { useCallback } from "react";

export function useCalendarioDragDrop({ actualizarOcurrencia, eventos, actualizarEvento }) {
  
  // Convierte el Date de FullCalendar a YYYY-MM-DDTHH:mm en la zona horaria local
  const formatLocal = useCallback((fecha) => {
    if (!fecha) return null;
    const tzOffset = fecha.getTimezoneOffset() * 60000;
    return new Date(fecha.getTime() - tzOffset).toISOString().slice(0, 16);
  }, []);

  // Extrae únicamente la fecha YYYY-MM-DD
  const getLocalYMD = (fecha) => {
    if (!fecha) return null;
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const handleEventModification = useCallback(
    async (info) => {
      const eventoFC = info.event;
      const oldEventoFC = info.oldEvent;
      const idEvento = eventoFC.extendedProps?.idEvento;
      const idOcurrencia = eventoFC.extendedProps?.idOcurrencia;

      if (!idEvento || !idOcurrencia) {
        info.revert();
        return;
      }

      // 1. SPLIT INTELIGENTE: Si tenemos el estado completo de eventos, revisamos si era de múltiples días
      if (eventos && actualizarEvento) {
        const originalEvento = eventos.find(e => e.id === idEvento);
        if (originalEvento) {
          const ocOriginal = originalEvento.ocurrencias.find(o => (o.id || o.id_ocurrencia || o.idLocal) === idOcurrencia);

          if (ocOriginal) {
            const fI = ocOriginal.fechaInicio || ocOriginal.fecha_inicio;
            const fF = ocOriginal.fechaFinalizacion || ocOriginal.fecha_finalizacion;

            const startDateStr = fI ? fI.split("T")[0] : "";
            const endDateStr = fF ? fF.split("T")[0] : "";

            // Si el registro original abarcaba múltiples días
            if (startDateStr && endDateStr && startDateStr !== endDateStr) {
              
              // El día original del bloque que se arrastró
              const draggedYMD = oldEventoFC ? getLocalYMD(oldEventoFC.start) : getLocalYMD(eventoFC.start);

              // Armamos la iteración
              const curr = new Date(`${startDateStr}T00:00:00`);
              const last = new Date(`${endDateStr}T00:00:00`);
              const individualDays = [];

              while (curr <= last) {
                individualDays.push(getLocalYMD(curr));
                curr.setDate(curr.getDate() + 1);
              }

              const timeInicio = fI.includes("T") ? fI.split("T")[1] : "00:00:00";
              const timeFin = fF.includes("T") ? fF.split("T")[1] : "23:59:00";

              const nuevasOcurrencias = [];
              let currentRango = null;

              // Reagrupamos omitiendo el día que el usuario desplazó
              individualDays.forEach(day => {
                if (day === draggedYMD) return;

                if (!currentRango) {
                  currentRango = { start: day, end: day };
                } else {
                  const prev = new Date(`${currentRango.end}T00:00:00`);
                  const current = new Date(`${day}T00:00:00`);
                  if ((current - prev) === 86400000) {
                    currentRango.end = day; // Extender rango
                  } else {
                    const { id, id_ocurrencia, idLocal, ...ocData } = ocOriginal;
                    nuevasOcurrencias.push({
                      ...ocData,
                      fechaInicio: `${currentRango.start}T${timeInicio}`,
                      fechaFinalizacion: `${currentRango.end}T${timeFin}`,
                      idLocal: crypto.randomUUID()
                    });
                    currentRango = { start: day, end: day };
                  }
                }
              });

              if (currentRango) {
                const { id, id_ocurrencia, idLocal, ...ocData } = ocOriginal;
                nuevasOcurrencias.push({
                  ...ocData,
                  fechaInicio: `${currentRango.start}T${timeInicio}`,
                  fechaFinalizacion: `${currentRango.end}T${timeFin}`,
                  idLocal: crypto.randomUUID()
                });
              }

              // Creamos una ocurrencia completamente nueva en el destino del drag and drop
              const { id, id_ocurrencia, idLocal, ...ocData } = ocOriginal;
              const newStart = formatLocal(eventoFC.start);
              const newEnd = eventoFC.end ? formatLocal(eventoFC.end) : newStart;

              nuevasOcurrencias.push({
                ...ocData,
                fechaInicio: newStart,
                fechaFinalizacion: newEnd,
                allDay: eventoFC.allDay,
                idLocal: crypto.randomUUID()
              });

              // Reemplazamos la ocurrencia original por sus fragmentos en el evento principal
              const restoOcurrencias = originalEvento.ocurrencias.filter(o => (o.id || o.id_ocurrencia || o.idLocal) !== idOcurrencia);
              const eventoActualizado = {
                ...originalEvento,
                ocurrencias: [...restoOcurrencias, ...nuevasOcurrencias]
              };

              try {
                await actualizarEvento(idEvento, eventoActualizado);
                if (onSuccess) onSuccess();
                return; 
              } catch (error) {
                console.error("Error al dividir ocurrencia:", error);
                info.revert();
                return;
              }
            }
          }
        }
      }

      // 2. FALLBACK: Si no abarca varios días, simplemente mutamos el bloque normalmente
      const datosCambio = {
        fechaInicio: formatLocal(eventoFC.start),
        fechaFinalizacion: eventoFC.end ? formatLocal(eventoFC.end) : formatLocal(eventoFC.start),
        allDay: eventoFC.allDay,
      };

      try {
        await actualizarOcurrencia(idEvento, idOcurrencia, datosCambio);
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error("Error al actualizar la ocurrencia:", error);
        info.revert();
      }
    },
    [actualizarOcurrencia, eventos, actualizarEvento, formatLocal]
  );

  const handleEventDrop = useCallback((info) => handleEventModification(info), [handleEventModification]);
  const handleEventResize = useCallback((info) => handleEventModification(info), [handleEventModification]);

  return {
    handleEventDrop,
    handleEventResize,
  };
}