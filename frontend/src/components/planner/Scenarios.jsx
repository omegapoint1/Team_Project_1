import React, { useState, useEffect } from 'react';
import './Scenario.css';

import ScenarioSelector from './Scenario/ScenarioSelector';
import ComparisonTable from './Scenario/ComparisonTable';
import RecommendationCard from './Scenario/RecommendationCard';
import WeightControls from './Scenario/WeightControls';
import ScenarioBuilder from './Scenario/ScenarioBuilder';
import { scenarioServerService, scenarioLocalService } from './services/scenarioService';

const ScenarioTab = () => {
  // States
  const [scenarios, setScenarios] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [weights, setWeights] = useState({ cost: 40, impact: 40, feasibility: 20 });
  const [showBuilder, setShowBuilder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load scenarios on component mount
  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      // Try server first
      let loadedScenarios = await scenarioServerService.getAll();
      
      // If server returns empty, try local
      if (!loadedScenarios || loadedScenarios.length === 0) {
        loadedScenarios = scenarioLocalService.getAll();
      }
      
      // If still empty, create some default scenarios for demo
      if (loadedScenarios.length === 0) {
        loadedScenarios = createDefaultScenarios();
      }
      
      setScenarios(loadedScenarios);
      
      // Auto-select first 2 scenarios if available
      if (loadedScenarios.length >= 2) {
        setSelectedIds([loadedScenarios[0].id, loadedScenarios[1].id]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading scenarios:', err);
      setError('Failed to load scenarios');
      // Fallback to local
      const localScenarios = scenarioLocalService.getAll();
      if (localScenarios.length > 0) {
        setScenarios(localScenarios);
      } else {
        setScenarios(createDefaultScenarios());
      }
    } finally {
      setLoading(false);
    }
  };

  // Create default scenarios for demo if none exist
  const createDefaultScenarios = () => {
    const defaults = [
      {
        id: 'scenario-1',
        name: 'Quick Wins',
        description: 'Low-cost, high-feasibility interventions for immediate impact',
        interventionIds: [2, 4, 10, 13],
        metrics: {
          totalCost: 16500,
          impact: { min: 12, max: 22 },
          feasibility: 8.5,
          timeline: '2-3 weeks'
        },
        scores: { cost: 8.5, impact: 7.2, feasibility: 8.5, total: 8.0 }
      },
      {
        id: 'scenario-2',
        name: 'Balanced Approach',
        description: 'Mix of cost-effective and high-impact interventions',
        interventionIds: [1, 2, 6, 7, 11],
        metrics: {
          totalCost: 165000,
          impact: { min: 25, max: 43 },
          feasibility: 6.2,
          timeline: '3-6 months'
        },
        scores: { cost: 5.5, impact: 8.8, feasibility: 6.2, total: 7.0 }
      },
      {
        id: 'scenario-3',
        name: 'Maximum Impact',
        description: 'Highest potential noise reduction regardless of cost',
        interventionIds: [1, 3, 5, 9, 14, 15],
        metrics: {
          totalCost: 480000,
          impact: { min: 43, max: 67 },
          feasibility: 4.5,
          timeline: '12-18 months'
        },
        scores: { cost: 2.5, impact: 9.5, feasibility: 4.5, total: 5.8 }
      }
    ];
    
    // Save defaults to local storage
    scenarioLocalService.saveAll(defaults);
    return defaults;
  };

  const handleScenarioSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(scenarioId => scenarioId !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAddScenario = async (newScenario) => {
    try {
      // Try to save to server
      const savedScenario = await scenarioServerService.create(newScenario);
      
      // Update local state
      setScenarios(prevScenarios => [...prevScenarios, savedScenario]);
      
      // Auto-select the new scenario if less than 3 selected
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, savedScenario.id]);
      }
      
      setShowBuilder(false);
    } catch (err) {
      console.error('Error saving scenario to server:', err);
      
      // Fallback to local storage
      const savedLocally = scenarioLocalService.create(newScenario);
      setScenarios(prevScenarios => [...prevScenarios, savedLocally]);
      
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, savedLocally.id]);
      }
      
      setShowBuilder(false);
    }
  };

  const handleDeleteScenario = async (scenarioId) => {
    try {
      // Try server delete
      await scenarioServerService.delete(scenarioId);
    } catch (err) {
      console.error('Error deleting from server:', err);
    }
    
    // Delete from local state
    scenarioLocalService.delete(scenarioId);
    setScenarios(prevScenarios => prevScenarios.filter(s => s.id !== scenarioId));
    setSelectedIds(prevIds => prevIds.filter(id => id !== scenarioId));
  };

  const handleWeightChange = (newWeights) => {
    setWeights(newWeights);
  };

  const selectedScenarios = scenarios.filter(s => selectedIds.includes(s.id));

  if (loading) {
    return (
      <div className="scenario-tab loading">
        <div className="loading-spinner">Loading scenarios...</div>
      </div>
    );
  }

  return (
    <div className="scenario-tab">
      {/* Header */}
      <div className="tab-header">
        <h1>Scenario Comparison</h1>
        <p>Compare intervention strategies side by side</p>
        {error && <div className="error-banner">{error} - Using local data</div>}
      </div>

      {/* Main layout */}
      <div className="scenario-layout">
        <div className="left-panel">
          <ScenarioSelector
            scenarios={scenarios}
            selectedIds={selectedIds}
            onSelect={handleScenarioSelect}
            onAddNew={() => setShowBuilder(true)}
            onDelete={handleDeleteScenario}
          />
          
          <WeightControls
            weights={weights}
            onChange={handleWeightChange}
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
                weights={weights}
              />
            </>
          ) : (
            <div className="empty-state">
              <p>Select 2-3 scenarios to compare</p>
              <button 
                className="create-first-btn"
                onClick={() => setShowBuilder(true)}
              >
                Create Your First Scenario
              </button>
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