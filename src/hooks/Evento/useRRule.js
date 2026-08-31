import { useState, useEffect } from "react";
import { RRule } from "rrule";

export const PATRONES_PREDEFINIDOS = {
  DAILY: "FREQ=DAILY",
  WEEKLY_MO: "FREQ=WEEKLY;BYDAY=MO",
  MONTHLY_LAST_MO: "FREQ=MONTHLY;BYDAY=-1MO",
  YEARLY_AUG_31: "FREQ=YEARLY;BYMONTH=8;BYMONTHDAY=31",
  WEEKDAYS: "FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR",
  CUSTOM: "CUSTOM",
};

export function useRRule(esRecurrente, onChangeRRule) {
  const [selectValue, setSelectValue] = useState(PATRONES_PREDEFINIDOS.DAILY);
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
    customFreq, setCustomFreq,
    customInterval, setCustomInterval,
    customDias, toggleDia,
    endType, setEndType,
    endCount, setEndCount,
    endDate, setEndDate,
  };
}