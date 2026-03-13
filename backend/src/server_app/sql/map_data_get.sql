SELECT
  lat,
  long,
  noise,
  time,
  category 
FROM map_data
WHERE MapDataId = $1;

