import React from 'react';
import './ComparisonTable.css';

const ComparisonTable = ({ scenarios, weights }) => {
  return (
    <div className="table-card">
      <h3>Comparison Table</h3>
      
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              {scenarios.map(scenario => (
                <th key={scenario.id}>{scenario.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cost</td>
              {scenarios.map(scenario => (
                <td key={scenario.id} className="metric-cost">
                  £{scenario.metrics.totalCost}
                </td>
              ))}
            </tr>
            <tr>
              <td>Impact</td>
              {scenarios.map(scenario => (
                <td key={scenario.id} className="metric-impact">
                  {scenario.metrics.impact.min}-{scenario.metrics.impact.max} dB
                </td>
              ))}
            </tr>
            <tr>
              <td>Feasibility</td>
              {scenarios.map(scenario => (
                <td key={scenario.id} className="metric-feasibility">
                  {scenario.metrics.feasibility.toFixed(2)}/1.0
                </td>
              ))}
            </tr>
            <tr>
              <td>Timeline</td>
              {scenarios.map(scenario => (
                <td key={scenario.id} className="metric-timeline">
                  {scenario.metrics.timeline}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;