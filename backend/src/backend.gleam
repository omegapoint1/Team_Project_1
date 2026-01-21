import wisp.{type Request, type Response}
import wisp/wisp_mist
import pog
import gleam/erlang/process
import mist
import gleam/http.{Get, Post}
import gleam/dynamic/decode
import argus
import shared/login





pub fn main() {
  wisp.configure_logger()
  let secret_key_base = wisp.random_string(64)
  let assert Ok(priv_directory) = wisp.priv_directory("backend")
  let static_directory = priv_directory <> "/static"
  let pool_name = process.new_name("db_name")

  let pool_child = 
    pog.default_config(pool_name)
    |> pog.user("alex")
    |> pog.database("user_db")
    |> pog.pool_size(15)
    |> pog.start
  let db = pog.named_connection(pool_name)

  let assert Ok(_) =
    handle_request(static_directory, _, db)
    |> wisp_mist.handler(secret_key_base)
    |> mist.new
    |> mist.port(3000)
    |> mist.start

    process.sleep_forever()

}


fn app_middleware(
  req: Request,
  static_directory: String,
  next: fn(Request) -> Response
) -> Response {
  let req = wisp.method_override(req)
  use <- wisp.log_request(req)
  use <- wisp.rescue_crashes
  use req <- wisp.handle_head(req)
  use <- wisp.serve_static(req, under: "/static", from: static_directory)
  next(req)
}


fn handle_request(
  static_directory: String,
  req: Request,
  db: pog.Connection
) -> Response {
  use req <- app_middleware(req, static_directory)
  case req.method, wisp.path_segments(req) {
    _, _ -> wisp.not_found()
  }
}