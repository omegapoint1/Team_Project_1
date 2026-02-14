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
  Severity int,
  Description varchar(2000),
  Locationofnoise varchar(2000),
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
