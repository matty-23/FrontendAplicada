// Agrupa días consecutivos que tienen exactamente los mismos datos configurables.
const CAMPOS_COMPARABLES = [
  "lugar",
  "cantidadPersonas",
  "id_encargado",
  "participantes",
];

function normalizarValor(valor) {
  if (valor === undefined || valor === null) {
    return null;
  }

  if (Array.isArray(valor)) {
    return [...valor].sort().join(",");
  }

  return valor;
}

function mismosDatos(a, b) {
  return CAMPOS_COMPARABLES.every((campo) => normalizarValor(a[campo]) === normalizarValor(b[campo]));
}

function fechaSinHora(fecha) {
  const d = new Date(`${fecha}T00:00:00`);
  d.setHours(0, 0, 0, 0);
  return d;
}

function sonConsecutivas(fecha1, fecha2) {
  const d1 = fechaSinHora(fecha1);
  const d2 = fechaSinHora(fecha2);
  const diferencia = d2.getTime() - d1.getTime();
  return diferencia === 24 * 60 * 60 * 1000;
}

export function agruparOcurrencias(ocurrencias) {
  if (!Array.isArray(ocurrencias) || ocurrencias.length === 0) {
    return [];
  }

  const ordenadas = [...ocurrencias].sort((a, b) => fechaSinHora(a.fecha).getTime() - fechaSinHora(b.fecha).getTime());
  const grupos = [];
  let grupoActual = null;

  for (const ocurrencia of ordenadas) {
    if (!grupoActual) {
      grupoActual = { ...ocurrencia, fechaInicio: ocurrencia.fecha, fechaFin: ocurrencia.fecha, };
      continue;
    }

    const puedeAgruparse =
      sonConsecutivas(grupoActual.fechaFin, ocurrencia.fecha) &&
      mismosDatos(grupoActual, ocurrencia);

    if (puedeAgruparse) {
      grupoActual.fechaFin = ocurrencia.fecha;
    } else {
      grupos.push(grupoActual);

      grupoActual = {
        ...ocurrencia,
        fechaInicio: ocurrencia.fecha,
        fechaFin: ocurrencia.fecha,
      };
    }
  }

  if (grupoActual) {
    grupos.push(grupoActual);
  }

  return grupos;
}