
const StatusBadge = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch(status) {
      case 'pending':
        return { className: 'status-pending', label: 'Pending', icon: '⏳' };
      case 'valid':
        return { className: 'status-valid', label: 'Valid', icon: '✓' };
      case 'duplicate':
        return { className: 'status-duplicate', label: 'Duplicate', icon: '↻' };
      case 'invalid':
        return { className: 'status-invalid', label: 'Invalid', icon: '✗' };
      case 'processed':
        return { className: 'status-processed', label: 'Processed', icon: '✓' };
      default:
        return { className: 'status-pending', label: 'Pending', icon: '⏳' };
    }
  };

  const { className, label, icon } = getStatusConfig();
  const sizeClass = size === 'sm' ? 'status-small' : 'status-medium';

  return (
    <span className={`status-badge ${className} ${sizeClass}`}>
      <span className="status-icon">{icon}</span>
      {label}
    </span>
  );
};

export default StatusBadge;