import { useEffect, useState } from "react";
import { useEvento } from "./useEvento";
import { useOcurrencias } from "./useOcurrencias";
import { useRecurrencia } from "./useRecurrencia";

export function useEventoForm(id) {
  const { crearEvento, actualizarEvento, eventoSeleccionado, cargarEventoById } = useEvento();
  const isEditing = Boolean(id);

  const [evento, setEvento] = useState({
    titulo: "", categoria: "Academico", color: null, estado: "Pendiente",
  });
  
  const [esRecurrente, setEsRecurrente] = useState(false);
  const [recurrenciaRRule, setRecurrenciaRRule] = useState("unico");

  // NUEVO: Estado para el prompt de decisión al modificar/eliminar una recurrencia
  const [promptModificacion, setPromptModificacion] = useState({
    activo: false,
    ocurrenciaTarget: null,
    accion: null, // "ELIMINAR" | "EDITAR"
    datosCambio: null
  });

  const {
    ocurrencias, establecerOcurrencias, agregarOcurrencia, agregarRango,
    actualizarOcurrencia: actualizarOcurrenciaBase,
    actualizarCampoOcurrencia,
    eliminarOcurrencia: eliminarOcurrenciaBase, separarOcurrencia
  } = useOcurrencias([{ 
    fechaInicio: "", fechaFinalizacion: "", lugar: "", cantidadPersonas: 0, 
    id_encargado: null, participantes: [], tipo: "NORMAL", isModificada: false 
  }]);

  const { actualizarTipo, actualizarFrecuencia, toggleDiaSemana, actualizarConfiguracion, limpiar: limpiarRecurrencia, validarRecurrencia, generarFechasDesdeRecurrencia } = useRecurrencia();

const handleToggleRecurrencia = (activo) => {
    setEsRecurrente(activo);
    if (activo) {
      // Si el evento no era recurrente y lo activan, forzamos un valor base para que la interfaz despierte
      if (recurrenciaRRule === "unico" || !recurrenciaRRule) {
          setRecurrenciaRRule("FREQ=DAILY");
      }
    } else {
      // Al apagarlo, volvemos a único
      setRecurrenciaRRule("unico");
    }
  };

  useEffect(() => {
    if (!id) return;
    cargarEventoById(id);
  }, [id]);

  useEffect(() => {
    if (!id || !eventoSeleccionado) return;

    setEvento({
      titulo: eventoSeleccionado.titulo || "",
      categoria: eventoSeleccionado.categoria || "Academico",
      color: eventoSeleccionado.color || null,
      estado: eventoSeleccionado.estado || "Pendiente",
    });

    // Restaurar RRULE
    if (eventoSeleccionado.recurrencia && eventoSeleccionado.recurrencia !== "unico") {
      setEsRecurrente(true);
      setRecurrenciaRRule(eventoSeleccionado.recurrencia);
    } else {
      setEsRecurrente(false);
      setRecurrenciaRRule("unico");
    }

    if (Array.isArray(eventoSeleccionado.ocurrencias)) {
      const ocurrenciasFormateadas = eventoSeleccionado.ocurrencias.map((oc) => {
        const formatParaInputFecha = (fechaRaw) => {
            if (!fechaRaw) return "";
            const d = new Date(fechaRaw);
            if (isNaN(d.getTime())) return "";
            const tzOffset = d.getTimezoneOffset() * 60000;
            return new Date(d - tzOffset).toISOString().slice(0, 16);
        };
        const fInicio = formatParaInputFecha(oc.fechaInicio || oc.fecha_inicio);
        const fFin = formatParaInputFecha(oc.fechaFinalizacion || oc.fecha_finalizacion);
        const esTodoElDia = fInicio.includes("T00:00") && (fFin.includes("T23:59") || !fFin);

        return {
          id: oc.id || oc.id_ocurrencia,
          idLocal: oc.idLocal || oc.id_ocurrencia || oc.id || crypto.randomUUID(),
          fechaInicio: fInicio,
          fechaFinalizacion: fFin,
          allDay: esTodoElDia,
          lugar: oc.lugar || "",
          cantidadPersonas: oc.cantidadPersonas ?? oc.cantidad_personas ?? 0,
          id_encargado: oc.id_encargado || oc.encargado?.id || null,
          participantes: Array.isArray(oc.participantes) ? oc.participantes.map((p) => typeof p === "string" ? p : p.id).filter(Boolean) : [],
          participantesSeleccionados: Array.isArray(oc.participantes) ? oc.participantes : [],
          // Mantenemos el tipo y estado de modificación
          tipo: oc.tipo || "NORMAL",
          isModificada: oc.isModificada || false
        };
      });
      establecerOcurrencias(ocurrenciasFormateadas);
    }
  }, [id, eventoSeleccionado]);

  const actualizarCampoEvento = (campo, valor) => setEvento((prev) => ({ ...prev, [campo]: valor }));

  // ==========================================
  // INTERCEPTORES ESTILO GOOGLE CALENDAR
  // ==========================================
  const eliminarOcurrencia = (idLocal) => {
    if (esRecurrente && isEditing) {
      setPromptModificacion({ activo: true, ocurrenciaTarget: idLocal, accion: "ELIMINAR" });
    } else {
      eliminarOcurrenciaBase(idLocal);
    }
  };

  const actualizarOcurrencia = (idLocal, cambios) => {
    if (esRecurrente && isEditing) {
      setPromptModificacion({ activo: true, ocurrenciaTarget: idLocal, accion: "EDITAR", datosCambio: cambios });
    } else {
      actualizarOcurrenciaBase(idLocal, cambios);
    }
  };

  const aplicarDecisionRecurrencia = (decision) => {
    const { ocurrenciaTarget, accion, datosCambio } = promptModificacion;
    setPromptModificacion({ activo: false, ocurrenciaTarget: null, accion: null, datosCambio: null });

    if (accion === "ELIMINAR") {
      if (decision === "SOLO_ESTE") {
        actualizarOcurrenciaBase(ocurrenciaTarget, { tipo: "EXCEPCION", isModificada: true });
      } else if (decision === "TODOS") {
        actualizarCampoEvento("estado", "Cancelado");
      }
    } else if (accion === "EDITAR") {
      if (decision === "SOLO_ESTE") {
        actualizarOcurrenciaBase(ocurrenciaTarget, { ...datosCambio, tipo: "MODIFICADA", isModificada: true });
      } else if (decision === "TODOS") {
        actualizarOcurrenciaBase(ocurrenciaTarget, { ...datosCambio, tipo: "NORMAL", isModificada: true });
      }
    }
  };

  // ==========================================
  // GUARDAR EVENTO 
  // ==========================================
const guardarEvento = async () => {
    if (!evento.titulo || !evento.titulo.trim()) throw new Error("El título es obligatorio");
    if (ocurrencias.length === 0) throw new Error("Debe haber al menos una ocurrencia");
    if (isEditing && evento.estado === "Terminado") throw new Error("No se pueden editar eventos terminados");

    const ocurrenciasFormateadas = ocurrencias.map((oc) => {
      // 1. Extraemos variables locales y el estado efímero del frontend
      const { 
        idLocal, 
        personalizado, 
        participantesSeleccionados, 
        isModificada, // Lo extraemos para mapearlo a 'fueActualizado'
        ...restoOc 
      } = oc;

      if (!isEditing) {
        delete restoOc.id;
        delete restoOc.id_ocurrencia;
      }

      // 2. Mapeamos los tipos del Frontend a los que entiende el EventoService.ts
      let tipoBackend = restoOc.tipo;
      if (tipoBackend === "NORMAL") tipoBackend = "unico";
      if (tipoBackend === "MODIFICADA") tipoBackend = "modificada";

      return {
        ...restoOc,
        // El DTO espera camelCase para fechas y cantidad
        fechaInicio: restoOc.fechaInicio ? new Date(restoOc.fechaInicio).toISOString() : null,
        fechaFinalizacion: restoOc.fechaFinalizacion ? new Date(restoOc.fechaFinalizacion).toISOString() : null,
        cantidadPersonas: restoOc.cantidadPersonas ?? 0,
        
        // El DTO espera snake_case SOLO para el encargado
        id_encargado: restoOc.id_encargado === "" ? null : restoOc.id_encargado,
        
        tipo: tipoBackend,
        
        // CAMPO EFÍMERO: Solo viaja en el update y no se guarda en Prisma
        fueActualizado: isModificada || false
      };
    });

   const payload = {
      ...evento,
      ocurrencias: ocurrenciasFormateadas,
      // PREFIJO OBLIGATORIO PARA GOOGLE CALENDAR
      recurrencia: esRecurrente 
        ? (recurrenciaRRule.startsWith("RRULE:") ? recurrenciaRRule : `RRULE:${recurrenciaRRule}`) 
        : "unico",
    };

    if (isEditing) {
      await actualizarEvento(id, payload);
    } else {
      await crearEvento(payload);
    }
    
    return true;
  };

  return {
    evento, actualizarCampoEvento, ocurrencias, establecerOcurrencias,
    agregarOcurrencia, agregarRango, actualizarOcurrencia, actualizarCampoOcurrencia,
    eliminarOcurrencia, separarOcurrencia,
    promptModificacion, setPromptModificacion, aplicarDecisionRecurrencia, // Propagamos el prompt a la UI
    esRecurrente, recurrenciaRRule, setRecurrenciaRRule, handleToggleRecurrencia,
    actualizarTipo, actualizarFrecuencia, toggleDiaSemana, actualizarConfiguracion,
    limpiarRecurrencia, validarRecurrencia, generarFechasDesdeRecurrencia,
    isEditing, eventoSeleccionado, guardarEvento,
  };
}