import gleam/dynamic/decode
import gleam/json
import gleam/option

/// Quest item for creating/receiving quests
pub type QuestItem {
  QuestItem(
    title: String,
    description: String,
    difficulty: String,
    xp_reward: Int,
    quest_type: String,
    target_value: option.Option(String),
  )
}

/// Full quest item with id (for API responses)
pub type QuestItemWithId {
  QuestItemWithId(
    id: Int,
    title: String,
    description: String,
    difficulty: String,
    xp_reward: Int,
    quest_type: String,
    target_value: option.Option(String),
    is_active: Bool,
  )
}

/// User quest progress item
pub type UserQuestItem {
  UserQuestItem(
    user_quest_id: Int,
    user_id: Int,
    quest_id: Int,
    title: String,
    description: String,
    difficulty: String,
    xp_reward: Int,
    quest_type: String,
    target_value: option.Option(String),
    status: String,
    progress: Int,
    max_progress: Int,
    started_at: option.Option(String),
    completed_at: option.Option(String),
  )
}

/// Complete quest request (for starting/completing quests)
pub type QuestCompleteRequest {
  QuestCompleteRequest(
    user_id: Int,
    quest_id: Int,
  )
}

/// Create quest request (admin only)
pub type QuestCreateRequest {
  QuestCreateRequest(
    title: String,
    description: String,
    difficulty: String,
    xp_reward: Int,
    quest_type: String,
    target_value: option.Option(String),
  )
}

/// Leaderboard entry
pub type LeaderboardEntry {
  LeaderboardEntry(
    username: String,
    quest_title: String,
    completion_time_seconds: Int,
    completed_at: String,
  )
}

/// User progression info
pub type UserProgression {
  UserProgression(
    user_id: Int,
    total_xp: Int,
    level: Int,
    completed_quests: Int,
  )
}

// ENCODERS

pub fn quest_item_with_id_to_json(quest: QuestItemWithId) -> json.Json {
  let QuestItemWithId(
    id:,
    title:,
    description:,
    difficulty:,
    xp_reward:,
    quest_type:,
    target_value:,
    is_active:,
  ) = quest
  let target_value_str = option.unwrap(target_value, "")
  json.object([
    #("id", json.int(id)),
    #("title", json.string(title)),
    #("description", json.string(description)),
    #("difficulty", json.string(difficulty)),
    #("xp_reward", json.int(xp_reward)),
    #("quest_type", json.string(quest_type)),
    #("target_value", json.string(target_value_str)),
    #("is_active", json.bool(is_active)),
  ])
}

pub fn user_quest_item_to_json(quest: UserQuestItem) -> json.Json {
  let UserQuestItem(
    user_quest_id:,
    user_id:,
    quest_id:,
    title:,
    description:,
    difficulty:,
    xp_reward:,
    quest_type:,
    target_value:,
    status:,
    progress:,
    max_progress:,
    started_at:,
    completed_at:,
  ) = quest
  let target_value_str = option.unwrap(target_value, "")
  let started_at_str = option.unwrap(started_at, "")
  let completed_at_str = option.unwrap(completed_at, "")
  json.object([
    #("user_quest_id", json.int(user_quest_id)),
    #("user_id", json.int(user_id)),
    #("quest_id", json.int(quest_id)),
    #("title", json.string(title)),
    #("description", json.string(description)),
    #("difficulty", json.string(difficulty)),
    #("xp_reward", json.int(xp_reward)),
    #("quest_type", json.string(quest_type)),
    #("target_value", json.string(target_value_str)),
    #("status", json.string(status)),
    #("progress", json.int(progress)),
    #("max_progress", json.int(max_progress)),
    #("started_at", json.string(started_at_str)),
    #("completed_at", json.string(completed_at_str)),
  ])
}

pub fn leaderboard_entry_to_json(entry: LeaderboardEntry) -> json.Json {
  let LeaderboardEntry(
    username:,
    quest_title:,
    completion_time_seconds:,
    completed_at:,
  ) = entry
  json.object([
    #("username", json.string(username)),
    #("quest_title", json.string(quest_title)),
    #("completion_time_seconds", json.int(completion_time_seconds)),
    #("completed_at", json.string(completed_at)),
  ])
}

pub fn user_progression_to_json(prog: UserProgression) -> json.Json {
  let UserProgression(user_id:, total_xp:, level:, completed_quests:) = prog
  json.object([
    #("user_id", json.int(user_id)),
    #("total_xp", json.int(total_xp)),
    #("level", json.int(level)),
    #("completed_quests", json.int(completed_quests)),
  ])
}

// DECODERS

pub fn quest_create_request_decoder() -> decode.Decoder(QuestCreateRequest) {
  use title <- decode.field("title", decode.string)
  use description <- decode.field("description", decode.string)
  use difficulty <- decode.field("difficulty", decode.string)
  use xp_reward <- decode.field("xp_reward", decode.int)
  use quest_type <- decode.field("quest_type", decode.string)
  use target_value <- decode.field("target_value", decode.optional(decode.string))
  decode.success(QuestCreateRequest(
    title:,
    description:,
    difficulty:,
    xp_reward:,
    quest_type:,
    target_value:,
  ))
}

pub fn quest_complete_request_decoder() -> decode.Decoder(QuestCompleteRequest) {
  use user_id <- decode.field("user_id", decode.int)
  use quest_id <- decode.field("quest_id", decode.int)
  decode.success(QuestCompleteRequest(user_id:, quest_id:))
}
