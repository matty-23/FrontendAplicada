// ─────────────────────────────────────────────────────────────────────────────
// eventoService.js
// Servicio de capa de datos para el módulo de Eventos.
// Conecta el Frontend con el BFF (Backend for Frontend) a través de la API REST.
// Base URL del BFF: http://localhost:3001
// ─────────────────────────────────────────────────────────────────────────────

const BFF_BASE_URL = import.meta.env.VITE_BFF_URL ?? 'http://localhost:3001';
const ENDPOINT = `${BFF_BASE_URL}/api/eventos`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Maneja la respuesta HTTP y lanza un error descriptivo si no es exitosa.
 * @param {Response} response
 * @returns {Promise<any>}
 */
async function handleResponse(response) {
  if (!response.ok) {
    let mensaje = `Error ${response.status}: ${response.statusText}`;
    try {
      const data = await response.json();
      if (data?.message) {
        mensaje = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;
      }
    } catch {
      // Si el cuerpo no es JSON (ej. 204 No Content), ignorar
    }
    throw new Error(mensaje);
  }

  // 204 No Content → no hay cuerpo para parsear
  if (response.status === 204) return null;

  return response.json();
}

// ─── Operaciones CRUD ─────────────────────────────────────────────────────────

/**
 * Obtiene todos los eventos.
 * GET /api/eventos
 * @returns {Promise<Evento[]>}
 */
export async function getEventos() {
  const response = await fetch(ENDPOINT);
  return handleResponse(response);
}

/**
 * Obtiene un evento por su ID.
 * GET /api/eventos/:id
 * @param {string} id
 * @returns {Promise<Evento>}
 */
export async function getEventoById(id) {
  const response = await fetch(`${ENDPOINT}/${id}`);
  return handleResponse(response);
}

/**
 * Crea un nuevo evento.
 * POST /api/eventos
 *
 * @param {Object} dto - CrearEventoDTO
 * @param {string}   dto.titulo               - Título del evento (obligatorio).
 * @param {string}   dto.fechaInicio           - Fecha de inicio ISO 8601 (obligatorio).
 * @param {string}   dto.fechaFin              - Fecha de fin ISO 8601 (obligatorio).
 * @param {string}   [dto.solicitanteId]       - ID del usuario solicitante.
 * @param {string}   [dto.responsableId]       - ID del usuario responsable/encargado.
 * @param {string}   [dto.tipoEvento]          - Tipo/categoría del evento.
 * @param {string}   [dto.descripcion]         - Descripción libre del evento.
 * @param {number}   [dto.cantidadPersonas]    - Cantidad estimada de personas.
 * @param {string}   [dto.solicitudOrigenId]   - ID de la solicitud de origen (si aplica).
 * @param {Array}    [dto.bloquesDiasHorarioLugar] - Bloques día + horario + lugar.
 * @returns {Promise<Evento>}
 */
export async function crearEvento(dto) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  return handleResponse(response);
}

/**
 * Actualiza un evento existente.
 * PUT /api/eventos/:id
 * @param {string} id
 * @param {Object} dto - ActualizarEventoDTO (campos parciales del evento)
 * @returns {Promise<null>} - 204 No Content
 */
export async function actualizarEvento(id, dto) {
  const response = await fetch(`${ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  return handleResponse(response);
}

/**
 * Elimina un evento por su ID.
 * DELETE /api/eventos/:id
 * @param {string} id
 * @returns {Promise<null>} - 204 No Content
 */
export async function eliminarEvento(id) {
  const response = await fetch(`${ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

// ─── Operaciones de Participantes ─────────────────────────────────────────────

/**
 * Asigna un encargado a un evento.
 * PATCH /api/eventos/:id/encargado
 * @param {string} eventoId
 * @param {string} usuarioId
 * @returns {Promise<Evento>}
 */
export async function asignarEncargado(eventoId, usuarioId) {
  const response = await fetch(`${ENDPOINT}/${eventoId}/encargado`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuarioId }),
  });
  return handleResponse(response);
}

/**
 * Agrega participantes a un evento.
 * PATCH /api/eventos/:id/participantes
 * @param {string}   eventoId
 * @param {string[]} participantes - Array de IDs de usuarios a agregar.
 * @returns {Promise<null>} - 204 No Content
 */
export async function agregarParticipantes(eventoId, participantes) {
  const response = await fetch(`${ENDPOINT}/${eventoId}/participantes`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ participantes }),
  });
  return handleResponse(response);
}

/**
 * Elimina un participante de un evento.
 * DELETE /api/eventos/:id/participantes/:usuarioId
 * @param {string} eventoId
 * @param {string} usuarioId
 * @returns {Promise<Evento>}
 */
export async function borrarParticipante(eventoId, usuarioId) {
  const response = await fetch(`${ENDPOINT}/${eventoId}/participantes/${usuarioId}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}
