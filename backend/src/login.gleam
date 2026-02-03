import gleam/io
import wisp.{type Request, type Response}
import pog
import gleam/http.{Get, Post}
import gleam/dynamic/decode
import argus
import shared/login
import server_app/sql
import gleam/option

fn handle_login_check(req: Request, db: pog.Connection) -> Response {

  use json <- wisp.require_json(req)
  let assert Ok(item) = decode.run(json, login.login_item_decoder())

  let password = item.password
  let username = item.username
  let assert Ok(data) = sql.login(db, username)

  let db_password = case data.rows {
    [row] -> row.password
    _ -> ""
  }


  case argus.verify(db_password, password)
  {
    Ok(True) -> wisp.ok()
    Ok(False) -> wisp.bad_request("Request failed")
    Error(_) -> wisp.bad_request("Request failed")
  }

  
}


fn handle_register(req: Request, db: pog.Connection) -> Response {
  use json <- wisp.require_json(req)
  let assert Ok(item) = decode.run(json, login.login_item_decoder())

  let password = item.password
  let username = item.username

  let salt = argus.gen_salt()

  let assert Ok(hashes) =
    argus.hasher()
    |> argus.algorithm(argus.Argon2id)
    |> argus.time_cost(3)
    |> argus.memory_cost(12228) // 
    |> argus.parallelism(1)
    |> argus.hash_length(32)
    |> argus.hash(password, salt)

  case sql.register(db, username, hashes.encoded_hash) {
    Ok(_) -> wisp.ok()
    Error(_) -> wisp.bad_request("Request failed")
  }


}


