import gleam/dynamic/decode
import gleam/json
pub type Item {
  Item(id: String, description: String)
}
pub type PlanItem {
  PlanItem(
    id: String,
    name: String,
    status: String,
    zone: String,
    budget: Int,
    total_cost: Int,
    timeline: Int,
    interventions: List(String),
    impact: Int,
    notes: List(#(String, String)),
    evidence: List(#(String, String, String)),
    created_at: String,
  )
}

pub fn plan_item_to_json(plan_item: PlanItem) -> json.Json {
  let PlanItem(id:, name:, status:, zone:, budget:, total_cost:, timeline:, interventions:, impact:, notes:, evidence:, created_at:) = plan_item
  json.object([
    #("id", json.string(id)),
    #("name", json.string(name)),
    #("status", json.string(status)),
    #("zone", json.string(zone)),
    #("budget", json.int(budget)),
    #("total_cost", json.int(total_cost)),
    #("timeline", json.int(timeline)),
    #("interventions", json.array(interventions, json.string)),
    #("impact", json.int(impact)),
    #("notes", json.array(notes, fn(value) {
      json.preprocessed_array([
        json.string(value.0),
        json.string(value.1),
      ])
    })),
    #("evidence", json.array(evidence, fn(value) {
      json.preprocessed_array([
        json.string(value.0),
        json.string(value.1),
        json.string(value.2),
      ])
    })),
    #("created_at", json.string(created_at)),
  ])
}

pub fn plan_item_decoder() -> decode.Decoder(PlanItem) {
  use id <- decode.field("id", decode.string)
  use name <- decode.field("name", decode.string)
  use status <- decode.field("status", decode.string)
  use zone <- decode.field("zone", decode.string)
  use budget <- decode.field("budget", decode.int)
  use total_cost <- decode.field("total_cost", decode.int)
  use timeline <- decode.field("timeline", decode.int)
  use interventions <- decode.field("interventions", decode.list(decode.string))
  use impact <- decode.field("impact", decode.int)
  use notes <- decode.field("notes", decode.list({
    use a <- decode.field(0, decode.string)
    use b <- decode.field(1, decode.string)

    decode.success(#(a, b))
  }))
  use evidence <- decode.field("evidence", decode.list({
    use a <- decode.field(0, decode.string)
    use b <- decode.field(1, decode.string)
    use c <- decode.field(2, decode.string)

    decode.success(#(a, b, c))
  }))
  use created_at <- decode.field("created_at", decode.string)
  decode.success(PlanItem(id:, name:, status:, zone:, budget:, total_cost:, timeline:, interventions:, impact:, notes:, evidence:, created_at:))
}