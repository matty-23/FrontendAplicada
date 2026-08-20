export function TopBar({ breadcrumb, title, children }) {
  return (
    <header className="v2-topbar">
      <div className="v2-topbar-left">
        <span className="v2-topbar-bc">{breadcrumb}</span>
        <span className="v2-topbar-title">{title}</span>
      </div>
      <div className="v2-topbar-right">
        {children}
      </div>
    </header>
  );
}