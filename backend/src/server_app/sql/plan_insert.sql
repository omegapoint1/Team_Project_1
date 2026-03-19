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
ON CONFLICT (InterventionPlanId) DO UPDATE SET
  Name = EXCLUDED.Name,
  Status = EXCLUDED.Status,
  Zone = EXCLUDED.Zone,
  Budget = EXCLUDED.Budget,
  TotalCost = EXCLUDED.TotalCost,
  Timeline = EXCLUDED.Timeline,
  Impact = EXCLUDED.Impact,
  interventions = EXCLUDED.interventions,
  notes = EXCLUDED.notes,
  evidence = EXCLUDED.evidence
RETURNING InterventionPlanId;