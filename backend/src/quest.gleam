import gleam/dynamic/decode
import gleam/int
import gleam/json
import gleam/list
import gleam/option
import gleam/result
import pog
import server_app/sql
import shared/quest_json
import wisp.{type Request, type Response}

/// Get all quests
pub fn get_all_quests(db: pog.Connection) -> Response {
  let assert Ok(quest_ids) = sql.quest_get_ids(db)

  let quests =
    list.map(quest_ids.rows, fn(row) { get_quest_by_id(db, row.questid) })

  let quests_encoded =
    json.array(quests, quest_json.quest_item_with_id_to_json)
    |> json.to_string()

  wisp.json_response(quests_encoded, 200)
}

/// Get quests by difficulty
pub fn get_quests_by_difficulty(
  db: pog.Connection,
  difficulty: String,
) -> Response {
  let assert Ok(quests_data) = sql.quest_get_by_difficulty(db, difficulty)

  let quests =
    list.map(quests_data.rows, fn(row) {
      quest_json.QuestItemWithId(
        id: row.questid,
        title: row.title,
        description: row.description,
        difficulty: row.difficulty,
        xp_reward: row.xpreward,
        quest_type: row.questtype,
        target_value: row.targetvalue,
        is_active: row.isactive,
      )
    })

  let quests_encoded =
    json.array(quests, quest_json.quest_item_with_id_to_json)
    |> json.to_string()

  wisp.json_response(quests_encoded, 200)
}

/// Get a specific quest by ID
pub fn get_quest_by_id(db: pog.Connection, quest_id: Int) -> quest_json.QuestItemWithId {
  let assert Ok(quest) = sql.quest_get(db, quest_id)
  let assert Ok(quest_data) = list.first(quest.rows)

  quest_json.QuestItemWithId(
    id: quest_data.questid,
    title: quest_data.title,
    description: quest_data.description,
    difficulty: quest_data.difficulty,
    xp_reward: quest_data.xpreward,
    quest_type: quest_data.questtype,
    target_value: quest_data.targetvalue,
    is_active: quest_data.isactive,
  )
}

/// Get quest by ID endpoint
pub fn get_quest(db: pog.Connection, quest_id: Int) -> Response {
  let quest = get_quest_by_id(db, quest_id)
  let quest_encoded =
    quest_json.quest_item_with_id_to_json(quest)
    |> json.to_string()

  wisp.json_response(quest_encoded, 200)
}

/// Create a new quest (admin only)
pub fn extract_create_quest(req: Request, db: pog.Connection) -> Response {
  use json <- wisp.require_json(req)
  let assert Ok(item) =
    decode.run(json, quest_json.quest_create_request_decoder())

  case create_quest(item, db) {
    Ok(quest_id) -> {
      let quest = get_quest_by_id(db, quest_id)
      let response_json =
        json.object([
          #("quest", quest_json.quest_item_with_id_to_json(quest)),
        ])
      wisp.json_response(json.to_string(response_json), 201)
    }
    Error(_) -> wisp.bad_request("Failed to create quest")
  }
}

pub fn create_quest(
  item: quest_json.QuestCreateRequest,
  db: pog.Connection,
) -> Result(Int, pog.QueryError) {
  let quest_id_result =
    sql.quest_insert(
      db,
      item.title,
      item.description,
      item.difficulty,
      item.xp_reward,
      item.quest_type,
      item.target_value,
      option.None, // CreatedBy - set to None for now, can be updated with auth
    )

  case quest_id_result {
    Ok(result) -> {
      case list.first(result.rows) {
        Ok(row) -> Ok(row.questid)
        Error(_) -> Error(pog.ConstraintViolated("Failed to create quest", "", ""))
      }
    }
    Error(e) -> Error(e)
  }
}

