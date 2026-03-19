-- Quests table stores all available quests
CREATE TABLE QUESTS(
  QuestId SERIAL PRIMARY KEY,
  Title VARCHAR(255) NOT NULL,
  Description TEXT NOT NULL,
  Difficulty VARCHAR(20) NOT NULL CHECK (Difficulty IN ('easy', 'medium', 'hard')),
  XPReward INTEGER NOT NULL DEFAULT 0,
  QuestType VARCHAR(50) NOT NULL,
  TargetValue TEXT,
  CreatedAt TIMESTAMP DEFAULT NOW(),
  CreatedBy INTEGER REFERENCES LOGIN(UserId),
  IsActive BOOLEAN DEFAULT TRUE
);

-- User quests table tracks user progress on quests
CREATE TABLE USER_QUESTS(
  UserQuestId SERIAL PRIMARY KEY,
  UserId INTEGER REFERENCES LOGIN(UserId) ON DELETE CASCADE,
  QuestId INTEGER REFERENCES QUESTS(QuestId) ON DELETE CASCADE,
  Status VARCHAR(20) DEFAULT 'not_started' CHECK (Status IN ('not_started', 'in_progress', 'completed')),
  Progress INTEGER DEFAULT 0,
  MaxProgress INTEGER DEFAULT 1,
  CompletedAt TIMESTAMP,
  StartedAt TIMESTAMP,
  UNIQUE(UserId, QuestId)
);

-- User XP and level tracking
CREATE TABLE USER_PROGRESSION(
  UserId INTEGER REFERENCES LOGIN(UserId) ON DELETE CASCADE PRIMARY KEY,
  TotalXP INTEGER DEFAULT 0,
  Level INTEGER DEFAULT 1,
  CompletedQuests INTEGER DEFAULT 0,
  LastUpdated TIMESTAMP DEFAULT NOW()
);

-- Optional: Quest leaderboard
CREATE TABLE QUEST_LEADERBOARD(
  LeaderboardId SERIAL PRIMARY KEY,
  UserId INTEGER REFERENCES LOGIN(UserId) ON DELETE CASCADE,
  QuestId INTEGER REFERENCES QUESTS(QuestId) ON DELETE CASCADE,
  CompletionTime INTEGER, -- in seconds
  CompletedAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(UserId, QuestId)
);

-- Indexes for better query performance
CREATE INDEX idx_quests_difficulty ON QUESTS(Difficulty);
CREATE INDEX idx_quests_active ON QUESTS(IsActive);
CREATE INDEX idx_user_quests_user ON USER_QUESTS(UserId);
CREATE INDEX idx_user_quests_status ON USER_QUESTS(Status);
CREATE INDEX idx_user_quests_quest ON USER_QUESTS(QuestId);
CREATE INDEX idx_leaderboard_quest ON QUEST_LEADERBOARD(QuestId);
CREATE INDEX idx_leaderboard_completion ON QUEST_LEADERBOARD(CompletionTime);
