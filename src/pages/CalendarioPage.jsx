import { useMemo } from "react";
import { RRule } from "rrule";
import DashboardLayout from "../components/DashboardLayout";
import Calendario from "../components/itemsCalendario/Calendario";
import { useEvento } from "../hooks/Evento/useEvento";

export default function CalendarioPage() {
  const { eventos, cargando, error, cargarEventos } = useEvento();

  // Funciones de formateo local estricto
  const pad = (n) => String(n).padStart(2, '0');
  const formatLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

  const getLocalDateStr = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const eventosFormateados = useMemo(() => {
    const list = [];
    const horizonte = new Date();
    horizonte.setMonth(horizonte.getMonth() + 12);

    eventos.forEach((ev) => {

      const esRecurrente = ev.recurrencia && ev.recurrencia !== "unico";
      if (esRecurrente) {
        const ocurrencias = ev.ocurrencias || [];

        // Identificamos base y excepciones
        const base = ocurrencias.find(o => {
          const t = (o.tipo || "").toLowerCase();
          return (t === "normal" || t === "unico") && !o.isModificada;
        }) || ocurrencias[0];

        // 1. DIBUJAR LAS EXCEPCIONES AISLADAS (A prueba de fallos)
        const excepciones = ocurrencias.filter(o => {
          const t = (o.tipo || "").toLowerCase();
          return t === "excepcion" || t === "cancelada"; // Cancelada tampoco se dibuja
        });
        const modificadas = ocurrencias.filter(o => (o.tipo || "").toLowerCase() === "modificada");

        modificadas.forEach(mod => {
          const modInicio = mod.fecha_inicio || mod.fechaInicio;
          const modFin = mod.fecha_finalizacion || mod.fechaFinalizacion || modInicio;
          const startObj = new Date(modInicio);
          const endObj = new Date(modFin);
          const isAllDay = mod.allDay ?? (startObj.getHours() === 0 && startObj.getMinutes() === 0 && endObj.getHours() === 23 && endObj.getMinutes() === 59);

          list.push({
            id: mod.idLocal || mod.id,
            title: ev.titulo,
            start: formatLocal(startObj),
            end: formatLocal(endObj),
            allDay: isAllDay,
            backgroundColor: ev.color || "#3B82F6",
            borderColor: ev.color || "#3B82F6",
            textColor: "#ffffff",
            extendedProps: {
              idEvento: ev.id,
              idOcurrencia: mod.id || mod.idLocal,
              estado: ev.estado,
              lugar: mod.lugar,
              isRecurrente: true,
              // Usamos la original si existe, sino usamos la actual como fallback
              instanciaOriginal: mod.ocurrencia_original ? getLocalDateStr(mod.ocurrencia_original) : getLocalDateStr(modInicio)
            }
          });
        });

        // 2. DIBUJAR LA REGLA BASE
        const baseInicio = base?.fecha_inicio || base?.fechaInicio;
        if (!base || !baseInicio) return;
        const baseFin = base.fecha_finalizacion || base.fechaFinalizacion || baseInicio;

        try {
          const rruleStr = ev.recurrencia.startsWith("RRULE:") ? ev.recurrencia : `RRULE:${ev.recurrencia}`;
          const rule = RRule.fromString(rruleStr);
          const inicioBase = new Date(baseInicio);
          rule.options.dtstart = inicioBase;
          const fechasProyectadas = rule.between(new Date(new Date().setMonth(new Date().getMonth() - 1)), horizonte, true);

          fechasProyectadas.forEach((fechaProyectada, index) => {
            const year = fechaProyectada.getUTCFullYear();
            const month = fechaProyectada.getUTCMonth();
            const date = fechaProyectada.getUTCDate();
            const fechaStr = `${year}-${pad(month + 1)}-${pad(date)}`;

            // Vemos si hay alguna excepci n o modificada CUYA FECHA ORIGINAL era esta
            const skipModified = modificadas.some(m => {
              const orig = m.ocurrencia_original || m.fecha_inicio || m.fechaInicio;
              return getLocalDateStr(orig) === fechaStr;
            });
            const skipException = excepciones.some(e => {
              const orig = e.ocurrencia_original || e.fecha_inicio || e.fechaInicio;
              return getLocalDateStr(orig) === fechaStr;
            });

            if (skipModified || skipException) return;

            // ... (el resto de la generacion base sigue igual)
            // Si es una excepción o fue modificada, la saltamos porque ya la dibujamos arriba
            if (excepciones.some(e => getLocalDateStr(e.fecha_inicio || e.fechaInicio) === fechaStr)) return;
            if (modificadas.some(m => getLocalDateStr(m.fecha_inicio || m.fechaInicio) === fechaStr)) return;

            const baseDate = new Date(baseInicio);
            const endBaseDate = new Date(baseFin);
            const duracionMs = endBaseDate.getTime() - baseDate.getTime();

            const startLocal = new Date(year, month, date, baseDate.getHours(), baseDate.getMinutes());
            const endLocal = new Date(startLocal.getTime() + duracionMs);

            const startCalculado = formatLocal(startLocal);
            const endCalculado = formatLocal(endLocal);
            const startObj = new Date(startCalculado);
            const endObj = new Date(endCalculado);
            const isAllDay = base.allDay ?? (startObj.getHours() === 0 && startObj.getMinutes() === 0 && endObj.getHours() === 23 && endObj.getMinutes() === 59);

            list.push({
              id: `${ev.id}-inst-${index}`,
              title: ev.titulo,
              start: startCalculado,
              end: endCalculado,
              allDay: isAllDay,
              backgroundColor: ev.color || "#3B82F6",
              borderColor: ev.color || "#3B82F6",
              textColor: "#ffffff",
              extendedProps: {
                idEvento: ev.id,
                idOcurrencia: base.id || base.idLocal,
                estado: ev.estado,
                lugar: base.lugar,
                isRecurrente: true,
                instanciaOriginal: fechaStr
              }
            });
          });
        } catch (err) {
          console.error(`Error procesando RRULE para evento ${ev.id}:`, err);
        }
      } else {
        // ... (el else original de eventos únicos sigue igual)
        (ev.ocurrencias || []).forEach((oc, index) => {
          if (oc.tipo === "EXCEPCION") return;

          const ocInicio = oc.fecha_inicio || oc.fechaInicio;
          const ocFin = oc.fecha_finalizacion || oc.fechaFinalizacion || ocInicio;

          const startObj = new Date(ocInicio);
          const endObj = new Date(ocFin);
          const isAllDay = oc.allDay ?? (startObj.getHours() === 0 && startObj.getMinutes() === 0 && endObj.getHours() === 23 && endObj.getMinutes() === 59);

          list.push({
            id: oc.idLocal || oc.id || `${ev.id}-oc-${index}`,
            title: ev.titulo,
            start: formatLocal(startObj),
            end: formatLocal(endObj),
            allDay: isAllDay,
            backgroundColor: ev.color || "#3B82F6",
            borderColor: ev.color || "#3B82F6",
            textColor: "#ffffff",
            extendedProps: {
              idEvento: ev.id,
              idOcurrencia: oc.id || oc.idLocal,
              estado: ev.estado,
              lugar: oc.lugar,
              isRecurrente: false
            }
          });
        });
      }
    });

    return list;
  }, [eventos]);

  return (
    <DashboardLayout hideTopBar={true}>
      <div className="calendario-page" style={{ height: "100%" }}>
        {cargando ? (
          <div className="calendario-loading">
            <i className="fa-solid fa-circle-notch fa-spin fa-2x"></i>
            <p className="calendario-loading-text">Cargando eventos...</p>
          </div>
        ) : error ? (
          <div className="calendario-error">
            <i className="fa-solid fa-triangle-exclamation"></i>
            <p>No se pudieron cargar los eventos. {error}</p>
          </div>
        ) : (
          <Calendario events={eventosFormateados} onEventoModificado={cargarEventos} />
        )}
      </div>
    </DashboardLayout>
  );
}