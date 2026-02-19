import ScrollableContainer from '../../common/ScrollableContainer';
import IncidentCard from './IncidentCard';
import './ScrollableGrid.css';
/*Specific element display for incidentCards. displayed inside Scrolable container*/
const IncidentScrollableGrid = ({ 
  incidents, 
  onViewMore,
  maxHeight = '600px',
  columns = 3,
  showCount = true,
  totalCount = 0,
  filterCount = 0,
  onExport = null,
  onGenerateReport = null
}) => {
  const headerActions = (
    <div className="grid-actions">
      {onExport && (
        <button 
          onClick={() => onExport()}
          className="action-button"
          title="Export as CSV"
        >
        </button>
      )}
      {onGenerateReport && (
        <button 
          onClick={() => onGenerateReport()}
          className="action-button"
          title="Generate report"
        >
        </button>
      )}
    </div>
  );

  const footer = (
    <div className="grid-footer">
      <div>
        {showCount && (
          <>
            <span className="bold">{filterCount}</span> of{' '}
            <span className="bold">{totalCount}</span> incidents displayed
          </>
        )}
      </div>
      <div className="footer-buttons">
        {onExport && (
          <button 
            onClick={() => onExport()}
            className="footer-button"
          >
            Export as CSV
          </button>
        )}
        {onGenerateReport && (
          <button 
            onClick={() => onGenerateReport()}
            className="footer-button"
          >
            Generate Report
          </button>
        )}
      </div>
    </div>
  );

  const emptyState = (
    <div className="empty-state">
      <div className="empty-icon">📭</div>
      <h3>No incidents found</h3>
      <p>Adjust your filters to hidden Incidents</p>
    </div>
  );

  return (
    <ScrollableContainer
      maxHeight={maxHeight}
      columns={columns}
      showHeader={true}
      headerTitle={`Incident Reports (${filterCount})`}
      headerActions={headerActions}
      footer={footer}
      emptyState={emptyState}
    >
      {incidents.map(incident => (
        <IncidentCard
          key={incident.id}
          incident={incident}
          onViewMore={onViewMore}
        />
      ))}
    </ScrollableContainer>
  );
};

export default IncidentScrollableGrid;