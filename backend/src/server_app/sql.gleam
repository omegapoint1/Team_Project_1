//// This module contains the code to run the sql queries defined in
//// `./src/server_app/sql`.
//// > 🐿️ This module was generated automatically using v4.6.0 of
//// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
////

import gleam/dynamic/decode
import gleam/option.{type Option}
import pog

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
) -> Result(pog.Returned(Nil), pog.QueryError) {
  let decoder = decode.map(decode.dynamic, fn(_) { Nil })

  "INSERT
INTO 
  LOGIN(Username, Password)
  values(
    $1,
    $2
  )"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.parameter(pog.text(arg_2))
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
    severity: Option(Int),
    description: Option(String),
    locationofnoise: Option(String),
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
    use severity <- decode.field(2, decode.optional(decode.int))
    use description <- decode.field(3, decode.optional(decode.string))
    use locationofnoise <- decode.field(4, decode.optional(decode.string))
    use tag_list <- decode.field(5, decode.list(decode.string))
    decode.success(ReportGetRow(
      noisetype:,
      datetime:,
      severity:,
      description:,
      locationofnoise:,
      tag_list:,
    ))
  }

  "SELECT 
  r.Noisetype,
  r.Datetime,
  r.Severity,
  r.Description,
  r.Locationofnoise,
  ARRAY_AGG(t.Name) AS tag_list
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
  arg_3: Int,
  arg_4: String,
  arg_5: String,
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
  Locationofnoise
)
VALUES ($1, $2, $3, $4, $5)
RETURNING ReportId;
"
  |> pog.query
  |> pog.parameter(pog.text(arg_1))
  |> pog.parameter(pog.text(arg_2))
  |> pog.parameter(pog.int(arg_3))
  |> pog.parameter(pog.text(arg_4))
  |> pog.parameter(pog.text(arg_5))
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
