import gleam/dynamic/decode
import gleam/json
import gleam/list
import gleam/option
import pog
import server_app/sql
import shared/intervention_json
import wisp.{type Request, type Response}

pub fn extract_inter_store(req: Request, db: pog.Connection) -> Response {
  use json <- wisp.require_json(req)
  let assert Ok(item) =
    decode.run(json, intervention_json.intervention_item_decoder())
  case store_inter(item, db) {
    "" -> wisp.bad_request("report storage error")
    _ -> wisp.ok()
  }
}

pub fn store_inter(
  item: intervention_json.InterventionItem,
  db: pog.Connection,
) -> String {
  let id = item.id
  let name = item.name
  let category = item.category
  let description = item.description
  let cost = item.cost
  let impact = item.impact
  let feasibility = item.feasibility
  let tags = item.tags
  let created_at = item.created_at

  let assert Ok(_) =
    sql.intervention_insert(
      db,
      id,
      name,
      category,
      description,
      json.preprocessed_array([
        json.int(cost.0),
        json.int(cost.1),
      ]),
      json.preprocessed_array([
        json.int(impact.0),
        json.int(impact.1),
      ]),
      feasibility,
      json.array(tags, json.string),
      created_at,
    )
  id
}


pub fn extract_intervention_get(db: pog.Connection, intervention_id) -> intervention_json.InterventionItem {
  let assert Ok(intervention) = sql.intervention_get(db, intervention_id)
  let assert Ok(intervention_data) = list.first(intervention.rows)

  let assert Ok(cost_item) =
    json.parse(
      option.unwrap(intervention_data.cost, ""),
      {
        use a <- decode.field(0, decode.int)
        use b <- decode.field(1, decode.int)
        decode.success(#(a, b))
      },
      )
  let assert Ok(impact_item) =
    json.parse(
      option.unwrap(intervention_data.impact, ""),
      {
        use a <- decode.field(0, decode.int)
        use b <- decode.field(1, decode.int)
        decode.success(#(a, b))
      })
      let assert Ok(tags_item) =
      json.parse(
        option.unwrap(intervention_data.tags, ""),
        decode.list(decode.string),
      )

  intervention_json.InterventionItem(
    id: intervention_data.interventionid,
    name: intervention_data.name,
    category: option.unwrap(intervention_data.category, ""),
    description: option.unwrap(intervention_data.description, ""),
    cost: cost_item,
    impact: impact_item,
    feasibility: option.unwrap(intervention_data.feasibility, 0),
    tags: tags_item,
    created_at: option.unwrap(intervention_data.created_at, ""),

  )
}

pub fn get_all_interventions(db: pog.Connection) -> Response {
  let assert Ok(inter_ids) = sql.intervention_get_ids(db)
  let interventions =
    list.map(inter_ids.rows, fn(row) {
      extract_intervention_get(db, row.interventionid)
    })
  let inter_encoded =
    json.array(interventions, intervention_json.intervention_item_to_json)
    |> json.to_string()
  wisp.log_alert(inter_encoded)
  wisp.response(200)
  |> wisp.json_body(inter_encoded)
}




pub fn add_reports(db: pog.Connection){
  let interventions = [
  intervention_json.InterventionItem(
    id: "1",
    name: "Acoustic Noise Barrier (3m)",
    category: "Physical Barrier",
    description: "3-meter high sound-reflecting or absorbing barrier along roadways or construction boundaries. Reduces direct line-of-sight noise transmission.",
    cost: #(
      35000,
      55000
    ),
    impact: #(
      8,
      12
    ),
    feasibility: 7,
    tags: ["barrier", "physical", "high-impact", "construction"],
    created_at: "2026-02-15T10:30:00Z"
  ),
  intervention_json.InterventionItem(
    id: "2",
    name: "Speed Reduction Signage",
    category: "Traffic Management",
    description: "Install digital speed awareness signs and physical speed limit signage in residential zones to reduce traffic noise.",
    cost: #(
       2500,
      4500
    ),
    impact: #(
       2,
      4
    ),
    feasibility: 9,
    tags: ["traffic", "signage", "low-cost", "quick-win"],
    created_at: "2026-02-15T10:30:00Z"
  ),
  intervention_json.InterventionItem(
    id: "3",
    name: "Quiet Road Surface (Low-Noise Asphalt)",
    category: "Infrastructure",
    description: "Resurface roads with porous or low-noise asphalt that reduces tyre-road interaction noise.",
    cost: #(
       100000,
      140000
    ),
    impact: #(
       4,
      7
    ),
    feasibility: 5,
    tags: ["road", "asphalt", "infrastructure", "long-term"],
    created_at: "2026-02-15T10:30:00Z"
  ),
  intervention_json.InterventionItem(
    id: "4",
    name: "Construction Scheduling Restrictions",
    category: "Regulatory",
    description: "Limit construction hours to daytime only (8am-6pm) with no weekend work in residential zones.",
    cost: #(
       500,
      1500
    ),
    impact: #(
       5,
      8
    ),
    feasibility: 8,
    tags: ["regulatory", "enforcement", "low-cost", "immediate"],
    created_at: "2026-02-15T10:30:00Z"
  ),
  intervention_json.InterventionItem(
    id: "5",
    name: "Residential Sound Insulation Grant",
    category: "Building",
    description: "Provide grants for double-glazing, acoustic vents, and insulation in homes adjacent to major noise sources.",
    cost: #(
       70000,
      100000
    ),
    impact: #(
       10,
      15
    ),
    feasibility: 4,
    tags: ["building", "indoor", "grants", "resident-focused"],
    created_at: "2026-02-15T10:30:00Z"
  ),
  intervention_json.InterventionItem(
    id: "6",
    name: "Green Buffer (Dense Hedgerow/Trees)",
    category: "Natural Barrier",
    description: "Plant dense evergreen hedgerows or tree belts along noise corridors. Provides aesthetic and acoustic benefits.",
    cost: #(
       10000,
      20000
    ),
    impact: #(
       2,
      5
    ),
    feasibility: 7,
    tags: ["green", "natural", "landscaping", "long-term"],
    created_at: "2026-02-15T10:30:00Z"
  ),
  intervention_json.InterventionItem(
    id: "7",
    name: "Traffic Rerouting Scheme",
    category: "Traffic Management",
    description: "Divert heavy goods vehicles and through-traffic away from residential streets onto main arterial roads.",
    cost: #(
       20000,
      30000
    ),
    impact: #(
       6,
      10
    ),
    feasibility: 6,
    tags: ["traffic", "rerouting", "planning", "consultation"],
    created_at: "2026-02-15T10:30:00Z"
  ),
  intervention_json.InterventionItem(
    id: "8",
    name: "Quiet Hours Enforcement",
    category: "Enforcement",
    description: "Dedicated noise patrols during evening/night hours to enforce existing noise regulations and respond to complaints.",
    cost: #(
       30000,
      50000
    ),
    impact: #(
       3,
      6
    ),
    feasibility: 6,
    tags: ["enforcement", "patrol", "staffing", "operational"],
    created_at: "2026-02-15T10:30:00Z"
  ),
  intervention_json.InterventionItem(
    id: "9",
    name: "Industrial Machinery Enclosures",
    category: "Industrial",
    description: "Install acoustic enclosures around fixed industrial plant and machinery (HVAC, generators, factory equipment).",
    cost: #(
       30000,
      40000
    ),
    impact: #(
       10,
      15
    ),
    feasibility: 5,
    tags: ["industrial", "enclosure", "machinery", "engineering"],
    created_at: "2026-02-15T10:30:00Z"
  ),
  intervention_json.InterventionItem(
    id: "10",
    name: "Event Noise Management Plan",
    category: "Regulatory",
    description: "Require licensed venues and events to submit noise management plans with sound limiting, orientation, and timing controls.",
    cost: #(
       1000,
      3000
    ),
    impact: #(
       4,
      7
    ),
    feasibility: 8,
    tags: ["events", "licensing", "regulatory", "planning"],
    created_at: "2026-02-15T10:30:00Z"
  ),
  intervention_json.InterventionItem(
    id: "11",
    name: "Building Facade Improvements",
    category: "Building",
    description: "Upgrade building facades facing noise sources with acoustic cladding or improved glazing for commercial/municipal buildings.",
    cost: #(
       55000,
      75000
    ),
    impact: #(
       7,
      12
    ),
    feasibility: 5,
    tags: ["building", "facade", "commercial", "retrofit"],
    created_at: "2026-02-15T10:30:00Z"
  ),
  intervention_json.InterventionItem(
    id: "12",
    name: "Low-Noise Pavement for Bus Lanes",
    category: "Infrastructure",
    description: "Specialised quiet pavement for bus corridors where frequent stopping/starting generates additional noise.",
    cost: #(
       80000,
      100000
    ),
    impact: #(
       3,
      5
    ),
    feasibility: 5,
    tags: ["bus", "transit", "pavement", "specialised"],
    created_at: "2026-02-15T10:30:00Z"
  ),
  intervention_json.InterventionItem(
    id: "13",
    name: "Community Alert System",
    category: "Community Engagement",
    description: "SMS/email alerts for scheduled noisy events (construction, roadworks, events) so residents can prepare.",
    cost: #(
       6000,
      10000
    ),
    impact: #(
       1,
      3
    ),
    feasibility: 9,
    tags: ["communication", "community", "alert", "software"],
    created_at: "2026-02-15T10:30:00Z"
  ),
  intervention_json.InterventionItem(
    id: "14",
    name: "Noise-Cancelling Technology at Source",
    category: "Technology",
    description: "Install active noise cancellation systems at fixed industrial sources (transformers, pumps, fans).",
    cost: #(
       45000,
      65000
    ),
    impact: #(
       6,
      10
    ),
    feasibility: 4,
    tags: ["technology", "active", "cancellation", "innovative"],
    created_at: "2026-02-15T10:30:00Z"
  ),
  intervention_json.InterventionItem(
    id: "15",
    name: "Rail Vibration Dampers",
    category: "Transport",
    description: "Install vibration dampers on rail tracks and resilient track fasteners in areas adjacent to railway lines.",
    cost: #(
       95000,
      125000
    ),
    impact: #(
       5,
      8
    ),
    feasibility: 4,
    tags: ["rail", "vibration", "track", "specialised"],
    created_at: "2026-02-15T10:30:00Z"
  )
  ]


  list.map(interventions, fn(x) {store_inter(x, db)})
}