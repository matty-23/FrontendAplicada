
import { useRef, useState } from "react";

const VISTAS = {
  dayGridMonth: "Mes",
  timeGridWeek: "Semana",
  timeGridDay: "Día",
};

export function useCalendario() {
  const calendarRef = useRef(null);
  const [vistaActual, setVistaActual] = useState("dayGridMonth");
  const [tituloCalendario, setTituloCalendario] = useState("");

  const obtenerCalendarApi = () => { return calendarRef.current?.getApi(); };

  // Navegación
  const irHoy = () => {
    const api = obtenerCalendarApi();
    if (!api) return;
    api.today();
  };
  const anterior = () => {
    const api = obtenerCalendarApi();
    if (!api) return;
    api.prev();
  };
  const siguiente = () => {
    const api = obtenerCalendarApi();
    if (!api) return;
    api.next();
  };

  // Cambio de vista
  const cambiarVista = (vista) => {
    const api = obtenerCalendarApi();
    if (!api) return;
    const fechaActual = api.getDate();
    api.changeView(vista, fechaActual);
    setVistaActual(vista);
  };


  // Actualizar fechas/título
  const handleDatesSet = (info) => {
    const { start, end, view } = info;
    let titulo = "";
    if (view.type === "dayGridMonth") {
      titulo = start.toLocaleString("es-AR", { month: "long", year: "numeric", });
    }

    if (view.type === "timeGridWeek") {
      const fechaFin = new Date(end);
      fechaFin.setDate(fechaFin.getDate() - 1);
      const inicio = start.toLocaleDateString("es-AR", { day: "numeric", month: "long", });
      const fin = fechaFin.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric", });
      titulo = `${inicio} – ${fin}`;
    }

    if (view.type === "timeGridDay") {
      titulo = start.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    setTituloCalendario(titulo);
    setVistaActual(view.type);
  };


  // Navegación con rueda
  const handleWheel = (event) => {
    const api = obtenerCalendarApi();
    if (!api || api.view.type !== "dayGridMonth") return;
    if (event.deltaY < 0) {
      api.prev();
    } else if (event.deltaY > 0) {
      api.next();
    }
  };

  return {
    calendarRef,
    vistaActual,
    tituloCalendario,
    VISTAS,
    irHoy,
    anterior,
    siguiente,
    cambiarVista,
    handleDatesSet,
    handleWheel,
  };
}
