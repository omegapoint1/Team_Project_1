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
WHERE QuestId = $1;
