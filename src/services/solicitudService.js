const BFF_URL = import.meta.env.VITE_BFF_URL ?? 'http://localhost:3001';

export const solicitudService = {

    // GET /api/solicitudes?estado=pendiente&page=1
    async listar(filtros = {}, page = 1) {
        const params = new URLSearchParams({ ...filtros, page: String(page) });
        const response = await fetch(`${BFF_URL}/api/solicitudes?${params.toString()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!response.ok) throw new Error(`Error al listar solicitudes: ${response.status}`);
        return response.json();
    },

    // GET /api/solicitudes/mis?idUsuario=...&page=1
    async listarMias(idUsuario, page = 1) {
        const params = new URLSearchParams({ idUsuario, page: String(page) });
        const response = await fetch(`${BFF_URL}/api/solicitudes/mis?${params.toString()}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!response.ok) throw new Error(`Error al listar mis solicitudes: ${response.status}`);
        return response.json();
    },

    // GET /api/solicitudes/:id
    async obtenerPorId(id) {
        const response = await fetch(`${BFF_URL}/api/solicitudes/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (response.status === 404) return null;
        if (!response.ok) throw new Error(`Error al obtener solicitud: ${response.status}`);
        return response.json();
    },

    // POST /api/solicitudes
    async crear(idUsuario, dto) {
        const response = await fetch(`${BFF_URL}/api/solicitudes?idUsuario=${idUsuario}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dto),
        });
        if (!response.ok) throw new Error(`Error al crear solicitud: ${response.status}`);
        return response.json();
    },

    // PUT /api/solicitudes/:id
    async modificar(id, dto) {
        const response = await fetch(`${BFF_URL}/api/solicitudes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dto),
        });
        if (!response.ok) throw new Error(`Error al modificar solicitud: ${response.status}`);
        return response.json();
    },

    // DELETE /api/solicitudes/:id  → cancela la solicitud
    async cancelar(id) {
        const response = await fetch(`${BFF_URL}/api/solicitudes/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) throw new Error(`Error al cancelar solicitud: ${response.status}`);
        return response.json();
    },

    // PATCH /api/solicitudes/:id/aceptar
    async aceptar(id, dto) {
        const response = await fetch(`${BFF_URL}/api/solicitudes/${id}/aceptar`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dto),
        });
        if (!response.ok) throw new Error(`Error al aceptar solicitud: ${response.status}`);
        return response.json();
    },

    // PATCH /api/solicitudes/:id/rechazar
    async rechazar(id, motivo) {
        const response = await fetch(`${BFF_URL}/api/solicitudes/${id}/rechazar`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ motivo }),
        });
        if (!response.ok) throw new Error(`Error al rechazar solicitud: ${response.status}`);
        return response.json();
    },
};
