import gleam/dynamic/decode
import gleam/json

pub type ReportItem {
  ReportItem(
    noisetype: String,
    datetime: String,
    severity: String,
    description: String,
    location_of_noise: String,
    zone: String,
    tags: List(String),
    lat: String,
    long: String)
}

pub fn report_item_to_json(report_item: ReportItem) -> json.Json {
  let ReportItem(noisetype:, datetime:, severity:, description:, location_of_noise:, zone:, tags:, lat:, long:) = report_item
  json.object([
    #("noisetype", json.string(noisetype)),
    #("datetime", json.string(datetime)),
    #("severity", json.string(severity)),
    #("description", json.string(description)),
    #("location_of_noise", json.string(location_of_noise)),
    #("zone", json.string(zone)),
    #("tags", json.array(tags, json.string)),
    #("lat", json.string(lat)),
    #("long", json.string(long)),
  ])
}

pub fn report_item_decoder() -> decode.Decoder(ReportItem) {
  use noisetype <- decode.field("noisetype", decode.string)
  use datetime <- decode.field("datetime", decode.string)
  use severity <- decode.field("severity", decode.string)
  use description <- decode.field("description", decode.string)
  use location_of_noise <- decode.field("location_of_noise", decode.string)
  use zone <- decode.field("zone", decode.string)
  use tags <- decode.field("tags", decode.list(decode.string))
  use lat <- decode.field("lat", decode.string)
  use long <- decode.field("long", decode.string)
  decode.success(ReportItem(noisetype:, datetime:, severity:, description:, location_of_noise:, zone:, tags:, lat:, long:))
}

