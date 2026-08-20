import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/Card";
import OcurrenciaBlock from "../../components/itemsEventos/OcurrenciaBlock";
import { useEvento } from "../../hooks/useEvento";

const formatParaInputFecha = (fechaRaw) => {
  if (!fechaRaw) return "";
  const d = new Date(fechaRaw);
  if (isNaN(d.getTime())) return "";
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d - tzOffset).toISOString().slice(0, 16);
};

const generarIdLocal = () => crypto.randomUUID();

export default function CrearEventoPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { crearEvento, actualizarEvento, cargarEventoById, eventoSeleccionado } = useEvento();

  const isEditing = Boolean(id);

  const [evento, setEvento] = useState({
    titulo: "",
    categoria: "Academico",
    estado: "Pendiente"
  });

  const [ocurrencias, setOcurrencias] = useState([
    {
      idLocal: generarIdLocal(),
      fechaInicio: "",
      fechaFinalizacion: "",
      lugar: "",
      cantidadPersonas: 0,
      id_encargado: "",
      participantes: []
    }
  ]);

  useEffect(() => {
    if (isEditing) {
      cargarEventoById(id);
    }
  }, [id]);

  useEffect(() => {
    if (isEditing && eventoSeleccionado && String(eventoSeleccionado.id) === String(id)) {
      setEvento({
        titulo: eventoSeleccionado.titulo || "",
        categoria: eventoSeleccionado.categoria || "Academico",
        estado: eventoSeleccionado.estado || "Pendiente"
      });

      if (eventoSeleccionado.ocurrencias && eventoSeleccionado.ocurrencias.length > 0) {
        const ocurrenciasCargadas = eventoSeleccionado.ocurrencias.map((oc) => ({
          id: oc.id || oc.id_ocurrencia,
          idLocal: oc.id || oc.id_ocurrencia || generarIdLocal(),
          fechaInicio: formatParaInputFecha(oc.fechaInicio || oc.fecha_inicio),
          fechaFinalizacion: formatParaInputFecha(oc.fechaFinalizacion || oc.fecha_finalizacion),
          lugar: oc.lugar || "",
          cantidadPersonas: oc.cantidadPersonas || oc.cantidad_personas || 0,
          id_encargado: oc.id_encargado || oc.encargado?.id || "",
          participantes: oc.participantes || []
        }));
        setOcurrencias(ocurrenciasCargadas);
      }
    }
  }, [eventoSeleccionado, isEditing, id]);

  const handleAgregarOcurrencia = () => {
    setOcurrencias([
      ...ocurrencias,
      {
        idLocal: generarIdLocal(),
        fechaInicio: "",
        fechaFinalizacion: "",
        lugar: "",
        cantidadPersonas: 0,
        id_encargado: "",
        participantes: []
      }
    ]);
  };

  const handleUpdateOcurrencia = (index, newData) => {
    const updated = [...ocurrencias];
    updated[index] = newData;
    setOcurrencias(updated);
  };

  const handleRemoveOcurrencia = (index) => {
    setOcurrencias(ocurrencias.filter((_, i) => i !== index));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    // Formatear fechas a ISO UTC para enviar al backend
    const ocurrenciasFormateadas = ocurrencias.map(({ idLocal, ...oc }) => ({
      ...oc,
      fechaInicio: oc.fechaInicio ? new Date(oc.fechaInicio).toISOString() : null,
      fechaFinalizacion: oc.fechaFinalizacion ? new Date(oc.fechaFinalizacion).toISOString() : null
    }));

    const payload = { ...evento, ocurrencias: ocurrenciasFormateadas };

    try {
      if (isEditing) {
        await actualizarEvento(id, payload);
      } else {
        await crearEvento(payload);
      }
      navigate("/admin/eventos");
    } catch (err) {
      console.error("Error al guardar el evento:", err);
      alert("Hubo un error al guardar el evento. Intenta nuevamente.");
    }
  };

  return (
    <DashboardLayout
      breadcrumb={isEditing ? "Gestión / Eventos / Editar" : "Gestión / Eventos / Crear"}
      title={isEditing ? "Editar Evento" : "Nuevo Evento"}
      rightActions={
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="v2-btn-secondary"
            onClick={() => navigate("/admin/eventos")}
          >
            Cancelar
          </button>
          <button type="submit" form="evento-form" className="v2-btn-primary">
            <i className={isEditing ? "fa-solid fa-save" : "fa-solid fa-check"}></i>
            {isEditing ? " Guardar Cambios" : " Guardar Evento"}
          </button>
        </div>
      }
    >
      <form id="evento-form" onSubmit={handleGuardar}>
        <div className="v2-grid-6040">
          {/* Columna Principal: Ocurrencias */}
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <Card title="Programación y Lugares">
              {ocurrencias.map((oc, idx) => (
                <OcurrenciaBlock
                  key={oc.idLocal}
                  index={idx}
                  data={oc}
                  canDelete={ocurrencias.length > 1}
                  onChange={handleUpdateOcurrencia}
                  onRemove={handleRemoveOcurrencia}
                />
              ))}

              <button
                type="button"
                className="v2-btn-ghost"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginTop: "8px",
                  border: "1.5px dashed var(--gray-300)"
                }}
                onClick={handleAgregarOcurrencia}
              >
                <i className="fa-solid fa-plus"></i> Añadir otra fecha/lugar
              </button>
            </Card>
          </div>

          {/* Columna Secundaria: Detalles del Evento */}
          <div>
            <Card title="Detalles Generales">
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--gray-700)" }}>
                    Nombre del Evento
                  </label>
                  <input
                    type="text"
                    required
                    className="v2-search"
                    style={{ width: "100%" }}
                    placeholder="Ej: Jornada de Puertas Abiertas"
                    value={evento.titulo}
                    onChange={(e) => setEvento({ ...evento, titulo: e.target.value })}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--gray-700)" }}>
                    Categoría
                  </label>
                  <select
                    className="v2-select"
                    style={{ width: "100%" }}
                    value={evento.categoria}
                    onChange={(e) => setEvento({ ...evento, categoria: e.target.value })}
                  >
                    <option value="Academico">Académico</option>
                    <option value="Institucional">Institucional</option>
                    <option value="Recreativo">Recreativo</option>
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--gray-700)" }}>
                    Estado
                  </label>
                  <select
                    className="v2-select"
                    style={{ width: "100%" }}
                    value={evento.estado}
                    onChange={(e) => setEvento({ ...evento, estado: e.target.value })}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En revisión">En revisión</option>
                    <option value="Activo">Activo</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}