import argus
import gleam/dynamic/decode
import gleam/json
import gleam/option.{None, Some}
import pog
import server_app/sql
import shared/login_json
import wisp.{type Request, type Response}

pub fn extract_login_check(req: Request, db: pog.Connection) -> Response {
  use json <- wisp.require_json(req)
  let assert Ok(item) = decode.run(json, login_json.login_item_decoder())
  case handle_login_check(item, db) {
    Ok(user_info) -> {
      let role = case user_info.admin {
        Ok(True) -> "planner"
        Ok(False) -> "citizen"
        Error(_) -> "citizen"
      }
      let response_json =
        json.object([
          #("user", json.object([#("role", json.string(role)), #("id", json.int(user_info.user_id))])),
        ])
      wisp.json_response(json.to_string(response_json), 200)
    }
    Error(_) -> wisp.bad_request("Invalid email or password")
  }
}

pub fn handle_login_check(
  item: login_json.LoginItem,
  db: pog.Connection,
) -> Result(LoginWithUserInfo, Nil) {
  let password = item.password
  let username = item.username

  case sql.login_with_user(db, username) {
    Ok(data) -> {
      case data.rows {
        [row] -> {
          case argus.verify(row.password, password) {
            Ok(True) -> {
              let admin = case row.admin {
                Some(value) -> Ok(value)
                None -> Error(Nil)
              }
              Ok(LoginWithUserInfo(user_id: row.user_id, admin:))
            }
            Ok(False) -> Error(Nil)
            Error(_) -> Error(Nil)
          }
        }
        _ -> Error(Nil)
      }
    }
    Error(_) -> Error(Nil)
  }
}

pub type LoginWithUserInfo {
  LoginWithUserInfo(user_id: Int, admin: Result(Bool, Nil))
}

pub fn extract_register(req: Request, db: pog.Connection) -> Response {
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
  let assert Ok(hashes) =
    argus.hasher()
    |> argus.algorithm(argus.Argon2id)
    |> argus.time_cost(3)
    |> argus.memory_cost(12_228)
    // 
    |> argus.parallelism(1)
    |> argus.hash_length(32)
    |> argus.hash(password, salt)

  let user_id = case sql.register(db, username, hashes.encoded_hash) {
    Ok(db_user_id) -> {
      case db_user_id.rows {
        [row] -> row.userid
        _ -> -1
      }
    }
    Error(_) -> {
      wisp.log_alert("err")
      -1
    }
  }
  case user_id {
    -1 -> -1
    n -> {
      let _ = case username {
        "alex.hinde@icloud.com" -> {
          let assert Ok(_) = sql.create_user(db, n, username, True)
        }

        _ -> {
          let assert Ok(_) = sql.create_user(db, n, username, False)
        }
      }
      1
    }
  }
}
