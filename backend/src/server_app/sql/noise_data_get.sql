SELECT
  NoiseDataId,
  Source,
  Geometry::text,
  NoiseClass,
  NoiseLevelDb,
  NoiseCategory,
  Severity,
  RecordedAt::text
FROM NOISE_DATA
WHERE
  ($1 = '' OR RecordedAt >= $1::TIMESTAMP)
  AND ($2 = '' OR RecordedAt <= $2::TIMESTAMP)
  AND ($3 = '' OR NoiseCategory = $3)
  AND ($4 = '' OR Source = $4)
  AND ($5 = 0  OR NoiseLevelDb >= $5)
  AND ($6 = 0  OR NoiseLevelDb <= $6)
ORDER BY RecordedAt DESC;
