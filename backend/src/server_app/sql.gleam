//// This module contains the code to run the sql queries defined in
//// `./src/server_app/sql`.
//// > 🐿️ This module was generated automatically using v4.6.0 of
//// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
////

import gleam/dynamic/decode
import gleam/json.{type Json}
import gleam/option.{type Option}
import pog

/// Runs the `create_user` query
/// defined in `./src/server_app/sql/create_user.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn create_user(
  db: pog.Connection,
  arg_1: Int,
  arg_2: String,
  arg_3: Bool,
) -> Result(pog.Returned(Nil), pog.QueryError) {
  let decoder = decode.map(decode.dynamic, fn(_) { Nil })

  "INSERT
INTO 
  USERS(UserId, Email, Admin)
  values(
    $1,
    $2,
    $3
  );"
  |> pog.query
  |> pog.parameter(pog.int(arg_1))
  |> pog.parameter(pog.text(arg_2))
  |> pog.parameter(pog.bool(arg_3))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `get_hotspots` query
/// defined in `./src/server_app/sql/get_hotspots.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type GetHotspotsRow {
  GetHotspotsRow(zone: Option(String), occurrence_count: Int)
}

/// Runs the `get_hotspots` query
/// defined in `./src/server_app/sql/get_hotspots.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn get_hotspots(
  db: pog.Connection,
) -> Result(pog.Returned(GetHotspotsRow), pog.QueryError) {
  let decoder = {
    use zone <- decode.field(0, decode.optional(decode.string))
    use occurrence_count <- decode.field(1, decode.int)
    decode.success(GetHotspotsRow(zone:, occurrence_count:))
  }

  "SELECT Zone, COUNT(Zone) AS occurrence_count
FROM REPORTS
GROUP BY Zone
ORDER BY occurrence_count DESC;"
  |> pog.query
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `intervention_get` query
/// defined in `./src/server_app/sql/intervention_get.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type InterventionGetRow {
  InterventionGetRow(
    interventionid: String,
    name: String,
    category: Option(String),
    description: Option(String),
    cost: Option(String),
    impact: Option(String),
    feasibility: Option(Int),
    tags: Option(String),
    created_at: Option(String),
  )
}

/// Runs the `intervention_get` query
/// defined in `./src/server_app/sql/intervention_get.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn intervention_get(
  db: pog.Connection,
  arg_1: String,
) -> Result(pog.Returned(InterventionGetRow), pog.QueryError) {
  let decoder = {
    use interventionid <- decode.field(0, decode.string)
    use name <- decode.field(1, decode.string)
    use category <- decode.field(2, decode.optional(decode.string))
    use description <- decode.field(3, decode.optional(decode.string))
    use cost <- decode.field(4, decode.optional(decode.string))
    use impact <- decode.field(5, decode.optional(decode.string))
    use feasibility <- decode.field(6, decode.optional(decode.int))
    use tags <- decode.field(7, decode.optional(decode.string))
    use created_at <- decode.field(8, decode.optional(decode.string))
    decode.success(InterventionGetRow(
      interventionid:,
      name:,
      category:,
      description:,
      cost:,
      impact:,
      feasibility:,
      tags:,
      created_at:,
    ))
  }

  "SELECT 
  InterventionId,
  Name,
  Category,
  Description,
  cost,
  impact,
  feasibility,
  tags,
  created_at
FROM intervention
WHERE InterventionId = $1;"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `intervention_get_ids` query
/// defined in `./src/server_app/sql/intervention_get_ids.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type InterventionGetIdsRow {
  InterventionGetIdsRow(interventionid: String)
}

