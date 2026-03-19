SELECT
  UserId,
  TotalXP,
  Level,
  CompletedQuests
FROM USER_PROGRESSION
WHERE UserId = $1;
