export default function TabGroup({ tabs, activeTab, onTabChange }) {
  return (
    <div className="v2-tabs" style={{ marginBottom: 0 }}>
      {tabs.map(t => (
        <button 
          key={t}
          className={`v2-tab${t === activeTab ? " active" : ""}`} 
          onClick={() => onTabChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}