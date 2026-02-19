import React, { useState } from 'react';
import IncidentList from './Incidents/IncidentList';

function Incidents() {

  return (
      <div className="incidents-header">
         <IncidentList/>
    </div>
  );
}

export default Incidents; 