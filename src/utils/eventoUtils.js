export const adaptarEventoAUI = (ev) => {
  const titulo = ev.titulo || "Evento sin título";

  const estadoRaw = (ev.estado || "pendiente")
    .toLowerCase()
    .trim();

  let estado = "Pendiente";
  let tipo = "orange";

  if (
    estadoRaw === "activo" ||
    estadoRaw === "active"
  ) {
    estado = "Activo";
    tipo = "green";
  } else if (
    estadoRaw === "en revisión" ||
    estadoRaw === "en revision" ||
    estadoRaw === "revision"
  ) {
    estado = "En revisión";
    tipo = "blue";
  }

  const ocurrencias = ev.ocurrencias || [];

  const primeraOc =
    ocurrencias.length > 0
      ? ocurrencias[0]
      : null;

  let fecha = "Sin fecha";
  let fechaRaw = null;
  let responsable = "Sin asignar";
  let participantesStr = "";

  // FECHAS
  if (ocurrencias.length > 0) {

    const ocurrenciasConFecha = ocurrencias
      .filter((oc) => oc.fechaInicio)
      .sort(
        (a, b) =>
          new Date(a.fechaInicio) -
          new Date(b.fechaInicio)
      );

    if (ocurrenciasConFecha.length > 0) {

      const primeraOcurrencia =
        ocurrenciasConFecha[0];

      const ultimaOcurrencia =
        ocurrenciasConFecha[
          ocurrenciasConFecha.length - 1
        ];

      const inicio =
        new Date(
          primeraOcurrencia.fechaInicio
        );

      const fin =
        ultimaOcurrencia.fechaFinalizacion
          ? new Date(
              ultimaOcurrencia.fechaFinalizacion
            )
          : null;

      const formatearFechaHora = (fecha) =>
        fecha.toLocaleString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

      fecha = formatearFechaHora(inicio);

      if (
        fin &&
        !isNaN(fin.getTime())
      ) {
        fecha += ` → ${formatearFechaHora(fin)}`;
      }

      fechaRaw =
        inicio.toISOString().split("T")[0];
    }
  }

  // ENCARGADO
  if (primeraOc?.encargado) {

    responsable =
      `${primeraOc.encargado.nombre || ""} ${
        primeraOc.encargado.apellido || ""
      }`.trim();

    if (!responsable) {
      responsable = "Sin asignar";
    }
  }

  // PARTICIPANTES
  if (
    Array.isArray(
      primeraOc?.participantes
    )
  ) {
    participantesStr =
      primeraOc.participantes
        .map((p) =>
          typeof p === "string"
            ? p
            : `${p.nombre || ""} ${
                p.apellido || ""
              }`.trim()
        )
        .join(" ");
  }

  return {
    id: ev.id,
    titulo,
    fecha,
    fechaRaw,
    responsable,
    participantesStr,
    estado,
    tipo,
    ocurrencias,
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