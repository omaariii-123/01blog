#!/bin/bash

nohup dockerd-rootless.sh > ~/docker-rootless.log 2>&1 &

docker run --name my-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=wonderland \
  -e POSTGRES_DB=mydb \
  -p 5432:5432 \
  -v pgdata:/var/lib/postgresql/data \
  -d postgres:15

