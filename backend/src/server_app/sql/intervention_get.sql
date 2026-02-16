SELECT 
  InterventionId,
  Name,
  Category,
  Description,
  cost,
  impact,
  feasibility,
  tags,
  created_at
FROM intervention
WHERE InterventionId = $1;