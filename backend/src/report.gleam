import wisp.{type Request, type Response}
import pog
import gleam/http.{Get, Post}
import gleam/dynamic/decode
import argus
import shared/report_json
import server_app/sql


pub fn store_report(req: Request, db: pog.Connection) -> Response {

  use json <- wisp.require_json(req)
  let assert Ok(item) = decode.run(json, report_json.report_item_decoder())
  let noisetype = item.noisetype
  let datetime = item.datetime
  let severity = item.severity
  let description = item.description
  let tags = item.tags
  let location_of_noise = item.location_of_noise


//  case sql.store_report(db, title, content, author) {
//
//    Ok(_) -> wisp.ok()
//    Error(_) -> wisp.bad_request("Request failed")
//  }
wisp.ok()
}