import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import KpiCard from "../../components/KpiCard";
import Card from "../../components/Card";
import TabGroup from "../../components/TabGroup";
import EventItem from "../../components/itemsEventos/EventItem";
import SearchInput from "../../components/itemsEventos/SearchInput";
import DateFilter from "../../components/itemsEventos/DateFilter";
import FilterToolbar from "../../components/itemsEventos/FilterToolBar";
import { useNavigate } from "react-router-dom";
import { useEvento } from "../../hooks/useEvento";

const TABS = ["Todos", "Pendientes", "En revisión", "Activos"];

export default function EventosPageV2() {
  const { eventos, cargando, error, eliminarEvento } = useEvento();
  const nav = useNavigate();
  const [tab, setTab] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateQuery, setDateQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
// Estado para la lista dinámica de Ocurrencias
  const [ocurrencias, setOcurrencias] = useState([
    { 
      fechaInicio: "", 
      fechaFinalizacion: "", 
      lugar: "", 
      cantidadPersonas: 0,
      id_encargado: "",     
      participantes: []   
    }
  ]);
const adaptarEventoAUI = (ev) => {
  const titulo = ev.titulo || "Evento sin título";

  // ESTADO
  const estadoRaw = (ev.estado || "pendiente")
    .toLowerCase()
    .trim();

  let estado = "Pendiente";
  let tipo = "orange";

  if (estadoRaw === "activo" || estadoRaw === "active") {
    estado = "Activo";
    tipo = "green";
  } else if (
    estadoRaw === "en revisión" ||
    estadoRaw === "en revision" ||
    estadoRaw === "revision"
  ) {
    estado = "En revisión";
    tipo = "blue";
  }

  // OCURRENCIAS
  const ocurrencias = ev.ocurrencias || [];
  const primeraOc = ocurrencias.length > 0
    ? ocurrencias[0]
    : null;

  let fecha = "Sin fecha";
  let fechaRaw = null;
  let responsable = "Sin asignar";
  let participantesStr = "";

  if (primeraOc) {

    // Fecha
    if (primeraOc.fechaInicio) {
      const d = new Date(primeraOc.fechaInicio);

      fecha = d.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });

      fechaRaw = d.toISOString().split("T")[0];
    }

    // Encargado
    if (primeraOc.encargado) {
      responsable = `${primeraOc.encargado.nombre || ""} ${
        primeraOc.encargado.apellido || ""
      }`.trim();
    }

    // Participantes
    if (
      Array.isArray(primeraOc.participantes)
    ) {
      participantesStr = primeraOc.participantes
        .map(p => `${p.nombre || ""} ${p.apellido || ""}`.trim())
        .join(" ");
    }
  }

  return {
    id: ev.id,
    titulo,
    fecha,
    fechaRaw,
    responsable,
    participantesStr,
    estado,
    tipo,
    ocurrencias
  };
};
  const eventosUI = (eventos || []).map(adaptarEventoAUI);

  const filtered = eventosUI.filter(e => {
    // 1. Filtro por Pestaña (Tab)
    const matchTab =
      tab === "Todos" ? true :
        tab === "Pendientes" ? e.estado === "Pendiente" :
          tab === "En revisión" ? e.estado === "En revisión" :
            e.estado === "Activo";

    // 2. Filtro de Búsqueda Blanda (con @)
    let matchSearch = true;
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase().trim();

      // Verificamos si empieza con '@' referenciando a un usuario
      if (searchLower.startsWith('@')) {
        const userQuery = searchLower.substring(1).trim(); // Quitamos el '@'
        const matchResponsable = e.responsable.toLowerCase().includes(userQuery);
        const matchParticipantes = e.participantesStr.toLowerCase().includes(userQuery);
        // Solo debe coincidir con el personal involucrado
        matchSearch = matchResponsable || matchParticipantes;
      } else {
        // Búsqueda normal: por título o responsable
        matchSearch =
          e.titulo.toLowerCase().includes(searchLower) ||
          e.responsable.toLowerCase().includes(searchLower);
      }
    }
    // 3. Filtro por la fecha de la primera ocurrencia
    let matchDate = true;
    if (dateQuery) {
      matchDate = e.ocurrencias?.some(oc => oc.fechaInicio && oc.fechaInicio.startsWith(dateQuery));
    }
    return matchTab && matchSearch && matchDate;
  });

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(e => e.id));
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar ${selectedIds.length} eventos?`)) {
      try {
        await Promise.all(selectedIds.map(id => eliminarEvento(id)));
        setSelectedIds([]);
      } catch (err) {
        alert("Hubo un error al eliminar algunos eventos.");
      }
    }
  };

  const rightActions = (
    <button className="v2-btn-primary" onClick={() => nav('/admin/eventos/crear')}>
      <i className="fa-solid fa-plus"></i> Nuevo
    </button>
  );

  return (
    <DashboardLayout breadcrumb="Gestión / Eventos" title="Gestión de Eventos" rightActions={rightActions}>

      {/* 1. KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 22 }}>
        <KpiCard label="Eventos activos" value={eventosUI.filter(e => e.estado === 'Activo').length} icon="fa-ticket" colorClass="k-blue" />
        <KpiCard label="Pendientes apro." value={eventosUI.filter(e => e.estado === 'Pendiente').length} icon="fa-clock" colorClass="k-yellow" />
        <KpiCard label="En revisión" value={eventosUI.filter(e => e.estado === 'En revisión').length} icon="fa-magnifying-glass" colorClass="k-orange" />
      </div>

      {/* 2. Barra de Herramientas de Filtrado */}
      <FilterToolbar
        leftContent={
          <TabGroup tabs={TABS} activeTab={tab} onTabChange={setTab} />
        }
        rightContent={
          <>
            <SearchInput placeholder="Buscar evento..." value={searchQuery} onChange={setSearchQuery} />
            <DateFilter value={dateQuery} onChange={setDateQuery} />
            <select className="v2-select">
              <option>Más recientes</option>
              <option>Más antiguos</option>
              <option>A - Z</option>
            </select>
          </>
        }
      />

      {/* 3. Lista de Resultados con Selección en Lote */}
      <Card bodyStyle={{ padding: "8px 22px 22px 22px" }}>

        {filtered.length > 0 && !cargando && !error && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid var(--gray-100)", marginBottom: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input
                type="checkbox"
                style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--blue-800)" }}
                checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                onChange={toggleAll}
              />
              <span style={{ fontSize: "13px", color: "var(--gray-500)", fontWeight: 600 }}>
                {selectedIds.length > 0 ? `${selectedIds.length} seleccionados` : "Seleccionar todos"}
              </span>
            </div>

            {selectedIds.length > 0 && (
              <button
                className="v2-btn-secondary"
                style={{ color: "var(--red-500)", borderColor: "var(--red-200)", background: "var(--red-50)", padding: "6px 14px" }}
                onClick={handleBulkDelete}
              >
                <i className="fa-regular fa-trash-can"></i> Eliminar
              </button>
            )}
          </div>
        )}

        <div className="v2-event-list">
          {cargando ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--blue-500)" }}>
              <i className="fa-solid fa-circle-notch fa-spin fa-2x"></i>
              <p style={{ marginTop: "10px", fontWeight: 600 }}>Cargando eventos...</p>
            </div>
          ) : error ? (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--red-500)", background: "var(--red-100)", borderRadius: "8px" }}>
              <i className="fa-solid fa-circle-exclamation"></i> Error de conexión: {error}
            </div>
          ) : filtered.length > 0 ? (
            filtered.map(e => (
              <EventItem
                key={e.id}
                id={e.id}
                titulo={e.titulo}
                fecha={e.fecha}
                responsable={e.responsable}
                estado={e.estado}
                tipo={e.tipo}
                isSelected={selectedIds.includes(e.id)}
                onSelect={toggleSelection}
                onEdit={(id) => nav(`/admin/eventos/editar/${id}`)}
                onView={(id) => nav(`/admin/eventos/${id}`)}
              />
            ))
          ) : (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--gray-500)" }}>
              <i className="fa-regular fa-folder-open fa-2x" style={{ marginBottom: "10px", opacity: 0.5 }}></i>
              <p>No se encontraron eventos que coincidan con los filtros.</p>
            </div>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}