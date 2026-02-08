FROM ubuntu:22.04



# Compile the Gleam application
RUN apt-get -y update && apt-get install -y erlang wget
RUN cd /usr/lib
RUN wget https://github.com/gleam-lang/gleam/releases/download/v1.14.0/gleam-v1.14.0-aarch64-unknown-linux-musl.tar.gz
RUN tar -xvf gleam-v1.14.0-aarch64-unknown-linux-musl.tar.gz


COPY . /backend/

