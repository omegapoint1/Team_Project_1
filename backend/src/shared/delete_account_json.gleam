import gleam/dynamic/decode
import gleam/json


pub type DeleteItem {
  DeleteItem(user_id: Int)
}

pub fn delete_item_to_json(delete_item: DeleteItem) -> json.Json {
  let DeleteItem(user_id:) = delete_item
  json.object([
    #("user_id", json.int(user_id)),
  ])
}

pub fn delete_item_decoder() -> decode.Decoder(DeleteItem) {
  use user_id <- decode.field("user_id", decode.int)
  decode.success(DeleteItem(user_id:))
}
