import gleam/dynamic/decode
import gleam/json
import gleam/list
import gleam/option
import pog
import server_app/sql
import shared/plan_json
import wisp.{type Request, type Response}

pub fn extract_plan_store(req: Request, db: pog.Connection) -> Response {
  use json <- wisp.require_json(req)
  let assert Ok(item) = decode.run(json, plan_json.plan_item_decoder())
  case store_plan(item, db) {
    "" -> wisp.bad_request("report storage error")
    _ -> wisp.ok()
  }
}

pub fn store_plan(item: plan_json.PlanItem, db: pog.Connection) -> String {
  let id = item.id
  let name = item.name
  let status = item.status
  let zone = item.zone
  let budget = item.budget
  let total_cost = item.total_cost
  let timeline = item.timeline
  let interventions = item.interventions
  let impact = item.impact
  let notes = item.notes
  let evidence = item.evidence
  let created_at = item.created_at
  json.array(interventions, json.string)

  let assert Ok(_) =
    sql.plan_insert(

      db,
      id,
      name,
      status,
      zone,
      budget,
      total_cost,
      timeline,
      impact,
      created_at,
      json.array(interventions, json.string),
      json.array(notes, fn(value) {
        json.preprocessed_array([
          json.string(value.0),
          json.string(value.1),
        ])
      }),
      json.array(evidence, fn(value) {
        json.preprocessed_array([
          json.string(value.0),
          json.string(value.1),
          json.string(value.2),
        ])
      }),
    )
  id
}

pub fn extract_plan_get(db: pog.Connection, plan_id) -> plan_json.PlanItem {
  let assert Ok(plan) = sql.plan_get(db, plan_id)
  let assert Ok(plan_data) = list.first(plan.rows)

  let assert Ok(inter_item) =
    json.parse(
      option.unwrap(plan_data.interventions, ""),
      decode.list(decode.string),
    )
  let assert Ok(notes_item) =
    json.parse(option.unwrap(plan_data.notes, ""), 
      decode.list({
        use a <- decode.field(0, decode.string)
        use b <- decode.field(1, decode.string)
        decode.success(#(a, b))
      }))
  let assert Ok(evidence_item) =
    json.parse(option.unwrap(plan_data.evidence, ""),     decode.list({
      use a <- decode.field(0, decode.string)
      use b <- decode.field(1, decode.string)
      use c <- decode.field(2, decode.string)

      decode.success(#(a, b, c))
    }),)


  plan_json.PlanItem(
    id: plan_data.interventionplanid,
    name: plan_data.name,
    status: option.unwrap(plan_data.status, ""),
    zone: option.unwrap(plan_data.zone, ""),
    budget: option.unwrap(plan_data.budget, 0),
    total_cost: option.unwrap(plan_data.totalcost, 0),
    timeline: option.unwrap(plan_data.timeline, 0),
    interventions: inter_item,
    impact: option.unwrap(plan_data.impact, 0),
    notes: notes_item,
    evidence: evidence_item,
    created_at: option.unwrap(plan_data.createdat, ""),
  )
}

