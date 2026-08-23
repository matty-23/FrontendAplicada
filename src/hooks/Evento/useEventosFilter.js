import { useMemo, useState } from "react";

export function useEventosFilter(eventos) {
  const [tab, setTab] = useState("Todos");

  const [searchQuery, setSearchQuery] = useState("");

  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });

  const filtered = useMemo(() => {
    return eventos.filter((e) => {
      // TAB
      const matchTab =
        tab === "Todos"
          ? true
          : tab === "Pendientes"
            ? e.estado === "Pendiente"
            : tab === "En revisión"
              ? e.estado === "En revisión"
              : e.estado === "Activo";


      // BÚSQUEDA

      let matchSearch = true;

      if (searchQuery) {
        const searchLower =
          searchQuery.toLowerCase().trim();

        if (searchLower.startsWith("@")) {

          const userQuery =
            searchLower.substring(1).trim();

          const matchResponsable =
            e.responsable
              .toLowerCase()
              .includes(userQuery);

          const matchParticipantes =
            e.participantesStr
              .toLowerCase()
              .includes(userQuery);

          matchSearch =
            matchResponsable ||
            matchParticipantes;

        } else {

          matchSearch =
            e.titulo
              .toLowerCase()
              .includes(searchLower) ||
            e.responsable
              .toLowerCase()
              .includes(searchLower);
        }
      }

      // FECHA
      let matchDate = true;

      if (dateRange?.from) {
        matchDate = e.ocurrencias?.some((oc) => {

          if (!oc.fechaInicio) {
            return false;
          }

          const fechaInicio = new Date(oc.fechaInicio);

          if (isNaN(fechaInicio.getTime())) {
            return false;
          }

          // Si no tiene fecha de finalización,
          // consideramos solamente su fecha de inicio.
          const fechaFin = oc.fechaFinalizacion
            ? new Date(oc.fechaFinalizacion)
            : fechaInicio;

          if (isNaN(fechaFin.getTime())) {
            return false;
          }

          // Normalizamos las fechas para comparar solamente día/mes/año
          const inicioOcurrencia = new Date(
            fechaInicio.getFullYear(),
            fechaInicio.getMonth(),
            fechaInicio.getDate()
          );

          const finOcurrencia = new Date(
            fechaFin.getFullYear(),
            fechaFin.getMonth(),
            fechaFin.getDate()
          );

          const desde = new Date(
            dateRange.from.getFullYear(),
            dateRange.from.getMonth(),
            dateRange.from.getDate()
          );

          const hasta = dateRange.to
            ? new Date(
              dateRange.to.getFullYear(),
              dateRange.to.getMonth(),
              dateRange.to.getDate()
            )
            : desde;

          // Hay coincidencia si los intervalos se superponen
          return (
            inicioOcurrencia <= hasta &&
            finOcurrencia >= desde
          );
        });
      }
      return (
        matchTab &&
        matchSearch &&
        matchDate
      );
    });
  }, [
    eventos,
    tab,
    searchQuery,
    dateRange,
  ]);

  return {
    tab,
    setTab,

    searchQuery,
    setSearchQuery,

    dateRange,
    setDateRange,

    filtered,
  };
}