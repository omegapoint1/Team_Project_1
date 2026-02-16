import wisp.{type Request, type Response}
import gleam/dynamic/decode
import gleam/json
import gleam/list
import gleam/option
import pog
import server_app/sql
import shared/map_json


pub fn store_map_data(db: pog.Connection, data: map_json.MapDataItem) -> Int{
  let lat = data.lat
  let long = data.long
  let noise = data.noise
  let time = data.time
  let category = data.category
  let assert Ok(_) = sql.map_data_insert(db, lat, long, noise, time, category)
  1

}

pub fn get_map_reports_by_id(
  db: pog.Connection,
  map_data_id: Int,
) -> map_json.MapDataItem {
  let assert Ok(map_data) = sql.map_data_get(db, map_data_id)
  let assert Ok(map_data_data) = list.first(map_data.rows)
  map_json.MapDataItem(
    lat: option.unwrap(map_data_data.lat, 0.0),
    long: option.unwrap(map_data_data.long, 0.0),
    noise: option.unwrap(map_data_data.noise, 0),
    time: option.unwrap(map_data_data.time, ""),
    category: option.unwrap(map_data_data.category, ""),
  )

}

pub fn get_all_map_reports(db: pog.Connection) -> Response {
  let assert Ok(map_data_ids) = sql.map_data_get_ids(db)

  let map_data =
    list.map(map_data_ids.rows, fn(row) { get_map_reports_by_id(db, row.mapdataid) })

  let map_data_encoded =
    json.array(map_data, map_json.map_data_item_to_json)
    |> json.to_string()

  wisp.json_response(map_data_encoded, 200)
}



