// hooks/useRecurrencia.js

import { useState } from "react";
import { RRule } from "rrule";

export function useRecurrencia() {
  const [recurrencia, setRecurrencia] = useState({
    tipo: "no-repetir",
    frecuencia: 1,
    diasSemana: [],
    configuracion: {},
  });
  const actualizarTipo = (tipo) => { setRecurrencia((prev) => ({ ...prev, tipo, })); };
  const actualizarFrecuencia = (frecuencia) => {
    setRecurrencia((prev) => ({ ...prev, frecuencia: Number(frecuencia), }));
  };

  const toggleDiaSemana = (dia) => {
    setRecurrencia((prev) => {
      const dias = prev.diasSemana.includes(dia) ? prev.diasSemana.filter((d) => d !== dia) : [...prev.diasSemana, dia];
      return { ...prev, diasSemana: dias, };
    });
  };

  const actualizarConfiguracion = (configuracion) => {
    setRecurrencia((prev) => ({
      ...prev,
      configuracion: { ...prev.configuracion, ...configuracion, },
    }));
  };

  const limpiar = () => {
    setRecurrencia({
      tipo: "no-repetir",
      frecuencia: 1,
      diasSemana: [],
      configuracion: {},
    });
  };

  // GENERAR FECHAS DESDE RECURRENCIA
  const generarFechasDesdeRecurrencia = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) {
      return [];
    }

    // No repetir
    if (recurrencia.tipo === "no-repetir") {
      return [fechaInicio.toISOString().split("T")[0],];
    }

    try {
      let rule;
      switch (recurrencia.tipo) {
        // DIARIA
        case "diaria":
          rule = new RRule({
            freq: RRule.DAILY,
            interval: 1,
            dtstart: fechaInicio,
            until: fechaFin,
          });
          break;


        // SEMANAL
        case "semanal": {
          const diaMap = [
            RRule.MO,
            RRule.TU,
            RRule.WE,
            RRule.TH,
            RRule.FR,
            RRule.SA,
            RRule.SU,
          ];

          const byweekday = (recurrencia.diasSemana || []).map((dia) => diaMap[dia]).filter(Boolean);
          if (byweekday.length === 0) {
            return [];
          }

          rule = new RRule({
            freq: RRule.WEEKLY,
            interval: 1,
            byweekday,
            dtstart: fechaInicio,
            until: fechaFin,
          });

          break;
        }

        // CADA X DÍAS
        case "cada-x":
          rule = new RRule({
            freq: RRule.DAILY,
            interval: Math.max(1, recurrencia.frecuencia || 1),
            dtstart: fechaInicio,
            until: fechaFin,
          });

          break;

        // PERSONALIZADA
        case "personalizada":
          rule = new RRule({
            freq: recurrencia.configuracion?.freq || RRule.DAILY,
            interval: recurrencia.configuracion?.interval || 1,
            byweekday: recurrencia.configuracion?.byweekday,
            dtstart: fechaInicio,
            until: fechaFin,
          });

          break;

        default:
          return [fechaInicio.toISOString().split("T")[0],];
      }

      if (!rule) {
        return [];
      }

      const ocurrencias = rule.between(
        fechaInicio,
        fechaFin,
        true
      );

      return ocurrencias.map((fecha) => fecha.toISOString().split("T")[0]);
    } catch (error) {
      console.error("Error generando fechas de recurrencia:", error);
      return [];
    }
  };


  // VALIDAR RECURRENCIA
  const validarRecurrencia = () => {
    if (recurrencia.tipo === "no-repetir") {
      return { valido: true, };
    }

    if (recurrencia.tipo === "semanal") {
      if (!recurrencia.diasSemana || recurrencia.diasSemana.length === 0) {
        return {
          valido: false,
          error: "Debe seleccionar al menos un día de la semana",
        };
      }
    }

    if (recurrencia.tipo === "cada-x") {
      if (!recurrencia.frecuencia || recurrencia.frecuencia < 1) {
        return {
          valido: false,
          error: "La frecuencia debe ser al menos 1",
        };
      }
    }

    return { valido: true, };
  };

  // RETURN
  return {
    recurrencia,
    actualizarTipo,
    actualizarFrecuencia,
    toggleDiaSemana,
    actualizarConfiguracion,
    generarFechasDesdeRecurrencia,
    validarRecurrencia,
    limpiar,
  };
}