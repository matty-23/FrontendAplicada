import { useState, useEffect, useCallback, useRef } from "react";

export function useRRule(esRecurrente, initialRule, onChangeRRule) {
  const [tipo, setTipo] = useState("DAILY");
  const [diasSemana, setDiasSemana] = useState([]);
  const [diasMes, setDiasMes] = useState([]);
  const [intervalo, setIntervalo] = useState(1);
  
  // Ref para evitar loops: Si estamos leyendo del backend, no emitimos hacia arriba
  const isParsing = useRef(false);

  // 1. LEER LA REGLA: Cuando recibimos initialRule (del backend o al activar el toggle)
  useEffect(() => {
    if (!initialRule || initialRule === "unico") return;

    isParsing.current = true; // Bloqueamos emisión

    // LIMPIAMOS EL PREFIJO PARA PARSEAR CORRECTAMENTE
    const cleanRule = initialRule.replace("RRULE:", "");

    const ruleObj = {};
    cleanRule.split(";").forEach((p) => {
      const [k, v] = p.split("=");
      if (k && v) ruleObj[k] = v;
    });

    if (ruleObj.FREQ === "DAILY" && parseInt(ruleObj.INTERVAL) > 1) {
      setTipo("CUSTOM");
      setIntervalo(parseInt(ruleObj.INTERVAL));
    } else {
      setTipo(ruleObj.FREQ || "DAILY");
    }

    if (ruleObj.BYDAY) setDiasSemana(ruleObj.BYDAY.split(","));
    if (ruleObj.BYMONTHDAY) setDiasMes(ruleObj.BYMONTHDAY.split(",").map(Number));

    // Liberamos el bloqueo
    setTimeout(() => { isParsing.current = false; }, 0);
  }, [initialRule]);

  // 2. GENERAR LA REGLA: A partir de los clics del usuario en la interfaz
  const generarRRule = useCallback(() => {
    if (!esRecurrente) return "unico";

    let rule = `FREQ=${tipo === "CUSTOM" ? "DAILY" : tipo}`;
    
    if (tipo === "CUSTOM" && intervalo > 1) {
      rule += `;INTERVAL=${intervalo}`;
    }
    if (tipo === "WEEKLY" && diasSemana.length > 0) {
      rule += `;BYDAY=${diasSemana.join(",")}`;
    }
    if (tipo === "MONTHLY" && diasMes.length > 0) {
      rule += `;BYMONTHDAY=${diasMes.join(",")}`;
    }

    return rule;
  }, [esRecurrente, tipo, diasSemana, diasMes, intervalo]);

  // 3. EMITIR LA REGLA: Solo si el usuario tocó algo y es distinto al inicial
  useEffect(() => {
    if (isParsing.current) return; 
    
    const newRule = generarRRule();
    if (newRule !== initialRule) {
        onChangeRRule(newRule);
    }
  }, [generarRRule, onChangeRRule, initialRule]);

  const toggleDiaSemana = (dia) => {
    setDiasSemana((prev) => prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]);
  };

  const toggleDiaMes = (dia) => {
    setDiasMes((prev) => prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]);
  };

  return {
    tipo, setTipo,
    diasSemana, toggleDiaSemana,
    diasMes, toggleDiaMes,
    intervalo, setIntervalo,
  };
}