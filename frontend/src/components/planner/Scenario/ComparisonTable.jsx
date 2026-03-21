import './ComparisonTable.css';

const ComparisonTable = ({ scenarios, weights }) => {
  // Helper function to format currency
  const formatCurrency = (value) => {
    if (!value) return '£0';
    return `£${value.toLocaleString()}`;
  };

  // Helper function to format impact
  const formatImpact = (impact) => {
    if (!impact) return '0 dB';
    if (typeof impact === 'object') {
      return `${impact.min || 0}-${impact.max || 0} dB`;
    }
    return `${impact} dB`;
  };

  // Helper function to format feasibility
  const formatFeasibility = (feasibility) => {
    if (!feasibility) return '0/10';
    return `${feasibility.toFixed(1)}/10`;
  };

  // Helper function to get timeline display
  const getTimeline = (scenario) => {
    if (scenario.metrics?.timeline) {
      return scenario.metrics.timeline;
    }
    
    const avgFeasibility = scenario.metrics?.feasibility || 0;
    if (avgFeasibility > 7) return '2-3 weeks';
    if (avgFeasibility > 4) return '3-6 months';
    return '12-18 months';
  };

  return (
    <div className="comparison-table-card">
      <div className="card-header">
        <h3>Comparison Table</h3>
        {weights && (
          <div className="weight-indicator">
            <small>Weights: Cost {weights.cost}% | Impact {weights.impact}% | Feasibility {weights.feasibility}%</small>
          </div>
        )}
      </div>
      
      <div className="table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="metric-column">Metric</th>
              {scenarios.map(scenario => (
                <th key={scenario.id} className="scenario-column">
                  {scenario.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Cost row */}
            <tr>
              <td className="metric-label">
                <strong>Cost</strong>
                <small>({weights?.cost || 40}% weight)</small>
              </td>
              {scenarios.map(scenario => (
                <td key={scenario.id} className="metric-value cost-value">
                  {formatCurrency(scenario.metrics?.totalCost || scenario.metrics?.cost)}
                </td>
              ))}
            </tr>

            {/* Impact Row */}
            <tr>
              <td className="metric-label">
                <strong>Impact</strong>
                <small>({weights?.impact || 40}% weight)</small>
              </td>
              {scenarios.map(scenario => (
                <td key={scenario.id} className="metric-value impact-value">
                  {formatImpact(scenario.metrics?.impact)}
                </td>
              ))}
            </tr>

            {/* Feasibility Row */}
            <tr>
              <td className="metric-label">
                <strong>Feasibility</strong>
                <small>({weights?.feasibility || 20}% weight)</small>
              </td>
              {scenarios.map(scenario => (
                <td key={scenario.id} className="metric-value feasibility-value">
                  {formatFeasibility(scenario.metrics?.feasibility)}
                </td>
              ))}
            </tr>

            <tr>
              <td className="metric-label">
                <strong>Timeline</strong>
              </td>
              {scenarios.map(scenario => (
                <td key={scenario.id} className="metric-value timeline-value">
                  {getTimeline(scenario)}
                </td>
              ))}
            </tr>

            <tr className="info-row">
              <td className="metric-label">
                <strong>Interventions</strong>
              </td>
              {scenarios.map(scenario => (
                <td key={scenario.id} className="metric-value">
                  {scenario.interventionIds?.length || 0} selected
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Legend/Notes Section */}
      <div className="table-footer">
        <small className="text-muted">
          * Lower cost = higher score | Higher impact = higher score | Higher feasibility = higher score
        </small>
      </div>
    </div>
  );
};

export default ComparisonTable;