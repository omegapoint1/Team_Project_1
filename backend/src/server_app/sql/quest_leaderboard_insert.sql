INSERT INTO QUEST_LEADERBOARD (
  UserId,
  QuestId,
  CompletionTime,
  CompletedAt
)
VALUES ($1, $2, $3, NOW())
ON CONFLICT (UserId, QuestId) DO UPDATE SET
  CompletionTime = EXCLUDED.CompletionTime,
  CompletedAt = EXCLUDED.CompletedAt;
