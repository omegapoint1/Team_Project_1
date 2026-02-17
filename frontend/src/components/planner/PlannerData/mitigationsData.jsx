export const interventionsData = [
  {
    id: 'int1',
    name: 'Quiet zone signage',
    description: 'Install signs indicating quiet zones',
    cost: 800,
    impact: { min: 2, max: 4 },
    feasibility: 0.9,
    timeline: '1-2 weeks'
  },
  {
    id: 'int2',
    name: 'Time restrictions',
    description: 'Implement time-based restrictions',
    cost: 200,
    impact: { min: 1, max: 3 },
    feasibility: 0.7,
    timeline: '2-3 weeks'
  },
  {
    id: 'int3',
    name: 'Noise barriers',
    description: 'Install acoustic barriers',
    cost: 4000,
    impact: { min: 8, max: 12 },
    feasibility: 0.6,
    timeline: '4-6 weeks'
  },
  {
    id: 'int4',
    name: 'Community awareness',
    description: 'Educational campaign about noise',
    cost: 150,
    impact: { min: 1, max: 2 },
    feasibility: 0.8,
    timeline: '3-4 weeks'
  },
  {
    id: 'int5',
    name: 'Speed bumps installation',
    description: 'Install speed reduction bumps to reduce traffic noise',
    cost: 1200,
    impact: { min: 3, max: 5 },
    feasibility: 0.75,
    timeline: '2-3 weeks'
  },
  {
    id: 'int6',
    name: 'Tree planting along roads',
    description: 'Plant dense vegetation as natural sound buffers',
    cost: 600,
    impact: { min: 2, max: 4 },
    feasibility: 0.85,
    timeline: '1-2 weeks planting, months to grow'
  },
  {
    id: 'int7',
    name: 'Low-noise pavement',
    description: 'Replace existing pavement with noise-reducing asphalt',
    cost: 8500,
    impact: { min: 5, max: 8 },
    feasibility: 0.4,
    timeline: '2-3 months'
  },
  {
    id: 'int8',
    name: 'Building insulation grants',
    description: 'Provide subsidies for soundproofing homes',
    cost: 5000,
    impact: { min: 6, max: 10 },
    feasibility: 0.55,
    timeline: 'Ongoing, 1-2 months per home'
  },
  {
    id: 'int9',
    name: 'Traffic flow optimization',
    description: 'Adjust traffic light timing to reduce stop-start noise',
    cost: 300,
    impact: { min: 1, max: 3 },
    feasibility: 0.9,
    timeline: '1-2 weeks'
  },
  {
    id: 'int10',
    name: 'Noise camera enforcement',
    description: 'Install cameras to detect and fine excessively noisy vehicles',
    cost: 3500,
    impact: { min: 4, max: 7 },
    feasibility: 0.5,
    timeline: '3-4 months'
  },
  {
    id: 'int11',
    name: 'Electric vehicle incentives',
    description: 'Promote EV adoption through tax breaks',
    cost: 2000,
    impact: { min: 2, max: 5 },
    feasibility: 0.65,
    timeline: 'Long-term program'
  },
  {
    id: 'int12',
    name: 'Night delivery restrictions',
    description: 'Ban commercial deliveries during nighttime hours',
    cost: 100,
    impact: { min: 3, max: 5 },
    feasibility: 0.7,
    timeline: '1-2 weeks for enforcement setup'
  },
  {
    id: 'int13',
    name: 'Bike lane expansion',
    description: 'Encourage cycling to reduce car traffic noise',
    cost: 2500,
    impact: { min: 2, max: 4 },
    feasibility: 0.6,
    timeline: '2-3 months'
  },
  {
    id: 'int14',
    name: 'Noise complaint hotline',
    description: 'Establish dedicated reporting system for noise issues',
    cost: 150,
    impact: { min: 1, max: 2 },
    feasibility: 0.95,
    timeline: '1-2 weeks'
  },
  {
    id: 'int15',
    name: 'Industrial zone buffering',
    description: 'Create buffer zones between industrial and residential areas',
    cost: 1800,
    impact: { min: 5, max: 8 },
    feasibility: 0.45,
    timeline: '3-6 months'
  },
  {
    id: 'int16',
    name: 'Residential speed limit reduction',
    description: 'Lower speed limits in residential neighborhoods',
    cost: 250,
    impact: { min: 2, max: 4 },
    feasibility: 0.8,
    timeline: '2-4 weeks'
  },
  {
    id: 'int17',
    name: 'Noise monitoring network',
    description: 'Install sensors to track noise levels citywide',
    cost: 2800,
    impact: { min: 1, max: 2 },
    feasibility: 0.7,
    timeline: '2-3 months'
  },
  {
    id: 'int18',
    name: 'Construction hour limits',
    description: 'Restrict construction activities to daytime only',
    cost: 100,
    impact: { min: 4, max: 6 },
    feasibility: 0.85,
    timeline: 'Immediate'
  },
  {
    id: 'int19',
    name: 'Green roof subsidies',
    description: 'Support green roofs for natural sound absorption',
    cost: 2200,
    impact: { min: 2, max: 4 },
    feasibility: 0.5,
    timeline: '2-3 months per project'
  }
];

export const zones = [
    { id: "zone_a", name: "Zone A", type: "residential", priority: "high" },
    { id: "zone_b", name: "Zone B", type: "campus", priority: "medium" },
    { id: "zone_c", name: "Zone C", type: "commercial", priority: "low" },
    { id: "zone_d", name: "Zone D", type: "mixed", priority: "medium" }
];