import gleam/dynamic
import wisp.{type Request, type Response}
import pog
import gleam/http.{Get, Post}
import gleam/dynamic/decode
import shared/report_json
import server_app/sql
import gleam/option
import gleam/list

pub fn extract_report_request(req: Request, db: pog.Connection) -> Response {
    use json <- wisp.require_json(req)
    let assert Ok(item) = decode.run(json, report_json.report_item_decoder())
    case store_report(item, db){
      -1 -> wisp.bad_request("report storage error")
      _ -> wisp.ok()
    }
}
pub fn store_report(item: report_json.ReportItem, db: pog.Connection) -> Int {
  let noisetype = item.noisetype
  let datetime = item.datetime
  let severity = item.severity
  let description = item.description
  let tags = item.tags
  let location_of_noise = item.location_of_noise
  let assert Ok(report_id_temp) = sql.reports_insert(db, noisetype, datetime, severity, description, location_of_noise)
  let report_id = case report_id_temp.rows{
    [row] -> row.reportid
    _ -> -1
  }
  let tag_ids = store_tags(db, tags, [])
  store_junction(db, report_id, tag_ids)
  report_id
}

fn store_tags(db: pog.Connection, tags: List(String), tag_ids: List(Int)) -> List(Int){
  case tags{
    [tag, ..t] -> {
      let assert Ok(report_id_temp) = sql.reports_tags(db, tag)
      let tag_id = case report_id_temp.rows{
        [row] -> row.tagid
        _ -> -1
      }
      store_tags(db, t, [tag_id, ..tag_ids])
  
    }
    [] -> tag_ids
  }
}

fn store_junction(db: pog.Connection, report_id: Int, tag_ids: List(Int)){
  case tag_ids{
    [tag_id, ..t] -> {
      let assert Ok(_) = sql.reports_junction(db, report_id, tag_id)
      store_junction(db, report_id, t)
    }
    [] -> -1
  }
}

pub fn get_report_by_id(db: pog.Connection, report_id: Int) -> report_json.ReportItem{
  let assert Ok(report) = sql.report_get(db, report_id)
    let assert Ok(report_data) = list.first(report.rows) 
    let report_item = report_json.ReportItem(
      noisetype: option.unwrap(report_data.noisetype, ""),
      datetime: option.unwrap(report_data.datetime, ""),
      severity: option.unwrap(report_data.severity, 0),
      description: option.unwrap(report_data.description, ""),
      location_of_noise: option.unwrap(report_data.locationofnoise, ""),
      tags: report_data.tag_list
    )
    report_item
}