/// Runs the `intervention_get_ids` query
/// defined in `./src/server_app/sql/intervention_get_ids.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn intervention_get_ids(
  db: pog.Connection,
) -> Result(pog.Returned(InterventionGetIdsRow), pog.QueryError) {
  let decoder = {
    use interventionid <- decode.field(0, decode.string)
    decode.success(InterventionGetIdsRow(interventionid:))
  }

  "SELECT InterventionId FROM intervention;"
  |> pog.query
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// Runs the `intervention_insert` query
/// defined in `./src/server_app/sql/intervention_insert.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn intervention_insert(
  db: pog.Connection,
  arg_1: String,
  arg_2: String,
  arg_3: String,
  arg_4: String,
  arg_5: Json,
  arg_6: Json,
  arg_7: Int,
  arg_8: Json,
  arg_9: String,
) -> Result(pog.Returned(Nil), pog.QueryError) {
  let decoder = decode.map(decode.dynamic, fn(_) { Nil })

  "INSERT INTO intervention (
  InterventionId,
  Name,
  Category,
  Description,
  cost,
  impact,
  feasibility,
  tags,
  created_at
)

VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
ON CONFLICT (InterventionId) DO UPDATE SET
  Name = EXCLUDED.Name,
  Category = EXCLUDED.Category,
  Description = EXCLUDED.Description,
  cost = EXCLUDED.cost,
  impact = EXCLUDED.impact,
  feasibility = EXCLUDED.feasibility,
  tags = EXCLUDED.tags;"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.parameter(pog.text(arg_2))
  |> pog.parameter(pog.text(arg_3))
  |> pog.parameter(pog.text(arg_4))
  |> pog.parameter(pog.text(json.to_string(arg_5)))
  |> pog.parameter(pog.text(json.to_string(arg_6)))
  |> pog.parameter(pog.int(arg_7))
  |> pog.parameter(pog.text(json.to_string(arg_8)))
  |> pog.parameter(pog.text(arg_9))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `login` query
/// defined in `./src/server_app/sql/login.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type LoginRow {
  LoginRow(password: String)
}

/// Runs the `login` query
/// defined in `./src/server_app/sql/login.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn login(
  db: pog.Connection,
  arg_1: String,
) -> Result(pog.Returned(LoginRow), pog.QueryError) {
  let decoder = {
    use password <- decode.field(0, decode.string)
    decode.success(LoginRow(password:))
  }

  "SELECT
  Password
FROM
  LOGIN
WHERE
  Username = $1;"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `login_with_user` query
/// defined in `./src/server_app/sql/login_with_user.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type LoginWithUserRow {
  LoginWithUserRow(password: String, admin: Option(Bool))
}

/// Runs the `login_with_user` query
/// defined in `./src/server_app/sql/login_with_user.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn login_with_user(
  db: pog.Connection,
  arg_1: String,
) -> Result(pog.Returned(LoginWithUserRow), pog.QueryError) {
  let decoder = {
    use password <- decode.field(0, decode.string)
    use admin <- decode.field(1, decode.optional(decode.bool))
    decode.success(LoginWithUserRow(password:, admin:))
  }

  "SELECT
  l.Password,
  u.Admin
FROM
  LOGIN l
LEFT JOIN
  USERS u ON l.UserId = u.UserId
WHERE
  l.Username = $1;
"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `map_data_get` query
/// defined in `./src/server_app/sql/map_data_get.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type MapDataGetRow {
  MapDataGetRow(
    lat: Option(Float),
    long: Option(Float),
    noise: Option(Int),
    time: Option(String),
    category: Option(String),
  )
}

