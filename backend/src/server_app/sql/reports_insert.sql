INSERT INTO REPORTS (
  Noisetype,
  Datetime,
  Severity,
  Description,
  Locationofnoise,
  Zone
)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING ReportId;
