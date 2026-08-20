export default function Card({ title, subtitle, headActions, bodyStyle, children }) {
  return (
    <div className="v2-card">
      <div className="v2-card-head">
        <div>
          <div className="v2-card-title">{title}</div>
          {subtitle && <div className="v2-card-sub">{subtitle}</div>}
        </div>
        {headActions && <div className="flex gap-8">{headActions}</div>}
      </div>
      <div className="v2-card-body" style={bodyStyle}>
        {children}
      </div>
    </div>
  );
}