/// Runs the `map_data_get` query
/// defined in `./src/server_app/sql/map_data_get.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn map_data_get(
  db: pog.Connection,
  arg_1: Int,
) -> Result(pog.Returned(MapDataGetRow), pog.QueryError) {
  let decoder = {
    use lat <- decode.field(0, decode.optional(decode.float))
    use long <- decode.field(1, decode.optional(decode.float))
    use noise <- decode.field(2, decode.optional(decode.int))
    use time <- decode.field(3, decode.optional(decode.string))
    use category <- decode.field(4, decode.optional(decode.string))
    decode.success(MapDataGetRow(lat:, long:, noise:, time:, category:))
  }

  "SELECT
  lat,
  long,
  noise,
  time,
  category 
FROM map_data
WHERE MapDataId = $1;

"
  |> pog.query
  |> pog.parameter(pog.int(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `map_data_get_ids` query
/// defined in `./src/server_app/sql/map_data_get_ids.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type MapDataGetIdsRow {
  MapDataGetIdsRow(mapdataid: Int)
}

/// Runs the `map_data_get_ids` query
/// defined in `./src/server_app/sql/map_data_get_ids.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn map_data_get_ids(
  db: pog.Connection,
) -> Result(pog.Returned(MapDataGetIdsRow), pog.QueryError) {
  let decoder = {
    use mapdataid <- decode.field(0, decode.int)
    decode.success(MapDataGetIdsRow(mapdataid:))
  }

  "SELECT MapDataId FROM map_data;"
  |> pog.query
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `map_data_insert` query
/// defined in `./src/server_app/sql/map_data_insert.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type MapDataInsertRow {
  MapDataInsertRow(mapdataid: Int)
}

/// Runs the `map_data_insert` query
/// defined in `./src/server_app/sql/map_data_insert.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn map_data_insert(
  db: pog.Connection,
  arg_1: Float,
  arg_2: Float,
  arg_3: Int,
  arg_4: String,
  arg_5: String,
) -> Result(pog.Returned(MapDataInsertRow), pog.QueryError) {
  let decoder = {
    use mapdataid <- decode.field(0, decode.int)
    decode.success(MapDataInsertRow(mapdataid:))
  }

  "INSERT INTO map_data (
  lat,
  long,
  noise,
  time,
  category
)
VALUES ($1, $2, $3, $4, $5)
RETURNING MapDataId;"
  |> pog.query
  |> pog.parameter(pog.float(arg_1))
  |> pog.parameter(pog.float(arg_2))
  |> pog.parameter(pog.int(arg_3))
  |> pog.parameter(pog.text(arg_4))
  |> pog.parameter(pog.text(arg_5))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `noise_data_get` query
/// defined in `./src/server_app/sql/noise_data_get.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type NoiseDataGetRow {
  NoiseDataGetRow(
    noisedataid: Int,
    source: String,
    geometry: String,
    noiseclass: Option(String),
    noiseleveldb: Option(Int),
    noisecategory: Option(String),
    severity: Option(Int),
    recordedat: String,
  )
}

/// Runs the `noise_data_get` query
/// defined in `./src/server_app/sql/noise_data_get.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn noise_data_get(
  db: pog.Connection,
  arg_1: String,
  arg_2: String,
  arg_3: String,
  arg_4: String,
  arg_5: Int,
  arg_6: Int,
) -> Result(pog.Returned(NoiseDataGetRow), pog.QueryError) {
  let decoder = {
    use noisedataid <- decode.field(0, decode.int)
    use source <- decode.field(1, decode.string)
    use geometry <- decode.field(2, decode.string)
    use noiseclass <- decode.field(3, decode.optional(decode.string))
    use noiseleveldb <- decode.field(4, decode.optional(decode.int))
    use noisecategory <- decode.field(5, decode.optional(decode.string))
    use severity <- decode.field(6, decode.optional(decode.int))
    use recordedat <- decode.field(7, decode.string)
    decode.success(NoiseDataGetRow(
      noisedataid:,
      source:,
      geometry:,
      noiseclass:,
      noiseleveldb:,
      noisecategory:,
      severity:,
      recordedat:,
    ))
  }

  "SELECT
  NoiseDataId,
  Source,
  Geometry::text,
  NoiseClass,
  NoiseLevelDb,
  NoiseCategory,
  Severity,
  RecordedAt::text
FROM NOISE_DATA
WHERE
  ($1 = '' OR RecordedAt >= $1::TIMESTAMP)
  AND ($2 = '' OR RecordedAt <= $2::TIMESTAMP)
  AND ($3 = '' OR NoiseCategory = $3)
  AND ($4 = '' OR Source = $4)
  AND ($5 = 0  OR NoiseLevelDb >= $5)
  AND ($6 = 0  OR NoiseLevelDb <= $6)
ORDER BY RecordedAt DESC;
"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.parameter(pog.text(arg_2))
  |> pog.parameter(pog.text(arg_3))
  |> pog.parameter(pog.text(arg_4))
  |> pog.parameter(pog.int(arg_5))
  |> pog.parameter(pog.int(arg_6))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `plan_get` query
/// defined in `./src/server_app/sql/plan_get.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type PlanGetRow {
  PlanGetRow(
    interventionplanid: String,
    name: String,
    status: Option(String),
    zone: Option(String),
    budget: Option(Int),
    totalcost: Option(Int),
    timeline: Option(Int),
    impact: Option(Int),
    createdat: Option(String),
    interventions: Option(String),
    notes: Option(String),
    evidence: Option(String),
  )
}

