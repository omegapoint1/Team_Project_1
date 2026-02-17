import gleam/dynamic/decode
import gleam/json

pub type HotspotsItem{
  HotspotsItem(
    hotspots: List(#(Int, String)),
  )
}

pub fn hotspots_item_to_json(hotspots_item: HotspotsItem) -> json.Json {
  let HotspotsItem(hotspots:) = hotspots_item
  json.object([
    #("hotspots", json.array(hotspots, fn(value) {
      json.preprocessed_array([
        json.int(value.0),
        json.string(value.1),
      ])
    })),
  ])
}

pub fn hotspots_item_decoder() -> decode.Decoder(HotspotsItem) {
  use hotspots <- decode.field("hotspots", decode.list({
    use a <- decode.field(0, decode.int)
    use b <- decode.field(1, decode.string)

    decode.success(#(a, b))
  }))
  decode.success(HotspotsItem(hotspots:))
}

