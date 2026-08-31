export function formatearRangoFechas(inicioStr, finStr) {
  if (!inicioStr) return "Sin fecha";

  const fInicio = new Date(`${inicioStr.split("T")[0]}T00:00:00`);

  let texto = fInicio.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  if (finStr && inicioStr.split("T")[0] !== finStr.split("T")[0]) {
    const fFin = new Date(`${finStr.split("T")[0]}T00:00:00`);
    texto += ` al ${fFin.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })}`;
  }

  return texto;
}

export function esOcurrenciaRango(ocurrencia) {
  if (!ocurrencia.fechaInicio || !ocurrencia.fechaFinalizacion) {
    return false;
  }

  const fechaI = ocurrencia.fechaInicio.split("T")[0];
  const fechaF = ocurrencia.fechaFinalizacion.split("T")[0];

  return fechaI !== fechaF;
}