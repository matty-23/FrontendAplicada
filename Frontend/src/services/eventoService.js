const BFF_URL = import.meta.env.VITE_BFF_URL ?? 'http://localhost:3001';

export const eventoService = {

    // CRUD

    async getEventos() {
        const token = localStorage.getItem('token');

        const response = await fetch(`${BFF_URL}/api/eventos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error al obtener los eventos: ${response.status}`);
        }

        return response.json();
    },

    async getEventoById(id) {
        const token = localStorage.getItem('token');

        const response = await fetch(`${BFF_URL}/api/eventos/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el evento: ${response.status}`);
        }

        return response.json();
    },

    async crearEvento(dto) {
        const token = localStorage.getItem('token');

        const response = await fetch(`${BFF_URL}/api/eventos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            throw new Error(`Error al crear el evento: ${response.status}`);
        }

        return response.json();
    },

    async actualizarEvento(id, dto) {
        const token = localStorage.getItem('token');

        const response = await fetch(`${BFF_URL}/api/eventos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar el evento: ${response.status}`);
        }

        return response.json();
    },

    async eliminarEvento(id) {
        const token = localStorage.getItem('token');

        const response = await fetch(`${BFF_URL}/api/eventos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar el evento: ${response.status}`);
        }

        return response.json();
    },

    // Participantes

    async asignarEncargado(eventoId, usuarioId) {
        const token = localStorage.getItem('token');

        const response = await fetch(`${BFF_URL}/api/eventos/${eventoId}/encargado`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ usuarioId }),
        });

        if (!response.ok) {
            throw new Error(`Error al asignar encargado: ${response.status}`);
        }

        return response.json();
    },

    async agregarParticipantes(eventoId, participantes) {
        const token = localStorage.getItem('token');

        const response = await fetch(`${BFF_URL}/api/eventos/${eventoId}/participantes`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ participantes }),
        });

        if (!response.ok) {
            throw new Error(`Error al agregar participantes: ${response.status}`);
        }

        return response.json();
    },

    async borrarParticipante(eventoId, usuarioId) {
        const token = localStorage.getItem('token');

        const response = await fetch(`${BFF_URL}/api/eventos/${eventoId}/participantes/${usuarioId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error al borrar participante: ${response.status}`);
        }

        return response.json();
    },
};