/// Runs the `plan_get` query
/// defined in `./src/server_app/sql/plan_get.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn plan_get(
  db: pog.Connection,
  arg_1: String,
) -> Result(pog.Returned(PlanGetRow), pog.QueryError) {
  let decoder = {
    use interventionplanid <- decode.field(0, decode.string)
    use name <- decode.field(1, decode.string)
    use status <- decode.field(2, decode.optional(decode.string))
    use zone <- decode.field(3, decode.optional(decode.string))
    use budget <- decode.field(4, decode.optional(decode.int))
    use totalcost <- decode.field(5, decode.optional(decode.int))
    use timeline <- decode.field(6, decode.optional(decode.int))
    use impact <- decode.field(7, decode.optional(decode.int))
    use createdat <- decode.field(8, decode.optional(decode.string))
    use interventions <- decode.field(9, decode.optional(decode.string))
    use notes <- decode.field(10, decode.optional(decode.string))
    use evidence <- decode.field(11, decode.optional(decode.string))
    decode.success(PlanGetRow(
      interventionplanid:,
      name:,
      status:,
      zone:,
      budget:,
      totalcost:,
      timeline:,
      impact:,
      createdat:,
      interventions:,
      notes:,
      evidence:,
    ))
  }

  "SELECT 
    InterventionPlanId, 
    Name, 
    Status, 
    Zone, 
    Budget, 
    Totalcost, 
    Timeline, 
    Impact, 
    Createdat, 
    interventions, 
    notes, 
    evidence 
FROM inter_plans
WHERE InterventionPlanId = $1;"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `plan_get_ids` query
/// defined in `./src/server_app/sql/plan_get_ids.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type PlanGetIdsRow {
  PlanGetIdsRow(interventionplanid: String)
}

/// Runs the `plan_get_ids` query
/// defined in `./src/server_app/sql/plan_get_ids.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn plan_get_ids(
  db: pog.Connection,
) -> Result(pog.Returned(PlanGetIdsRow), pog.QueryError) {
  let decoder = {
    use interventionplanid <- decode.field(0, decode.string)
    decode.success(PlanGetIdsRow(interventionplanid:))
  }

  "SELECT InterventionPlanId FROM inter_plans;"
  |> pog.query
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `plan_insert` query
/// defined in `./src/server_app/sql/plan_insert.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type PlanInsertRow {
  PlanInsertRow(interventionplanid: String)
}

/// Runs the `plan_insert` query
/// defined in `./src/server_app/sql/plan_insert.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn plan_insert(
  db: pog.Connection,
  arg_1: String,
  arg_2: String,
  arg_3: String,
  arg_4: String,
  arg_5: Int,
  arg_6: Int,
  arg_7: Int,
  arg_8: Int,
  arg_9: String,
  arg_10: Json,
  arg_11: Json,
  arg_12: Json,
) -> Result(pog.Returned(PlanInsertRow), pog.QueryError) {
  let decoder = {
    use interventionplanid <- decode.field(0, decode.string)
    decode.success(PlanInsertRow(interventionplanid:))
  }

  "INSERT INTO inter_plans (
  InterventionPlanId,
  Name,
  Status,
  Zone,
  Budget,
  TotalCost,
  Timeline,
  Impact,
  Createdat,
  interventions,
  notes,
  evidence
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11, $12)
ON CONFLICT (InterventionPlanId) DO UPDATE SET
  Name = EXCLUDED.Name,
  Status = EXCLUDED.Status,
  Zone = EXCLUDED.Zone,
  Budget = EXCLUDED.Budget,
  TotalCost = EXCLUDED.TotalCost,
  Timeline = EXCLUDED.Timeline,
  Impact = EXCLUDED.Impact,
  interventions = EXCLUDED.interventions,
  notes = EXCLUDED.notes,
  evidence = EXCLUDED.evidence
