   export const mitigationPlans = [
  {
    id: "001",
    name: "Full Mitigation Package",
    description: "",
    createdBy: "planner_john",
    createdAt: "2025-02-25T09:00:00Z",//random time stamp copied
    
    interventionIds: ["001", "007", "PLAN-2025-003"],
    
    // calculated aggregation metrics 
    totalCost: 32000,
    totalImpactDB: 15,
    zonesCovered: 3,
    populationCovered: 1200,
    
    feasibilityScore: 3.2, //averaging from the plans probably
    implementationTimeMonths: 6,
    status:"Planned" //[]
    ,
    //tags fop
    tags: ["comprehensive", "high_budget", "long_term"]
  }]
  
 export const plan_statuses = {
    'Planned':{ label: 'Planned', color: 'green' },
    'In Progress':{ label: 'In Progress', color: 'blue' },  
    'Done':{ label: 'Done', badgeColor: 'purple' },
    'Rejected/Cancelled':{ label: 'Rejected/Cancelled', color: 'red' }
};



export const status_transitions = {
    'Planned': [
        { 
            next: 'In Progress', 
            label: 'Start Processing',
            description: 'Begin work on this plan'
        }
    ],
    
    'In Progress': [
        { 
            next: 'Done', 
            label: 'Mark as Complete',
            description: 'Plan has been fully executed'
        },
        { 
            next: 'Rejected/Cancelled', 
            label: 'Reject Plan',
            description: 'Plan is invalid or cancelled'
        }
    ],
    
    'Done': [
        { 
            next: '', 
            label: 'Re-open Plan',
            description: 'Re-open for additional work'
        }
    ],
    
    'Rejected/Cancelled': [
        { 
            next: 'Planned', 
            label: 'Reinstate Plan',
            description: 'Return to planned status'
        }
    ],
        'default': []
};