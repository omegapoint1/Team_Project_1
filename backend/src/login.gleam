import gleam/option
import wisp.{type Request, type Response}
import pog
import gleam/dynamic/decode
import argus
import shared/login_json
import server_app/sql


pub fn extract_login_check(req: Request, db: pog.Connection) -> Response{
  use json <- wisp.require_json(req)
  let assert Ok(item) = decode.run(json, login_json.login_item_decoder())
  case handle_login_check(item, db){
    1 -> wisp.ok()
    _ ->wisp.bad_request("Request failed")
  }
}

pub fn handle_login_check(item: login_json.LoginItem, db: pog.Connection) -> Int {


  let password = item.password
  let username = item.username
  let assert Ok(data) = sql.login(db, username)

  let db_password = case data.rows {
    [row] -> row.password
    _ -> ""
  }

  case argus.verify(db_password, password)
  {
    Ok(True) -> 1
    Ok(False) -> -1
    Error(_) -> -1
  }  
}

pub fn extract_register(req: Request, db: pog.Connection) -> Response{
  use json <- wisp.require_json(req)
  let assert Ok(item) = decode.run(json, login_json.login_item_decoder())
  case handle_register(item, db) {
    1 -> wisp.ok()
    _ -> wisp.bad_request("register failed")
  }
}
pub fn handle_register(item: login_json.LoginItem, db: pog.Connection) -> Int {

  let password = item.password
  let username = item.username

  let salt = argus.gen_salt()
  wisp.log_alert(password)
  wisp.log_alert(username)
  let assert Ok(hashes) =
    argus.hasher()
    |> argus.algorithm(argus.Argon2id)
    |> argus.time_cost(3)
    |> argus.memory_cost(12228) // 
    |> argus.parallelism(1)
    |> argus.hash_length(32)
    |> argus.hash(password, salt)

  case sql.register(db, username, hashes.encoded_hash) {
    Ok(_) -> 1
    Error(_) -> {
      wisp.log_alert("err")
      -1
  }

  }
}