RETURNING InterventionPlanId;"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.parameter(pog.text(arg_2))
  |> pog.parameter(pog.text(arg_3))
  |> pog.parameter(pog.text(arg_4))
  |> pog.parameter(pog.int(arg_5))
  |> pog.parameter(pog.int(arg_6))
  |> pog.parameter(pog.int(arg_7))
  |> pog.parameter(pog.int(arg_8))
  |> pog.parameter(pog.text(arg_9))
  |> pog.parameter(pog.text(json.to_string(arg_10)))
  |> pog.parameter(pog.text(json.to_string(arg_11)))
  |> pog.parameter(pog.text(json.to_string(arg_12)))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `register` query
/// defined in `./src/server_app/sql/register.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type RegisterRow {
  RegisterRow(userid: Int)
}

/// Runs the `register` query
/// defined in `./src/server_app/sql/register.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn register(
  db: pog.Connection,
  arg_1: String,
  arg_2: String,
) -> Result(pog.Returned(RegisterRow), pog.QueryError) {
  let decoder = {
    use userid <- decode.field(0, decode.int)
    decode.success(RegisterRow(userid:))
  }

  "INSERT
INTO 
  LOGIN(Username, Password)
  values(
    $1,
    $2
  )
  RETURNING Userid;"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.parameter(pog.text(arg_2))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// Runs the `report_accept` query
/// defined in `./src/server_app/sql/report_accept.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn report_accept(
  db: pog.Connection,
  arg_1: String,
  arg_2: Int,
) -> Result(pog.Returned(Nil), pog.QueryError) {
  let decoder = decode.map(decode.dynamic, fn(_) { Nil })

  "UPDATE REPORTS 
SET Approved = $1
WHERE ReportId = $2;"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.parameter(pog.int(arg_2))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `report_get` query
/// defined in `./src/server_app/sql/report_get.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type ReportGetRow {
  ReportGetRow(
    noisetype: Option(String),
    datetime: Option(String),
    severity: Option(String),
    description: Option(String),
    locationofnoise: Option(String),
    zone: Option(String),
    lat: Option(String),
    long: Option(String),
    approved: Option(String),
    tag_list: List(String),
  )
}

