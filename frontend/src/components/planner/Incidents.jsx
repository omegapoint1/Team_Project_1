import React, { useState } from 'react';
import IncidentList from './Incidents/IncidentList';

function Incidents() {

  return (
    <div className="module incidents">
      <div className="incidents-header">
        <h2>🚨 Incident Management</h2>
         <IncidentList/>
      </div>
    </div>
  );
}

export default Incidents; 