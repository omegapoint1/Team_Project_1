export const mockIncidents = [
   /*Mock incidents made by external random generator based on predicted json format **To be moved to 
   to external json file*/
  {
    id: 'INC-001',
    zone: 'zone_a',
    timestamp: '2024-01-20T22:30:00Z',
    category: 'noise',
    description: 'Empty',
    severity: 'high',
    status: 'pending',
    tags: []
  },
  {
    id: 'INC-002',
    zone: 'zone_b',
    timestamp: '2024-01-20T23:15:00Z',
    category: 'music',
    description: 'Loud music from weekend party affecting nearby apartments.',
    severity: 'medium',
    status: 'valid',
    tags: ['music', 'weekend', 'party']
  },
  {
    id: 'INC-003',
    zone: 'zone_a',
    timestamp: '2024-01-20T20:30:00Z',
    category: 'traffic',
    description: 'Traffic jam driving me mental',
    severity: 'low',
    status: 'processed',
    tags: ['traffic', 'rush hour', 'horn']
  },
  {
    id: 'INC-004',
    zone: 'zone_d',
    timestamp: '2024-01-19T18:15:00Z',
    category: 'events',
    description: ' outdoor concert exceeding permitted noise levels.',
    severity: 'medium',
    status: 'valid',
    tags: ['event', 'concert', 'music']
  },
  {
    id: 'INC-005',
    zone: 'zone_b',
    timestamp: '2024-01-19T14:30:00Z',
    category: 'construction',
    description: 'Fire station enxt to care home causing havoc',
    severity: 'high',
    status: 'duplicate',
    tags: ['fire station', 'elderly', 'care-home']
  },
  {
    id: 'INC-006',
    zone: 'zone_c',
    timestamp: '2024-01-18T11:15:00Z',
    category: 'other',
    description: 'Industrial factory disturbing school in early moring',
    severity: 'low',
    status: 'invalid',
    tags: ['industrial', 'children']
  },
  {
    id: 'INC-007',
    zone: 'zone_a',
    timestamp: '2024-01-18T09:45:00Z',
    category: 'construction',
    description: 'Early morning drilling work is distrubing me.',
    severity: 'medium',
    status: 'valid',
    tags: ['drilling', 'morning', 'residential']
  }
];