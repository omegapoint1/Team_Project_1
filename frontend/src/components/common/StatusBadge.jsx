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

  const STATUS_CONFIG = {
    pending: { 
      label: 'pending', 
    },
    accepted : { 
      label: 'accepted', 
    },
     rejected: { 
      label: 'rejected', 
    },

  };
  
  /*
    gets the configuration for the given status
    @returns {Object}- className, label, and icon
   */


  
  //Map size to CSS by mapping class
  //use tail wind which will work if the program is running on it else make css files 
 


  
const StatusBadge = ({ status}) => {
  return (
    <span style={{
      backgroundColor: 'light green',
      color: 'black',
      borderRadius: '16px',
      fontWeight: '600',
      textTransform: 'capitalize',
    }}>
      {status}
    </span>
  );
};


export default StatusBadge;