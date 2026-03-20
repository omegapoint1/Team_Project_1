SELECT
  uq.UserQuestId,
  uq.UserId,
  uq.QuestId,
  q.Title,
  q.Description,
  q.Difficulty,
  q.XPReward,
  q.QuestType,
  q.TargetValue,
  uq.Status,
  uq.Progress,
  uq.MaxProgress,
  COALESCE(uq.StartedAt::text, '') AS StartedAt,
  COALESCE(uq.CompletedAt::text, '') AS CompletedAt
FROM USER_QUESTS uq
JOIN QUESTS q ON uq.QuestId = q.QuestId
WHERE uq.UserId = $1
ORDER BY uq.Status, q.Difficulty;
