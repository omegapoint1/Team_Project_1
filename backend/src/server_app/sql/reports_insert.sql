INSERT INTO REPORTS (
  Noisetype,
  Datetime,
  Severity,
  Description,
  Locationofnoise
)
VALUES ($1, $2, $3, $4, $5)
RETURNING ReportId;
