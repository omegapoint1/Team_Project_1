INSERT INTO REPORTS (
  Noisetype,
  Datetime,
  Severity,
  Description,
  Locationofnoise,
  Zone,
  Lat,
  Long
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING ReportId;
