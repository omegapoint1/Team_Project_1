INSERT INTO scenario(
  Id,
  Name,
  Description,
  InterventionIds,
  metrics,
  scores,
  user_id,
  created_at,
  updated_at
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING Id;


