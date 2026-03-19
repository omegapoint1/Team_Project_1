INSERT INTO USER_QUESTS (
  UserId,
  QuestId,
  Status,
  Progress,
  MaxProgress,
  StartedAt
)
VALUES ($1, $2, 'in_progress', 0, 1, NOW())
ON CONFLICT (UserId, QuestId) DO UPDATE SET Status = 'in_progress', StartedAt = NOW()
RETURNING UserQuestId;
