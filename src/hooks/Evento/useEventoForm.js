import { useState } from "react";
import { useEvento } from "./useEvento";
import { useOcurrencias } from "./useOcurrencias";
import { useRecurrencia } from "./useRecurrencia";

export function useEventoForm(id) {
  const { crearEvento, actualizarEvento, eventoSeleccionado, } = useEvento();
  const isEditing = Boolean(id);
  // EVENTO GENERAL
  const [evento, setEvento] = useState({
    titulo: "",
    categoria: "Academico",
    color: null,
    estado: "Pendiente",
  });
  // OCURRENCIAS
  const {
    ocurrencias,
    establecerOcurrencias,
    agregarOcurrencia,
    agregarRango,
    actualizarOcurrencia,
    actualizarCampoOcurrencia,
    eliminarOcurrencia,
    separarOcurrencia,
    obtenerOcurrenciasParaAPI,
  } = useOcurrencias([
    {
      fechaInicio: "",
      fechaFinalizacion: "",
      lugar: "",
      cantidadPersonas: 0,
      id_encargado: "",
      participantes: [],
    },]);
  // RECURRENCIA
  const {
    recurrencia,
    actualizarTipo,
    actualizarFrecuencia,
    toggleDiaSemana,
    actualizarConfiguracion,
    limpiar: limpiarRecurrencia,
    validarRecurrencia,
    generarFechasDesdeRecurrencia,
  } = useRecurrencia();
  // ACTUALIZAR EVENTO
  const actualizarCampoEvento = (campo, valor) => {
    setEvento((prev) => ({ ...prev, [campo]: valor, }));
  };
  // GUARDAR 
  const guardarEvento = async () => {
    // 1. VALIDACIONES BÁSICAS
    if (!evento.titulo || !evento.titulo.trim()) {
      throw new Error("El título es obligatorio");
    }
    if (ocurrencias.length === 0) {
      throw new Error("Debe haber al menos una ocurrencia");
    }
    if (isEditing && evento.estado === "Terminado") {
      throw new Error("No se pueden editar eventos terminados");
    }

    // 2. FUNCIONES AUXILIARES PARA AGRUPAR
    const desglosar = (isoStr) => {
      if (!isoStr) return { d: "", t: "" };
      const [d, t] = isoStr.split("T");
      return { d, t: t || "" };
    };

    // Verifica si dos fechas están separadas por exactamente 1 día
    const sonConsecutivos = (finAnterior, inicioActual) => {
      if (!finAnterior || !inicioActual) return false;
      const f1 = new Date(`${finAnterior}T00:00:00`);
      const f2 = new Date(`${inicioActual}T00:00:00`);
      const diffDias = Math.round((f2 - f1) / (1000 * 60 * 60 * 24));
      return diffDias === 1;
    };

    // Compara que tengan los mismos participantes
    const arraysIguales = (a = [], b = []) => {
      if (a.length !== b.length) return false;
      const s1 = [...a].sort();
      const s2 = [...b].sort();
      return s1.every((val, i) => val === s2[i]);
    };

    // 3. ORDENAR CRONOLÓGICAMENTE
    const ordenadas = [...ocurrencias].sort(
      (a, b) => new Date(a.fechaInicio || 0) - new Date(b.fechaInicio || 0)
    );

    // 4. AGRUPAR BLOQUES CONSECUTIVOS IDÉNTICOS
    const agrupadas = [];
    ordenadas.forEach((oc) => {
      if (agrupadas.length === 0) {
        agrupadas.push({ ...oc });
        return;
      }

      const prev = agrupadas[agrupadas.length - 1];

      const prevInicio = desglosar(prev.fechaInicio);
      const prevFin = desglosar(prev.fechaFinalizacion);
      const currInicio = desglosar(oc.fechaInicio);
      const currFin = desglosar(oc.fechaFinalizacion);

      // Condiciones para que dos tarjetas se fusionen:
      const consecutivas = sonConsecutivos(prevFin.d, currInicio.d);
      const mismoHorario = prevInicio.t === currInicio.t && prevFin.t === currFin.t;
      const mismosDatos =
        prev.lugar === oc.lugar &&
        Number(prev.cantidadPersonas) === Number(oc.cantidadPersonas) &&
        prev.id_encargado === oc.id_encargado &&
        arraysIguales(prev.participantes, oc.participantes);

      if (consecutivas && mismoHorario && mismosDatos) {
        // Fusión: Estiramos la fecha de finalización del bloque anterior para "comerse" este día
        prev.fechaFinalizacion = currFin.t ? `${currFin.d}T${currFin.t}` : currFin.d;
      } else {
        // Si cambia la hora, el lugar, o salta un día, se guarda como bloque separado
        agrupadas.push({ ...oc });
      }
    });

    // 5. FORMATEAR AL ESTÁNDAR DE LA BASE DE DATOS (ISO)
    const ocurrenciasFormateadas = agrupadas.map(
      ({ idLocal, personalizado, participantesSeleccionados, ...oc }) => ({
        ...oc,
        fechaInicio: oc.fechaInicio ? new Date(oc.fechaInicio).toISOString() : null,
        fechaFinalizacion: oc.fechaFinalizacion ? new Date(oc.fechaFinalizacion).toISOString() : null,
      })
    );

    const payload = {
      ...evento,
      ocurrencias: ocurrenciasFormateadas,
      recurrencia: recurrencia.tipo !== "no-repetir" ? recurrencia : null,
    };

    // 6. ENVIAR AL BACKEND
    if (isEditing) {
      await actualizarEvento(id, payload);
    } else {
      await crearEvento(payload);
    }
    return true;
  };
  // RETURN
  return {
    // Evento
    evento,
    actualizarCampoEvento,

    // Ocurrencias
    ocurrencias,
    establecerOcurrencias,
    agregarOcurrencia,
    agregarRango,
    actualizarOcurrencia,
    actualizarCampoOcurrencia,
    eliminarOcurrencia,
    obtenerOcurrenciasParaAPI,

    // Recurrencia
    recurrencia,
    actualizarTipo,
    actualizarFrecuencia,
    toggleDiaSemana,
    actualizarConfiguracion,
    limpiarRecurrencia,
    validarRecurrencia,
    generarFechasDesdeRecurrencia,
    separarOcurrencia,
    // General
    isEditing,
    eventoSeleccionado,
    guardarEvento,
  };
}