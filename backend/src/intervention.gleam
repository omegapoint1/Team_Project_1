import gleam/dynamic/decode
import gleam/json
import gleam/list
import gleam/option
import pog
import server_app/sql
import shared/intervention_json
import wisp.{type Request, type Response}

pub fn extract_inter_store(req: Request, db: pog.Connection) -> Response {
  use json <- wisp.require_json(req)
  let assert Ok(item) =
    decode.run(json, intervention_json.intervention_item_decoder())
  case store_inter(item, db) {
    "" -> wisp.bad_request("report storage error")
    _ -> wisp.ok()
  }
}

pub fn store_inter(
  item: intervention_json.InterventionItem,
  db: pog.Connection,
) -> String {
  let id = item.id
  let name = item.name
  let category = item.category
  let description = item.description
  let cost = item.cost
  let impact = item.impact
  let feasibility = item.feasibility
  let tags = item.tags
  let created_at = item.created_at

  let assert Ok(_) =
    sql.intervention_insert(
      db,
      id,
      name,
      category,
      description,
      json.preprocessed_array([
        json.int(cost.0),
        json.int(cost.1),
      ]),
      json.preprocessed_array([
        json.int(impact.0),
        json.int(impact.1),
      ]),
      feasibility,
      json.array(tags, json.string),
      created_at,
    )
  id
}


pub fn extract_intervention_get(db: pog.Connection, intervention_id) -> intervention_json.InterventionItem {
  let assert Ok(intervention) = sql.intervention_get(db, intervention_id)
  let assert Ok(intervention_data) = list.first(intervention.rows)

  let assert Ok(cost_item) =
    json.parse(
      option.unwrap(intervention_data.cost, ""),
      {
        use a <- decode.field(0, decode.int)
        use b <- decode.field(1, decode.int)
        decode.success(#(a, b))
      },
      )
  let assert Ok(impact_item) =
    json.parse(
      option.unwrap(intervention_data.impact, ""),
      {
        use a <- decode.field(0, decode.int)
        use b <- decode.field(1, decode.int)
        decode.success(#(a, b))
      })
      let assert Ok(tags_item) =
      json.parse(
        option.unwrap(intervention_data.tags, ""),
        decode.list(decode.string),
      )

  intervention_json.InterventionItem(
    id: intervention_data.interventionid,
    name: intervention_data.name,
    category: option.unwrap(intervention_data.category, ""),
    description: option.unwrap(intervention_data.description, ""),
    cost: cost_item,
    impact: impact_item,
    feasibility: option.unwrap(intervention_data.feasibility, 0),
    tags: tags_item,
    created_at: option.unwrap(intervention_data.created_at, ""),

  )
}

pub fn get_all_interventions(db: pog.Connection) -> Response {
  let assert Ok(inter_ids) = sql.intervention_get_ids(db)
  let interventions =
    list.map(inter_ids.rows, fn(row) {
      extract_intervention_get(db, row.interventionid)
    })
  let inter_encoded =
    json.array(interventions, intervention_json.intervention_item_to_json)
    |> json.to_string()
  wisp.log_alert(inter_encoded)
  wisp.response(200)
  |> wisp.json_body(inter_encoded)
}
