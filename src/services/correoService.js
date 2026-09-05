const getApiUrl = () => import.meta.env.VITE_BFF_URL;
export class CorreoService {
    constructor() { }

    async notificaciones(destinatarios, asunto = null, mensaje = null, archivosAdjuntos = null) {
        const url = `${getApiUrl()}/api/correo/notificacion`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    destinatarios: destinatarios,
                    ...(asunto && { asunto: asunto }),
                    ...(mensaje && { mensajeHtml: mensaje }),
                    prioridad: "baja",
                    ...(archivosAdjuntos && { archivosAdjuntos: archivosAdjuntos })
                }),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data?.message || 'Error al enviar la notificacion');
            return data;
        } catch (error) {
            throw error;
        }
    }

    async confirmacionEvento(destinatarios, asunto, mensaje, archivosAdjuntos = null) {
        const url = `${getApiUrl()}/api/correo/cuenta/confirmacion`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    destinatarios: destinatarios,
                    asunto: asunto,
                    mensajeConfirmacion: mensaje
                }),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data?.message || 'Error al enviar la notificacion');
            return data;
        } catch (error) {
            throw error;
        }
    }

    async confirmacionEvento(destinatarios, asunto, mensaje) {
        const url = `${getApiUrl()}/api/correo/solicitud/confirmacion`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    destinatarios: destinatarios,
                    ...(asunto && { asunto: asunto }),
                    ...(mensaje && { mensajeHtml: mensaje }),
                    prioridad: "alta",
                    ...(archivosAdjuntos && { archivosAdjuntos: archivosAdjuntos })
                }),
            });
            const data = await response.json();

            if (!response.ok) throw new Error(data?.message || 'Error al enviar la notificacion');
            return data;
        } catch (error) {
            throw error;
        }
    }
}