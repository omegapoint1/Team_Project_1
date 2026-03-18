import gleam/dynamic/decode
import gleam/json
import gleam/list
import gleam/option
import pog
import server_app/sql
import shared/scenario_json
import wisp.{type Request, type Response}

pub fn extract_scenario_store(req: Request, db: pog.Connection) -> Response {
  use json <- wisp.require_json(req)
  let assert Ok(item) = decode.run(json, scenario_json.scenario_item_decoder())
  case store_scenario(item, db) {
    "" -> wisp.bad_request("report storage error")
    _ -> wisp.ok()
  }
}

pub fn store_scenario(item: scenario_json.ScenarioItem, db: pog.Connection) -> String {
  let id = item.id
  let name = item.name
  let description = item.description
  let intervention_ids = item.intervention_ids
  let metrics = item.metrics
  let scores = item.scores
  let user_id = item.user_id
  let created_at = item.created_at
  let updated_at = item.updated_at


  let assert Ok(_) =
    sql.scenario_insert(
      db,
      id,
      name,
      description,
      json.array(intervention_ids, json.string),
      json.preprocessed_array([
      json.int(metrics.0),
      json.preprocessed_array([
        json.int(metrics.1.0),
        json.int(metrics.1.1),
      ]),
      json.float(metrics.2),
      json.string(metrics.3),
    ]),
    json.preprocessed_array([
      json.float(scores.0),
      json.float(scores.1),
      json.float(scores.2),
      json.float(scores.3),
    ]),
    user_id,
    created_at,
    updated_at
    )
    id
}

pub fn extract_scenario_get(db: pog.Connection, scenario_id) -> scenario_json.ScenarioItem {
  let assert Ok(scenario) = sql.scenario_get(db, scenario_id)
  let assert Ok(scenario_data) = list.first(scenario.rows)

  let assert Ok(inter_item) =
    json.parse(
      option.unwrap(scenario_data.interventionids, ""),
      decode.list(decode.string),
    )
  let assert Ok(metrics_item) =
    json.parse(
      option.unwrap(scenario_data.metrics, ""),
      {
        use a <- decode.field(0, decode.int)
        use b <- decode.field(1, {
        use a <- decode.field(0, decode.int)
        use b <- decode.field(1, decode.int)
        decode.success(#(a, b))
      })
      use c <- decode.field(2, decode.float)
      use d <- decode.field(3, decode.string)

      decode.success(#(a, b, c, d))
    },
    )
  let assert Ok(scores_item) =
    json.parse(
      option.unwrap(scenario_data.scores, ""),
      {
        use a <- decode.field(0, decode.float)
        use b <- decode.field(1, decode.float)
        use c <- decode.field(2, decode.float)
        use d <- decode.field(3, decode.float)

        decode.success(#(a, b, c, d))
      },
    )

  scenario_json.ScenarioItem(
    id: scenario_data.id,
    name: scenario_data.name,
    description: option.unwrap(scenario_data.description, ""),
    intervention_ids: inter_item,
    metrics: metrics_item,
    scores: scores_item,
    user_id: option.unwrap(scenario_data.user_id, 0),
    created_at: option.unwrap(scenario_data.created_at, ""),
    updated_at: option.unwrap(scenario_data.updated_at, ""),
  )
}

pub fn get_all_scenarios(db: pog.Connection) -> Response {
  let assert Ok(scenario_ids) = sql.scenario_get_ids(db)
  let plans =
    list.map(scenario_ids.rows, fn(row) {
      extract_scenario_get(db, row.id)
    })
  let scenarios_encoded =
    json.array(plans, scenario_json.scenario_item_to_json)
    |> json.to_string()
  wisp.log_alert(scenarios_encoded)
  wisp.response(200)
  |> wisp.json_body(scenarios_encoded)
}
