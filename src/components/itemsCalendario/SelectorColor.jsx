const COLORES = [
  "#FACC15",
  "#F97316",
  "#22C55E",
  "#3B82F6",
  "#A855F7",
  "#EC4899",
];

export default function SelectorColor({
  value,
  onChange,
}) {
  return (
    <div className="selector-color">
      {COLORES.map((color) => {
        const seleccionado = value === color;

        return (
          <button
            key={color}
            type="button"
            className={`selector-color-option ${
              seleccionado ? "selected" : ""
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            aria-label={`Seleccionar color ${color}`}
            aria-pressed={seleccionado}
          />
        );
      })}
    </div>
  );
}
