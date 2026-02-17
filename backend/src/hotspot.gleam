import gleam/json
import gleam/option
import server_app/sql
import pog
import gleam/list
import shared/hotspots_json
import wisp.{type Response, type Request}



pub fn get_hotspots_small(db: pog.Connection) -> Response {
  let assert Ok(hotspots) = sql.get_hotspots(db)
  let hotspots_decoded = list.map(hotspots.rows, fn(row) {
    #(row.occurrence_count, option.unwrap(row.zone, ""))
  })
  let hotspots_finished = hotspots_json.HotspotsItem(hotspots: hotspots_decoded)
  let hotspots_encoded = hotspots_json.hotspots_item_to_json(hotspots_finished)
  wisp.json_response(json.to_string(hotspots_encoded), 200)
}



pub fn get_hotspots(_req: Request, _db: pog.Connection) -> Response {
  let json =
    "{
  \"hotspots\": [
    {
      \"id\": 1,
      \"name\": \"Zone A - Severe Road Noise\",
      \"geometry\": {
        \"type\": \"Polygon\",
        \"coordinates\": [[[466965.0,458415.0],[466965.0,458405.0],[466955.0,458405.0],[466955.0,458415.0],[466965.0,458415.0]]]
      },
      \"noiseclass\": \">=75.0\",
      \"noiseleveldb\": 87,
      \"noisecategory\": \"very_loud\",
      \"severity\": 10,
      \"reports\": [
        { \"id\": 101, \"description\": \"Constant heavy traffic, unbearable during peak hours\", \"noisetype\": \"traffic\", \"severity\": 10, \"recordedat\": \"2025-08-17 08:23:00\" },
        { \"id\": 102, \"description\": \"HGVs using this route overnight\", \"noisetype\": \"traffic\", \"severity\": 9, \"recordedat\": \"2025-08-14 02:11:00\" }
      ]
    },
    {
      \"id\": 2,
      \"name\": \"Zone B - High Traffic Corridor\",
      \"geometry\": {
        \"type\": \"Polygon\",
        \"coordinates\": [[[420145.0,253935.0],[420135.0,253935.0],[420135.0,253945.0],[420145.0,253945.0],[420145.0,253935.0]]]
      },
      \"noiseclass\": \"75.0-79.9\",
      \"noiseleveldb\": 77,
      \"noisecategory\": \"loud\",
      \"severity\": 8,
      \"reports\": [
        { \"id\": 103, \"description\": \"Road resurfacing works causing disruption\", \"noisetype\": \"construction\", \"severity\": 8, \"recordedat\": \"2025-07-22 07:45:00\" },
        { \"id\": 104, \"description\": \"Bus stops nearby cause frequent engine idling\", \"noisetype\": \"traffic\", \"severity\": 7, \"recordedat\": \"2025-07-30 17:52:00\" }
      ]
    },
    {
      \"id\": 3,
      \"name\": \"Zone C - Industrial Area\",
      \"geometry\": {
        \"type\": \"Polygon\",
        \"coordinates\": [[[530100.0,179200.0],[530110.0,179200.0],[530110.0,179210.0],[530100.0,179210.0],[530100.0,179200.0]]]
      },
      \"noiseclass\": \"70.0-74.9\",
      \"noiseleveldb\": 72,
      \"noisecategory\": \"loud\",
      \"severity\": 7,
      \"reports\": [
        { \"id\": 105, \"description\": \"Factory machinery audible from residential street\", \"noisetype\": \"industrial\", \"severity\": 7, \"recordedat\": \"2025-06-10 11:30:00\" },
        { \"id\": 106, \"description\": \"Early morning deliveries waking residents\", \"noisetype\": \"traffic\", \"severity\": 6, \"recordedat\": \"2025-06-15 05:20:00\" }
      ]
    }
  ]
}"

  wisp.response(200)
  |> wisp.json_body(json)
}