export const adaptarEventoAUI = (ev) => {
  const titulo = ev.titulo || "Evento sin título";
  const estadoRaw = (ev.estado || "pendiente").toLowerCase().trim();
  let estado = "Pendiente";
  let tipo = "orange";

  if (estadoRaw === "activo" || estadoRaw === "active") {
    estado = "Activo";
    tipo = "green";
  } else if (estadoRaw === "en revisión" || estadoRaw === "en revision" || estadoRaw === "revision") {
    estado = "En revisión";
    tipo = "blue";
  }

 const ocurrencias = ev.ocurrencias || [];
  
  // Buscar la verdadera base ignorando mayúsculas/minúsculas
  const base = ocurrencias.find(o => {
    const t = (o.tipo || "").toLowerCase();
    return t === "normal" || t === "unico";
  }) || ocurrencias[0];

  const primeraOc = ocurrencias.length > 0 ? base : null;

  let fecha = "Sin fecha";
  let fechaRaw = null;
  let responsable = "Sin asignar";
  let participantesStr = "";

  // ==========================================
  // LÓGICA INTELIGENTE DE RRULE PARA LA TARJETA
  // ==========================================
  if (primeraOc && primeraOc.fechaInicio) {
    const inicioDate = new Date(primeraOc.fechaInicio);
    const finDate = primeraOc.fechaFinalizacion ? new Date(primeraOc.fechaFinalizacion) : null;

    const horaStr = inicioDate.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }) +
      (finDate ? ` - ${finDate.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}` : "");

    fechaRaw = inicioDate.toISOString().split("T")[0];

    // Si hay RRULE, parseamos la regla compacta
    if (ev.recurrencia && ev.recurrencia !== "unico") {
      const rrule = ev.recurrencia;

      if (rrule.includes("FREQ=DAILY")) {
        const intervalMatch = rrule.match(/INTERVAL=(\d+)/);
        if (intervalMatch && parseInt(intervalMatch[1]) > 1) {
          fecha = `Cada ${intervalMatch[1]} días | ${horaStr}`; // Caso: Cada X días
        } else {
          fecha = `Todos los días | ${horaStr}`; // Caso: Diario
        }
      }
      else if (rrule.includes("FREQ=WEEKLY")) {
        // Extraer los días (BYDAY=MO,TU,WE)
        const byDayMatch = rrule.match(/BYDAY=([^;]+)/);
        if (byDayMatch) {
          const mapDias = { MO: "Lun", TU: "Mar", WE: "Mié", TH: "Jue", FR: "Vie", SA: "Sáb", SU: "Dom" };
          const diasCortos = byDayMatch[1].split(",").map(d => mapDias[d]).join(" · ");
          fecha = `${diasCortos} | ${horaStr}`;
        } else {
          fecha = `Semanal | ${horaStr}`;
        }
      }
      else if (rrule.includes("FREQ=MONTHLY")) {
        // Extraer el día del mes
        const byMonthDayMatch = rrule.match(/BYMONTHDAY=(\d+)/);
        if (byMonthDayMatch) {
          fecha = `Día ${byMonthDayMatch[1]} de cada mes | ${horaStr}`;
        } else {
          fecha = `Mensual | ${horaStr}`;
        }
      }
      else if (rrule.includes("FREQ=YEARLY")) {
        fecha = `${inicioDate.toLocaleDateString("es-AR", { day: "numeric", month: "long" })} | ${horaStr}`;
      }
      else {
        fecha = `Recurrente | ${horaStr}`; // Fallback genérico
      }
    } else {
      // Sin recurrencia: Mostrar fecha normal
      fecha = `${inicioDate.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" })} | ${horaStr}`;
    }
  }

  // ENCARGADO
  if (primeraOc?.encargado) {
    responsable = `${primeraOc.encargado.nombre || ""} ${primeraOc.encargado.apellido || ""}`.trim();
    if (!responsable) responsable = "Sin asignar";
  }

  // PARTICIPANTES
  if (Array.isArray(primeraOc?.participantes)) {
    participantesStr = primeraOc.participantes
      .map((p) => typeof p === "string" ? p : `${p.nombre || ""} ${p.apellido || ""}`.trim())
      .join(" ");
  }

  return {
    id: ev.id, titulo, fecha, fechaRaw, responsable,
    participantesStr, estado, tipo, ocurrencias,
  };
};
export const obtenerFechasConEventos = (eventos) => {
  return [
    ...new Set(
      eventos.flatMap((evento) =>
        (evento.ocurrencias || [])
          .filter((oc) => oc.fechaInicio)
          .map((oc) => {
            const fecha = new Date(
              oc.fechaInicio
            );

            if (isNaN(fecha.getTime())) {
              return null;
            }

            return fecha
              .toISOString()
              .split("T")[0];
          })
          .filter(Boolean)
      )
    ),
  ];
};
export const generarIdLocal = () => {
  return crypto.randomUUID();
};

export const formatParaInputFecha = (fechaRaw) => {

  if (!fechaRaw) {
    return "";
  }

  const d = new Date(fechaRaw);

  if (isNaN(d.getTime())) {
    return "";
  }

  const tzOffset =
    d.getTimezoneOffset() * 60000;

  return new Date(
    d - tzOffset
  )
    .toISOString()
    .slice(0, 16);
};