export function useOcurrenciaFechas(ocurrencia, cambiar) {
  const fechaI = ocurrencia.fechaInicio ? ocurrencia.fechaInicio.split("T")[0] : "";
  const horaI = ocurrencia.fechaInicio && ocurrencia.fechaInicio.includes("T")
    ? ocurrencia.fechaInicio.split("T")[1].substring(0, 5)
    : "00:00";

  const fechaF = ocurrencia.fechaFinalizacion ? ocurrencia.fechaFinalizacion.split("T")[0] : "";
  const horaF = ocurrencia.fechaFinalizacion && ocurrencia.fechaFinalizacion.includes("T")
    ? ocurrencia.fechaFinalizacion.split("T")[1].substring(0, 5)
    : "23:59";

  const cambiarFecha = (tipo, nuevaFecha) => {
    if (!nuevaFecha) {
      cambiar(`fecha${tipo}`, "");
      return;
    }
    const h = tipo === "Inicio" ? horaI : horaF;
    const finalTime = ocurrencia.allDay ? (tipo === "Inicio" ? "00:00" : "23:59") : h;
    cambiar(`fecha${tipo}`, `${nuevaFecha}T${finalTime}`);
  };

  const cambiarHora = (tipo, nuevaHora) => {
    const f = tipo === "Inicio" ? fechaI : fechaF;
    if (!f) return;
    cambiar(`fecha${tipo}`, `${f}T${nuevaHora}`);
  };

  const cambiarAllDay = (e) => {
    const checked = e.target.checked;
    cambiar("allDay", checked);

    if (checked) {
      if (fechaI) cambiar("fechaInicio", `${fechaI}T00:00`);
      if (fechaF) cambiar("fechaFinalizacion", `${fechaF}T23:59`);
    }
  };

  return {
    fechaI,
    fechaF,
    horaI,
    horaF,
    cambiarFecha,
    cambiarHora,
    cambiarAllDay,
  };
}