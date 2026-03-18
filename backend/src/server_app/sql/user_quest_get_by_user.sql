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
  uq.StartedAt::text,
  uq.CompletedAt::text
FROM USER_QUESTS uq
JOIN QUESTS q ON uq.QuestId = q.QuestId
WHERE uq.UserId = $1
ORDER BY uq.Status, q.Difficulty;
