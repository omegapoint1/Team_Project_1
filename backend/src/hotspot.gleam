import gleam/json
import gleam/option
import server_app/sql
import pog
import gleam/list
import shared/hotspots_json
import wisp.{type Response}

pub fn get_hotspots(db: pog.Connection) -> Response {
  let assert Ok(hotspots) = sql.get_hotspots(db)
  let hotspots_decoded = list.map(hotspots.rows, fn(row) {
    #(row.occurrence_count, option.unwrap(row.zone, ""))
  })
  let hotspots_finished = hotspots_json.HotspotsItem(hotspots: hotspots_decoded)
  let hotspots_encoded = hotspots_json.hotspots_item_to_json(hotspots_finished)
  wisp.json_response(json.to_string(hotspots_encoded), 200)
}