/// Runs the `report_get` query
/// defined in `./src/server_app/sql/report_get.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn report_get(
  db: pog.Connection,
  arg_1: Int,
) -> Result(pog.Returned(ReportGetRow), pog.QueryError) {
  let decoder = {
    use noisetype <- decode.field(0, decode.optional(decode.string))
    use datetime <- decode.field(1, decode.optional(decode.string))
    use severity <- decode.field(2, decode.optional(decode.string))
    use description <- decode.field(3, decode.optional(decode.string))
    use locationofnoise <- decode.field(4, decode.optional(decode.string))
    use zone <- decode.field(5, decode.optional(decode.string))
    use lat <- decode.field(6, decode.optional(decode.string))
    use long <- decode.field(7, decode.optional(decode.string))
    use approved <- decode.field(8, decode.optional(decode.string))
    use tag_list <- decode.field(9, decode.list(decode.string))
    decode.success(ReportGetRow(
      noisetype:,
      datetime:,
      severity:,
      description:,
      locationofnoise:,
      zone:,
      lat:,
      long:,
      approved:,
      tag_list:,
    ))
  }

  "SELECT 
  
  r.Noisetype,
  r.Datetime,
  r.Severity,
  r.Description,
  r.Locationofnoise,
  r.Zone,
  r.lat,
  r.long,
  r.Approved,
  COALESCE(ARRAY_AGG(t.Name) FILTER (WHERE t.Name IS NOT NULL), '{}') AS tag_list

FROM REPORTS r
LEFT JOIN REPORT_TAGS rt ON r.Reportid = rt.Report_id
LEFT JOIN TAGS t ON rt.Tag_id = t.Tagid
WHERE r.Reportid = $1
GROUP BY r.Reportid;"
  |> pog.query
  |> pog.parameter(pog.int(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `report_get_ids` query
/// defined in `./src/server_app/sql/report_get_ids.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type ReportGetIdsRow {
  ReportGetIdsRow(reportid: Int)
}

/// Runs the `report_get_ids` query
/// defined in `./src/server_app/sql/report_get_ids.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn report_get_ids(
  db: pog.Connection,
) -> Result(pog.Returned(ReportGetIdsRow), pog.QueryError) {
  let decoder = {
    use reportid <- decode.field(0, decode.int)
    decode.success(ReportGetIdsRow(reportid:))
  }

  "SELECT ReportId FROM REPORTS;"
  |> pog.query
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `reports_insert` query
/// defined in `./src/server_app/sql/reports_insert.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type ReportsInsertRow {
  ReportsInsertRow(reportid: Int)
}

/// Runs the `reports_insert` query
/// defined in `./src/server_app/sql/reports_insert.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn reports_insert(
  db: pog.Connection,
  arg_1: String,
  arg_2: String,
  arg_3: String,
  arg_4: String,
  arg_5: String,
  arg_6: String,
  arg_7: String,
  arg_8: String,
) -> Result(pog.Returned(ReportsInsertRow), pog.QueryError) {
  let decoder = {
    use reportid <- decode.field(0, decode.int)
    decode.success(ReportsInsertRow(reportid:))
  }

  "INSERT INTO REPORTS (
  Noisetype,
  Datetime,
  Severity,
  Description,
  Locationofnoise,
  Zone,
  Lat,
  Long
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING ReportId;
"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.parameter(pog.text(arg_2))
  |> pog.parameter(pog.text(arg_3))
  |> pog.parameter(pog.text(arg_4))
  |> pog.parameter(pog.text(arg_5))
  |> pog.parameter(pog.text(arg_6))
  |> pog.parameter(pog.text(arg_7))
  |> pog.parameter(pog.text(arg_8))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// Runs the `reports_junction` query
/// defined in `./src/server_app/sql/reports_junction.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn reports_junction(
  db: pog.Connection,
  arg_1: Int,
  arg_2: Int,
) -> Result(pog.Returned(Nil), pog.QueryError) {
  let decoder = decode.map(decode.dynamic, fn(_) { Nil })

  "INSERT INTO REPORT_TAGS (
  Report_id,
  Tag_id
  )
VALUES($1, $2)
ON CONFLICT DO NOTHING;"
  |> pog.query
  |> pog.parameter(pog.int(arg_1))
  |> pog.parameter(pog.int(arg_2))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `reports_tags` query
/// defined in `./src/server_app/sql/reports_tags.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type ReportsTagsRow {
  ReportsTagsRow(tagid: Int)
}

/// Runs the `reports_tags` query
/// defined in `./src/server_app/sql/reports_tags.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn reports_tags(
  db: pog.Connection,
  arg_1: String,
) -> Result(pog.Returned(ReportsTagsRow), pog.QueryError) {
  let decoder = {
    use tagid <- decode.field(0, decode.int)
    decode.success(ReportsTagsRow(tagid:))
  }

  "INSERT INTO TAGS(
  Name
)
VALUES($1)
ON CONFLICT (Name) DO UPDATE SET name = EXCLUDED.name
RETURNING Tagid;"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `scenario_get` query
/// defined in `./src/server_app/sql/scenario_get.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type ScenarioGetRow {
  ScenarioGetRow(
    id: String,
    name: String,
    description: Option(String),
    interventionids: Option(String),
    metrics: Option(String),
    scores: Option(String),
    user_id: Option(Int),
    created_at: Option(String),
    updated_at: Option(String),
  )
}

