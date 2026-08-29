import { useCallback, useRef, useState, } from "react";

export function useCalendarioSeleccion() {
  const [modalAbierto, setModalAbierto,] = useState(false);
  const [rangoSeleccionado, setRangoSeleccionado,] = useState(null);
  const ultimoClick = useRef({ fecha: null, tiempo: 0, });

  const handleDateClick = useCallback((info) => {
    const ahora = Date.now();
    const mismoDia = ultimoClick.current.fecha === info.dateStr;
    const dobleClick = mismoDia && ahora - ultimoClick.current.tiempo < 400;

    if (!dobleClick) {
      ultimoClick.current = { fecha: info.dateStr, tiempo: ahora, };
      return;
    }
    const rango = {
      fechaInicio: info.dateStr,
      fechaFin: info.dateStr,
      allDay: info.allDay,
    };
    setRangoSeleccionado(rango);
    setModalAbierto(true);
    ultimoClick.current = { fecha: null, tiempo: 0, };
  }, []);

  const handleSelect = useCallback((info) => {
    let fechaFin;
    if (info.allDay) {
      const fin = new Date(info.end);
      // FullCalendar end es exclusivo
      fin.setDate(fin.getDate() - 1);

      fechaFin = fin.toISOString().split("T")[0];
    } else {
      fechaFin = info.endStr;
    }

    const rango = {
      fechaInicio: info.startStr,
      fechaFin,
      allDay: info.allDay,
    };

    setRangoSeleccionado(rango);
    setModalAbierto(true);
  }, []);

  const abrirModal = useCallback((rango = null) => {
    setRangoSeleccionado(rango);
    setModalAbierto(true);
  }, []);

  const cerrarModal = useCallback(() => {
    setModalAbierto(false);
    setRangoSeleccionado(null);

    ultimoClick.current = { fecha: null, tiempo: 0, };
  }, []);

  return {
    modalAbierto,
    rangoSeleccionado,
    handleDateClick,
    handleSelect,
    abrirModal,
    cerrarModal,
  };
}