import gleam/dynamic/decode
import gleam/json

pub type ReportItem {
  ReportItem(
    noisetype: String,
    datetime: String,
    severity: Int,
    description: String,
    location_of_noise: String,
    tags: List(String))
}

pub fn report_item_decoder() -> decode.Decoder(ReportItem) {
  use noisetype <- decode.field("noisetype", decode.string)
  use datetime <- decode.field("datetime", decode.string)
  use severity <- decode.field("severity", decode.int)
  use description <- decode.field("description", decode.string)
  use location_of_noise <- decode.field("location_of_noise", decode.string)
  use tags <- decode.field("tags", decode.list(decode.string))

  decode.success(ReportItem(noisetype:, datetime:, severity:, description:, location_of_noise:, tags:))
}

pub fn report_item_to_json(report_item: ReportItem) -> json.Json {
  let ReportItem(noisetype:, datetime:, severity:, description:, location_of_noise:, tags:) = report_item
  json.object([
    #("noisetype", json.string(noisetype)),
    #("datetime", json.string(datetime)),
    #("severity", json.int(severity)),
    #("description", json.string(description)),
    #("location_of_noise", json.string(location_of_noise)),
    #("tags", json.array(tags, json.string))])
}


