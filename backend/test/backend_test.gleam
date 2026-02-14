import shared/login_json
import gleeunit
import pog
import gleam/erlang/process
import gleam/option
import shared/report_json
import shared/plan_json
import plan

import report
import login

pub fn main() -> Nil {
  gleeunit.main()
}

// gleeunit test functions end in `_test`
pub fn report_test() {
  let pool_name = process.new_name("db_name")
  let pool_child = 
  pog.default_config(pool_name)
  |> pog.user("admin")
  |> pog.database("testdb")
  |> pog.password(option.Some("admin"))
  |> pog.pool_size(15)
  |> pog.port(5432)
  |> pog.start
  let db = pog.named_connection(pool_name)
  let  report_item =   report_json.ReportItem(
    noisetype: "cars",
    datetime: "12:30",
    severity: 4,
    description: "cars are very loud",
    location_of_noise: "road",
    tags: ["car", "road"])
  
  let report_id = report.store_report(report_item, db)
  let new_report_item = report.get_report_by_id(db, report_id)

  assert report_item == new_report_item
}


pub fn login_test() {
  let pool_name = process.new_name("db_name")
  let pool_child = 
  pog.default_config(pool_name)
  |> pog.user("admin")
  |> pog.database("testdb")
  |> pog.password(option.Some("admin"))
  |> pog.pool_size(15)
  |> pog.port(5432)
  |> pog.start
  let db = pog.named_connection(pool_name)
  let login_item = login_json.LoginItem(
    username: "apex.hinde@gmail.com",
    password: "1234"
  )
  let login_check = login.handle_register(login_item, db)
  let register_check = login.handle_login_check(login_item, db)
  assert login_check == 1
  assert register_check == 1
}

pub fn plan_test() {
  let pool_name = process.new_name("db_name")
  let pool_child = 
  pog.default_config(pool_name)
  |> pog.user("admin")
  |> pog.database("testdb")
  |> pog.password(option.Some("admin"))
  |> pog.pool_size(15)
  |> pog.port(5432)
  |> pog.start
  let db = pog.named_connection(pool_name)
  let plan_item = plan_json.PlanItem(
    id: "001",
    name: "cars",
    status: "open",
    zone: "2",
    budget: 100,
    total_cost: 50,
    timeline: 2,
    interventions: ["0","1"],
    impact: 7,
    notes: [#("0", "is good"), #("1", "is bad")],
    evidence: [#("0", "is good", "hi"), #("1", "is bad", "hallo")],
    created_at: "123"
  )
  let plan_id = plan.store_plan(plan_item, db)
  let new_plan_item = plan.extract_plan_get(db, plan_id)
  assert plan_item == new_plan_item


}