/// Get user's quest progress
pub fn get_user_quests(db: pog.Connection, user_id: Int) -> Response {
  let assert Ok(user_quests_data) = sql.user_quest_get_by_user(db, user_id)

  let user_quests =
    list.map(user_quests_data.rows, fn(row) {
      quest_json.UserQuestItem(
        user_quest_id: row.userquestid,
        user_id: row.userid,
        quest_id: row.questid,
        title: row.title,
        description: row.description,
        difficulty: row.difficulty,
        xp_reward: row.xpreward,
        quest_type: row.questtype,
        target_value: row.targetvalue,
        status: row.status,
        progress: row.progress,
        max_progress: row.maxprogress,
        started_at: row.startedat,
        completed_at: row.completedat,
      )
    })

  let quests_encoded =
    json.array(user_quests, quest_json.user_quest_item_to_json)
    |> json.to_string()

  wisp.json_response(quests_encoded, 200)
}

/// Start a quest for a user
pub fn extract_start_quest(req: Request, db: pog.Connection) -> Response {
  use json <- wisp.require_json(req)
  let assert Ok(item) =
    decode.run(json, quest_json.quest_complete_request_decoder())

  case start_quest(item.user_id, item.quest_id, db) {
    Ok(_) -> wisp.ok()
    Error(_) -> wisp.bad_request("Failed to start quest")
  }
}

pub fn start_quest(
  user_id: Int,
  quest_id: Int,
  db: pog.Connection,
) -> Result(Int, pog.QueryError) {
  sql.user_quest_insert(db, user_id, quest_id)
  |> result.map(fn(result) {
    case list.first(result.rows) {
      Ok(row) -> row.userquestid
      Error(_) -> -1
    }
  })
}

/// Complete a quest for a user
pub fn extract_complete_quest(req: Request, db: pog.Connection) -> Response {
  use json <- wisp.require_json(req)
  let assert Ok(item) =
    decode.run(json, quest_json.quest_complete_request_decoder())

  case complete_quest(item.user_id, item.quest_id, db) {
    Ok(result) -> {
      let progression = get_user_progression(item.user_id, db)
      let response_json =
        json.object([
          #("result", json.string(result)),
          #("progression", quest_json.user_progression_to_json(progression)),
        ])
      wisp.json_response(json.to_string(response_json), 200)
    }
    Error(_) -> wisp.bad_request("Failed to complete quest")
  }
}

pub fn complete_quest(
  user_id: Int,
  quest_id: Int,
  db: pog.Connection,
) -> Result(String, pog.QueryError) {
  // First, get the user's quest to find the user_quest_id
  let user_quests_result = sql.user_quest_get_by_user(db, user_id)

  case user_quests_result {
    Ok(user_quests_data) -> {
      let user_quest_opt =
        list.find(user_quests_data.rows, fn(row) {
          row.questid == quest_id && row.status != "completed"
        })

      case user_quest_opt {
        Ok(user_quest) -> {
          // Complete the quest
          let _ =
            sql.user_quest_complete(db, user_quest.userquestid, user_id, quest_id)

          // Get XP reward
          let xp_result = sql.quest_get_xp(db, quest_id)

          case xp_result {
            Ok(xp_data) -> {
              case list.first(xp_data.rows) {
                Ok(xp_row) -> {
                  // Update user progression
                  let _ =
                    update_user_progression(db, user_id, xp_row.xpreward)

                  // Add to leaderboard (completion time in seconds - set to 0 for now)
                  let _ =
                    sql.quest_leaderboard_insert(db, user_id, quest_id, 0)

                  Ok("Quest completed!")
                }
                Error(_) -> Ok("Quest completed but XP not recorded")
              }
            }
            Error(_) -> Ok("Quest completed but XP not recorded")
          }
        }
        Error(_) ->
          // Return a dummy error - in practice we'd want a proper error type
          Error(pog.ConstraintViolated("Quest not found or already completed", "", ""))
      }
    }
    Error(_) -> Error(pog.ConstraintViolated("Failed to load user quests", "", ""))
  }
}

