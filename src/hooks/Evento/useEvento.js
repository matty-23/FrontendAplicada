import { useState, useEffect } from 'react';
import { eventoService } from '../../services/eventoService';

export const useEvento = () => {
    const [eventos, setEventos] = useState([]);
    const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const cargar = async () => {
            setCargando(true);
            try {
                const data = await eventoService.getEventos();
                setEventos(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);
    const actualizarOcurrencia = async (idEvento, idOcurrencia, dto) => {
        setError(null);

        try {
            const actualizado = await eventoService.actualizarOcurrencia(
                idEvento,
                idOcurrencia,
                dto
            );

            // Actualizamos la ocurrencia dentro del evento local
            setEventos(prev =>
                prev.map(evento => {
                    if (evento.id !== idEvento) {
                        return evento;
                    }

                    return {
                        ...evento,
                        ocurrencias: (evento.ocurrencias || []).map(ocurrencia =>
                            ocurrencia.id === idOcurrencia
                                ? {
                                    ...ocurrencia,
                                    ...dto,
                                }
                                : ocurrencia
                        ),
                    };
                })
            );

            return actualizado;

        } catch (err) {
            setError(err.message);
            throw err;
        }
    };
    const cargarEventoById = async (id) => {
        setCargando(true);
        setError(null);

        try {
            const data = await eventoService.getEventoById(id);

            setEventoSeleccionado(data);

            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setCargando(false);
        }
    };

    const cargarEventos = async () => {
        setCargando(true);
        try {
            const data = await eventoService.getEventos();
            setEventos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarEventos();
    }, []);
    const crearEvento = async (dto) => {
        setError(null);
        try {
            const nuevo = await eventoService.crearEvento(dto);
            setEventos(prev => [...prev, nuevo]);
            return nuevo;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const actualizarEvento = async (id, dto) => {
        setError(null);
        try {
            await eventoService.actualizarEvento(id, dto);
            setEventos(prev => prev.map(e => e.id === id ? { ...e, ...dto } : e));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const eliminarEvento = async (id) => {
        setError(null);
        try {
            await eventoService.eliminarEvento(id);
            setEventos(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const asignarEncargado = async (eventoId, usuarioId) => {
        setError(null);
        try {
            const actualizado = await eventoService.asignarEncargado(eventoId, usuarioId);
            setEventos(prev => prev.map(e => e.id === eventoId ? actualizado : e));
            return actualizado;
        } catch (err) {
            setError(err.message);
        }
    };

    const agregarParticipantes = async (eventoId, participantes) => {
        setError(null);
        try {
            await eventoService.agregarParticipantes(eventoId, participantes);
        } catch (err) {
            setError(err.message);
        }
    };

    const borrarParticipante = async (eventoId, usuarioId) => {
        setError(null);
        try {
            const actualizado = await eventoService.borrarParticipante(eventoId, usuarioId);
            setEventos(prev => prev.map(e => e.id === eventoId ? actualizado : e));
            return actualizado;
        } catch (err) {
            setError(err.message);
        }
    };


    return {
        eventos, eventoSeleccionado,
        cargando, error, cargarEventos,
        cargarEventoById, actualizarOcurrencia,
        crearEvento, actualizarEvento, eliminarEvento,
        asignarEncargado, agregarParticipantes, borrarParticipante,
    };

};
