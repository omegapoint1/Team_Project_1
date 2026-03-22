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
ON CONFLICT (ReportId) DO UPDATE SET
  Noisetype = EXCLUDED.Noisetype,
  Datetime = EXCLUDED.Datetime,
  Severity = EXCLUDED.Severity,
  Description = EXCLUDED.Description,
  Locationofnoise = EXCLUDED.Locationofnoise,
  Zone = EXCLUDED.Zone,
  Lat = EXCLUDED.Lat,
  Long = EXCLUDED.Long

RETURNING ReportId;
