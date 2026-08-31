import { useState } from "react";
import OcurrenciaCardHeader from "./OcurrenciaCardHeader";
import OcurrenciaCardFields from "./OcurrenciaCardFields";
import OcurrenciaCardSeparar from "./OcurrenciaCardSeparar";

import { useOcurrenciaFechas } from "./useOcurrenciaFechas";
import { esOcurrenciaRango } from "./ocurrenciaUtils";

import "./OcurrenciaCard.css";

export default function OcurrenciaCard({
  ocurrencia,
  index,
  onChange,
  onEliminar,
  onSeparar,
  soloLectura = false,
}) {
  const [expandida, setExpandida] = useState(false);

  const cambiar = (campo, valor) => {
    if (soloLectura) return;
    onChange(ocurrencia.idLocal, {
      [campo]: valor,
    });
  };

  const {
    fechaI,
    fechaF,
    horaI,
    horaF,
    cambiarFecha,
    cambiarHora,
    cambiarAllDay,
  } = useOcurrenciaFechas(ocurrencia, cambiar);

  const esRango = esOcurrenciaRango(ocurrencia);

  return (
    <div
      className={`ocurrencia-card ${expandida ? "expanded" : ""} ${
        soloLectura ? "solo-lectura" : ""
      }`}
    >
      <OcurrenciaCardHeader
        ocurrencia={ocurrencia}
        index={index}
        expandida={expandida}
        soloLectura={soloLectura}
        onToggle={() => setExpandida(!expandida)}
        onEliminar={onEliminar}
      />

      {expandida && (
        <div className="ocurrencia-card-content">
          <OcurrenciaCardFields
            ocurrencia={ocurrencia}
            soloLectura={soloLectura}
            fechaI={fechaI}
            fechaF={fechaF}
            horaI={horaI}
            horaF={horaF}
            onDateChange={cambiarFecha}
            onTimeChange={cambiarHora}
            onAllDayChange={cambiarAllDay}
            onChange={cambiar}
          />

          {esRango && !soloLectura && (
            <OcurrenciaCardSeparar onSeparar={() => onSeparar(ocurrencia.idLocal)} />
          )}
        </div>
      )}
    </div>
  );
}