import gleam/dynamic/decode
import gleam/json


pub type DeleteItem {
  DeleteItem(username: String, email: String)
}

pub fn delete_item_to_json(delete_item: DeleteItem) -> json.Json {
  let DeleteItem(username:, email:) = delete_item
  json.object([
    #("username", json.string(username)),
    #("email", json.string(email)),
  ])
}

pub fn delete_item_decoder() -> decode.Decoder(DeleteItem) {
  use username <- decode.field("username", decode.string)
  use email <- decode.field("email", decode.string)
  decode.success(DeleteItem(username:, email:))
}