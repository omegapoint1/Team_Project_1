//// This module contains the code to run the sql queries defined in
//// `./src/server_app/sql`.
//// > 🐿️ This module was generated automatically using v4.6.0 of
//// > the [squirrel package](https://github.com/giacomocavalieri/squirrel).
////

import gleam/dynamic/decode
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
  password
FROM
  Login
WHERE
  username = $1;"
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
  Login(username, password)
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
