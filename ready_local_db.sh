#!/bin/bash

# This script is provided to startup the PostgreSQL and wait for it to be available before completing. This is useful in
# automated scenarios where you need to ensure the database is available before performing certain actions. For example,
# when running integration tests during continuous integration scripts, we would execute this script before executing
# the tests.
#
# Usage:
#   ./ready_local_db.sh

# Make sure the PPR Database is UP
echo "Running Docker Compose"
docker-compose up -d

# Wait until PostgreSQL is available before moving on
attempts=0
until docker container exec ppr_ppr_db_1 psql -U postgres -c 'SELECT 1' > /dev/null 2>&1; do
  ((attempts=attempts+1))
  if [ $attempts -ge 10 ]; then
    echo "Failed to connect to PostgreSQL after 10 attempts, aborting"
    exit 1
  fi

  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done
echo "PostgreSQL is available"
