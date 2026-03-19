FROM ubuntu:22.04
FROM erlang:28.3.1.0

RUN apt-get -y update && apt-get install -y wget npm
RUN wget -c https://github.com/gleam-lang/gleam/releases/download/v1.14.0/gleam-v1.14.0-x86_64-unknown-linux-musl.tar.gz -O - | tar -xz -C /bin
RUN wget -c https://s3.amazonaws.com/rebar3/rebar3 -O /bin/rebar3 && chmod 775 /bin/rebar3

COPY . /Team_Project/

RUN cd /Team_Project/frontend \
  && npm install \
  && npm run build

RUN mkdir -p /Team_Project/backend/priv/static

RUN mv /Team_Project/frontend/dist/bundle.js /Team_Project/backend/priv/static/bundle.js
RUN mv /Team_Project/frontend/dist/assets/index.css /Team_Project/backend/priv/static/index.css

# Copy public image/static files from dist root into Gleam static folder
RUN find /Team_Project/frontend/dist -maxdepth 1 -type f \( \
  -name "*.png" -o \
  -name "*.jpg" -o \
  -name "*.jpeg" -o \
  -name "*.webp" -o \
  -name "*.svg" -o \
  -name "*.ico" -o \
  -name "manifest.json" \
\) -exec cp {} /Team_Project/backend/priv/static/ \;

RUN cd /Team_Project/backend \
  && gleam export erlang-shipment \
  && mv build/erlang-shipment /app

EXPOSE 3000
WORKDIR /app
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["run"]