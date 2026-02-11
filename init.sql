
CREATE 
TABLE 
LOGIN(
  UserId SERIAL PRIMARY KEY,
  Username varchar(80) not null,
  Password varchar(80) not null
);

CREATE
TABLE
REPORTS(
  ReportId SERIAL PRIMARY KEY,
  Noisetype varchar(80),
  Datetime varchar(80),
  Severity int,
  Description varchar(255),
  Locationofnoise varchar(255)
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