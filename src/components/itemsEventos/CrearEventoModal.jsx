import { useEffect, useState, useRef } from "react";
import { useEventoForm } from "../../hooks/Evento/useEventoForm";
import EventoGeneralForm from "./EventoGeneralForm";
import RecurrenciaForm from "./Recurrencia/RecurrenciaForm";
import OcurrenciasList from "./Ocurrencia/OcurrenciasList";
import "./CrearEventoModal.css";
import { useEvento } from "../../hooks/Evento/useEvento";
export default function CrearEventoModal({
  isOpen,
  onClose,
  rangoSeleccionado,
  onSuccess,
  eventoSeleccionado,
  modo = "crear",
}) {

  // ==========================================
  // ID DEL EVENTO
  // ==========================================

  const idEvento = eventoSeleccionado?.idEvento ?? null;
  const { actualizarOcurrencia: patchOcurrencia, eliminarEvento } = useEvento();

  // ==========================================
  // FORMULARIO
  // ==========================================

  const {
    evento,
    ocurrencias,
    isEditing,

    separarOcurrencia,
    actualizarCampoEvento,

    agregarOcurrencia,
    actualizarOcurrencia,
    actualizarCampoOcurrencia,
    eliminarOcurrencia,
    esRecurrente,
    recurrenciaRRule,
    setRecurrenciaRRule,
    handleToggleRecurrencia,
    agregarRango,

    guardarEvento,

    promptModificacion,
    setPromptModificacion,
    aplicarDecisionRecurrencia,
  } = useEventoForm(modo === "crear" ? null : idEvento);

  const [error, setError] =
    useState(null);

  const [guardando, setGuardando] =
    useState(false);

  // ==========================================
  // LIMPIAR ERROR AL CAMBIAR DE MODAL
  // ==========================================

  useEffect(() => {

    if (isOpen) {
      setError(null);
    }

  }, [
    isOpen,
    idEvento,
    modo
  ]);

  // ==========================================
  // RANGO SELECCIONADO
  // ==========================================

  useEffect(() => {

    if (
      !isOpen ||
      modo !== "crear" ||
      !rangoSeleccionado
    ) {
      return;
    }

    const {
      fechaInicio,
      fechaFin,
      allDay,
    } = rangoSeleccionado;

    const formatearFecha = (
      fechaStr,
      esFin
    ) => {

      if (!fechaStr) {
        return "";
      }

      if (
        fechaStr.includes("T")
      ) {
        return fechaStr.substring(
          0,
          16
        );
      }

      return `${fechaStr}T${esFin
        ? "23:59"
        : "00:00"
        }`;
    };

    agregarRango(
      formatearFecha(
        fechaInicio,
        false
      ),
      formatearFecha(
        fechaFin,
        true
      ),
      {
        allDay,
      }
    );

  }, [
    isOpen,
    modo,
    rangoSeleccionado
  ]);
  const [position, setPosition] = useState({ top: 40, left: window.innerWidth - 480 }); // Empieza arriba a la derecha
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      let newTop = e.clientY - dragOffset.current.y;
      let newLeft = e.clientX - dragOffset.current.x;

      // Límites para que no se escape de la pantalla
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - 50));
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - 200));

      setPosition({ top: newTop, left: newLeft });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
  };
  // ==========================================
  // GUARDAR
  // ==========================================

