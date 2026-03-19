UPDATE USER_QUESTS
SET
  Status = 'completed',
  Progress = MaxProgress,
  CompletedAt = NOW()
WHERE UserQuestId = $1 AND UserId = $2 AND QuestId = $3
RETURNING UserQuestId;