/// Runs the `scenario_get` query
/// defined in `./src/server_app/sql/scenario_get.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn scenario_get(
  db: pog.Connection,
  arg_1: String,
) -> Result(pog.Returned(ScenarioGetRow), pog.QueryError) {
  let decoder = {
    use id <- decode.field(0, decode.string)
    use name <- decode.field(1, decode.string)
    use description <- decode.field(2, decode.optional(decode.string))
    use interventionids <- decode.field(3, decode.optional(decode.string))
    use metrics <- decode.field(4, decode.optional(decode.string))
    use scores <- decode.field(5, decode.optional(decode.string))
    use user_id <- decode.field(6, decode.optional(decode.int))
    use created_at <- decode.field(7, decode.optional(decode.string))
    use updated_at <- decode.field(8, decode.optional(decode.string))
    decode.success(ScenarioGetRow(
      id:,
      name:,
      description:,
      interventionids:,
      metrics:,
      scores:,
      user_id:,
      created_at:,
      updated_at:,
    ))
  }

  "SELECT
  Id,
  Name,
  Description,
  InterventionIds,
  metrics,
  scores,
  user_id,
  created_at,
  updated_at
FROM scenario
WHERE Id = $1;



"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `scenario_get_ids` query
/// defined in `./src/server_app/sql/scenario_get_ids.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type ScenarioGetIdsRow {
  ScenarioGetIdsRow(id: String)
}

/// Runs the `scenario_get_ids` query
/// defined in `./src/server_app/sql/scenario_get_ids.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn scenario_get_ids(
  db: pog.Connection,
) -> Result(pog.Returned(ScenarioGetIdsRow), pog.QueryError) {
  let decoder = {
    use id <- decode.field(0, decode.string)
    decode.success(ScenarioGetIdsRow(id:))
  }

  "SELECT Id FROM scenario;"
  |> pog.query
  |> pog.returning(decoder)
  |> pog.execute(db)
}

/// A row you get from running the `scenario_insert` query
/// defined in `./src/server_app/sql/scenario_insert.sql`.
///
/// > 🐿️ This type definition was generated automatically using v4.6.0 of the
/// > [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub type ScenarioInsertRow {
  ScenarioInsertRow(id: String)
}

/// Runs the `scenario_insert` query
/// defined in `./src/server_app/sql/scenario_insert.sql`.
///
/// > 🐿️ This function was generated automatically using v4.6.0 of
/// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
///
pub fn scenario_insert(
  db: pog.Connection,
  arg_1: String,
  arg_2: String,
  arg_3: String,
  arg_4: Json,
  arg_5: Json,
  arg_6: Json,
  arg_7: Int,
  arg_8: String,
  arg_9: String,
) -> Result(pog.Returned(ScenarioInsertRow), pog.QueryError) {
  let decoder = {
    use id <- decode.field(0, decode.string)
    decode.success(ScenarioInsertRow(id:))
  }

  "INSERT INTO scenario(
  Id,
  Name,
  Description,
  InterventionIds,
  metrics,
  scores,
  user_id,
  created_at,
  updated_at
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
ON CONFLICT (Id) DO UPDATE SET
  Name = EXCLUDED.Name,
  Description = EXCLUDED.Description,
  InterventionIds = EXCLUDED.InterventionIds,
  metrics = EXCLUDED.metrics,
  scores = EXCLUDED.scores,
  updated_at = EXCLUDED.updated_at
RETURNING Id;


"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.parameter(pog.text(arg_2))
  |> pog.parameter(pog.text(arg_3))
  |> pog.parameter(pog.text(json.to_string(arg_4)))
  |> pog.parameter(pog.text(json.to_string(arg_5)))
  |> pog.parameter(pog.text(json.to_string(arg_6)))
  |> pog.parameter(pog.int(arg_7))
  |> pog.parameter(pog.text(arg_8))
  |> pog.parameter(pog.text(arg_9))
  |> pog.returning(decoder)
  |> pog.execute(db)
}
