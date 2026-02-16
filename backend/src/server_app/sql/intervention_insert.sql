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
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);