import gleam/int
import gleam/json
import gleam/list
import gleam/option
import gleam/string
import pog
import server_app/sql
import wisp.{type Request, type Response}

pub fn get_noise_data(req: Request, db: pog.Connection) -> Response {
  let params = wisp.get_query(req)

  let start_date = get_param(params, "start_date", "")
  let end_date = get_param(params, "end_date", "")
  let category = get_param(params, "category", "")
  let source = get_param(params, "source", "")
  let min_level = get_param(params, "min_level", "0") |> parse_int(0)
  let max_level = get_param(params, "max_level", "0") |> parse_int(0)

  case sql.noise_data_get(db, start_date, end_date, category, source, min_level, max_level) {
    Error(e) -> {
      wisp.log_alert("noise_data_get failed: " <> string_of_error(e))
      wisp.internal_server_error()
    }
    Ok(returned) -> {
      // Build each feature by inlining the raw geometry JSON string directly
      // rather than encoding it as a quoted string, so Leaflet receives a
      // proper GeoJSON object rather than a string value.
      let features =
        list.map(returned.rows, fn(row) {
          let properties =
            json.object([
              #("id", json.int(row.noisedataid)),
              #("source", json.string(row.source)),
              #("noiseclass", json.string(option.unwrap(row.noiseclass, ""))),
              #("noiseleveldb", json.int(option.unwrap(row.noiseleveldb, 0))),
              #("noisecategory", json.string(option.unwrap(row.noisecategory, ""))),
              #("severity", json.int(option.unwrap(row.severity, 0))),
              #("recordedat", json.string(row.recordedat)),
            ])
            |> json.to_string
          "{\"type\":\"Feature\",\"geometry\":"
          <> row.geometry
          <> ",\"properties\":"
          <> properties
          <> "}"
        })

      let geojson =
        "{\"type\":\"FeatureCollection\",\"features\":["
        <> string.join(features, ",")
        <> "]}"

      wisp.response(200)
      |> wisp.json_body(geojson)
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

fn get_param(params: List(#(String, String)), key: String, default: String) -> String {
  case list.key_find(params, key) {
    Ok(value) -> value
    Error(_) -> default
  }
}

fn parse_int(s: String, default: Int) -> Int {
  case int.parse(s) {
    Ok(n) -> n
    Error(_) -> default
  }
}

fn string_of_error(e: pog.QueryError) -> String {
  case e {
    pog.ConstraintViolated(msg, _, _) -> "ConstraintViolated: " <> msg
    pog.PostgresqlError(_, _, msg) -> "PostgresqlError: " <> msg
    pog.UnexpectedArgumentCount(expected, got) ->
      "UnexpectedArgumentCount: expected "
      <> int.to_string(expected)
      <> " got "
      <> int.to_string(got)
    pog.UnexpectedArgumentType(expected, got) ->
      "UnexpectedArgumentType: expected " <> expected <> " got " <> got
    pog.UnexpectedResultType(errors) ->
      "UnexpectedResultType: " <> int.to_string(list.length(errors)) <> " decode errors"
    pog.QueryTimeout -> "QueryTimeout"
    pog.ConnectionUnavailable -> "ConnectionUnavailable"
  }
}
