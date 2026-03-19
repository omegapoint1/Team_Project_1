SELECT COUNT(*) as quest_count
FROM USER_QUESTS
WHERE UserId = $1 AND Status = 'completed';
