import { useMemo } from "react";
import { RRule } from "rrule";
import DashboardLayout from "../components/DashboardLayout";
import Calendario from "../components/itemsCalendario/Calendario";
import { useEvento } from "../hooks/Evento/useEvento";

export default function CalendarioPage() {
  const { eventos, cargando, error, cargarEventos } = useEvento();

  // Funciones de formateo local estricto
  const pad = (n) => String(n).padStart(2, '0');
  const formatLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  
  const getLocalDateStr = (isoString) => {
      if (!isoString) return "";
      const d = new Date(isoString);
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  };

  const eventosFormateados = useMemo(() => {
    const list = [];
    const horizonte = new Date();
    horizonte.setMonth(horizonte.getMonth() + 12); 

    eventos.forEach((ev) => {
      const estado = (ev.estado || "pendiente").toLowerCase();
      let className = "ev-orange";
      if (estado === "activo" || estado === "active") className = "ev-green";
      else if (estado.includes("revis")) className = "ev-blue";

      const esRecurrente = ev.recurrencia && ev.recurrencia !== "unico";

      if (esRecurrente) {
        const ocurrencias = ev.ocurrencias || [];
        const base = ocurrencias.find(o => o.tipo === "NORMAL" && !o.isModificada) || ocurrencias[0];
        const excepciones = ocurrencias.filter(o => o.tipo === "EXCEPCION");
        const modificadas = ocurrencias.filter(o => o.tipo === "MODIFICADA");

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
            // RRule guarda las fechas usando UTC pero representando tu hora local. 
            // Extraemos los números en UTC para que coincidan con tu calendario.
            const year = fechaProyectada.getUTCFullYear();
            const month = fechaProyectada.getUTCMonth();
            const date = fechaProyectada.getUTCDate();
            
            const fechaStr = `${year}-${pad(month+1)}-${pad(date)}`;

            // ¿Es una excepción?
            const esExcepcion = excepciones.some(e => getLocalDateStr(e.fecha_inicio || e.fechaInicio) === fechaStr);
            if (esExcepcion) return; 

            // ¿Fue modificada?
            const modificada = modificadas.find(m => getLocalDateStr(m.fecha_inicio || m.fechaInicio) === fechaStr);
            const ocActiva = modificada || base;

            const activaInicio = ocActiva.fecha_inicio || ocActiva.fechaInicio;
            const activaFin = ocActiva.fecha_finalizacion || ocActiva.fechaFinalizacion || activaInicio;

            let startCalculado, endCalculado;

            if (modificada) {
              const modStart = new Date(activaInicio);
              const modEnd = new Date(activaFin);
              startCalculado = formatLocal(modStart);
              endCalculado = formatLocal(modEnd);
            } else {
              // Reensamblamos la fecha local combinando el día proyectado y la hora original
              const baseDate = new Date(baseInicio);
              const endBaseDate = new Date(baseFin);
              const duracionMs = endBaseDate.getTime() - baseDate.getTime();
              
              const startLocal = new Date(year, month, date, baseDate.getHours(), baseDate.getMinutes());
              const endLocal = new Date(startLocal.getTime() + duracionMs);
              
              startCalculado = formatLocal(startLocal);
              endCalculado = formatLocal(endLocal);
            }

            const startObj = new Date(startCalculado);
            const endObj = new Date(endCalculado);
            const isAllDay = ocActiva.allDay ?? (startObj.getHours() === 0 && startObj.getMinutes() === 0 && endObj.getHours() === 23 && endObj.getMinutes() === 59);

            list.push({
              id: modificada ? ocActiva.idLocal || ocActiva.id : `${ev.id}-inst-${index}`,
              title: ev.titulo,
              start: startCalculado, // String estricto sin "Z", ej: 2026-09-01T02:00:00
              end: endCalculado,
              allDay: isAllDay,
              className,
              extendedProps: {
                idEvento: ev.id,
                idOcurrencia: ocActiva.idLocal || ocActiva.id,
                estado: ev.estado,
                lugar: ocActiva.lugar,
                isRecurrente: true,
                instanciaOriginal: fechaStr 
              }
            });
          });
        } catch (err) {
          console.error(`Error procesando RRULE para evento ${ev.id}:`, err);
        }
      } else {
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
            className,
            extendedProps: {
              idEvento: ev.id,
              idOcurrencia: oc.idLocal || oc.id,
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
    <DashboardLayout breadcrumb="Principal / Calendario" title="Calendario General" rightActions={<button className="v2-btn-primary"><i className="fa-solid fa-plus"></i> Añadir</button>}>
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