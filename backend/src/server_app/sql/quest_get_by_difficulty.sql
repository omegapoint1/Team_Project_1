SELECT
  QuestId,
  Title,
  Description,
  Difficulty,
  XPReward,
  QuestType,
  TargetValue,
  IsActive
FROM QUESTS
WHERE Difficulty = $1 AND IsActive = TRUE
ORDER BY XPReward;
