import gleam/io
import wisp.{type Request, type Response}
import wisp/wisp_mist
import pog
import gleam/erlang/process
import mist
import gleam/http.{Get, Post}
import gleam/dynamic/decode
import argus
import lustre/attribute
import lustre/element
import lustre/element/html
import login
import report

pub fn main() {
  wisp.configure_logger()
  let secret_key_base = wisp.random_string(64)
  let assert Ok(priv_directory) = wisp.priv_directory("backend")
  let static_directory = priv_directory <> "/static"
  let pool_name = process.new_name("db_name")
  io.print(static_directory)

  let pool_child = 
    pog.default_config(pool_name)
    |> pog.user("admin")
    |> pog.database("testdb")
    |> pog.pool_size(15)
    |> pog.port(5432)
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
    Post, ["api", "login"] -> login.handle_login_check(req, db)
    Post, ["api", "register"] -> login.handle_register(req, db)
    Post, ["api", "report"] -> report.store_report(req, db)
    Get, _ -> serve_index()
    _, _ -> wisp.not_found()
  }
}


fn serve_index() -> Response {
  let html =
    html.html([], [
      html.head([], [
        html.title([], "HTML migrator"),
        html.script(
          [attribute.type_("module"), attribute.src("/static/LoginPage.jsx")],
          "",
        ),
        html.link([
          attribute.href("/static/LoginPage.css"),
          attribute.rel("stylesheet"),
        ]),
      ]),
      html.body([], [html.div([attribute.id("app")], [])]),
    ])
      html
  |> element.to_document_string
  |> wisp.html_response(200)
}


