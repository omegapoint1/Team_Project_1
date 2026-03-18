SELECT
  Id,
  Name,
  Description,
  InterventionIds,
  metrics,
  scores,
  user_id,
  created_at,
  updated_at
FROM scenario
WHERE Id = $1;



