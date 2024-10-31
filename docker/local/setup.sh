#!/bin/bash

# Navigate to the directory containing compose.local.yaml
cd ./docker/local

# Start the services
docker compose -f compose.local.yaml up -d

# Seed the database
mongorestore --uri mongodb://root:root@localhost:37001 --drop --gzip --archive=./data/stops.dump

# Delete the unziped dump folders
rm -rf ./data/stops-db