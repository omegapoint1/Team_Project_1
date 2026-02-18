

//example mock scenarios

export const mockScenarios = [
  {
    id: 'scenario1',
    name: 'Low-cost approach',
    description: 'Focus on awareness and basic restrictions',
    metrics: {
      totalCost: 1000,
      impact: { min: 3, max: 7 },
      feasibility: 0.8,
      timeline: '2-3 weeks'
    },
    scores: {
      cost: 9,
      impact: 6,
      feasibility: 8,
      total: 7.8
    }
  },
  {
    id: 'scenario2',
    name: 'Balanced strategy',
    description: 'Focus on legal routes and awareness',
    metrics: {
      totalCost: 2200,
      impact: { min: 6, max: 12 },
      feasibility: 0.75,
      timeline: '3-4 weeks'
    },
    scores: {
      cost: 7,
      impact: 8,
      feasibility: 7,
      total: 7.4
    }
  },
  {
    id: 'scenario3',
    name: 'High-Impact solution',
    description: 'Invasive engineering approach',
    metrics: {
      totalCost: 6000,
      impact: { min: 13, max: 21 },
      feasibility: 0.65,
      timeline: '5-7 weeks'
    },
    scores: {
      cost: 4,
      impact: 9,
      feasibility: 6,
      total: 6.2
    }
  }
];