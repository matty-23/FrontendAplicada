const ESTADOS = {
  activo: {
    label: "Activo",
    className: "activo",
  },
  pendiente: {
    label: "Pendiente",
    className: "pendiente",
  },
  terminado: {
    label: "Terminado",
    className: "terminado",
  },
};

export default function EstadoBadge({ estado }) {
  const estadoNormalizado = estado?.toLowerCase();
  const estadoConfig = ESTADOS[estadoNormalizado];

  if (!estadoConfig) {
    return null;
  }

  return (
    <span className={`estado-badge estado-${estadoConfig.className}`}>
      <span className="estado-badge-dot" />
      {estadoConfig.label}
    </span>
  );
}
