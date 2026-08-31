import { useEffect, useState } from "react";
import { useEvento } from "./useEvento";
import { useOcurrencias } from "./useOcurrencias";
import { useRecurrencia } from "./useRecurrencia";

export function useEventoForm(id) {

  const {
    crearEvento,
    actualizarEvento,
    eventoSeleccionado,
    cargarEventoById,
  } = useEvento();

  const isEditing = Boolean(id);

  // EVENTO GENERAL
  const [evento, setEvento] = useState({
    titulo: "",
    categoria: "Academico",
    color: null,
    estado: "Pendiente",
  });
  const [esRecurrente, setEsRecurrente] = useState(false);
  // Regla de recurrencia en formato RRULE (estilo Google Calendar).
  // "unico" significa que el evento no se repite.
  const [recurrenciaRRule, setRecurrenciaRRule] = useState("unico");
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
    },
  ]);

  // RECURRENCIA
  const {
    actualizarTipo,
    actualizarFrecuencia,
    toggleDiaSemana,
    actualizarConfiguracion,
    limpiar: limpiarRecurrencia,
    validarRecurrencia,
    generarFechasDesdeRecurrencia,
  } = useRecurrencia();
  // Activa/desactiva la recurrencia del evento. Esto SOLO controla el RRULE:
  // nunca debe tocar `ocurrencias`, ya que los bloques de fecha se agregan y
  // eliminan de forma totalmente independiente, sea el evento recurrente o no.
  const handleToggleRecurrencia = (activo) => {
    setEsRecurrente(activo);
    if (activo) {
      setRecurrenciaRRule("FREQ=DAILY"); // Valor predeterminado al activar
    } else {
      setRecurrenciaRRule("unico");
    }
  };
  // CARGAR EVENTO CUANDO SE EDITA / VE
  useEffect(() => {

    if (!id) return;

    console.log("Solicitando evento:", id);

    cargarEventoById(id);

  }, [id]);

  // ==========================================
  // PASAR EVENTO CARGADO AL FORMULARIO
  // ==========================================

  useEffect(() => {

    if (!id || !eventoSeleccionado) return;

    console.log(
      "Evento recibido por useEventoForm:",
      eventoSeleccionado
    );

    // ------------------------------------------
    // DATOS GENERALES
    // ------------------------------------------

    setEvento({
      titulo: eventoSeleccionado.titulo || "",
      categoria: eventoSeleccionado.categoria || "Academico",
      color: eventoSeleccionado.color || null,
      estado: eventoSeleccionado.estado || "Pendiente",
    });

    // ------------------------------------------
    // OCURRENCIAS
    // ------------------------------------------

    if (Array.isArray(eventoSeleccionado.ocurrencias)) {
      const ocurrenciasFormateadas = eventoSeleccionado.ocurrencias.map((oc) => {
        const fInicio = formatParaInputFecha(oc.fechaInicio || oc.fecha_inicio);
        const fFin = formatParaInputFecha(oc.fechaFinalizacion || oc.fecha_finalizacion);
        const esTodoElDia = fInicio.includes("T00:00") && (fFin.includes("T23:59") || !fFin);

        return {
          id: oc.id || oc.id_ocurrencia, // <-- CRÍTICO: Conservar el ID original de la base de datos
          idLocal: oc.idLocal || oc.id_ocurrencia || oc.id || crypto.randomUUID(),
          fechaInicio: fInicio,
          fechaFinalizacion: fFin,
          allDay: esTodoElDia,
          lugar: oc.lugar || "",
          cantidadPersonas: oc.cantidadPersonas ?? oc.cantidad_personas ?? 0,
          id_encargado: oc.id_encargado || oc.encargado?.id || null, // <-- CRÍTICO: Usar null en vez de ""
          participantes: Array.isArray(oc.participantes)
            ? oc.participantes.map((p) => typeof p === "string" ? p : p.id).filter(Boolean)
            : [],
          participantesSeleccionados: Array.isArray(oc.participantes)
            ? oc.participantes
            : [],
        };
      });
      establecerOcurrencias(ocurrenciasFormateadas);
    }
  }, [
    id,
    eventoSeleccionado,
  ]);

  // ==========================================
  // ACTUALIZAR CAMPO DEL EVENTO
  // ==========================================
  const formatParaInputFecha = (fechaRaw) => {
    if (!fechaRaw) return "";
    const d = new Date(fechaRaw);
    if (isNaN(d.getTime())) return "";
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d - tzOffset).toISOString().slice(0, 16);
  };
  const actualizarCampoEvento = (
    campo,
    valor
  ) => {

    setEvento((prev) => ({
      ...prev,
      [campo]: valor,
    }));

  };

  // ==========================================
  // GUARDAR EVENTO
  // ==========================================

  const guardarEvento = async () => {

    // ------------------------------------------
    // VALIDACIONES
    // ------------------------------------------

    if (
      !evento.titulo ||
      !evento.titulo.trim()
    ) {
      throw new Error(
        "El título es obligatorio"
      );
    }

    if (ocurrencias.length === 0) {
      throw new Error(
        "Debe haber al menos una ocurrencia"
      );
    }

    if (
      isEditing &&
      evento.estado === "Terminado"
    ) {
      throw new Error(
        "No se pueden editar eventos terminados"
      );
    }

    // ------------------------------------------
    // AUXILIARES
    // ------------------------------------------

    const desglosar = (isoStr) => {

      if (!isoStr) {
        return {
          d: "",
          t: "",
        };
      }

      const [d, t] =
        isoStr.split("T");

      return {
        d,
        t: t || "",
      };
    };

    const sonConsecutivos = (
      finAnterior,
      inicioActual
    ) => {

      if (
        !finAnterior ||
        !inicioActual
      ) {
        return false;
      }

      const f1 =
        new Date(
          `${finAnterior}T00:00:00`
        );

      const f2 =
        new Date(
          `${inicioActual}T00:00:00`
        );

      const diffDias =
        Math.round(
          (f2 - f1) /
          (1000 * 60 * 60 * 24)
        );

      return diffDias === 1;
    };

    const arraysIguales = (
      a = [],
      b = []
    ) => {

      if (a.length !== b.length) {
        return false;
      }

      const s1 = [...a].sort();
      const s2 = [...b].sort();

      return s1.every(
        (val, i) =>
          val === s2[i]
      );
    };

    // ------------------------------------------
    // ORDENAR
    // ------------------------------------------

    const ordenadas =
      [...ocurrencias].sort(
        (a, b) =>
          new Date(a.fechaInicio || 0) -
          new Date(b.fechaInicio || 0)
      );

    // ------------------------------------------
    // EXPANDIR (Aplica el horario a cada día)
    // ------------------------------------------
    const expandidas = [];

    ordenadas.forEach((oc) => {
      const inicio = desglosar(oc.fechaInicio);
      const fin = desglosar(oc.fechaFinalizacion || oc.fechaInicio);

      if (!inicio.d) return;

      const fechaActual = new Date(`${inicio.d}T00:00:00`);
      const fechaFin = new Date(`${fin.d || inicio.d}T00:00:00`);

      let esPrimerDia = true; // <-- Bandera para saber cuál es la ocurrencia original

      // Iteramos sobre cada día dentro del rango
      while (fechaActual <= fechaFin) {
        const fechaStr = fechaActual.toISOString().split("T")[0];

        const nuevaOc = {
          ...oc,
          fechaInicio: inicio.t ? `${fechaStr}T${inicio.t}` : fechaStr,
          fechaFinalizacion: fin.t ? `${fechaStr}T${fin.t}` : fechaStr,
          // Convertimos string vacío a null antes de ir al backend
          id_encargado: oc.id_encargado === "" ? null : oc.id_encargado,
        };

        // Si es un día clonado/expandido extra, le BORRAMOS el ID para que el 
        // backend no intente pisar el mismo registro y genere una nueva fila
        if (!esPrimerDia) {
          delete nuevaOc.id;
          delete nuevaOc.id_ocurrencia;
        }

        expandidas.push(nuevaOc);

        esPrimerDia = false;
        fechaActual.setDate(fechaActual.getDate() + 1);
      }
    });

    // ------------------------------------------
    // FORMATEAR FECHAS
    // ------------------------------------------
    const ocurrenciasFormateadas =
      expandidas.map(
        ({
          idLocal,
          personalizado,
          participantesSeleccionados,
          ...oc
        }) => ({
          ...oc,
          fechaInicio: oc.fechaInicio
            ? new Date(oc.fechaInicio).toISOString()
            : null,
          fechaFinalizacion: oc.fechaFinalizacion
            ? new Date(oc.fechaFinalizacion).toISOString()
            : null,
        })
      );

    // ------------------------------------------
    // AGRUPAR
    // ------------------------------------------

    const agrupadas = [];

    ordenadas.forEach((oc) => {

      if (agrupadas.length === 0) {

        agrupadas.push({
          ...oc,
        });

        return;
      }

      const prev =
        agrupadas[
        agrupadas.length - 1
        ];

      const prevInicio =
        desglosar(
          prev.fechaInicio
        );

      const prevFin =
        desglosar(
          prev.fechaFinalizacion
        );

      const currInicio =
        desglosar(
          oc.fechaInicio
        );

      const currFin =
        desglosar(
          oc.fechaFinalizacion
        );

      const consecutivas =
        sonConsecutivos(
          prevFin.d,
          currInicio.d
        );

      const mismoHorario =
        prevInicio.t ===
        currInicio.t &&
        prevFin.t ===
        currFin.t;

      const mismosDatos =
        prev.lugar === oc.lugar &&
        Number(
          prev.cantidadPersonas
        ) === Number(
          oc.cantidadPersonas
        ) &&
        prev.id_encargado ===
        oc.id_encargado &&
        arraysIguales(
          prev.participantes,
          oc.participantes
        );

      if (
        consecutivas &&
        mismoHorario &&
        mismosDatos
      ) {

        prev.fechaFinalizacion =
          currFin.t
            ? `${currFin.d}T${currFin.t}`
            : currFin.d;

      } else {

        agrupadas.push({
          ...oc,
        });

      }

    });

    // PAYLOAD
    const payload = {
      ...evento,
      ocurrencias: ocurrenciasFormateadas,
      recurrencia: esRecurrente ? recurrenciaRRule : "unico",
    };

    console.log("Payload enviado:", payload); // <-- Movido aquí adentro

    if (isEditing) {
      await actualizarEvento(id, payload);
    } else {
      await crearEvento(payload);
    }
    return true;
  };

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
    separarOcurrencia,

    // Recurrencia
    esRecurrente,
    recurrenciaRRule,
    setRecurrenciaRRule,
    handleToggleRecurrencia,
    actualizarTipo,
    actualizarFrecuencia,
    toggleDiaSemana,
    actualizarConfiguracion,
    limpiarRecurrencia,
    validarRecurrencia,
    generarFechasDesdeRecurrencia,

    // General
    isEditing,
    eventoSeleccionado,
    guardarEvento,
  };
}