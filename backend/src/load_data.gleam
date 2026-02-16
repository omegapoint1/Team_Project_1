import gleam/dynamic/decode
import gleam/io
import gleam/list
import gleam/result
import gleam/string
import pog
import simplifile

pub fn run(db: pog.Connection, filepath: String) -> Nil {
  let count_decoder = {
    use count <- decode.field(0, decode.int)
    decode.success(count)
  }
  let already_loaded = case
    "SELECT COUNT(*)::int FROM NOISE_DATA"
    |> pog.query
    |> pog.returning(count_decoder)
    |> pog.execute(db)
  {
    Ok(returned) ->
      case returned.rows {
        [count, ..] -> count > 0
        _ -> False
      }
    Error(_) -> False
  }

  case already_loaded {
    True -> io.println("NOISE_DATA already populated, skipping load.")
    False -> load(db, filepath)
  }
}

fn load(db: pog.Connection, filepath: String) -> Nil {
  io.println("Loading GeoJSON from " <> filepath <> " …")

  case simplifile.read(filepath) {
    Error(_) -> {
      io.println("Could not read file: " <> filepath)
    }
    Ok(raw) -> {
      let features = split_features(raw)
      io.println(
        "Found " <> string.inspect(list.length(features)) <> " features",
      )
      let inserted =
        features
        |> list.filter_map(parse_feature)
        |> list.fold(0, fn(count, feature) {
          let #(noiseclass, geometry_json) = feature
          let #(db_level, severity, category) = map_noiseclass(noiseclass)
          case
            insert_row(
              db,
              geometry_json,
              noiseclass,
              db_level,
              severity,
              category,
            )
          {
            Ok(_) -> count + 1
            Error(e) -> {
              io.println("Insert failed: " <> string.inspect(e))
              count
            }
          }
        })
      io.println("Inserted " <> string.inspect(inserted) <> " rows.")
    }
  }
}

fn split_features(raw: String) -> List(String) {
  raw
  |> string.split("{ \"type\": \"Feature\"")
  |> list.drop(1)
  |> list.map(fn(s) { "{ \"type\": \"Feature\"" <> s })
}

fn parse_feature(feature: String) -> Result(#(String, String), Nil) {
  use noiseclass <- result.try(extract_noiseclass(feature))
  use geometry <- result.try(extract_geometry(feature))
  Ok(#(noiseclass, geometry))
}

fn extract_noiseclass(feature: String) -> Result(String, Nil) {
  case string.split_once(feature, "\"noiseclass\": \"") {
    Error(_) -> Error(Nil)
    Ok(#(_, rest)) ->
      case string.split_once(rest, "\"") {
        Error(_) -> Error(Nil)
        Ok(#(value, _)) -> Ok(value)
      }
  }
}

fn extract_geometry(feature: String) -> Result(String, Nil) {
  case string.split_once(feature, "\"geometry\": ") {
    Error(_) -> Error(Nil)
    Ok(#(_, rest)) -> Ok(extract_json_object(rest))
  }
}

fn extract_json_object(s: String) -> String {
  do_extract(s, "", 0)
}

fn do_extract(remaining: String, acc: String, depth: Int) -> String {
  case string.pop_grapheme(remaining) {
    Error(_) -> acc
    Ok(#(char, rest)) -> {
      let new_acc = acc <> char
      case char {
        "{" -> do_extract(rest, new_acc, depth + 1)
        "}" if depth == 1 -> new_acc
        "}" -> do_extract(rest, new_acc, depth - 1)
        _ -> do_extract(rest, new_acc, depth)
      }
    }
  }
}

fn map_noiseclass(noiseclass: String) -> #(Int, Int, String) {
  case noiseclass {
    "40.0-44.9" -> #(42, 1, "quiet")
    "45.0-49.9" -> #(47, 2, "quiet")
    "50.0-54.9" -> #(52, 3, "moderate")
    "55.0-59.9" -> #(57, 4, "moderate")
    "60.0-64.9" -> #(62, 5, "moderate")
    "65.0-69.9" -> #(67, 6, "loud")
    "70.0-74.9" -> #(72, 7, "loud")
    "75.0-79.9" -> #(77, 8, "loud")
    "80.0-84.9" -> #(82, 9, "very_loud")
    ">=75.0" -> #(87, 10, "very_loud")
    _ -> #(0, 0, "")
  }
}

fn insert_row(
  db: pog.Connection,
  geometry_json: String,
  noiseclass: String,
  db_level: Int,
  severity: Int,
  category: String,
) -> Result(pog.Returned(Nil), pog.QueryError) {
  let decoder = decode.map(decode.dynamic, fn(_) { Nil })
  "INSERT INTO NOISE_DATA
    (Source, Geometry, NoiseClass, NoiseLevelDb, NoiseCategory, Severity, RecordedAt)
  VALUES (
    'amsterdam_dataset',
    $1::jsonb,
    $2,
    $3,
    $4,
    $5,
    NOW()
      - INTERVAL '1 day'    * (180 + floor(random() * 185))::int
      + INTERVAL '1 hour'   * (CASE floor(random() * 16)::int
                                 WHEN 0 THEN 7
                                 WHEN 1 THEN 8
                                 WHEN 2 THEN 17
                                 WHEN 3 THEN 18
                                 ELSE floor(random() * 24)::int
                               END)
      + INTERVAL '1 minute' * floor(random() * 60)::int
  )"
  |> pog.query
  |> pog.parameter(pog.text(geometry_json))
  |> pog.parameter(pog.text(noiseclass))
  |> pog.parameter(pog.int(db_level))
  |> pog.parameter(pog.text(category))
  |> pog.parameter(pog.int(severity))
  |> pog.returning(decoder)
  |> pog.execute(db)
}
