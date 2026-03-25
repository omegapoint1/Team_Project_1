/*
  ScenarioTab module - Provides a comprehensive scenario comparison interface for intervention strategies.
 
 Features:
 Load and manage multiple scenarios (server + local storage fallback )
 Select 2-3 scenarios for side-by-side comparison
 This module collects all the relevant component and adds the logic to combine into the main scenario comparison tab as a component
 */


import React, { useState, useEffect } from 'react';
import './Scenario.css';

import ScenarioSelector from './Scenario/ScenarioSelector';
import ComparisonTable from './Scenario/ComparisonTable';
import RecommendationCard from './Scenario/RecommendationCard';
import WeightControls from './Scenario/WeightControls';
import ScenarioBuilder from './Scenario/ScenarioBuilder';
import ScenarioPdfExport from './Scenario/ScenarioPdfExport';
import { scenarioServerService, scenarioLocalService } from '../services/scenarioService';

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
      
      setScenarios(loadedScenarios || []);
      
      // Auto-select first 2 scenarios if available
      if (loadedScenarios && loadedScenarios.length >= 2) {
        setSelectedIds([loadedScenarios[0].id, loadedScenarios[1].id]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error loading scenarios:', err);
      setError('Failed to load scenarios');
      // Fallback to local
      const localScenarios = scenarioLocalService.getAll();
      if (localScenarios && localScenarios.length > 0) {
        setScenarios(localScenarios);
      } else {
        setScenarios([]);
      }
    } finally {
      setLoading(false);
    }
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

  const handleExportComplete = (success) => {
    if (success) {
      console.log('PDF exported successfully');
    } else {
      console.error('PDF export failed');
      alert('Failed to generate PDF. Please try again.');
    }
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
        <div className="header-left">
          <h1>Scenario Comparison</h1>
          <p>Compare intervention strategies side by side</p>
        </div>
        <div className="header-right">
          {selectedScenarios.length > 0 && (
            <ScenarioPdfExport
              scenarios={selectedScenarios}
              weights={weights}
              onExportComplete={handleExportComplete}
            />
          )}
        </div>
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