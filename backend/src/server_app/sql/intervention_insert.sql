INSERT INTO intervention (
  InterventionId,
  Name,
  Category,
  Description,
  cost,
  impact,
  feasibility,
  tags,
  created_at
)

VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
ON CONFLICT (InterventionId) DO UPDATE SET
  Name = EXCLUDED.Name,
  Category = EXCLUDED.Category,
  Description = EXCLUDED.Description,
  cost = EXCLUDED.cost,
  impact = EXCLUDED.impact,
  feasibility = EXCLUDED.feasibility,
  tags = EXCLUDED.tags;