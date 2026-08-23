import { useEffect, useState } from "react";
import { useEvento } from "./useEvento";
import {
  formatParaInputFecha,
  generarIdLocal,
} from "../../utils/eventoUtils";

export function useEventoForm(id) {

  const {
    crearEvento,
    actualizarEvento,
    cargarEventoById,
    eventoSeleccionado,
  } = useEvento();

  const isEditing = Boolean(id);

  // EVENTO

  const [evento, setEvento] = useState({
    titulo: "",
    categoria: "Academico",
    estado: "Pendiente",
  });


  // OCURRENCIAS
  const [ocurrencias, setOcurrencias] = useState([
    {
      idLocal: generarIdLocal(),
      fechaInicio: "",
      fechaFinalizacion: "",
      lugar: "",
      cantidadPersonas: 0,
      id_encargado: "",
      participantes: [],
    },
  ]);


  // CARGAR EVENTO
  useEffect(() => {
    if (isEditing) {
      cargarEventoById(id);
    }
  }, [id, isEditing]);

  // CARGAR DATOS EN FORMULARIO
  useEffect(() => {
    if (!isEditing || !eventoSeleccionado || String(eventoSeleccionado.id) !== String(id) ) {
      return;
    }

    setEvento({
      titulo: eventoSeleccionado.titulo || "",
      categoria: eventoSeleccionado.categoria || "Academico",
      estado: eventoSeleccionado.estado || "Pendiente",
    });


    if (eventoSeleccionado.ocurrencias && eventoSeleccionado.ocurrencias.length > 0) {
      const ocurrenciasCargadas = eventoSeleccionado.ocurrencias.map((oc) => {
          const encargado = oc.encargado || null;
          const participantes =  Array.isArray(oc.participantes)? oc.participantes:[];
          return {
            // ID real de la ocurrencia
            id: oc.id ||oc.id_ocurrencia,

            // ID para React
            idLocal: oc.id ||oc.id_ocurrencia ||   generarIdLocal(),

            // FECHAS
            fechaInicio: formatParaInputFecha(   oc.fechaInicio ||  oc.fecha_inicio ),
            fechaFinalizacion: formatParaInputFecha(oc.fechaFinalizacion ||oc.fecha_finalizacion),

            // DATOS
            lugar: oc.lugar || "",
            cantidadPersonas: oc.cantidadPersonas ?? oc.cantidad_personas ?? 0,

            // ENCARGADO
            id_encargado: oc.id_encargado ||  encargado?.id ||  encargado?.id_usuario || encargado?.usuarioId ||  "",
            encargadoSeleccionado:  encargado,

            // PARTICIPANTES
            participantes: participantes.map((p) => {
                  if (typeof p === "string") {
                    return p;
                  }
                  return ( p.id ||p.id_usuario || p.usuarioId);
                }).filter(Boolean),

            participantesSeleccionados: participantes,
          };
        });

      setOcurrencias(ocurrenciasCargadas);
    }

  }, [eventoSeleccionado, isEditing,id,]);

  // ACTUALIZAR EVENTO
  const actualizarCampoEvento = (campo, valor) => {
    setEvento((prev) => ({
      ...prev, [campo]: valor, }));
  };


  // AGREGAR OCURRENCIA
  const agregarOcurrencia = () => {
    setOcurrencias((prev) => [
      ...prev,
      {
        idLocal: generarIdLocal(),
        fechaInicio: "",
        fechaFinalizacion: "",
        lugar: "",
        cantidadPersonas: 0,
        id_encargado: "",
        participantes: [],
      },
    ]);

  };


  // ACTUALIZAR OCURRENCIA

  const actualizarOcurrencia = (index, newData) => {
    setOcurrencias((prev) => {
      const updated = [...prev];
      updated[index] = newData;
      return updated;
    });

  };

  // ELIMINAR OCURRENCIA
  const eliminarOcurrencia = (index) => {
    setOcurrencias((prev) => prev.filter((_, i) => i !== index) );
  };


  // GUARDAR
  const guardarEvento = async () => {
    const ocurrenciasFormateadas =
      ocurrencias.map( ({ idLocal, ...oc }) => ({
          ...oc,
          fechaInicio: oc.fechaInicio ? new Date(oc.fechaInicio).toISOString() : null,
          fechaFinalizacion:
            oc.fechaFinalizacion? new Date( oc.fechaFinalizacion).toISOString():null,
        })
      );


    const payload = {
      ...evento,
      ocurrencias: ocurrenciasFormateadas,
    };


    if (isEditing) {
      await actualizarEvento(id, payload);
    } else {
      await crearEvento(payload);
    }

  };

  return {
    evento,
    ocurrencias,
    isEditing,
    actualizarCampoEvento,
    agregarOcurrencia,
    actualizarOcurrencia,
    eliminarOcurrencia,
    guardarEvento,
  };
}