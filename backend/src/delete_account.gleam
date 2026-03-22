import gleam/json
import shared/delete_account_json
import gleam/dynamic/decode
import pog
import server_app/sql
import wisp.{type Request, type Response}


//deletes an account 
pub fn delete_account(req: Request, db: pog.Connection)-> Response{
  use json <- wisp.require_json(req)
  let assert Ok(item) =
    decode.run(json, delete_account_json.delete_item_decoder())
  let assert Ok(_) = sql.delete_user(db, item.user_id)
  wisp.ok()
}
