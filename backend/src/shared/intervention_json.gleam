import gleam/dynamic/decode
import gleam/json

pub type InterventionItem{
  InterventionItem(
    id: String,
    name: String,
    category: String,
    description: String,
    cost: #(Int, Int),
    impact: #(Int, Int),
    feasibility: Int,
    tags: List(String),
    created_at: String
  )
}

pub fn intervention_item_to_json(intervention_item: InterventionItem) -> json.Json {
  let InterventionItem(id:, name:, category:, description:, cost:, impact:, feasibility:, tags:, created_at:) = intervention_item
  json.object([
    #("id", json.string(id)),
    #("name", json.string(name)),
    #("category", json.string(category)),
    #("description", json.string(description)),
    #("cost", json.preprocessed_array([
      json.int(cost.0),
      json.int(cost.1),
    ])),
    #("impact", json.preprocessed_array([
      json.int(impact.0),
      json.int(impact.1),
    ])),
    #("feasibility", json.int(feasibility)),
    #("tags", json.array(tags, json.string)),
    #("created_at", json.string(created_at)),
  ])
}

pub fn intervention_item_decoder() -> decode.Decoder(InterventionItem) {
  use id <- decode.field("id", decode.string)
  use name <- decode.field("name", decode.string)
  use category <- decode.field("category", decode.string)
  use description <- decode.field("description", decode.string)
  use cost <- decode.field("cost", {
    use a <- decode.field(0, decode.int)
    use b <- decode.field(1, decode.int)

    decode.success(#(a, b))
  })
  use impact <- decode.field("impact", {
    use a <- decode.field(0, decode.int)
    use b <- decode.field(1, decode.int)

    decode.success(#(a, b))
  })
  use feasibility <- decode.field("feasibility", decode.int)
  use tags <- decode.field("tags", decode.list(decode.string))
  use created_at <- decode.field("created_at", decode.string)
  decode.success(InterventionItem(id:, name:, category:, description:, cost:, impact:, feasibility:, tags:, created_at:))
}
