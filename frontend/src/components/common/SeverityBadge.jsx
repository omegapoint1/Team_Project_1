/*
 Reusable SeverityBadge UI Component
 
 Displays a visual badge representing severity levels -Low, Medium or High-
 with configurable icon visibility.
 
 @param {Object} props - Component props
 @param {string} props.severity - Severity level
 @param {boolean} [props.showIcon=true] - Whether to display the icon
  
 @returns Rendered severity badge (JSX)

 */
const SeverityBadge = ({ severity, showIcon = true }) => {
  /*
   Maps the severity string to the object
   @returns {Object} configuration with className, icon, and label
   */
  const getSeverityConfig = () => {
    // case insensitive servertity string comparison
    switch(severity?.toLowerCase()) {
      case 'low':
        return { 
          className: 'severity-low', 
          icon: '🟢', 
          label: 'Low',
          //Consider adding ARIA attributes
        };
      case 'medium':
        return { 
          className: 'severity-medium', 
          icon: '🟡', 
          label: 'Medium' 
        };
      case 'high':
        return { 
          className: 'severity-high', 
          icon: '🔴', 
          label: 'High' 
        };
      default:
        if (process.env.NODE_ENV === 'development' && severity) {
          console.warn(`Invalid severity value: "${severity}". Defaulting to "medium".`);
        }
        return { 
          className: 'severity-medium', 
          icon: '🟡', 
          label: 'Medium' 
        };
    }
  };

  const { className, icon, label } = getSeverityConfig();

  return (
    <span 
      className={`severity-badge ${className}`}
      role="status" 
    >
      {showIcon && (
        <span 
          className="severity-icon"
        >
          {icon}
        </span>
      )}
      <span className="severity-label">{label}</span>
    </span>
  );
};

export default SeverityBadge;