import DashboardLayout from "../components/DashboardLayout";
import Calendario from "../components/itemsCalendario/Calendario";
import { useEvento } from "../hooks/Evento/useEvento";

export default function CalendarioPage() {
  // 1. Traemos los eventos reales desde tu base de datos
  const { eventos } = useEvento();
// 2. Transformamos los eventos al formato de FullCalendar
  const eventosFormateados = eventos.flatMap((ev) => {
    return (ev.ocurrencias || []).map((oc, index) => {
      
      const estado = (ev.estado || "pendiente").toLowerCase();
      let className = "ev-orange"; 
      
      if (estado === "activo" || estado === "active") {
        className = "ev-green";
      } else if (estado.includes("revis")) {
        className = "ev-blue";
      }

      const fechaI = oc.fechaInicio || oc.fecha_inicio || "";
      const fechaF = oc.fechaFinalizacion || oc.fecha_finalizacion || "";
      
      // Magia: Detectamos si es un evento de todo el día para ocultar el "00:00"
      const isAllDay = !fechaI.includes("T") || (fechaI.includes("00:00") && fechaF.includes("23:59"));

      return {
        id: oc.idLocal || oc.id_ocurrencia || `${ev.id}-oc-${index}`, 
        title: ev.titulo,
        start: fechaI,
        end: fechaF,
        allDay: isAllDay, // <--- Esta línea hace que desaparezca el texto "00:00"
        className: className,
        extendedProps: {
          id: ev.id,
          ocurrenciaId: oc.idLocal || oc.id_ocurrencia,
          estado: ev.estado,
          lugar: oc.lugar
        }
      };
    });
  });

  const rightActions = (
    <button className="v2-btn-primary">
      <i className="fa-solid fa-plus"></i>
      Añadir
    </button>
  );

  return (
    <DashboardLayout
      breadcrumb="Principal / Calendario"
      title="Calendario General"
      rightActions={rightActions}
    >
      <div className="calendario-page" style={{ height: "100%" }}>
        {/* Le pasamos los eventos ya formateados al componente inteligente */}
        <Calendario events={eventosFormateados} />
      </div>
    </DashboardLayout>
  );
}