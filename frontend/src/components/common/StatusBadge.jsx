/*
  Reusable status badge UI  component which d isplays a visual badge representing different statuses
  size configuration
*/

/*
 @param {Object} props - Component props
 @param {string} props.status - Status value
 @param {string} [props.size='md'] - Size variation 'sm','md'
 @returns Rendered status badge (jsx)
 */
const StatusBadge = ({ status, size = 'md' }) => {

  const STATUS_CONFIG = {
    pending: { 
      className: 'status-pending', 
      label: 'Pending', 
      icon: '⏳',
    },
    valid: { 
      className: 'status-valid', 
      label: 'Valid', 
      icon: '✓' 
    },
    duplicate: { 
      className: 'status-duplicate', 
      label: 'Duplicate', 
      icon: '↻' 
    },
    invalid: { 
      className: 'status-invalid', 
      label: 'Invalid', 
      icon: '✗' 
    },
    processed: { 
      className: 'status-processed', 
      label: 'Processed', 
      icon: '✓' 
    }
  };
  
  /*
    gets the configuration for the given status
    @returns {Object}- className, label, and icon
   */
  const getStatusConfig = () => {
    const config = STATUS_CONFIG[status];
    
    if (!config) {
      // Handle invalid status with warning 
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Invalid status value: "${status}". Defaulting to "pending".`);
      }
      return STATUS_CONFIG.pending;
    }
    
    return config;
  };

  const { className, label, icon } = getStatusConfig();
  
  //Map size to CSS by mapping class
  //use tail wind which will work if the program is running on it else make css files 
  const sizeClasses = {
    sm: 'status-small',
    md: 'status-medium',
    lg: 'status-large' 
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <span 
      className={`status-badge ${className} ${sizeClass}`}
      role="status" 

    >
      <span 
        className="status-icon"
      >
        {icon}
      </span>
      <span className="status-label">{label}</span>
    </span>
  );
};

export default StatusBadge;