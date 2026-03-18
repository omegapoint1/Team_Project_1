SELECT
  l.Username,
  q.Title AS quest_title,
  ql.CompletionTime,
  ql.CompletedAt::text
FROM QUEST_LEADERBOARD ql
JOIN QUESTS q ON ql.QuestId = q.QuestId
JOIN LOGIN l ON ql.UserId = l.UserId
WHERE ql.QuestId = $1
ORDER BY ql.CompletionTime ASC
LIMIT 10;
