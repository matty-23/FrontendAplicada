import { useEffect, useRef, useState } from "react";
import { DayPicker } from "@daypicker/react";
import { es } from "@daypicker/react/locale";
import "@daypicker/react/style.css";
import "./DateFilter.css";

export default function DateFilter({
  value,
  onChange,
  eventDates = []
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  /*
   * Convierte las fechas recibidas desde EventosPage
   * a objetos Date que pueda utilizar DayPicker.
   */
  const fechasConEventos = eventDates
    .map((fecha) => {
      if (!fecha) return null;

      const date = new Date(`${fecha}T00:00:00`);

      return isNaN(date.getTime()) ? null : date;
    })
    .filter(Boolean);

  /*
   * Cierra el calendario si hacemos click fuera.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * Texto que mostramos en el botón.
   */
  const getLabel = () => {
    if (!value?.from) {
      return "Filtrar por fecha";
    }

    const desde = value.from.toLocaleDateString("es-AR");

    if (!value.to) {
      return `${desde} — ...`;
    }

    const hasta = value.to.toLocaleDateString("es-AR");

    return `${desde} — ${hasta}`;
  };

  /*
   * Cuando se selecciona una fecha/rango.
   */
  const handleSelect = (range) => {
    onChange(range);

    /*
     * Cerramos solamente cuando ya tenemos
     * las dos fechas seleccionadas.
     */
    if (range?.from && range?.to) {
      setOpen(false);
    }
  };

  /*
   * Permite limpiar el filtro.
   */
  const handleClear = (event) => {
    event.stopPropagation();

    onChange({
      from: undefined,
      to: undefined
    });
  };

  return (
    <div
      className="date-filter"
      ref={containerRef}
    >
      <button
        type="button"
        className="date-filter-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <i className="fa-regular fa-calendar-days"></i>

        <span>{getLabel()}</span>

        {value?.from && (
          <span
            className="date-filter-clear"
            onClick={handleClear}
            title="Limpiar filtro"
          >
            <i className="fa-solid fa-xmark"></i>
          </span>
        )}

        <i className="fa-solid fa-chevron-down date-filter-chevron"></i>
      </button>

      {open && (
        <div className="date-filter-calendar">
          <DayPicker
            mode="range"
            selected={value}
            onSelect={handleSelect}
            locale={es}
            weekStartsOn={1}
            showOutsideDays
            resetOnSelect
            modifiers={{
              tieneEvento: fechasConEventos
            }}
            modifiersClassNames={{
              tieneEvento: "date-filter-event-day"
            }}
          />
        </div>
      )}
    </div>
  );
}
