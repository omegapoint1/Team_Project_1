/*
Main tab controllers which loads and servers tabs of the planner screen this is then called by the planner screen
page
*/
import React, { useState } from 'react';
import Overview from './Overview';
import Incidents from './Incidents';
import Hotspots from './Hotspots';
import Plans from './MitigationTab';
import ScenarioTab from './Scenarios';
import Reports from './Reports';

function PlannerScreenTabManager() {
  //states track active tab
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { 
      id: 'overview', 
      label: '📊OVERVIEW', 
      component: <Overview />,
    },
    { 
      id: 'incidents', 
      label: '🚨INCIDENTS', 
      component: <Incidents/>,
    },
    { 
      id: 'hotspots', 
      label: '📍HOTSPOTS', 
      component: <Hotspots />,
    },
    { 
      id: 'plans', 
      label: '📋PLANS', 
      component: <Plans />,
    },
    { 
      id: 'scenarios', 
      label: '🎯SCENARIOS', 
      component: <ScenarioTab />,
    },
    { 
      id: 'reports', 
      label: '📄REPORTS', 
      component: <Reports />,
    }
  ];

  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="incident-tab-manager">
      <div className="incident-tab-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`incident-tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-label">{tab.label}</span>

          </button>
        ))}
      </div>

      <div className="incident-tab-content">
        {activeComponent}
      </div>
    </div>
  );
}

export default PlannerScreenTabManager;