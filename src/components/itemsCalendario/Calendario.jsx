
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

import "./Calendario.css";

export default function Calendario({events = [],onEventoModificado}) {

  // ==========================================
  // CALENDARIO
  // ==========================================

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
    actualizarOcurrencia,
    eventos,
    actualizarEvento,
  } = useEvento();

  // ==========================================
  // SELECCIÓN / MODAL
  // ==========================================
  const {
    modalAbierto,
    modoModal,
    eventoSeleccionado,
    rangoSeleccionado,
    handleDateClick,
    handleSelect,
    abrirModal,
    cerrarModal,
  } = useCalendarioSeleccion();

  // ==========================================
  // DRAG & DROP
  // ==========================================
  const {
    handleEventDrop,
    handleEventResize,
  } = useCalendarioDragDrop({
    actualizarOcurrencia,
    eventos,
    actualizarEvento,
    onSuccess: onEventoModificado
  });

  // ==========================================
  // CLICK EN UNA OCURRENCIA
  // ==========================================

  const handleEventClick =
    (info) => {

      const evento =
        info.event;

      const idEvento =
        evento.extendedProps
          ?.idEvento;

      const idOcurrencia =
        evento.extendedProps
          ?.idOcurrencia;

      console.log(
        "CLICK EN OCURRENCIA:",
        {
          idEvento,
          idOcurrencia,
          extendedProps:
            evento.extendedProps,
        }
      );

      if (
        !idEvento ||
        !idOcurrencia
      ) {

        console.error(
          "No se encontraron idEvento o idOcurrencia.",
          {
            eventoId:
              evento.id,

            extendedProps:
              evento.extendedProps,
          }
        );

        return;
      }

      // --------------------------------------
      // IMPORTANTE
      // --------------------------------------
      // No cargamos el evento acá.
      //
      // useEventoForm se encargará de
      // llamar a cargarEventoById cuando
      // reciba el idEvento.
      // --------------------------------------

      abrirModal({
        modo: "ver",

        evento: {
          idEvento,
        },
      });

    };

  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="calendario-container">

      {/* TOOLBAR */}

      <CalendarioToolbar
        titulo={tituloCalendario}
        vistaActual={vistaActual}
        VISTAS={VISTAS}

        onHoy={irHoy}
        onAnterior={anterior}
        onSiguiente={siguiente}
        onCambiarVista={
          cambiarVista
        }
      />

      {/* CALENDARIO */}

      <div
        className="calendario-wrapper"
        onWheel={handleWheel}
      >

        <FullCalendar

          ref={calendarRef}

          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
          ]}

          initialView={vistaActual}
          headerToolbar={false}
          events={events}

          selectable={true}
          selectMirror={true}

          dateClick={handleDateClick}
          select={handleSelect}
          eventClick={handleEventClick}
          eventDrop={ handleEventDrop}
          eventResize={ handleEventResize}
          datesSet={handleDatesSet }

          height="100%"
          editable={true}
          droppable={true}
          eventStartEditable={true }
          eventDurationEditable={true }
          displayEventTime={ false}
          slotDuration="00:15:00"
          slotLabelInterval="01:00"
          snapDuration="00:15:00"
          eventDisplay="block"
          displayEventEnd={ false }
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}

        />

      </div>

      {/* MODAL */}

      <CrearEventoModal

        isOpen={ modalAbierto}
        onClose={ cerrarModal }
        rangoSeleccionado={ rangoSeleccionado}
        eventoSeleccionado={ eventoSeleccionado}
        modo={modoModal}
        onSuccess={onEventoModificado}

      />

    </div>
  );
}

