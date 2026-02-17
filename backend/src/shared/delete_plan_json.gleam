import gleam/dynamic/decode
import gleam/json

pub type DeletePlanItem{
  DeletePlanItem(
    id: Int,
  )
}

pub fn delete_plan_item_decoder() -> decode.Decoder(DeletePlanItem) {
  use id <- decode.field("id", decode.int)
  decode.success(DeletePlanItem(id:))
}