/// Get user progression
pub fn get_user_progression(
  user_id: Int,
  db: pog.Connection,
) -> quest_json.UserProgression {
  let progression_result = sql.user_progression_get(db, user_id)

  let default_progression = quest_json.UserProgression(
    user_id: user_id,
    total_xp: 0,
    level: 1,
    completed_quests: 0,
  )

  case progression_result {
    Ok(result) ->
      case list.first(result.rows) {
        Ok(row) ->
          quest_json.UserProgression(
            user_id: row.userid,
            total_xp: row.totalxp,
            level: row.level,
            completed_quests: row.completedquests,
          )
        Error(_) -> default_progression
      }
    Error(_) -> default_progression
  }
}

/// Get user progression endpoint
pub fn get_user_progression_endpoint(
  db: pog.Connection,
  user_id: Int,
) -> Response {
  let progression = get_user_progression(user_id, db)
  let progression_json =
    quest_json.user_progression_to_json(progression)
    |> json.to_string()

  wisp.json_response(progression_json, 200)
}

/// Update user progression after completing a quest
fn update_user_progression(
  db: pog.Connection,
  user_id: Int,
  xp_gained: Int,
) -> Result(Nil, pog.QueryError) {
  // Get current progression
  let current_progression = get_user_progression(user_id, db)

  // Get completed quests count
  let completed_count_result = sql.get_completed_quests_count(db, user_id)
  let completed_count = case completed_count_result {
    Ok(result) ->
      case list.first(result.rows) {
        Ok(row) -> row.quest_count
        Error(_) -> 0
      }
    Error(_) -> 0
  }

  // Calculate new level (simple formula: level = floor(total_xp / 1000) + 1)
  let new_total_xp = current_progression.total_xp + xp_gained
  let new_level = new_total_xp / 1000 + 1

  sql.user_progression_upsert(
    db,
    user_id,
    new_total_xp,
    new_level,
    completed_count,
  )
  |> result.map(fn(_) { Nil })
}

/// Get quest leaderboard
pub fn get_quest_leaderboard(db: pog.Connection, quest_id: Int) -> Response {
  let assert Ok(leaderboard_data) = sql.quest_leaderboard_get(db, quest_id)

  let leaderboard =
    list.map(leaderboard_data.rows, fn(row) {
      quest_json.LeaderboardEntry(
        username: row.username,
        quest_title: row.quest_title,
        completion_time_seconds: row.completiontime,
        completed_at: row.completedat,
      )
    })

  let leaderboard_encoded =
    json.array(leaderboard, quest_json.leaderboard_entry_to_json)
    |> json.to_string()

  wisp.json_response(leaderboard_encoded, 200)
}

/// Generate initial 18 quests (6 per difficulty)
pub fn generate_initial_quests(db: pog.Connection) {
  let _ = generate_easy_quests(db)
  let _ = generate_medium_quests(db)
  let _ = generate_hard_quests(db)
}

fn generate_easy_quests(db: pog.Connection) {
  let easy_quests = [
    quest_json.QuestCreateRequest(
      title: "First Steps",
      description: "Submit your first noise report",
      difficulty: "easy",
      xp_reward: 50,
      quest_type: "submit_report",
      target_value: option.Some("1"),
    ),
    quest_json.QuestCreateRequest(
      title: "Explorer",
      description: "View the noise map",
      difficulty: "easy",
      xp_reward: 30,
      quest_type: "view_map",
      target_value: option.Some("1"),
    ),
    quest_json.QuestCreateRequest(
      title: "Noise Detective",
      description: "Identify noise in Zone B",
      difficulty: "easy",
      xp_reward: 75,
      quest_type: "identify_zone_noise",
      target_value: option.Some("Zone B"),
    ),
    quest_json.QuestCreateRequest(
      title: "Reporter",
      description: "Submit 3 noise reports",
      difficulty: "easy",
      xp_reward: 100,
      quest_type: "submit_multiple_reports",
      target_value: option.Some("3"),
    ),
    quest_json.QuestCreateRequest(
      title: "Observer",
      description: "Check the noise hotspot dashboard",
      difficulty: "easy",
      xp_reward: 40,
      quest_type: "view_hotspots",
      target_value: option.Some("1"),
    ),
    quest_json.QuestCreateRequest(
      title: "Early Bird",
      description: "Submit a report in the morning (6AM-12PM)",
      difficulty: "easy",
      xp_reward: 60,
      quest_type: "time_based_report",
      target_value: option.Some("morning"),
    ),
  ]

  list.each(easy_quests, fn(quest) {
    let _ = create_quest(quest, db)
    Nil
  })
}

