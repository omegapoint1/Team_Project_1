import React from 'react';
/*
This section of the code is the generic scrollable container that wraps around grid components 
*/
const ScrollableContainer = ({
  //parameters passed to container 
  children, 
  maxHeight = '600px',
  columns = 3,
  className = '',
  showHeader = true,
  headerTitle = '',
  headerActions = null,
  footer = null,
  emptyState = null
}) => {
  return (
    <div className="scrollable-container">
      {/* Header*/}
      {showHeader && (
        <div className="scrollable-header">
          <div className="header-content">
            <h2 className="header-title">
              {headerTitle}
            </h2>
            {headerActions && (
              <div className="header-actions">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      )}

      {/**/}
      <div className="scrollable-content">
        {React.Children.count(children) === 0 ? (
          emptyState || (
            <div className="empty-default">
              <div className="empty-icon">📭</div>
              <h3>No items found</h3>
              <p>Try adjusting your filters</p>
            </div>
          )
        ) : (
          <div 
            className={`scrollable-grid columns-${columns} ${className}`}
            style={{ maxHeight }}
          >
            {children}
          </div>
        )}
      </div>

      {/*Footer*/}
      {footer && (
        <div className="scrollable-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default ScrollableContainer;