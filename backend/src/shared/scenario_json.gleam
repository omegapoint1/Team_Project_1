import gleam/dynamic/decode
import gleam/json

pub type ScenarioItem{
  ScenarioItem(
    id: String,
    name: String,
    description: String,
    intervention_ids: List(String),
    metrics: #(Int, #(Int, Int), Float, String),
    scores: #(Float, Float, Float, Float),
    user_id: Int,
    created_at: String,
    updated_at: String
    )
}

pub fn scenario_item_to_json(scenario_item: ScenarioItem) -> json.Json {
  let ScenarioItem(id:, name:, description:, intervention_ids:, metrics:, scores:, user_id:, created_at:, updated_at:) = scenario_item
  json.object([
    #("id", json.string(id)),
    #("name", json.string(name)),
    #("description", json.string(description)),
    #("intervention_ids", json.array(intervention_ids, json.string)),
    #("metrics", json.preprocessed_array([
      json.int(metrics.0),
      json.preprocessed_array([
        json.int(metrics.1.0),
        json.int(metrics.1.1),
      ]),
      json.float(metrics.2),
      json.string(metrics.3),
    ])),
    #("scores", json.preprocessed_array([
      json.float(scores.0),
      json.float(scores.1),
      json.float(scores.2),
      json.float(scores.3),
    ])),
    #("user_id", json.int(user_id)),
    #("created_at", json.string(created_at)),
    #("updated_at", json.string(updated_at)),
  ])
}

pub fn scenario_item_decoder() -> decode.Decoder(ScenarioItem) {
  use id <- decode.field("id", decode.string)
  use name <- decode.field("name", decode.string)
  use description <- decode.field("description", decode.string)
  use intervention_ids <- decode.field("intervention_ids", decode.list(decode.string))
  use metrics <- decode.field("metrics", {
    use a <- decode.field(0, decode.int)
    use b <- decode.field(1, {
      use a <- decode.field(0, decode.int)
      use b <- decode.field(1, decode.int)

      decode.success(#(a, b))
    })
    use c <- decode.field(2, decode.float)
    use d <- decode.field(3, decode.string)

    decode.success(#(a, b, c, d))
  })
  use scores <- decode.field("scores", {
    use a <- decode.field(0, decode.float)
    use b <- decode.field(1, decode.float)
    use c <- decode.field(2, decode.float)
    use d <- decode.field(3, decode.float)

    decode.success(#(a, b, c, d))
  })
  use user_id <- decode.field("user_id", decode.int)
  use created_at <- decode.field("created_at", decode.string)
  use updated_at <- decode.field("updated_at", decode.string)
  decode.success(ScenarioItem(id:, name:, description:, intervention_ids:, metrics:, scores:, user_id:, created_at:, updated_at:))
}
