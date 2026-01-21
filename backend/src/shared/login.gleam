import gleam/dynamic/decode
import gleam/json


pub type LoginItem {
  LoginItem(username: String, password: String)
}


pub fn login_item_decoder() -> decode.Decoder(LoginItem) {
  use username <- decode.field("username", decode.string)
  use password <- decode.field("password", decode.string)
  decode.success(LoginItem(username:, password:))
}

pub fn login_item_to_json(login_item: LoginItem) -> json.Json {
  let LoginItem(username:, password:) = login_item
  json.object([#("username", json.string(username)), #("password", json.string(password))])
}