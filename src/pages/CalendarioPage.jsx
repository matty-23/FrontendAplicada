import { useMemo } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Calendario from "../components/itemsCalendario/Calendario";
import { useEvento } from "../hooks/Evento/useEvento";

export default function CalendarioPage() {
  // 1. Traemos los eventos reales desde tu base de datos
  const { eventos, cargando, error, cargarEventos } = useEvento();
  // 2. Transformamos los eventos al formato de FullCalendar.
  // useMemo: sólo se recalcula si "eventos" cambia (no en cada render de la página).
  const eventosFormateados = useMemo(() => {
    return eventos.flatMap((ev) => {
      // Usamos flatMap en lugar de map para poder devolver múltiples eventos por cada ocurrencia si es necesario
      return (ev.ocurrencias || []).flatMap((oc, index) => {
        const estado = (ev.estado || "pendiente").toLowerCase();
        let className = "ev-orange";
        if (estado === "activo" || estado === "active") {
          className = "ev-green";
        } else if (estado.includes("revis")) {
          className = "ev-blue";
        }

        const fechaI = oc.fechaInicio || oc.fecha_inicio || "";
        const fechaF = oc.fechaFinalizacion || oc.fecha_finalizacion || "";
        const idOcurrencia = oc.id || oc.idLocal || oc.id_ocurrencia;

        const inicio = new Date(fechaI);
        const fin = new Date(fechaF);

        const isAllDay =
          inicio.getHours() === 0 &&
          inicio.getMinutes() === 0 &&
          fin.getHours() === 23 &&
          fin.getMinutes() === 59;

        // EXPANSIÓN: Si no es de todo el día y abarca múltiples fechas
        if (!isAllDay && fechaI && fechaF && fechaI.includes("T") && fechaF.includes("T")) {
          const dateStartStr = fechaI.split("T")[0];
          const dateEndStr = fechaF.split("T")[0];

          if (dateStartStr !== dateEndStr) {
            const timeStart = fechaI.split("T")[1];
            const timeEnd = fechaF.split("T")[1];

            const splitEvents = [];
            const currentDate = new Date(`${dateStartStr}T00:00:00`);
            const lastDate = new Date(`${dateEndStr}T00:00:00`);

            let subIndex = 0;
            // Generamos un evento individual para cada día en el calendario
            while (currentDate <= lastDate) {
              const currentStr = currentDate.toISOString().split("T")[0];
              splitEvents.push({
                id: `${idOcurrencia || ev.id + '-oc-' + index}-split-${subIndex}`,
                title: ev.titulo,
                start: `${currentStr}T${timeStart}`,
                end: `${currentStr}T${timeEnd}`,
                allDay: false,
                className: className,
                extendedProps: {
                  idEvento: ev.id,
                  idOcurrencia: idOcurrencia, // Conservamos el ID original para que funcione el click/edición
                  estado: ev.estado,
                  lugar: oc.lugar
                }
              });
              currentDate.setDate(currentDate.getDate() + 1);
              subIndex++;
            }
            return splitEvents;
          }
        }

        // Retorno por defecto (para eventos de 1 solo día o los de "todo el día")
        return [{
          id: idOcurrencia || `${ev.id}-oc-${index}`,
          title: ev.titulo,
          start: fechaI,
          end: fechaF,
          allDay: isAllDay,
          className: className,
          extendedProps: {
            idEvento: ev.id,
            idOcurrencia,
            estado: ev.estado,
            lugar: oc.lugar
          }
        }];
      });
    });
  }, [eventos]);
  const rightActions = (
    <button className="v2-btn-primary">
      <i className="fa-solid fa-plus"></i>
      Añadir
    </button>
  );

  return (
    <DashboardLayout
      breadcrumb="Principal / Calendario"
      title="Calendario General"
      rightActions={rightActions}
    >
      <div className="calendario-page" style={{ height: "100%" }}>
        {cargando ? (
          <div className="calendario-loading">
            <i className="fa-solid fa-circle-notch fa-spin fa-2x"></i>
            <p className="calendario-loading-text">Cargando eventos...</p>
          </div>
        ) : error ? (
          <div className="calendario-error">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <p>No se pudieron cargar los eventos. {error}</p>
          </div>
        ) : (
          <Calendario events={eventosFormateados} onEventoModificado={cargarEventos} />
        )}
      </div>
    </DashboardLayout>
  );
}