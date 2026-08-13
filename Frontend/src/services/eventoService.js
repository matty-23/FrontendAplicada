const BFF_URL = import.meta.env.VITE_BFF_URL ?? 'http://localhost:3001';

export const eventoService = {

    // CRUD

    async getEventos() {
        const response = await fetch(`${BFF_URL}/api/eventos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Error al obtener los eventos: ${response.status}`);
        }

        return response.json();
    },

    async getEventoById(id) {
        const response = await fetch(`${BFF_URL}/api/eventos/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el evento: ${response.status}`);
        }

        return response.json();
    },

    async crearEvento(dto) {
        const response = await fetch(`${BFF_URL}/api/eventos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            throw new Error(`Error al crear el evento: ${response.status}`);
        }

        return response.json();
    },

    async actualizarEvento(id, dto) {
        const response = await fetch(`${BFF_URL}/api/eventos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el evento: ${response.status}`);
        }

        // 204 No Content — el BFF no devuelve cuerpo
        return null;
    },

    async eliminarEvento(id) {
        const response = await fetch(`${BFF_URL}/api/eventos/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el evento: ${response.status}`);
        }

        // 204 No Content — el BFF no devuelve cuerpo
        return null;
    },

    // Participantes

    async asignarEncargado(eventoId, usuarioId) {
        const response = await fetch(`${BFF_URL}/api/eventos/${eventoId}/encargado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ usuarioId }),
        });

        if (!response.ok) {
            throw new Error(`Error al asignar encargado: ${response.status}`);
        }

        return response.json();
    },

    async agregarParticipantes(eventoId, participantes) {
        const response = await fetch(`${BFF_URL}/api/eventos/${eventoId}/participantes`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ participantes }),
        });

        if (!response.ok) {
            throw new Error(`Error al agregar participantes: ${response.status}`);
        }

        // 204 No Content — el BFF no devuelve cuerpo
        return null;
    },

    async borrarParticipante(eventoId, usuarioId) {
        const response = await fetch(`${BFF_URL}/api/eventos/${eventoId}/participantes/${usuarioId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Error al borrar participante: ${response.status}`);
        }

        return response.json();
    },
};
