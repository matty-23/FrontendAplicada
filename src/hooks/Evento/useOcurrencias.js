import { useCallback, useState } from "react";
import { agruparOcurrencias } from "../../utils/agruparOcurrencias";

const generarIdLocal = () => crypto.randomUUID();

function crearOcurrenciaBase(datos = {}) {
  return {
    idLocal: datos.idLocal || generarIdLocal(),
    fechaInicio: datos.fechaInicio || "",
    fechaFinalizacion: datos.fechaFinalizacion || datos.fechaInicio || "",
    lugar: datos.lugar || "",
    cantidadPersonas: datos.cantidadPersonas ?? 0,
    id_encargado: datos.id_encargado || "",
    participantes: datos.participantes || [],
    participantesSeleccionados: datos.participantesSeleccionados || [],
    comentarios: datos.comentarios || [],
    personalizado: datos.personalizado || {},
  };
}

export function useOcurrencias(ocurrenciasIniciales = []) {
  const [ocurrencias, setOcurrencias] = useState(ocurrenciasIniciales.map(crearOcurrenciaBase));

  // ESTABLECER TODAS LAS OCURRENCIAS
  const establecerOcurrencias = useCallback(
    (nuevasOcurrencias = []) => { setOcurrencias(nuevasOcurrencias.map(crearOcurrenciaBase)); },
    []
  );

  // AGREGAR UN RANGO DE FECHAS 
  const agregarRango = useCallback(
    (fechaInicio, fechaFin, datosIniciales = {}) => {
      if (!fechaInicio || !fechaFin) return [];

      // En lugar de dividirlo por días, creamos UNA ocurrencia que abarque todo el rango
      const nueva = crearOcurrenciaBase({
        ...datosIniciales,
        fechaInicio: fechaInicio,
        fechaFinalizacion: fechaFin,
      });

      setOcurrencias([nueva]);
      return [nueva];
    },
    []
  );


  // DESAGRUPAR/SEPARAR RANGO EN DÍAS INDIVIDUALES
  const separarOcurrencia = useCallback((idLocal) => {
    setOcurrencias((prev) => {
      const targetIndex = prev.findIndex((oc) => oc.idLocal === idLocal);
      if (targetIndex === -1) return prev;

      const target = prev[targetIndex];

      // Extraer solo la fecha (YYYY-MM-DD)
      const fechaStrInicio = target.fechaInicio.split("T")[0];
      const fechaStrFin = target.fechaFinalizacion.split("T")[0];

      const fInicio = new Date(`${fechaStrInicio}T00:00:00`);
      const fFin = new Date(`${fechaStrFin}T00:00:00`);

      // Si es el mismo día, no hay nada que separar
      if (fInicio.getTime() === fFin.getTime()) return prev;

      // Mantener la hora si el usuario ya la había modificado
      const timeInicio = target.fechaInicio.includes("T") ? target.fechaInicio.split("T")[1] : "";
      const timeFin = target.fechaFinalizacion.includes("T") ? target.fechaFinalizacion.split("T")[1] : "";

      const nuevasOcurrencias = [];
      const actual = new Date(fInicio);

      while (actual <= fFin) {
        const fechaStr = actual.toISOString().split("T")[0];
        nuevasOcurrencias.push(
          crearOcurrenciaBase({
            ...target, // Heredamos todos los datos (lugar, personas, encargado, etc)
            idLocal: crypto.randomUUID(), // Generamos IDs nuevos
            fechaInicio: timeInicio ? `${fechaStr}T${timeInicio}` : fechaStr,
            fechaFinalizacion: timeFin ? `${fechaStr}T${timeFin}` : fechaStr,
          })
        );
        actual.setDate(actual.getDate() + 1);
      }

      // Reemplazar la ocurrencia original por la lista de días separados
      const nuevoState = [...prev];
      nuevoState.splice(targetIndex, 1, ...nuevasOcurrencias);
      return nuevoState;
    });
  }, []);


  // AGREGAR UNA OCURRENCIA
  const agregarOcurrencia = useCallback(
    (datosIniciales = {}) => {
      const nueva = crearOcurrenciaBase(datosIniciales);
      setOcurrencias((prev) => [...prev, nueva,]);
      return nueva;
    },
    []
  );

  // ACTUALIZAR OCURRENCIA COMPLETA
  const actualizarOcurrencia = useCallback(
    (idLocal, cambios) => {
      setOcurrencias((prev) =>
        prev.map((oc) => oc.idLocal === idLocal ? { ...oc, ...cambios, } : oc)
      );
    },
    []);


  // ACTUALIZAR UN CAMPO
  const actualizarCampoOcurrencia =  useCallback(
      (idLocal, campo, valor) => {
        setOcurrencias((prev) =>
          prev.map((oc) => oc.idLocal === idLocal ? { ...oc, [campo]: valor, } : oc));
      }, []);

  // ELIMINAR OCURRENCIA
  const eliminarOcurrencia = useCallback(
    (idLocal) => { setOcurrencias((prev) => prev.filter((oc) => oc.idLocal !== idLocal)); },
    []
  );

  // FORMATO PARA API
  const obtenerOcurrenciasParaAPI = useCallback(() => {
      const dias = ocurrencias.map((oc) => ({ ...oc, fecha: oc.fechaInicio, }));
      const grupos = agruparOcurrencias(dias);

      return grupos.map((grupo) => ({
        fechaInicio: grupo.fechaInicio,
        fechaFinalizacion: grupo.fechaFin,
        lugar: grupo.lugar,
        cantidadPersonas: grupo.cantidadPersonas,
        id_encargado: grupo.id_encargado,
        participantes: grupo.participantes,
        comentarios: grupo.comentarios,
      }));
    }, [ocurrencias]);

  return {
    ocurrencias,
    establecerOcurrencias,
    agregarOcurrencia,
    agregarRango,
    actualizarOcurrencia,
    actualizarCampoOcurrencia,
    eliminarOcurrencia,
    separarOcurrencia,
    obtenerOcurrenciasParaAPI,
  };
}