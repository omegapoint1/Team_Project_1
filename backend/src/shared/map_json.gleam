import gleam/dynamic/decode
import gleam/json

pub type MapDataItem{
  MapDataItem(
    lat: Float,
    long: Float,
    noise: Int,
    time: String,
    category: String
  )
}

pub fn map_data_item_to_json(map_data_item: MapDataItem) -> json.Json {
  let MapDataItem(lat:, long:, noise:, time:, category:) = map_data_item
  json.object([
    #("lat", json.float(lat)),
    #("long", json.float(long)),
    #("noise", json.int(noise)),
    #("time", json.string(time)),
    #("category", json.string(category)),
  ])
}

pub fn map_data_item_decoder() -> decode.Decoder(MapDataItem) {
  use lat <- decode.field("lat", decode.float)
  use long <- decode.field("long", decode.float)
  use noise <- decode.field("noise", decode.int)
  use time <- decode.field("time", decode.string)
  use category <- decode.field("category", decode.string)
  decode.success(MapDataItem(lat:, long:, noise:, time:, category:))
}

