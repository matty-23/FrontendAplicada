export function obtenerValorOcurrencia(ocurrencia,generales,campo) {
  const personalizado = ocurrencia?.personalizado?.[campo];

  if (personalizado) return ocurrencia[campo];

  return generales?.[campo] ?? "";
}

 //Indica si un campo de una ocurrenciafue personalizado.
export function esCampoPersonalizado(ocurrencia,campo) {
  return Boolean(ocurrencia?.personalizado?.[campo]);
}
