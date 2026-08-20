import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/Card";
import OcurrenciaBlock from "../../components/itemsEventos/OcurrenciaBlock";
import { useEvento } from "../../hooks/useEvento";

// Función utilitaria para convertir fechas del backend al formato que necesita el input datetime-local
const formatParaInputFecha = (fechaRaw) => {
  if (!fechaRaw) return "";
  const d = new Date(fechaRaw);
  // Ajustamos por la zona horaria para que no se desfase la hora local
  const tzOffset = d.getTimezoneOffset() * 60000; 
  const localISOTime = new Date(d - tzOffset).toISOString().slice(0, 16); 
  return localISOTime; // Retorna formato "YYYY-MM-DDTHH:mm"
};

export default function CrearEventoPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Si hay ID, estamos en modo Edición
  const { crearEvento, actualizarEvento, cargarEventoById, eventoSeleccionado } = useEvento();

  const isEditing = Boolean(id);

  // Estado base del Evento
  const [evento, setEvento] = useState({
    titulo: "",
    categoria: "Academico",
    estado: "Pendiente"
  });

  // Estado para la lista dinámica de Ocurrencias
  const [ocurrencias, setOcurrencias] = useState([
    { fechaInicio: "", fechaFinalizacion: "", lugar: "", cantidadPersonas: 0 }
  ]);

  // Si estamos editando, pedimos los datos al cargar la vista
  useEffect(() => {
    if (isEditing) {
      cargarEventoById(id);
    }
  }, [id]);

  // Cuando los datos del backend llegan, rellenamos el formulario
  useEffect(() => {
    if (isEditing && eventoSeleccionado) {
      setEvento({
        titulo: eventoSeleccionado.titulo || "",
        categoria: eventoSeleccionado.categoria || "Academico",
        estado: eventoSeleccionado.estado || "Pendiente"
      });

      if (eventoSeleccionado.ocurrencias && eventoSeleccionado.ocurrencias.length > 0) {
        const ocurrenciasCargadas = eventoSeleccionado.ocurrencias.map(oc => ({
          id: oc.id || oc.id_ocurrencia, // Guardamos el ID para que el backend sepa cuál actualizar
          fechaInicio: formatParaInputFecha(oc.fechaInicio || oc.fecha_inicio),
          fechaFinalizacion: formatParaInputFecha(oc.fechaFinalizacion || oc.fecha_finalizacion),
          lugar: oc.lugar || "",
          cantidadPersonas: oc.cantidadPersonas || oc.cantidad_personas || 0
        }));
        setOcurrencias(ocurrenciasCargadas);
      }
    }
  }, [eventoSeleccionado, isEditing]);

  const handleAgregarOcurrencia = () => {
    setOcurrencias([
      ...ocurrencias,
      { fechaInicio: "", fechaFinalizacion: "", lugar: "", cantidadPersonas: 0 }
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
    const payload = { ...evento, ocurrencias };

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
          <button className="v2-btn-secondary" onClick={() => navigate("/admin/eventos")}>
            Cancelar
          </button>
          <button className="v2-btn-primary" onClick={handleGuardar}>
            <i className={isEditing ? "fa-solid fa-save" : "fa-solid fa-check"}></i> 
            {isEditing ? " Guardar Cambios" : " Guardar Evento"}
          </button>
        </div>
      }
    >
      <div className="v2-grid-6040">
        {/* Columna Principal: Ocurrencias */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <Card title="Programación y Lugares">
            {ocurrencias.map((oc, idx) => (
              <OcurrenciaBlock
                key={idx}
                index={idx}
                data={oc}
                onChange={handleUpdateOcurrencia}
                onRemove={handleRemoveOcurrencia}
              />
            ))}

            <button
              type="button"
              className="v2-btn-ghost"
              style={{ width: "100%", justifyContent: "center", marginTop: "8px", border: "1.5px dashed var(--gray-300)" }}
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

              {/* Agregamos el selector de Estado (solo útil para editar/crear) */}
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
    </DashboardLayout>
  );
}