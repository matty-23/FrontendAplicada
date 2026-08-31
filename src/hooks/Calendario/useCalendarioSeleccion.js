import { useCallback, useRef, useState } from "react";

export function useCalendarioSeleccion() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState("crear");
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [rangoSeleccionado, setRangoSeleccionado] = useState(null);

  const ultimoClick = useRef({ fecha: null, tiempo: 0 });

  const handleDateClick = useCallback((info) => {
    const ahora = Date.now();
    const mismoDia = ultimoClick.current.fecha === info.dateStr;
    const dobleClick =
      mismoDia && ahora - ultimoClick.current.tiempo < 400;

    if (!dobleClick) {
      ultimoClick.current = {
        fecha: info.dateStr,
        tiempo: ahora,
      };
      return;
    }

    const rango = {
      fechaInicio: info.dateStr,
      fechaFin: info.dateStr,
      allDay: info.allDay,
    };

    setEventoSeleccionado(null);
    setModoModal("crear");
    setRangoSeleccionado(rango);
    setModalAbierto(true);

    ultimoClick.current = {
      fecha: null,
      tiempo: 0,
    };
  }, []);

  const handleSelect = useCallback((info) => {
    let fechaFin;

    if (info.allDay) {
      const fin = new Date(info.end);

      // FullCalendar usa end exclusivo
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

    setEventoSeleccionado(null);
    setModoModal("crear");
    setRangoSeleccionado(rango);
    setModalAbierto(true);
  }, []);

  const abrirModal = useCallback(
    ({ modo = "crear", evento = null, rango = null } = {}) => {
      setModoModal(modo);
      setEventoSeleccionado(evento);
      setRangoSeleccionado(rango);
      setModalAbierto(true);
    },
    []
  );

  const cerrarModal = useCallback(() => {
    setModalAbierto(false);
    setEventoSeleccionado(null);
    setRangoSeleccionado(null);
    setModoModal("crear");

    ultimoClick.current = {
      fecha: null,
      tiempo: 0,
    };
  }, []);

  return {
    modalAbierto,
    modoModal,
    eventoSeleccionado,
    rangoSeleccionado,

    handleDateClick,
    handleSelect,

    abrirModal,
    cerrarModal,
  };
}