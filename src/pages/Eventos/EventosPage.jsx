import DashboardLayout from "../../components/DashboardLayout";
import KpiCard from "../../components/KpiCard";
import Card from "../../components/Card";
import TabGroup from "../../components/TabGroup";
import EventItem from "../../components/itemsEventos/EventItem";
import SearchInput from "../../components/itemsEventos/SearchInput";
import DateFilter from "../../components/itemsEventos/DateFilter";
import FilterToolbar from "../../components/itemsEventos/FilterToolBar";
import { rightActions } from "../../utils/rightActions";
import { useNavigate } from "react-router-dom";
import { useEvento } from "../../hooks/Evento/useEvento";
import { useEventosFilter } from "../../hooks/Evento/useEventosFilter";
import { useEventosSelection } from "../../hooks/Evento/useEventosSelection";

import {adaptarEventoAUI,obtenerFechasConEventos} from "../../utils/eventoUtils";
import '../../styles/EventoPages.css'
const TABS = ["Todos", "Pendientes", "En revisión", "Activos"];

export default function EventosPage() {
  const {
    eventos,
    cargando,
    error,
    eliminarEvento,
  } = useEvento();

  const nav = useNavigate();

  // =========================
  // ADAPTAR EVENTOS
  // =========================

  const eventosUI =
    (eventos || []).map(adaptarEventoAUI);

  // =========================
  // FILTROS
  // =========================

  const {
    tab,
    setTab,
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    filtered,
  } = useEventosFilter(eventosUI);

  // =========================
  // SELECCIÓN
  // =========================

  const {
    selectedIds,
    toggleSelection,
    toggleAll,
    handleBulkDelete,
  } = useEventosSelection(
    filtered,
    eliminarEvento
  );

  // =========================
  // FECHAS CON EVENTOS
  // =========================

  const fechasConEventos =
    obtenerFechasConEventos(eventosUI);

  // =========================
  // ACCIONES
  // =========================

  

  return (
    <DashboardLayout
      breadcrumb="Gestión / Eventos"
      title="Gestión de Eventos"
      rightActions={rightActions("Nuevo","/admin/eventos/crear")}
    >

      {/* =========================
          KPIs
          ========================= */}

      <div className="eventos-kpi-grid">
        <KpiCard
          label="Eventos activos"
          value={
            eventosUI.filter(
              (e) => e.estado === "Activo"
            ).length
          }
          icon="fa-ticket"
          colorClass="k-blue"
        />

        <KpiCard
          label="Pendientes apro."
          value={
            eventosUI.filter(
              (e) => e.estado === "Pendiente"
            ).length
          }
          icon="fa-clock"
          colorClass="k-yellow"
        />

        <KpiCard
          label="En revisión"
          value={
            eventosUI.filter(
              (e) => e.estado === "En revisión"
            ).length
          }
          icon="fa-magnifying-glass"
          colorClass="k-orange"
        />
      </div>


      {/* =========================
          FILTROS
          ========================= */}

      <FilterToolbar
        leftContent={
          <TabGroup
            tabs={TABS}
            activeTab={tab}
            onTabChange={setTab}
          />
        }
        rightContent={
          <>
            <SearchInput
              placeholder="Buscar evento..."
              value={searchQuery}
              onChange={setSearchQuery}
            />

            <DateFilter
              value={dateRange}
              onChange={setDateRange}
              eventDates={fechasConEventos}
            />

            <select className="v2-select">
              <option>Más recientes</option>
              <option>Más antiguos</option>
              <option>A - Z</option>
            </select>
          </>
        }
      />


      {/* =========================
          LISTA DE EVENTOS
          ========================= */}

      <Card bodyStyle={{ padding: "8px 22px 22px 22px" }}>

        {/* SELECCIÓN */}

        {filtered.length > 0 &&
          !cargando &&
          !error && (

            <div className="eventos-selection-bar">

              <div className="eventos-selection-left">

                <input
                  type="checkbox"
                  className="eventos-select-all"
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length === filtered.length
                  }
                  onChange={toggleAll}
                />

                <span className="eventos-selection-text">
                  {selectedIds.length > 0
                    ? `${selectedIds.length} seleccionados`
                    : "Seleccionar todos"}
                </span>

              </div>


              {selectedIds.length > 0 && (
                <button
                  className="v2-btn-secondary eventos-delete-button"
                  onClick={handleBulkDelete}
                >
                  <i className="fa-regular fa-trash-can"></i>
                  Eliminar
                </button>
              )}

            </div>
          )}


        {/* EVENTOS */}

        <div className="v2-event-list eventos-list">

          {cargando ? (

            <div className="eventos-loading">

              <i className="fa-solid fa-circle-notch fa-spin fa-2x"></i>

              <p className="eventos-loading-text">
                Cargando eventos...
              </p>

            </div>

          ) : error ? (

            <div className="eventos-error">

              <i className="fa-solid fa-circle-exclamation"></i>

              {" "}Error de conexión: {error}

            </div>

          ) : filtered.length > 0 ? (

            filtered.map((e) => (
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
                onEdit={(id) =>
                  nav(`/admin/eventos/editar/${id}`)
                }
                onView={(id) =>
                  nav(`/admin/eventos/${id}`)
                }
              />
            ))

          ) : (

            <div className="eventos-empty">

              <i
                className="fa-regular fa-folder-open fa-2x eventos-empty-icon"
              ></i>

              <p>
                No se encontraron eventos que
                coincidan con los filtros.
              </p>

            </div>

          )}

        </div>

      </Card>

    </DashboardLayout>
  );
}