
const Tag = ({ label, color = 'gray', removable = false, onRemove }) => {
  return (
    <span className={`tag tag-${color}`}>
      {label}
      {removable && (
        <button 
          onClick={onRemove}
          className="tag-remove"
        >
          ×
        </button>
      )}
    </span>
  );
};

export default Tag;