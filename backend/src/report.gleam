import gleam/dict
import gleam/dynamic/decode
import gleam/float
import gleam/int
import gleam/json
import gleam/list
import gleam/option
import gleam/time/duration
import gleam/time/timestamp
import map_data
import pog
import server_app/sql
import shared/accept_json
import shared/map_json
import shared/report_json
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
  let report_id = case report_id_temp.rows {
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

pub fn get_report_by_id(db: pog.Connection, report_id: Int) -> ReportItemId {
  let assert Ok(report) = sql.report_get(db, report_id)
  let assert Ok(report_data) = list.first(report.rows)
  let tag_l = case report_data.tag_list {
    [_, ..] -> report_data.tag_list
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
  let ReportItemId(
    id:,
    noisetype:,
    datetime:,
    severity:,
    description:,
    location_of_noise:,
    zone:,
    tags:,
    lat:,
    long:,
    approved:,
  ) = report_item
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

pub type ReportItemId {
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
    approved: String,
  )
}
pub fn extract_approve_report(req: Request, db: pog.Connection) -> Response {
    use json <- wisp.require_json(req)
  let assert Ok(item) = decode.run(json, accept_json.accept_item_decoder())
  case approve_report(item, db) {
    1 -> wisp.ok()
    _ -> wisp.bad_request("Request failed")
  }
}
pub fn approve_report(item: accept_json.AcceptItem, db: pog.Connection) -> Int {

  let assert Ok(_) = sql.report_accept(db, item.accepted, item.id)
  let report_data = get_report_by_id(db, item.id)
  let lat = case float.parse(report_data.lat) {
    Ok(val) -> val
    _ -> 0.0
  }
  let long = case float.parse(report_data.long) {
    Ok(val) -> val
    _ -> 0.0
  }
  let severity = case int.parse(report_data.severity) {
    Ok(val) -> val
    _ -> 0
  }
  let new_map_data =
    map_json.MapDataItem(
      lat: lat,
      long: long,
      noise: severity,
      time: report_data.datetime,
      category: report_data.noisetype,
    )
  map_data.store_map_data(db, new_map_data)
  1
}

//for testing
pub fn get_report_by_id_testing(
  db: pog.Connection,
  report_id: Int,
) -> report_json.ReportItem {
  let assert Ok(report) = sql.report_get(db, report_id)
  let assert Ok(report_data) = list.first(report.rows)
  let tag_l = case report_data.tag_list {
    [_, ..] -> report_data.tag_list
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
pub fn generate_reports(db: pog.Connection){
  let reports = generate_reports_list(0, [])
  list.map(reports, fn(report) {
    let id = store_report(report, db)
    let accept_item = accept_json.AcceptItem(
      id: id,
      accepted: "Accepted",
    )
    approve_report(accept_item, db)
  })
}
fn generate_reports_list(
  i: Int,
  acc: List(report_json.ReportItem),
) -> List(report_json.ReportItem) {
  let catagories = ["Traffic", "Music", "Train", "Construction", "Crowd"]
  let zones = [
    "North West",
    "North-Central-West",
    "North-Central-East",
    "North-East",
    "Central-North-West",
    "Central-North-Central-West",
    "Central-North-Central-East",
    "Central-North-East",
    "Central-South-West",
    "Central-South-Central-West",
    "Central-South-Central-East",
    "Central-South-East",
    "South-West",
    "South-Central-West",
    "South-Central-East",
  ]
  case i {
    100 -> acc
    _ -> {
      let lat = {
        { float.random() /. 12.0 } +. 50.65
      }
      let long = {
        { float.random() /. 6.5 } -. 3.58
      }
      let assert Ok(category) = list.first(list.sample(catagories, 1))
      let assert Ok(zone) = list.first(list.sample(zones, 1))

      let time =
        timestamp.add(
          timestamp.system_time(),
          duration.hours(-1 * int.random(100)),
        )
      let datetime = timestamp.to_rfc3339(time, duration.hours(0))
      let data =
        report_json.ReportItem(
          datetime: datetime,
          lat: float.to_string(lat),
          long: float.to_string(long),
          description: "this is a random description",
          severity: int.to_string(int.random(10)),
          tags: [],
          location_of_noise: "exeter",
          noisetype: category,
          zone: zone
        )
      generate_reports_list(i + 1, [data, ..acc])
    }
  }
}
