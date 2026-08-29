import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import EventoForm from "../../components/itemsEventos/EventoForm";
import { useEvento } from "../../hooks/Evento/useEvento";
import "./CrearEventoPage.css";

const generarIdLocal = () => crypto.randomUUID();

const formatParaInputFecha = (fechaRaw) => {
  if (!fechaRaw) return "";
  const d = new Date(fechaRaw);
  if (isNaN(d.getTime())) return "";

  const tzOffset = d.getTimezoneOffset() * 60000;

  return new Date(d - tzOffset).toISOString().slice(0, 16);
};

const crearOcurrenciaVacia = () => ({
  idLocal: generarIdLocal(),
  fechaInicio: "",
  fechaFinalizacion: "",
  lugar: "",
  cantidadPersonas: 0,
  id_encargado: "",
  participantes: [],
  participantesSeleccionados: [],
  comentarios: [],
  personalizado: {},
});

export default function CrearEventoPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    crearEvento,
    actualizarEvento,
    cargarEventoById,
    eventoSeleccionado,
  } = useEvento();

  const isEditing = Boolean(id);

  const [evento, setEvento] = useState({
    titulo: "",
    categoria: "Academico",
    estado: "Pendiente",
  });

  const [ocurrencias, setOcurrencias] = useState([crearOcurrenciaVacia(),]);

  const [guardando, setGuardando] = useState(false);


  // Cargar evento para edición
  useEffect(() => {
    if (isEditing) { cargarEventoById(id); }
  }, [id, isEditing]);

  // Pasar evento cargado al formulario
  useEffect(() => {
    if (!isEditing || !eventoSeleccionado || String(eventoSeleccionado.id) !== String(id)
    ) { return; }
    setEvento({
      titulo: eventoSeleccionado.titulo || "",
      categoria: eventoSeleccionado.categoria || "Academico",
      estado: eventoSeleccionado.estado || "Pendiente",
    });

    if (eventoSeleccionado.ocurrencias && eventoSeleccionado.ocurrencias.length > 0) {
      const ocurrenciasCargadas = eventoSeleccionado.ocurrencias.map((oc) => ({
        id: oc.id || oc.id_ocurrencia,
        idLocal: oc.id || oc.id_ocurrencia || generarIdLocal(),
        fechaInicio: formatParaInputFecha(oc.fechaInicio || oc.fecha_inicio),
        fechaFinalizacion: formatParaInputFecha(oc.fechaFinalizacion || oc.fecha_finalizacion),
        lugar: oc.lugar || "",
        cantidadPersonas: oc.cantidadPersonas ?? oc.cantidad_personas ?? 0,
        id_encargado: typeof oc.id_encargado === "string" ? oc.id_encargado : oc.encargado?.id || "",
        participantes: (oc.participantes || []).map((p) => typeof p === "string" ? p : p?.id).filter(Boolean),
        participantesSeleccionados: oc.participantes || [],
        comentarios: oc.comentarios || [],
        personalizado: oc.personalizado || {},
      }));
      setOcurrencias(ocurrenciasCargadas);
    }
  }, [eventoSeleccionado, isEditing, id,]);

  // Evento
  const handleEventoChange = (campo, valor) => {
    setEvento((prev) => ({ ...prev, [campo]: valor, }));
  };

  // Ocurrencias

  const handleAgregarOcurrencia = () => {
    setOcurrencias((prev) => [...prev, crearOcurrenciaVacia(),]);
  };

  const handleOcurrenciaChange = (index, newData) => {
    setOcurrencias((prev) => prev.map((oc, i) => i === index ? newData : oc));
  };

  const handleEliminarOcurrencia = (index) => {
    setOcurrencias((prev) => prev.filter((_, i) => i !== index));
  };

  // Guardar

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (guardando) return;

    if (!evento.titulo.trim()) {
      alert("El nombre del evento es obligatorio.");
      return;
    }

    if (ocurrencias.length === 0) {
      alert("Debe existir al menos una ocurrencia.");
      return;
    }

    setGuardando(true);

    const ocurrenciasFormateadas =
      ocurrencias.map(({ idLocal, ...oc }) => ({
        ...oc,
        fechaInicio: oc.fechaInicio ? new Date(oc.fechaInicio).toISOString() : null,
        fechaFinalizacion: oc.fechaFinalizacion ? new Date(oc.fechaFinalizacion).toISOString() : null,
      })
      );

    const payload = { ...evento, ocurrencias: ocurrenciasFormateadas, };
    try {
      if (isEditing) {
        await actualizarEvento(id, payload);
      } else {
        await crearEvento(payload);
      }
      navigate("/admin/eventos");

    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Hubo un error al guardar el evento.");
      setGuardando(false);
    }
  };

  return (
    <DashboardLayout
      breadcrumb={isEditing ? "Gestión / Eventos / Editar" : "Gestión / Eventos / Crear"}
      title={isEditing ? "Editar Evento" : "Nuevo Evento"}
      rightActions={
        <div className="crear-evento-actions">
          <button
            type="button"
            className="v2-btn-secondary"
            onClick={() => navigate("/admin/eventos")}
            disabled={guardando}
          >Cancelar </button>

          <button
            type="submit"
            form="evento-form"
            className="v2-btn-primary"
            disabled={guardando}
          >
            <i className={guardando ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-save"}
            ></i>
            {guardando ? " Guardando..." : isEditing ? " Guardar Cambios" : " Guardar Evento"}
          </button>
        </div>
      }
    >

      <form id="evento-form" onSubmit={handleGuardar}>
        <EventoForm
          evento={evento}
          ocurrencias={ocurrencias}
          onEventoChange={handleEventoChange}
          onOcurrenciaChange={handleOcurrenciaChange}
          onAgregarOcurrencia={handleAgregarOcurrencia}
          onEliminarOcurrencia={handleEliminarOcurrencia}
        />
      </form>
    </DashboardLayout>
  );
}