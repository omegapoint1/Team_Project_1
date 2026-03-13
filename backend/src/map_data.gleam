import gleam/int
import wisp.{type Request, type Response}
import gleam/dynamic/decode
import gleam/json
import gleam/list
import gleam/option
import pog
import server_app/sql
import shared/map_json
import gleam/float
import shared/report_json


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
  
  list.map(generate_data(0, []), fn(data) {
    
    sql.map_data_insert(db, data.lat, data.long, data.noise, data.time, data.category)
  })
  1
}


fn generate_data(i: Int, acc: List(map_json.MapDataItem)) -> List(map_json.MapDataItem){
  let catagories = ["Traffic", "Music", "Train", "Construction", "Crowd"]
  case i{
    100 -> acc
    j ->{

      let lat = {{float.random()/.12.0}+.50.65}
      let long = {{float.random()/.6.5}-.3.58}
      let assert Ok(category) = list.first(list.sample(catagories, 1))

      let data = map_json.MapDataItem(
        lat: lat,
        long: long,
        noise: int.random(10),
        time: "2024-02-15T08:25:00",
        category: category,
      )
    generate_data(i+1, [data, ..acc])
    }

  }
}