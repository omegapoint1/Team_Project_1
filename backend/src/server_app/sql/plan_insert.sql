INSERT INTO inter_plans (
  InterventionPlanId,
  Name,
  Status,
  Zone,
  Budget,
  TotalCost,
  Timeline,
  Impact,
  Createdat,
  interventions,
  notes,
  evidence
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11, $12)
RETURNING InterventionPlanId;