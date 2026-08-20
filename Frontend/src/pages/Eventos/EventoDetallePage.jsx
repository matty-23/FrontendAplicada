import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/Card";
import { useEvento } from "../../hooks/useEvento";

export default function EventoDetallePage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { eventoSeleccionado: evento, cargarEventoById, cargando, error } = useEvento();

  useEffect(() => {
    if (id) {
      cargarEventoById(id);
    }
  }, [id]);

  if (cargando) {
    return (
      <DashboardLayout breadcrumb="Gestión / Eventos / Detalle" title="Cargando...">
        <div style={{ padding: "40px", textAlign: "center", color: "var(--blue-500)" }}>
          <i className="fa-solid fa-circle-notch fa-spin fa-3x"></i>
          <p style={{ marginTop: "15px", fontWeight: 600 }}>Obteniendo detalles del evento...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !evento) {
    return (
      <DashboardLayout breadcrumb="Gestión / Eventos / Detalle" title="Error">
        <div style={{ padding: "20px", textAlign: "center", color: "var(--red-500)", background: "var(--red-100)", borderRadius: "8px" }}>
          <i className="fa-solid fa-circle-exclamation fa-2x"></i>
          <p style={{ marginTop: "10px", fontWeight: 600 }}>{error || "Evento no encontrado."}</p>
          <button className="v2-btn-secondary" style={{ marginTop: "15px" }} onClick={() => nav("/admin/eventos")}>
            Volver a Eventos
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Lógica para los estilos del Badge de estado
  const estadoRaw = (evento.estado || "pendiente").toLowerCase().trim();
  let badgeClass = "b-pending";
  let estadoTexto = "Pendiente";

  if (estadoRaw === "activo" || estadoRaw === "active") {
    badgeClass = "b-active";
    estadoTexto = "Activo";
  } else if (estadoRaw === "en revisión" || estadoRaw === "en revision") {
    badgeClass = "b-review";
    estadoTexto = "En revisión";
  }

  const rightActions = (
    <div style={{ display: "flex", gap: "10px" }}>
      <button className="v2-btn-secondary" onClick={() => nav("/admin/eventos")}>
        <i className="fa-solid fa-arrow-left"></i> Volver
      </button>
      <button className="v2-btn-ghost" style={{ color: "var(--gray-600)", borderColor: "var(--gray-300)" }}>
        <i className="fa-solid fa-pen"></i> Editar
      </button>
    </div>
  );

  return (
    <DashboardLayout 
      breadcrumb="Gestión / Eventos / Detalle" 
      title={evento.titulo || "Detalle del Evento"} 
      rightActions={rightActions}
    >
      <div className="v2-grid-6040">
        
        {/* COLUMNA IZQUIERDA: Info General y Ocurrencias */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          
          {/* Card de Resumen */}
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h2 style={{ fontSize: "22px", color: "var(--blue-900)", marginBottom: "4px" }}>
                  {evento.titulo}
                </h2>
                <div style={{ fontSize: "13px", color: "var(--gray-500)", display: "flex", gap: "15px" }}>
                  <span><i className="fa-solid fa-tag"></i> {evento.categoria}</span>
                  <span><i className="fa-solid fa-fingerprint"></i> ID: {evento.id.substring(0, 8)}...</span>
                </div>
              </div>
              <span className={`v2-badge ${badgeClass}`} style={{ fontSize: "14px", padding: "6px 12px" }}>
                {estadoTexto}
              </span>
            </div>
          </Card>

          {/* Card de Ocurrencias (Fechas y Lugares) */}
          <Card title="Programación y Lugares" subtitle={`${evento.ocurrencias?.length || 0} fechas programadas`}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "10px" }}>
              {evento.ocurrencias?.map((oc, idx) => {
                const fechaInicio = new Date(oc.fecha_inicio || oc.fechaInicio).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
                const fechaFin = new Date(oc.fecha_finalizacion || oc.fechaFinalizacion).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });

                return (
                  <div key={idx} style={{ borderLeft: "4px solid var(--blue-500)", background: "var(--gray-50)", padding: "16px", borderRadius: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                      <span style={{ fontWeight: 700, color: "var(--gray-800)" }}>Ocurrencia #{idx + 1}</span>
                      <span style={{ fontSize: "12px", color: "var(--gray-500)", fontWeight: 600 }}>
                        <i className="fa-solid fa-users"></i> {oc.cantidad_personas || oc.cantidadPersonas || 0} personas
                      </span>
                    </div>
                    
                    <div className="v2-grid-2">
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--gray-400)", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Inicio</span>
                        <span style={{ fontSize: "14px", color: "var(--gray-800)", fontWeight: 500 }}>{fechaInicio}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: "11px", color: "var(--gray-400)", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Fin</span>
                        <span style={{ fontSize: "14px", color: "var(--gray-800)", fontWeight: 500 }}>{fechaFin}</span>
                      </div>
                      <div style={{ gridColumn: "span 2", marginTop: "6px" }}>
                        <span style={{ fontSize: "11px", color: "var(--gray-400)", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Lugar</span>
                        <span style={{ fontSize: "14px", color: "var(--gray-800)", fontWeight: 500 }}>
                          <i className="fa-solid fa-location-dot" style={{ color: "var(--blue-400)" }}></i> {oc.lugar || "Sin especificar"}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {!evento.ocurrencias || evento.ocurrencias.length === 0 && (
                <p style={{ color: "var(--gray-500)", textAlign: "center", fontStyle: "italic" }}>No hay fechas programadas.</p>
              )}
            </div>
          </Card>

        </div>

        {/* COLUMNA DERECHA: Personal Asignado */}
        <div>
          <Card title="Personal Asignado">
            {evento.ocurrencias?.map((oc, idx) => (
              <div key={idx} style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: idx !== evento.ocurrencias.length - 1 ? "1px solid var(--gray-200)" : "none" }}>
                <h4 style={{ fontSize: "13px", color: "var(--gray-500)", marginBottom: "12px", textTransform: "uppercase" }}>Ocurrencia #{idx + 1}</h4>
                
                {/* Encargado */}
                <div style={{ marginBottom: "16px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--gray-600)", display: "block", marginBottom: "6px" }}>Encargado/a</span>
                  {oc.encargado ? (
                    <div className="v2-user-card" style={{ background: "var(--gray-50)", border: "1px solid var(--gray-200)" }}>
                      <div className="v2-user-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                        {oc.encargado.nombre.charAt(0)}{oc.encargado.apellido.charAt(0)}
                      </div>
                      <div className="v2-user-info">
                        <div className="v2-user-name" style={{ color: "var(--gray-800)", fontSize: 13 }}>{oc.encargado.nombre} {oc.encargado.apellido}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: "13px", color: "var(--red-500)", background: "var(--red-50)", padding: "8px 12px", borderRadius: "8px", border: "1px dashed var(--red-200)" }}>
                      <i className="fa-solid fa-triangle-exclamation"></i> Sin encargado asignado
                    </div>
                  )}
                </div>

                {/* Participantes */}
                <div>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--gray-600)", display: "block", marginBottom: "6px" }}>
                    Participantes ({oc.participantes?.length || 0})
                  </span>
                  
                  {oc.participantes && oc.participantes.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {oc.participantes.map((p, pIdx) => (
                        <div key={pIdx} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", background: "white", border: "1px solid var(--gray-200)", borderRadius: "8px" }}>
                          <div style={{ width: 6, height: 6, background: "var(--blue-500)", borderRadius: "50%" }}></div>
                          <span style={{ fontSize: "13px", color: "var(--gray-800)", fontWeight: 500 }}>{p.nombre} {p.apellido}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: "12px", color: "var(--gray-400)" }}>No hay participantes inscriptos.</p>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}