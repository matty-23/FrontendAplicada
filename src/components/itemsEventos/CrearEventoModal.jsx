// components/calendario/CrearEventoModal.jsx

import { useEffect, useState } from "react";
import { useEventoForm } from "../../hooks/Evento/useEventoForm";
import EventoGeneralForm from "./EventoGeneralForm";
import RecurrenciaForm from "./RecurrenciaForm";
import OcurrenciasList from "./OcurrenciasList";
import "./CrearEventoModal.css";
import { useEvento } from "../../hooks/Evento/useEvento";
export default function CrearEventoModal({
  isOpen,
  onClose,
  rangoSeleccionado,
  onSuccess,
}) {
  const {
    evento,
    ocurrencias,
    recurrencia,
    isEditing,
    separarOcurrencia,
    actualizarCampoEvento,
    agregarOcurrencia,
    actualizarOcurrencia,
    actualizarCampoOcurrencia,
    eliminarOcurrencia,
    agregarRango,
    generarFechasDesdeRecurrencia,
    guardarEvento,
  } = useEventoForm();

  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Cuando se abre con rango seleccionado
  useEffect(() => {
    if (isOpen && rangoSeleccionado) {
      const { fechaInicio, fechaFin, allDay } = rangoSeleccionado;

      // El input datetime-local necesita el formato estricto YYYY-MM-DDTHH:mm
      const formatearFecha = (fechaStr, esFin) => {
        if (!fechaStr) return "";
        if (fechaStr.includes("T")) {
          return fechaStr.substring(0, 16); // Corta la zona horaria, deja YYYY-MM-DDTHH:mm
        }
        // Si es un evento de todo el día, asignamos 00:00 al inicio y 23:59 al final
        return `${fechaStr}T${esFin ? "23:59" : "00:00"}`;
      };

      // Limpiar ocurrencias existentes y agregar el rango seleccionado
      agregarRango(
        formatearFecha(fechaInicio, false),
        formatearFecha(fechaFin, true),
        { allDay }
      );
    }
  }, [isOpen, rangoSeleccionado]);

  // Cuando cambia el tipo de recurrencia
  useEffect(() => {
    if (recurrencia.tipo !== "no-repetir") {
      // Generar ocurrencias desde recurrencia
      const fechas =
        generarFechasDesdeRecurrencia(
          new Date(ocurrencias[0]?.fechaInicio),
          new Date(ocurrencias[0]?.fechaFinalizacion)
        );

      // Reemplazar ocurrencias con las generadas
      // por recurrencia
    }
  }, [recurrencia.tipo]);

  const handleGuardar = async () => {
    setError(null);
    setGuardando(true);

    try {
      await guardarEvento();

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2>
            {isEditing ? "Editar" : "Crear"} Evento
          </h2>

          <button
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Error */}
          {error && (
            <div className="modal-error">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}

          {/* Info General */}
          <EventoGeneralForm
            evento={evento}
            onChange={actualizarCampoEvento}
          />

          {/* Recurrencia */}
          <RecurrenciaForm
            recurrencia={recurrencia}
            onUpdate={(cambios) => {
              // Actualizar recurrencia
            }}
          />

          {/* Ocurrencias */}
          <OcurrenciasList
            ocurrencias={ocurrencias}
            valoresGenerales={evento}
            onChange={actualizarOcurrencia}
            onAgregar={agregarOcurrencia}
            onEliminar={eliminarOcurrencia}
            onSeparar={separarOcurrencia}
          />
        </div>

        {/* Footer */}
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