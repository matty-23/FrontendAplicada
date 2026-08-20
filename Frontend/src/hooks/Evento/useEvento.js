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

    const cargarEventoById = async (id) => {
        setCargando(true);
        setError(null);
        try {
            const data = await eventoService.getEventoById(id);
            setEventoSeleccionado(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };

    const crearEvento = async (dto) => {
        setError(null);
        try {
            const nuevo = await eventoService.crearEvento(dto);
            setEventos(prev => [...prev, nuevo]);
            return nuevo;
        } catch (err) {
            setError(err.message);
        }
    };

    const actualizarEvento = async (id, dto) => {
        setError(null);
        try {
            await eventoService.actualizarEvento(id, dto);
            setEventos(prev => prev.map(e => e.id === id ? { ...e, ...dto } : e));
        } catch (err) {
            setError(err.message);
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
        cargando, error,
        cargarEventoById,
        crearEvento, actualizarEvento, eliminarEvento,
        asignarEncargado, agregarParticipantes, borrarParticipante,
    };

};
