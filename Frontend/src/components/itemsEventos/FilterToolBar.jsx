export default function FilterToolbar({ leftContent, rightContent }) {
  return (
    <div 
      className="v2-filter-row" 
      style={{ 
        background: "white", 
        padding: "14px 22px", 
        borderRadius: "var(--radius-lg)", 
        border: "1px solid var(--gray-200)", 
        boxShadow: "var(--shadow-sm)", 
        marginBottom: 22 
      }}
    >
      <div className="v2-filter-left">
        {leftContent}
      </div>
      <div className="flex gap-10 items-center">
        {rightContent}
      </div>
    </div>
  );
}