fn generate_medium_quests(db: pog.Connection) {
  let medium_quests = [
    quest_json.QuestCreateRequest(
      title: "Zone Analyst",
      description: "Identify the noisiest time in Zone B",
      difficulty: "medium",
      xp_reward: 150,
      quest_type: "analyze_zone_peak",
      target_value: option.Some("Zone B"),
    ),
    quest_json.QuestCreateRequest(
      title: "Data Collector",
      description: "Submit 10 noise reports",
      difficulty: "medium",
      xp_reward: 200,
      quest_type: "submit_multiple_reports",
      target_value: option.Some("10"),
    ),
    quest_json.QuestCreateRequest(
      title: "Pattern Finder",
      description: "Identify noise patterns across 3 different zones",
      difficulty: "medium",
      xp_reward: 175,
      quest_type: "multi_zone_analysis",
      target_value: option.Some("3"),
    ),
    quest_json.QuestCreateRequest(
      title: "Severity Expert",
      description: "Submit a report with severity level 8 or higher",
      difficulty: "medium",
      xp_reward: 125,
      quest_type: "high_severity_report",
      target_value: option.Some("8"),
    ),
    quest_json.QuestCreateRequest(
      title: "Consistent Reporter",
      description: "Submit reports on 3 different days",
      difficulty: "medium",
      xp_reward: 180,
      quest_type: "consistent_reporting",
      target_value: option.Some("3"),
    ),
    quest_json.QuestCreateRequest(
      title: "Category Master",
      description: "Submit reports of 5 different noise types",
      difficulty: "medium",
      xp_reward: 160,
      quest_type: "category_variety",
      target_value: option.Some("5"),
    ),
  ]

  list.each(medium_quests, fn(quest) {
    let _ = create_quest(quest, db)
    Nil
  })
}

fn generate_hard_quests(db: pog.Connection) {
  let hard_quests = [
    quest_json.QuestCreateRequest(
      title: "Noise Master",
      description: "Submit 50 noise reports",
      difficulty: "hard",
      xp_reward: 500,
      quest_type: "submit_multiple_reports",
      target_value: option.Some("50"),
    ),
    quest_json.QuestCreateRequest(
      title: "Zone Conqueror",
      description: "Identify peak noise times for ALL zones",
      difficulty: "hard",
      xp_reward: 400,
      quest_type: "all_zone_analysis",
      target_value: option.Some("all"),
    ),
    quest_json.QuestCreateRequest(
      title: "Dedicated Reporter",
      description: "Submit at least one report every day for a week",
      difficulty: "hard",
      xp_reward: 350,
      quest_type: "weekly_streak",
      target_value: option.Some("7"),
    ),
    quest_json.QuestCreateRequest(
      title: "Extreme Noise Hunter",
      description: "Submit 5 reports with severity 9 or 10",
      difficulty: "hard",
      xp_reward: 300,
      quest_type: "extreme_severity_streak",
      target_value: option.Some("5"),
    ),
    quest_json.QuestCreateRequest(
      title: "Complete 5 Easy Quests",
      description: "Complete 5 easy difficulty quests",
      difficulty: "hard",
      xp_reward: 250,
      quest_type: "complete_quests_by_difficulty",
      target_value: option.Some("easy:5"),
    ),
    quest_json.QuestCreateRequest(
      title: "Quest Champion",
      description: "Complete 10 quests of any difficulty",
      difficulty: "hard",
      xp_reward: 450,
      quest_type: "total_quests_completed",
      target_value: option.Some("10"),
    ),
  ]

  list.each(hard_quests, fn(quest) {
    let _ = create_quest(quest, db)
    Nil
  })
}
