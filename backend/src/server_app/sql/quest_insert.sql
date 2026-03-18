INSERT INTO QUESTS (
  Title,
  Description,
  Difficulty,
  XPReward,
  QuestType,
  TargetValue,
  CreatedBy
)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING QuestId;
