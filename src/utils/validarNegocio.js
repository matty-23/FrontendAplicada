export function validarEvento(evento, ocurrencias) {
  const errores = [];

  // Validación del evento
  if (!evento.titulo?.trim()) {
    errores.push("El título del evento es obligatorio");
  }

  if (ocurrencias.length === 0) {
    errores.push("Debe haber al menos una ocurrencia");
  }

  // Validación de ocurrencias
  ocurrencias.forEach((oc, idx) => {
    if (!oc.fechaInicio) {
      errores.push(`Ocurrencia ${idx + 1}: Falta fecha de inicio`);
    }

    if (oc.fechaInicio && oc.fechaFinalizacion) {
      const inicio = new Date(oc.fechaInicio);
      const fin = new Date(oc.fechaFinalizacion);

      if (fin < inicio) {
        errores.push(`Ocurrencia ${idx + 1}: La fecha de fin no puede ser anterior a la de inicio`);
      }
    }
  });

  // Validación de estado
  if (evento.estado === "Terminado" && evento.id) {
    // Si es edición de evento ya existente terminado
    errores.push("No se pueden editar eventos terminados");
  }

  return { valido: errores.length === 0, errores, };
}