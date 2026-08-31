import { useState, useEffect, useMemo } from "react";
import { RRule } from "rrule";

export function useRRule(esRecurrente, onChangeRRule, fechaInicio) {
  // Generador dinámico idéntico a Google Calendar
  const { patrones, labels } = useMemo(() => {
    const defaultData = { patrones: {}, labels: {} };
    if (!fechaInicio) return defaultData;

    const d = new Date(fechaInicio);
    if (isNaN(d.getTime())) return defaultData;

    // Obtener datos del día
    const dayNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    const dayNamesEs = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    
    const dayIdx = d.getDay();
    const dayStr = dayNames[dayIdx];
    const date = d.getDate();
    const nth = Math.ceil(date / 7); // Calcula si es el 1er, 2do, 3er día del mes

    return {
      patrones: {
        DAILY: "FREQ=DAILY",
        WEEKLY: `FREQ=WEEKLY;BYDAY=${dayStr}`,
        MONTHLY: `FREQ=MONTHLY;BYDAY=${nth}${dayStr}`,
        YEARLY: `FREQ=YEARLY;BYMONTH=${d.getMonth() + 1};BYMONTHDAY=${date}`,
        WEEKDAYS: "FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR",
        CUSTOM: "CUSTOM",
      },
      labels: {
        DAILY: "Todos los días",
        WEEKLY: `Cada semana, el ${dayNamesEs[dayIdx]}`,
        MONTHLY: `Mensual, el ${nth}º ${dayNamesEs[dayIdx]}`,
        YEARLY: `Anual, el ${date} de ${d.toLocaleString('es', { month: 'long' })}`,
        WEEKDAYS: "Todos los días hábiles (Lun-Vie)",
        CUSTOM: "Personalizado...",
      }
    };
  }, [fechaInicio]);

  const [selectValue, setSelectValue] = useState("FREQ=DAILY");
  
  // Variables Custom (mantén las que ya tenías)
  const [customFreq, setCustomFreq] = useState("WEEKLY");
  const [customInterval, setCustomInterval] = useState(1);
  const [customDias, setCustomDias] = useState([]);
  const [endType, setEndType] = useState("never");
  const [endCount, setEndCount] = useState(10);
  const [endDate, setEndDate] = useState("");

  // Sincronización de opciones predefinidas
  useEffect(() => {
    if (selectValue !== "CUSTOM" && esRecurrente) {
      onChangeRRule(selectValue);
    }
  }, [selectValue, esRecurrente, onChangeRRule]);

  // Generación dinámica de la regla personalizada
  useEffect(() => {
    if (selectValue === "CUSTOM") {
      let options = {
        freq: RRule[customFreq],
        interval: customInterval,
      };

      if (customFreq === "WEEKLY" && customDias.length > 0) {
        options.byweekday = customDias.map((d) => RRule[d]);
      }

      if (endType === "count" && endCount > 0) {
        options.count = endCount;
      } else if (endType === "until" && endDate) {
        const d = new Date(endDate);
        if (!isNaN(d.getTime())) {
          d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
          d.setHours(23, 59, 59);
          options.until = d;
        }
      }

      try {
        const rule = new RRule(options).toString();
        onChangeRRule(rule.replace("RRULE:", ""));
      } catch (err) {
        console.error("Error generando RRule", err);
      }
    }
  }, [customFreq, customInterval, customDias, endType, endCount, endDate, selectValue, onChangeRRule]);

  const toggleDia = (dia) => {
    setCustomDias((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  return {
    selectValue, setSelectValue,
    patrones, labels,
    customFreq, setCustomFreq,
    customInterval, setCustomInterval,
    customDias, toggleDia,
    endType, setEndType,
    endCount, setEndCount,
    endDate, setEndDate,
  };
}