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

          const fechaOcurrencia =
            new Date(oc.fechaInicio);

          if (isNaN(fechaOcurrencia.getTime())) {
            return false;
          }

          const fecha = new Date(
            fechaOcurrencia.getFullYear(),
            fechaOcurrencia.getMonth(),
            fechaOcurrencia.getDate()
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

          return fecha >= desde && fecha <= hasta;
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