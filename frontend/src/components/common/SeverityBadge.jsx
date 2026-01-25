
const SeverityBadge = ({ severity, showIcon = true }) => {
  const getSeverityConfig = () => {
    switch(severity?.toLowerCase()) {
      case 'low':
        return { className: 'severity-low', icon: '🟢', label: 'Low' };
      case 'medium':
        return { className: 'severity-medium', icon: '🟡', label: 'Medium' };
      case 'high':
        return { className: 'severity-high', icon: '🔴', label: 'High' };
      default:
        return { className: 'severity-medium', icon: '🟡', label: 'Medium' };
    }
  };

  const { className, icon, label } = getSeverityConfig();

  return (
    <span className={`severity-badge ${className}`}>
      {showIcon && <span className="severity-icon">{icon}</span>}
      {label}
    </span>
  );
};

export default SeverityBadge;