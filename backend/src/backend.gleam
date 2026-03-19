import gleam/erlang/process
import gleam/http.{Get, Options, Post}
import gleam/int
import gleam/io
import gleam/option
import hotspot
import intervention
import load_data
import login
import lustre/attribute
import lustre/element
import lustre/element/html
import mist
import noise
import plan
import pog
import quest
import report
import wisp.{type Request, type Response}
import wisp/wisp_mist
import map_data

pub fn main() {
  wisp.configure_logger()
  let secret_key_base = wisp.random_string(64)
  let assert Ok(priv_directory) = wisp.priv_directory("backend")
  let static_directory = priv_directory <> "/static"
  let pool_name = process.new_name("db_name")
  io.print(static_directory)

  let _ =
    pog.default_config(pool_name)
    |> pog.user("admin")
    |> pog.database("testdb")
    |> pog.password(option.Some("admin"))
    |> pog.pool_size(15)
    |> pog.port(5432)
    |> pog.host("db")
    |> pog.start
  let db = pog.named_connection(pool_name)
  map_data.generate_map_data(db)
  report.generate_reports(db)
  quest.generate_initial_quests(db)
  let assert Ok(_) =
    handle_request(static_directory, _, db)
    |> wisp_mist.handler(secret_key_base)
    |> mist.new
    |> mist.port(3000)
    |> mist.bind("0.0.0.0")
    |> mist.start

  load_data.run(db, priv_directory <> "/road_noise.geojson")

  process.sleep_forever()
}

fn app_middleware(
  req: Request,
  static_directory: String,
  next: fn(Request) -> Response,
) -> Response {
  let req = wisp.method_override(req)
  use <- wisp.log_request(req)
  use <- wisp.rescue_crashes
  use req <- wisp.handle_head(req)
  use <- wisp.serve_static(req, under: "/static", from: static_directory)
  let response = next(req)
  response
  |> wisp.set_header("Access-Control-Allow-Origin", "http://localhost:5173")
  |> wisp.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  |> wisp.set_header("Access-Control-Allow-Headers", "Content-Type")
}

fn handle_request(
  static_directory: String,
  req: Request,
  db: pog.Connection,
) -> Response {
  use req <- app_middleware(req, static_directory)
  case req.method, wisp.path_segments(req) {
    Options, _ ->
      wisp.response(200)
      |> wisp.set_header("Access-Control-Allow-Origin", "http://localhost:5173")
      |> wisp.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
      |> wisp.set_header("Access-Control-Allow-Headers", "Content-Type")
    Post, ["api", "login"] -> login.extract_login_check(req, db)
    Post, ["api", "register"] -> login.extract_register(req, db)
    Post, ["api", "report", "store"] -> report.extract_report_store(req, db)
    Get, ["api", "report", "get"] -> report.get_all_reports(db)
    Get, ["api", "noise-data"] -> noise.get_noise_data(req, db)
    Get, ["api", "hotspots"] -> hotspot.get_hotspots(req, db)
    Get, ["api", "hotspots", "dashboard"] -> hotspot.get_hotspots_small(db)
    Post, ["api", "report", "accept"] -> report.extract_approve_report(req, db)
    Post, ["api", "intervention-plan", "store"] ->
      plan.extract_plan_store(req, db)
    Get, ["api", "intervention-plan", "get"] -> plan.get_all_plans(db)
    Post, ["api", "intervention", "store"] ->
      intervention.extract_inter_store(req, db)
    Get, ["api", "intervention", "get"] ->
      intervention.get_all_interventions(db)
    Get, ["api", "map-data", "get"] -> map_data.get_all_map_reports(db)
    // Quest endpoints
    Get, ["api", "quests"] -> quest.get_all_quests(db)
    Get, ["api", "quests", "difficulty", difficulty] ->
      quest.get_quests_by_difficulty(db, difficulty)
    Get, ["api", "quests", quest_id_str] -> {
      case int.parse(quest_id_str) {
        Ok(quest_id) -> quest.get_quest(db, quest_id)
        Error(_) -> wisp.bad_request("Invalid quest ID")
      }
    }
    Post, ["api", "quests", "create"] -> quest.extract_create_quest(req, db)
    Get, ["api", "user", "quests", user_id_str] -> {
      case int.parse(user_id_str) {
        Ok(user_id) -> quest.get_user_quests(db, user_id)
        Error(_) -> wisp.bad_request("Invalid user ID")
      }
    }
    Post, ["api", "quests", "start"] -> quest.extract_start_quest(req, db)
    Post, ["api", "quests", "complete"] -> quest.extract_complete_quest(req, db)
    Get, ["api", "user", "progression", user_id_str] -> {
      case int.parse(user_id_str) {
        Ok(user_id) -> quest.get_user_progression_endpoint(db, user_id)
        Error(_) -> wisp.bad_request("Invalid user ID")
      }
    }
    Get, ["api", "quests", "leaderboard", quest_id_str] -> {
      case int.parse(quest_id_str) {
        Ok(quest_id) -> quest.get_quest_leaderboard(db, quest_id)
        Error(_) -> wisp.bad_request("Invalid quest ID")
      }
    }
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
          [attribute.type_("module"), attribute.src("/static/bundle.js")],
          "",
        ),
        html.link([
          attribute.href("/static/index.css"),
          attribute.rel("stylesheet"),
        ]),
      ]),
      html.body([], [html.div([attribute.id("root")], [])]),
    ])
  html
  |> element.to_document_string
  |> wisp.html_response(200)
}
