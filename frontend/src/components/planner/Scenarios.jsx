import React, { useState } from 'react';
import './Scenario.css';

import ScenarioSelector from './Scenario/ScenarioSelector';
import ComparisonTable from './Scenario/ComparisonTable';
import RecommendationCard from './Scenario/RecommendationCard';
import WeightControls from './Scenario/WeightControls';
import ScenarioBuilder from './Scenario/ScenarioBuilder';

import { mockScenarios } from './PlannerData/scenarioData';

const ScenarioTab = () => {
  // States
  const [scenarios, setScenarios] = useState(mockScenarios);
  const [selectedIds, setSelectedIds] = useState(['scenario1', 'scenario2']);
  const [weights, setWeights] = useState({ cost: 40, impact: 40, feasibility: 20 });
  const [showBuilder, setShowBuilder] = useState(false);

  // Getting selected scenarios
  const selectedScenarios = scenarios.filter(s => selectedIds.includes(s.id));

  // Handler functions

  
  const handleScenarioSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(scenarioId => scenarioId !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAddScenario = (newScenario) => {
    setScenarios([...scenarios, newScenario]);
    setShowBuilder(false);
  };

  return (
    <div className="scenario-tab">
      {/* Header */}
      <div className="tab-header">
        <h1>⚖️ Scenario Comparison</h1>
        <p>Compare intervention strategies side by side</p>
      </div>

      {/* Main layout */}
      <div className="scenario-layout">
        <div className="left-panel">
          <ScenarioSelector
            scenarios={scenarios}
            selectedIds={selectedIds}
            onSelect={handleScenarioSelect}
            onAddNew={() => setShowBuilder(true)}
          />
          
          <WeightControls
            weights={weights}
            onChange={setWeights}
          />
        </div>

        {/* Right panel */}
        <div className="right-panel">
          {selectedScenarios.length > 0 ? (
            <>
              <ComparisonTable
                scenarios={selectedScenarios}
                weights={weights}
              />
              
              <RecommendationCard
                scenarios={selectedScenarios}
              />
            </>
          ) : (
            <div className="empty-state">
              <p>Select 2-3 scenarios to compare</p>
            </div>
          )}
        </div>
      </div>

      {/* Scenario Builder modal */}
      {showBuilder && (
        <ScenarioBuilder
          onSave={handleAddScenario}
          onClose={() => setShowBuilder(false)}
        />
      )}
    </div>
  );
};

export default ScenarioTab;