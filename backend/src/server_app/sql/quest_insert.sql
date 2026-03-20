INSERT INTO QUESTS (
  Title,
  Description,
  Difficulty,
  XPReward,
  QuestType,
  TargetValue
)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING QuestId;
