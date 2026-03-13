INSERT INTO map_data (
  lat,
  long,
  noise,
  time,
  category
)
VALUES ($1, $2, $3, $4, $5)
RETURNING MapDataId;