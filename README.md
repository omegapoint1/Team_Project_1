# Garbage Collectors
# Noise Map

## Collabirators
Alex Hinde, 



## How to Run
you will need docker and docker compose <br>
clone the repository <br>

```sh
cd Team_Project_1
docker compose up --build  # Run the docker
```

then navigate to 0.0.0.0/3000

this docker starts a postgresql database and initialises the tables <br>
it then starts a custom ubuntu image <br>
this image downloads erlang, gleam, rebar3, wget and npm <br>
this image then builds the frontend and launches the web server <br>