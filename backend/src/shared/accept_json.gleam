import gleam/dynamic/decode
import gleam/json

pub type AcceptItem{
  AcceptItem(
    id: Int,
    accepted: String,
  )
}pub fn accept_item_decoder() -> decode.Decoder(AcceptItem) {
  use id <- decode.field("id", decode.int)
  use accepted <- decode.field("accepted", decode.string)
  decode.success(AcceptItem(id:, accepted:))
}
