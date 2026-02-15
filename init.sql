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
  Approved BOOLEAN DEFAULT FALSE
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
