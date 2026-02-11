CREATE 
TABLE 
LOGIN(
  Username varchar(255) not null,
  Password varchar(4000) not null
);

CREATE
TABLE
REPORTS(
  ReportId SERIAL PRIMARY KEY,
  Noisetype varchar(255),
  Datetime varchar(255),
  Severity int,
  Description varchar(2000),
  Locationofnoise varchar(2000)
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