
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

export default function Calendario({ events = [], onEventoModificado }) {

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
    promptDragDrop,
    procesarDecision,
    cancelarModificacion
  } = useCalendarioDragDrop({
    actualizarOcurrencia,
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

      abrirModal({
        modo: "ver",
        evento: {
          idEvento,
          idOcurrencia, // ¡Clave para que el modal sepa qué día tocaste!
          isRecurrente: evento.extendedProps?.isRecurrente,
          instanciaOriginal: evento.extendedProps?.instanciaOriginal
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
      {promptDragDrop.activo && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: "420px", padding: "24px", height: "auto" }}>
            <h3 style={{ marginTop: 0, color: "var(--gray-900)" }}>¿Cómo quieres aplicar este cambio de fecha/hora?</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "24px 0" }}>
              <button
                type="button"
                className="v2-btn-secondary"
                style={{ justifyContent: "flex-start", padding: "12px", height: "auto" }}
                onClick={() => procesarDecision("SOLO_ESTE")}
              >
                <i className="fa-regular fa-calendar-check" style={{ fontSize: "16px", color: "var(--blue-500)" }}></i>
                <div style={{ textAlign: "left", marginLeft: "8px" }}>
                  <strong>Solo este evento</strong>
                  <div style={{ fontSize: "11px", color: "var(--gray-500)" }}>Modifica únicamente esta fecha.</div>
                </div>
              </button>

              <button
                type="button"
                className="v2-btn-secondary"
                style={{ justifyContent: "flex-start", padding: "12px", height: "auto" }}
                onClick={() => procesarDecision("TODOS")}
              >
                <i className="fa-solid fa-layer-group" style={{ fontSize: "16px", color: "var(--blue-500)" }}></i>
                <div style={{ textAlign: "left", marginLeft: "8px" }}>
                  <strong>Todos los eventos de la serie</strong>
                  <div style={{ fontSize: "11px", color: "var(--gray-500)" }}>Se desplazará toda la recurrencia.</div>
                </div>
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button type="button" className="v2-btn-ghost" onClick={cancelarModificacion}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALENDARIO */}
      <div className="calendario-wrapper" onWheel={handleWheel}>
        <FullCalendar

          ref={calendarRef}

          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
          ]}
          nowIndicator={true}
          eventStartEditable={true}
          eventDurationEditable={true}
          displayEventTime={true} 
          displayEventEnd={true}
          initialView={vistaActual}
          headerToolbar={false}
          events={events}

          selectable={true}
          selectMirror={true}

          dateClick={handleDateClick}
          select={handleSelect}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          datesSet={handleDatesSet}

          height="100%"
          editable={true}
          droppable={true}
          forceEventDuration={true}
          defaultTimedEventDuration="01:00:00"

          slotDuration="00:30:00" 
          slotLabelInterval="01:00"
          snapDuration="00:15:00"
          eventDisplay="block"
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}

        />

      </div>

      {/* MODAL */}

      {modalAbierto && (
        <CrearEventoModal
          isOpen={modalAbierto}
          onClose={cerrarModal}
          rangoSeleccionado={rangoSeleccionado}
          eventoSeleccionado={eventoSeleccionado}
          modo={modoModal}
          onSuccess={onEventoModificado}
        />
      )}

    </div>
  );
}

