INSERT INTO USER_PROGRESSION (
  UserId,
  TotalXP,
  Level,
  CompletedQuests
)
VALUES ($1, $2, $3, $4)
ON CONFLICT (UserId) DO UPDATE SET
  TotalXP = EXCLUDED.TotalXP,
  Level = EXCLUDED.Level,
  CompletedQuests = EXCLUDED.CompletedQuests,
  LastUpdated = NOW()
RETURNING UserId, TotalXP, Level, CompletedQuests;
