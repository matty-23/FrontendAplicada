import { useState } from "react";
import { CorreoService } from "../services/correoService";

const correoService = new CorreoService();

export function useCorreo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const ejecutar = async (accion) => {
    setLoading(true);
    setError(null);

    try {
      return await accion();
    } catch (primerError) {
      await esperar(1000); //Se añadio un pequeño delay 

      try {
        return await accion();
      } catch (segundoError) {
        setError(segundoError.message || "No se pudo enviar el correo.");
        throw segundoError;
      }
    } finally {
      setLoading(false);
    }
  };

  const enviarNotificacion = (destinatarios,asunto,mensaje,archivosAdjuntos) =>
    ejecutar(() =>correoService.notificaciones(destinatarios,asunto,mensaje,archivosAdjuntos));

  const enviarConfirmacionCuenta = (destinatarios,asunto,mensajeConfirmacion) =>
    ejecutar(() =>correoService.confirmacionCreacionCuenta(destinatarios,asunto, mensajeConfirmacion));

  const enviarConfirmacionEvento = (destinatarios, asunto, mensaje) =>
    ejecutar(() =>correoService.confirmacionEvento(destinatarios,asunto,mensaje));

  return {loading,error,enviarNotificacion,enviarConfirmacionCuenta,enviarConfirmacionEvento,};
}