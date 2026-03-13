# Garbage Collectors – Noise Map

A web app for visualising and reporting noise incidents in your local area. Users can submit noise reports, view hotspots on a map, and access analytics. Planners get additional tools for moderation, mitigation planning, and hotspot analysis.

**Contributors:**
- Alex Hinde - Project Lead and Backend Dev
- Ben Lloyd - Scrum Master and Frontend Dev
- Sam Harries - UI/UX Design, Documentation & Comms and Frontend Dev
- William Noubissie - Frontend Dev
- Victor Gutowski - Frontend Dev
- Daniel Li - Frontend Dev
- Ollie Gutierrez - DevOps Engineer and Backend Dev
- Nick Woods - DevOps Engineer and Frontend Dev

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Running the App

Clone the repository, then:
```bash
cd Team_Project_1
docker compose up --build
```

Docker then handles:
- Starting a PostgreSQL database and initialising all tables from `init.sql`
- Spinning up an Ubuntu-based container with Erlang, Gleam, rebar3, wget, and npm installed
- Building the React/Vite frontend
- Launching the Gleam web server on port 3000

Data is persisted via a Docker volume, so your database survives container restarts.

To view the dashboard, navigate to [http://localhost:3000](http://localhost:3000) in your browser.

To stop:
```bash
docker compose down
```

And to delete the persisted database:
```bash
docker compose down -v
```

---

## Running Tests

Tests are written in Gleam and require a running PostgreSQL database. The easiest way to run them is locally rather than through Docker.

**Prerequisites:** [Gleam](https://gleam.run/getting-started/installing/), [Erlang](https://www.erlang.org/downloads), [rebar3](https://www.rebar3.org/)

Start the database with Docker, then run the tests locally:
```bash
docker compose up -d db
cd backend
gleam test
```

---

## Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Frontend   | React, Vite                 |
| Backend    | Gleam (on the BEAM/Erlang VM) |
| Database   | PostgreSQL                  |
| Mapping    | Leaflet.js                  |
| Deployment | Docker                      |
