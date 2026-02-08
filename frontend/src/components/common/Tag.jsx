/*
Reusable Tag ui component displays label icon and badge according to the 

*/

//Perhaps simplify to avoid complexity 

const Tag = ({      //Parameters
  label,           // text of the tag
  colour = 'grey',  // Colour variations
  removable = false, // Whether to show a remove button (default = false)
  onRemove,        // function to occur when remove button is pressed
  icon,            // icon to display before the label (optional)
  size = 'md',     // size variations: 'sm', 'md', or 'lg'
  className = '',  // Additional CSS classes
  style,           // styles Removable -
  ...restProps     // Other props passed to the span element
}) => {

  //remove button click function
  const handleRemove = (event) => {
    event.stopPropagation(); //Prevent triggering the parent click events
    
    //check if on remove is a function
    if (typeof onRemove === 'function') {
      onRemove(event);
    } else if (process.env.NODE_ENV === 'development') {
      console.warn('Tag component: onRemove prop is not a function');
    }
  };

  //Keyboard events handling for added accessibility
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRemove(event);
    }
  };

  // Map the size to the CSS class
  const sizeClass = {
    sm: 'tag-sm',
    md: 'tag-md',
    lg: 'tag-lg'
  }[size] || 'tag-md';

  //css colour classes
  const colourClasses = {
    grey: 'tag-grey',
    blue: 'tag-blue',
    red: 'tag-red',
    green: 'tag-green',
    yellow: 'tag-yellow',
    purple: 'tag-purple',
    teal: 'tag-teal',
    orange: 'tag-orange'
  };

  // Use mapped color or fallback to generic class
  const colourClass = colourClasses[colour] || `tag-custom-${colour}`;

  return (
    <span 
      className={`tag ${colourClass} ${sizeClass} ${className}`.trim()}
      style={style}
      role={removable ? "button" : undefined} // Screen reader role when interactive
      tabIndex={removable ? 0 : undefined} // Make focusable when removable
      data-color={colour} // Data attribute for CSS/JS targeting
      {...restProps} // Spread any additional props
    >
      {/* Optional icon */}
      {icon && (
        <span 
          className="tag-icon"
          aria-hidden="true" // Decorative icon
        >
          {icon}
        </span>
      )}
      
      {/* Label */}
      <span className="tag-label">
        {label}
      </span>
      
      {/*renders remove button if condition met */}
      {removable && (
        <button 
          type="button"
          onClick={handleRemove}
          onKeyDown={handleKeyDown}
          className="tag-remove"
          aria-label={`Remove ${label} tag`} // Accessible label
          title={`Remove ${label}`} 
          tabIndex={-1} // Prevent the button from being tabbed to if parent span is focusable
        >
          {/*close icon */}
          <span aria-hidden="true">×</span>
          <span className="sr-only">Remove</span> 
        </button>
      )}
    </span>
  );
};

export default Tag;