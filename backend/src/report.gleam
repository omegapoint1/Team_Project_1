import gleam/dynamic/decode
import gleam/json
import gleam/list
import gleam/option
import pog
import server_app/sql
import shared/report_json
import shared/accept_json
import wisp.{type Request, type Response}

pub fn extract_report_store(req: Request, db: pog.Connection) -> Response {
  wisp.log_alert("hi")
  use json <- wisp.require_json(req)
  wisp.log_alert("hi2")

  let assert Ok(item) = decode.run(json, report_json.report_item_decoder())
  wisp.log_alert("hi3")

  case store_report(item, db) {
    -1 -> wisp.bad_request("report storage error")
    _ -> wisp.ok()
  }
}

pub fn store_report(item: report_json.ReportItem, db: pog.Connection) -> Int {
  wisp.log_alert(item.noisetype)
  let noisetype = item.noisetype
  let datetime = item.datetime
  let severity = item.severity
  let description = item.description
  let tags = item.tags
  let location_of_noise = item.location_of_noise
  let zone = item.zone
  let lat = item.lat
  let long = item.long
  let assert Ok(report_id_temp) =
    sql.reports_insert(
      db,
      noisetype,
      datetime,
      severity,
      description,
      location_of_noise,
      zone,
      lat,
      long,
    )
  let report_id = case report_id_temp
.rows {
    [row] -> row.reportid
    _ -> -1
  }
  let tag_ids = store_tags(db, tags, [])
  store_junction(db, report_id, tag_ids)
  report_id
}

fn store_tags(
  db: pog.Connection,
  tags: List(String),
  tag_ids: List(Int),
) -> List(Int) {
  case tags {
    [tag, ..t] -> {
      let assert Ok(report_id_temp) = sql.reports_tags(db, tag)
      let tag_id = case report_id_temp.rows {
        [row] -> row.tagid
        _ -> -1
      }
      store_tags(db, t, [tag_id, ..tag_ids])
    }
    [] -> tag_ids
  }
}

fn store_junction(db: pog.Connection, report_id: Int, tag_ids: List(Int)) {
  case tag_ids {
    [tag_id, ..t] -> {
      let assert Ok(_) = sql.reports_junction(db, report_id, tag_id)
      store_junction(db, report_id, t)
    }
    [] -> -1
  }
}

pub fn get_report_by_id(
  db: pog.Connection,
  report_id: Int,
) -> ReportItemId {
  let assert Ok(report) = sql.report_get(db, report_id)
  let assert Ok(report_data) = list.first(report.rows)
  let tag_l = case report_data.tag_list{
    [_, .._] -> report_data.tag_list
    [] -> [""]
  }
  let report_item =
    ReportItemId(
      id: report_id,
      noisetype: option.unwrap(report_data.noisetype, ""),
      datetime: option.unwrap(report_data.datetime, ""),
      severity: option.unwrap(report_data.severity, ""),
      description: option.unwrap(report_data.description, ""),
      location_of_noise: option.unwrap(report_data.locationofnoise, ""),
      zone: option.unwrap(report_data.zone, ""),
      tags: report_data.tag_list,
      lat: option.unwrap(report_data.lat, ""),
      long: option.unwrap(report_data.long, ""),
      approved: option.unwrap(report_data.approved, "Pending"),
    )
  report_item
}

pub fn get_all_reports(db: pog.Connection) -> Response {
  let assert Ok(report_ids) = sql.report_get_ids(db)

  let reports =
    list.map(report_ids.rows, fn(row) { get_report_by_id(db, row.reportid) })

  let reports_encoded =
    json.array(reports, report_item_to_json)
    |> json.to_string()

  wisp.json_response(reports_encoded, 200)
}

pub fn report_item_to_json(report_item: ReportItemId) -> json.Json {
  let ReportItemId(id:, noisetype:, datetime:, severity:, description:, location_of_noise:, zone:, tags:, lat:, long:, approved:) = report_item
  json.object([
    #("id", json.int(id)),
    #("noisetype", json.string(noisetype)),
    #("datetime", json.string(datetime)),
    #("severity", json.string(severity)),
    #("description", json.string(description)),
    #("location_of_noise", json.string(location_of_noise)),
    #("zone", json.string(zone)),
    #("tags", json.array(tags, json.string)),
    #("lat", json.string(lat)),
    #("long", json.string(long)),
    #("approved", json.string(approved)),
  ])
}

pub type ReportItemId{
  ReportItemId(
    id: Int,
    noisetype: String,
    datetime: String,
    severity: String,
    description: String,
    location_of_noise: String,
    zone: String,
    tags: List(String),
    lat: String,
    long: String,
    approved: String)
}



pub fn approve_report(req: Request, db: pog.Connection) -> Response {
  use json <- wisp.require_json(req)
  let assert Ok(item) = decode.run(json, accept_json.accept_item_decoder())
  let assert Ok(_) = sql.report_accept(db, item.accepted, item.id)
  get_report_by_id(db, item.id)
  wisp.ok()
}

//for testing
pub fn get_report_by_id_testing(
  db: pog.Connection,
  report_id: Int,
) -> report_json.ReportItem {
  let assert Ok(report) = sql.report_get(db, report_id)
  let assert Ok(report_data) = list.first(report.rows)
  let tag_l = case report_data.tag_list{
    [_, .._] -> report_data.tag_list
    [] -> [""]
  }
  let report_item =
    report_json.ReportItem(
      noisetype: option.unwrap(report_data.noisetype, ""),
      datetime: option.unwrap(report_data.datetime, ""),
      severity: option.unwrap(report_data.severity, ""),
      description: option.unwrap(report_data.description, ""),
      location_of_noise: option.unwrap(report_data.locationofnoise, ""),
      zone: option.unwrap(report_data.zone, ""),
      tags: report_data.tag_list,
      lat: option.unwrap(report_data.lat, ""),
      long: option.unwrap(report_data.long, ""),
    )
  report_item
}