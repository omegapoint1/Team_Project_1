CREATE 
TABLE 
LOGIN(
  UserId SERIAL PRIMARY KEY,
  Username varchar(255) not null UNIQUE,
  Password varchar(4000) not null
);

CREATE TABLE USERS(
  UserId SERIAL PRIMARY KEY REFERENCES LOGIN(UserId) ON DELETE CASCADE,
  Email varchar(255),
  Admin BOOLEAN DEFAULT FALSE
  );

CREATE
TABLE
REPORTS(
  ReportId SERIAL PRIMARY KEY,
  Noisetype varchar(255),
  Datetime varchar(255),
  Severity varchar(255),
  Description varchar(2000),
  Locationofnoise varchar(2000),
  Zone varchar(255),
  Lat varchar(255),
  Long varchar(255),
  Approved varchar(255) DEFAULT 'Pending'
);

CREATE 
TABLE 
TAGS (
  TagId SERIAL PRIMARY KEY,
  Name TEXT UNIQUE NOT NULL
);

CREATE 
TABLE 
REPORT_TAGS (
  Report_id INTEGER REFERENCES REPORTS(ReportId) ON DELETE CASCADE,
  Tag_id INTEGER REFERENCES TAGS(TagId) ON DELETE CASCADE,
  PRIMARY KEY (Report_id, Tag_id)
);

CREATE TABLE inter_plans (
  InterventionPlanId varchar(255) PRIMARY KEY,
  Name varchar(255) NOT NULL,
  Status varchar(255),
  Zone varchar(255),
  Budget int,
  Totalcost int,
  Timeline int,
  Impact int,
  Createdat varchar(255),
  interventions JSONB,
  notes JSONB,
  evidence JSONB
  );

CREATE TABLE intervention (
  InterventionId varchar(255) PRIMARY KEY,
  Name varchar(255) NOT NULL,
  Category varchar(255),
  Description varchar(255),
  cost JSONB,
  impact JSONB,
  feasibility int,
  tags JSONB,
  created_at varchar(255)
  );

CREATE TABLE scenario (
  Id varchar(255) PRIMARY KEY,
  Name varchar(255) NOT NULL,
  Description varchar(255),
  InterventionIds JSONB,
  metrics JSONB,
  scores JSONB,
  user_id int,
  created_at varchar(255),
  updated_at varchar(255)
  );

CREATE TABLE NOISE_DATA (
  NoiseDataId   SERIAL PRIMARY KEY,
  Source        VARCHAR(50)  NOT NULL
                  CHECK (Source IN ('amsterdam_dataset', 'verified_user_report')),
  Geometry      JSONB        NOT NULL,
  NoiseClass    VARCHAR(20),
  NoiseLevelDb  INTEGER,
  NoiseCategory VARCHAR(20)
                  CHECK (NoiseCategory IN ('quiet', 'moderate', 'loud', 'very_loud')),
  Severity      INTEGER CHECK (Severity BETWEEN 1 AND 10),
  RecordedAt    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_noise_data_source    ON NOISE_DATA (Source);
CREATE INDEX idx_noise_data_recorded  ON NOISE_DATA (RecordedAt);
CREATE INDEX idx_noise_data_category  ON NOISE_DATA (NoiseCategory);
CREATE INDEX idx_noise_data_geometry  ON NOISE_DATA USING GIN (Geometry);


CREATE TABLE map_data (
  MapDataId SERIAL PRIMARY KEY,
  lat Float,
  long Float,
  noise Int,
  time varchar(255),
  category varchar(255)
);

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
  CompletionTime INTEGER,
  CompletedAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(UserId, QuestId)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_quests_difficulty ON QUESTS(Difficulty);
CREATE INDEX IF NOT EXISTS idx_quests_active ON QUESTS(IsActive);
CREATE INDEX IF NOT EXISTS idx_user_quests_user ON USER_QUESTS(UserId);
CREATE INDEX IF NOT EXISTS idx_user_quests_status ON USER_QUESTS(Status);
CREATE INDEX IF NOT EXISTS idx_user_quests_quest ON USER_QUESTS(QuestId);
CREATE INDEX IF NOT EXISTS idx_leaderboard_quest ON QUEST_LEADERBOARD(QuestId);
CREATE INDEX IF NOT EXISTS idx_leaderboard_completion ON QUEST_LEADERBOARD(CompletionTime);