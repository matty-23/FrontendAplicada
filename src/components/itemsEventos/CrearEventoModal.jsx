import { useEffect, useState } from "react";
import { useEventoForm } from "../../hooks/Evento/useEventoForm";

import EventoGeneralForm from "./EventoGeneralForm";
import RecurrenciaForm from "./Recurrencia/RecurrenciaForm";
import OcurrenciasList from "./OcurrenciasList";

import "./CrearEventoModal.css";

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

  const idEvento =
    eventoSeleccionado?.idEvento ??
    null;

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

  } = useEventoForm(
    modo === "crear"
      ? null
      : idEvento
  );

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

  // ==========================================
  // GUARDAR
  // ==========================================

  const handleGuardar =
    async () => {

      setError(null);
      setGuardando(true);

      try {

        await guardarEvento();

        if (onSuccess) {
          onSuccess();
        }

        onClose();

      } catch (err) {

        console.error(
          "Error al guardar:",
          err
        );

        setError(
          err.message ||
          "Ocurrió un error al guardar"
        );

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

  // ==========================================
  // MODAL
  // ==========================================

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >

      <div
        className="modal-content"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="modal-header">

          <h2>

            {modo === "crear"
              ? "Crear Evento"
              : modo === "ver"
                ? "Detalle del Evento"
                : "Editar Evento"}

          </h2>

          <button
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>

        </div>

        {/* BODY */}

        <div className="modal-body">

          {error && (
            <div className="modal-error">

              <i className="fa-solid fa-circle-exclamation"></i>

              {error}

            </div>
          )}

          {/* INFORMACIÓN GENERAL */}

          <EventoGeneralForm
            evento={evento}
            onChange={actualizarCampoEvento}
          />

          {/* OCURRENCIAS (bloques de fecha: independientes de la
              recurrencia, siempre se pueden agregar o quitar) */}

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
          />

        </div>

        {/* FOOTER */}

        <div className="modal-footer">

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
                <i className="fa-solid fa-spinner fa-spin"></i>
                Guardando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-check"></i>
                Guardar
              </>
            )}

          </button>

        </div>

      </div>

    </div>
  );
}