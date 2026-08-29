import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useCalendario } from "../../hooks/Calendario/useCalendario";
import { useCalendarioSeleccion } from "../../hooks/Calendario/useCalendarioSeleccion";
import { useCalendarioDragDrop } from "../../hooks/Calendario/useCalendarioDragDrop";
import { useEvento } from "../../hooks/Evento/useEvento";

import CrearEventoModal from "../itemsEventos/CrearEventoModal";
import CalendarioToolbar from "./CalendarioToolbar";
import "./Calendario.css"
export default function Calendario({
  events = [],
}) {
  const {
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
  } = useCalendario();

  const {
    modalAbierto,
    rangoSeleccionado,
    handleDateClick,
    handleSelect,
    cerrarModal,
  } = useCalendarioSeleccion();

  const { actualizarEvento } = useEvento();

  const {
    handleEventDrop,
    handleEventResize,
  } = useCalendarioDragDrop({
    actualizarEvento,
  });

  return (
    <div className="calendario-container">

      <CalendarioToolbar
        titulo={tituloCalendario}
        vistaActual={vistaActual}
        VISTAS={VISTAS}
        onHoy={irHoy}
        onAnterior={anterior}
        onSiguiente={siguiente}
        onCambiarVista={cambiarVista}
      />

      <div
        className="calendario-wrapper"
        onWheel={handleWheel}
      >

<FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={vistaActual}
          headerToolbar={false}
          events={events}
          selectable={true}
          selectMirror={true}
          dateClick={handleDateClick}
          select={handleSelect}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          datesSet={handleDatesSet}
          height="auto"
          displayEventTime={false}
          slotDuration="00:15:00"
          slotLabelInterval="01:00"
          snapDuration="00:15:00"
          eventDisplay="block" /* Obliga a dibujar cajas sólidas siempre */
          displayEventEnd={false} /* Oculta la hora de fin para no saturar el bloque */
          eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }} /* Formato 24h limpio (Ej: 14:30) */
        />

      </div>

      <CrearEventoModal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        rangoSeleccionado={rangoSeleccionado}
      />

    </div>
  );
}