const handleGuardar = async () => {
    setError(null);

    // Verificamos si hay alguna ocurrencia que fue tocada/modificada por el usuario
    const hayOcurrenciasModificadas = ocurrencias.some(oc => oc.isModificada);

    // Si es recurrente, estamos editando, Y se modificó alguna fecha/hora/lugar/etc., preguntamos
    if (isEditing && esRecurrente && hayOcurrenciasModificadas) {
      setPromptModificacion({ activo: true, accion: "GUARDAR" });
      return;
    }

    // Si es un evento nuevo, no recurrente, o solo se cambiaron datos generales 
    // (título, categoría, estado), guarda directo para toda la serie.
    ejecutarGuardado("TODOS");
  };

  const ejecutarGuardado = async (decision) => {
    setGuardando(true);
    setPromptModificacion({ activo: false, ocurrenciaTarget: null, accion: null, datosCambio: null });

    try {
      if (decision === "SOLO_ESTE" && eventoSeleccionado?.idOcurrencia) {

        // ¡Magia aquí! Buscamos el día exacto que tocaste en vez de clavar [0]
        const ocData = ocurrencias.find(o =>
          o.id === eventoSeleccionado.idOcurrencia ||
          o.idLocal === eventoSeleccionado.idOcurrencia
        ) || ocurrencias[0];

        const datosCambio = {
          fechaInicio: ocData.fechaInicio,
          fechaFinalizacion: ocData.fechaFinalizacion,
          allDay: ocData.allDay,
          lugar: ocData.lugar,
          cantidadPersonas: ocData.cantidadPersonas,
          id_encargado: ocData.id_encargado,
          participantes: ocData.participantes,
          tipo: "MODIFICADA",
          ocurrencia_original: eventoSeleccionado.instanciaOriginal // <-- AQUÍ
        };
        await patchOcurrencia(eventoSeleccionado.idEvento, eventoSeleccionado.idOcurrencia, datosCambio);

      } else {
        await guardarEvento(decision);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
      setError(err.message || "Ocurrió un error al guardar");
    } finally {
      setGuardando(false);
    }
  };
  const ejecutarEliminar = async (decision, targetId = null) => {
    setGuardando(true);
    setPromptModificacion({ activo: false, ocurrenciaTarget: null, accion: null, datosCambio: null });

    try {
      if (decision === "SOLO_ESTE") {
        const idPatch = targetId || eventoSeleccionado?.idOcurrencia;
        if (idPatch) {
          // Convertimos la instancia en CANCELADA
          await patchOcurrencia(eventoSeleccionado.idEvento, idPatch, {
            tipo: "CANCELADA",
            ocurrencia_original: eventoSeleccionado.instanciaOriginal // <-- AQUÍ
          });
        }
      
      } else {
        // Si eligió TODOS, o es un evento normal (no recurrente), eliminamos todo de raíz
        await eliminarEvento(eventoSeleccionado.idEvento);
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Error al eliminar:", err);
      setError("No se pudo eliminar: " + err.message);
    } finally {
      setGuardando(false);
    }
  };
  // ==========================================
  // NO MOSTRAR SI ESTÁ CERRADO
  // ==========================================
  if (!isOpen) {
    return null;
  }

  // ==============================================================
  // 1. FUNCIÓN AUXILIAR: Dibuja solo el cartelito de "Solo este / Todos"
  // ==============================================================
  const renderPromptModificacion = () => {
    if (!promptModificacion.activo) return null;

    const accion = promptModificacion.accion;
    const esGuardar = accion === "GUARDAR";
    const esEliminarOcurrencia = accion === "ELIMINAR"; // Click en el tacho de un día específico
    const esEliminarEvento = accion === "ELIMINAR_EVENTO"; // Click en el botón de abajo de todo

    let tituloModal = "¿Cómo quieres guardar estos cambios?";
    if (esEliminarOcurrencia) tituloModal = "¿Qué deseas eliminar?";
    if (esEliminarEvento) tituloModal = "¿Seguro que deseas eliminar este evento recurrente?";

    return (
      <div className="modal-overlay" style={{ zIndex: 1100 }}>
        <div className="modal-content" style={{ maxWidth: "420px", padding: "24px", height: "auto" }}>
          <h3 style={{ marginTop: 0, color: "var(--gray-900)" }}>{tituloModal}</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "24px 0" }}>
            <button
              type="button"
              className="v2-btn-secondary"
              style={{ justifyContent: "flex-start", padding: "12px", height: "auto" }}
              onClick={() => {
                if (esGuardar) ejecutarGuardado("SOLO_ESTE");
                else ejecutarEliminar("SOLO_ESTE", promptModificacion.ocurrenciaTarget);
              }}
            >
              <i className={esGuardar ? "fa-regular fa-calendar-check" : "fa-solid fa-calendar-xmark"} style={{ fontSize: "16px", color: esGuardar ? "var(--blue-500)" : "var(--red-500)" }}></i>
              <div style={{ textAlign: "left", marginLeft: "8px" }}>
                <strong>Solo {esGuardar ? "este evento" : "esta fecha"}</strong>
                <div style={{ fontSize: "11px", color: "var(--gray-500)" }}>
                  {esGuardar ? "Modifica únicamente esta fecha." : "Se eliminará solo esta ocurrencia de la serie."}
                </div>
              </div>
            </button>

            <button
              type="button"
              className="v2-btn-secondary"
              style={{ justifyContent: "flex-start", padding: "12px", height: "auto" }}
              onClick={() => {
                if (esGuardar) ejecutarGuardado("TODOS");
                else ejecutarEliminar("TODOS");
              }}
            >
              <i className="fa-solid fa-layer-group" style={{ fontSize: "16px", color: esGuardar ? "var(--blue-500)" : "var(--red-500)" }}></i>
              <div style={{ textAlign: "left", marginLeft: "8px" }}>
                <strong>Todos los eventos de la serie</strong>
                <div style={{ fontSize: "11px", color: "var(--gray-500)" }}>
                  {esGuardar ? "Se aplicará a toda la recurrencia." : "Se eliminará la serie completa para siempre."}
                </div>
              </div>
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="v2-btn-ghost"
              onClick={() => setPromptModificacion({ activo: false, ocurrenciaTarget: null, accion: null, datosCambio: null })}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==============================================================
  // 2. RENDER PRINCIPAL: Dibuja el modal grande y el cartelito encima si hace falta
  // ==============================================================
  return (
    <>
      {/* Llamamos a la función auxiliar para que dibuje el cartelito si está activo */}
      {renderPromptModificacion()}

      {/* Este es el fondo oscuro del modal grande. Acá pusimos la validación onMouseDown */}
      <div className="modal-overlay" style={{ pointerEvents: 'none' }}>

        <div
          className="modal-content"
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: '440px', // O el ancho que prefieras
            pointerEvents: 'auto',
            transition: isDragging ? 'none' : 'box-shadow 0.2s ease', // Evita lag al mover
            margin: 0
          }}
        >
          {/* Agregamos el onMouseDown al header y cambiamos el cursor */}
          <div
            className="modal-header"
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <h2>
              {modo === "crear" ? "Crear Evento" : modo === "ver" ? "Detalle del Evento" : "Editar Evento"}
            </h2>

            <button className="modal-close" onClick={onClose} type="button">
              <i className="fa-solid fa-times"></i>
            </button>
          </div>

          {/* BODY */}
          <div className="modal-body">
            {error && (
              <div className="modal-error">
                <i className="fa-solid fa-circle-exclamation"></i> {error}
              </div>
            )}

            <EventoGeneralForm
              evento={evento}
              onChange={actualizarCampoEvento}
            />

            <OcurrenciasList
              ocurrencias={ocurrencias}
              valoresGenerales={evento}
              onChange={actualizarOcurrencia}
              onAgregar={agregarOcurrencia}
              onEliminar={eliminarOcurrencia}
              onSeparar={separarOcurrencia}
              isEditing={isEditing}
              esRecurrente={esRecurrente}
              recurrenciaRRule={recurrenciaRRule}
              onToggleRecurrencia={handleToggleRecurrencia}
              onChangeRRule={setRecurrenciaRRule}
              targetOcurrenciaId={eventoSeleccionado?.idOcurrencia}
            />
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button
              type="button"
              className="v2-btn-ghost"
              style={{ color: "var(--red-500)", marginRight: "auto" }}
              onClick={() => {
                if (esRecurrente) {
                  setPromptModificacion({ activo: true, accion: "ELIMINAR_EVENTO" });
                } else {
                  if (window.confirm("¿Seguro que deseas eliminar este evento?")) {
                    ejecutarEliminar("TODOS");
                  }
                }
              }}
              disabled={guardando}
            >
              <i className="fa-regular fa-trash-can"></i> Eliminar
            </button>
            <button
              className="v2-btn-secondary"
              onClick={onClose}
              disabled={guardando}
              type="button"
            >
              Cancelar
            </button>

            <button
              className="v2-btn-primary"
              onClick={handleGuardar}
              disabled={guardando}
              type="button"
            >
              {guardando ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Guardando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i> Guardar
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}