pub fn generate_map_data(db: pog.Connection) -> Int {

  let init_data = [
    // Feb 
    map_json.MapDataItem(lat: 52.7, long: -3.5, noise: 4, time: "2024-02-01T10:30:00", category: "Train" ),
    map_json.MapDataItem(lat: 52.705, long: -3.505, noise: 7, time: "2024-02-01T14:35:00", category: "Traffic" ),
    map_json.MapDataItem(lat: 52.695, long: -3.495, noise: 3, time: "2024-02-01T18:40:00", category: "Music" ),
    map_json.MapDataItem(lat: 52.702, long: -3.508, noise: 8, time: "2024-02-02T09:45:00", category: "Construction" ),
    map_json.MapDataItem(lat: 52.698, long: -3.502, noise: 5, time: "2024-02-02T12:50:00", category: "Crowd" ),
    map_json.MapDataItem(lat: 52.708, long: -3.498, noise: 6, time: "2024-02-02T16:55:00", category: "Traffic" ),
    map_json.MapDataItem(lat: 52.697, long: -3.512, noise: 4, time: "2024-02-03T08:20:00", category: "Music" ),
    map_json.MapDataItem(lat: 52.703, long: -3.503, noise: 7, time: "2024-02-03T11:15:00", category: "Train" ),
    map_json.MapDataItem(lat: 52.710, long: -3.495, noise: 6, time: "2024-02-03T15:20:00", category: "Traffic" ),
    map_json.MapDataItem(lat: 52.692, long: -3.507, noise: 4, time: "2024-02-04T07:45:00", category: "Music" ),
    map_json.MapDataItem(lat: 52.706, long: -3.510, noise: 9, time: "2024-02-04T13:30:00", category: "Construction" ),
    map_json.MapDataItem(lat: 52.699, long: -3.493, noise: 5, time: "2024-02-04T17:15:00", category: "Crowd" ),
    map_json.MapDataItem(lat: 52.704, long: -3.500, noise: 7, time: "2024-02-05T09:00:00", category: "Traffic" ),
    map_json.MapDataItem(lat: 52.696, long: -3.505, noise: 3, time: "2024-02-05T12:30:00", category: "Music" ),
    map_json.MapDataItem(lat: 52.709, long: -3.502, noise: 8, time: "2024-02-05T19:45:00", category: "Train" ),
    map_json.MapDataItem(lat: 52.701, long: -3.497, noise: 6, time: "2024-02-06T08:15:00", category: "Traffic" ),
    map_json.MapDataItem(lat: 52.707, long: -3.509, noise: 9, time: "2024-02-06T14:20:00", category: "Construction" ),
    map_json.MapDataItem(lat: 52.694, long: -3.501, noise: 5, time: "2024-02-06T18:30:00", category: "Crowd" ),
    map_json.MapDataItem(lat: 52.698, long: -3.496, noise: 4, time: "2024-02-07T10:10:00", category: "Music" ),
    map_json.MapDataItem(lat: 52.711, long: -3.504, noise: 7, time: "2024-02-07T13:45:00", category: "Train" ),
    map_json.MapDataItem(lat: 52.693, long: -3.511, noise: 6, time: "2024-02-07T16:20:00", category: "Traffic" ),
    map_json.MapDataItem(lat: 52.705, long: -3.499, noise: 8, time: "2024-02-08T09:30:00", category: "Construction" ),
    map_json.MapDataItem(lat: 52.700, long: -3.506, noise: 4, time: "2024-02-08T12:15:00", category: "Music" ),
    map_json.MapDataItem(lat: 52.697, long: -3.503, noise: 7, time: "2024-02-08T17:40:00", category: "Traffic" ),
    map_json.MapDataItem(lat: 52.708, long: -3.494, noise: 5, time: "2024-02-09T08:50:00", category: "Crowd" ),
    map_json.MapDataItem(lat: 52.702, long: -3.513, noise: 8, time: "2024-02-09T11:25:00", category: "Train" ),
    map_json.MapDataItem(lat: 52.695, long: -3.508, noise: 3, time: "2024-02-09T15:10:00", category: "Music" ),
    map_json.MapDataItem(lat: 52.712, long: -3.492, noise: 6, time: "2024-02-10T10:05:00", category: "Traffic" ),
    map_json.MapDataItem(lat: 52.691, long: -3.514, noise: 8, time: "2024-02-10T14:35:00", category: "Construction" ),
    map_json.MapDataItem(lat: 52.703, long: -3.498, noise: 5, time: "2024-02-10T18:50:00", category: "Crowd" ),
    map_json.MapDataItem(lat: 52.699, long: -3.507, noise: 4, time: "2024-02-11T09:20:00", category: "Music" ),
    map_json.MapDataItem(lat: 52.706, long: -3.491, noise: 7, time: "2024-02-11T13:10:00", category: "Train" ),
    map_json.MapDataItem(lat: 52.694, long: -3.515, noise: 6, time: "2024-02-11T16:45:00", category: "Traffic" ),
    map_json.MapDataItem(lat: 52.710, long: -3.500, noise: 8, time: "2024-02-12T08:30:00", category: "Construction" ),
    map_json.MapDataItem(lat: 52.696, long: -3.512, noise: 4, time: "2024-02-12T11:55:00", category: "Music" ),
    map_json.MapDataItem(lat: 52.704, long: -3.493, noise: 7, time: "2024-02-12T15:25:00", category: "Traffic" ),
    map_json.MapDataItem(lat: 52.701, long: -3.510, noise: 5, time: "2024-02-13T10:40:00", category: "Crowd" ),
    map_json.MapDataItem(lat: 52.708, long: -3.498, noise: 6, time: "2024-02-13T15:55:00", category: "Traffic" ),
    map_json.MapDataItem(lat: 52.697, long: -3.512, noise: 4, time: "2024-02-13T14:20:00", category: "Music" ),
    map_json.MapDataItem(lat: 52.695, long: -3.506, noise: 7, time: "2024-02-14T09:15:00", category: "Train" ),
    map_json.MapDataItem(lat: 52.709, long: -3.495, noise: 5, time: "2024-02-14T12:30:00", category: "Music" ),
    map_json.MapDataItem(lat: 52.702, long: -3.504, noise: 8, time: "2024-02-14T16:50:00", category: "Construction" ),
    map_json.MapDataItem(lat: 52.698, long: -3.501, noise: 6, time: "2024-02-15T08:25:00", category: "Traffic" ),
    map_json.MapDataItem(lat: 52.705, long: -3.497, noise: 4, time: "2024-02-15T13:40:00", category: "Music" ),
    map_json.MapDataItem(lat: 52.693, long: -3.509, noise: 7, time: "2024-02-15T17:55:00", category: "Train" ),
  ]
  list.map(init_data, fn(data) {
    
    sql.map_data_insert(db, data.lat, data.long, data.noise, data.time, data.category)
  })
  1
}
