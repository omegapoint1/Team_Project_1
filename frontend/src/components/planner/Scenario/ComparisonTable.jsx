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

  const calculateNormalizedScores = () => {
    if (!scenarios.length) return {};
    
    const costs = scenarios.map(s => s.metrics?.totalCost || s.metrics?.cost || 0);
    const impacts = scenarios.map(s => {
      const impact = s.metrics?.impact;
      if (!impact) return 0;
      if (typeof impact === 'object') {
        return (impact.min + impact.max) / 2;
      }
      return impact;
    });
    const feasibilities = scenarios.map(s => s.metrics?.feasibility || 0);
    
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    const maxImpact = Math.max(...impacts);
    const minImpact = Math.min(...impacts);
    const maxFeasibility = Math.max(...feasibilities);
    const minFeasibility = Math.min(...feasibilities);
    
    return scenarios.map((scenario, index) => {
      let normalizedCost = 100;
      if (maxCost > minCost) {
        normalizedCost = ((maxCost - costs[index]) / (maxCost - minCost)) * 100;
      }
      
      // Impact
      let normalizedImpact = 100;
      if (maxImpact > minImpact) {
        normalizedImpact = ((impacts[index] - minImpact) / (maxImpact - minImpact)) * 100;
      }
      
      // Feasibility
      let normalizedFeasibility = 100;
      if (maxFeasibility > minFeasibility) {
        normalizedFeasibility = ((feasibilities[index] - minFeasibility) / (maxFeasibility - minFeasibility)) * 100;
      }
      
      // Calculate weighted score
      const weightedScore = (
        normalizedCost * (weights?.cost || 40) +
        normalizedImpact * (weights?.impact || 40) +
        normalizedFeasibility * (weights?.feasibility || 20)
      ) / 100;
      
      return {
        id: scenario.id,
        normalizedCost,
        normalizedImpact,
        normalizedFeasibility,
        weightedScore
      };
    });
  };

  const normalizedScores = calculateNormalizedScores();

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
                <div className="weight-badge">Weight: {weights?.cost || 40}%</div>
              </td>
              {scenarios.map((scenario, index) => {
                const score = normalizedScores.find(s => s.id === scenario.id);
                return (
                  <td key={scenario.id} className="metric-value cost-value">
                    <div className="metric-main">
                      {formatCurrency(scenario.metrics?.totalCost || scenario.metrics?.cost)}
                    </div>
              
                  </td>
                );
              })}
            </tr>

            {/* Impact Row */}
            <tr>
              <td className="metric-label">
                <strong>Impact</strong>
                <div className="weight-badge">Weight: {weights?.impact || 40}%</div>
              </td>
              {scenarios.map((scenario, index) => {
                const score = normalizedScores.find(s => s.id === scenario.id);
                return (
                  <td key={scenario.id} className="metric-value impact-value">
                    <div className="metric-main">
                      {formatImpact(scenario.metrics?.impact)}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Feasibility Row */}
            <tr>
              <td className="metric-label">
                <strong>Feasibility</strong>
                <div className="weight-badge">Weight: {weights?.feasibility || 20}%</div>
              </td>
              {scenarios.map((scenario, index) => {
                const score = normalizedScores.find(s => s.id === scenario.id);
                return (
                  <td key={scenario.id} className="metric-value feasibility-value">
                    <div className="metric-main">
                      {formatFeasibility(scenario.metrics?.feasibility)}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Timeline row */}
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

            {/* Interventions row */}
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

      <div className="table-footer">
        <small className="text-muted">
          * Lower cost = higher score | Higher impact = higher score | Higher feasibility = higher score
        </small>
      </div>
    </div>
  );
};

export default ComparisonTable;