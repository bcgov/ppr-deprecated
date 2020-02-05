#!/bin/bash

# This script is provided to set create a local database and populate it with some test data.  It assumes the local
# docker-compose.yml is being used to run the database.  As such, it will shut it down, remove the volume then restart
# it and setup the database.
#
# IMPORTANT: This process uses alembic to create the database schemas. You should make sure that you are running in
#            a Python Virtual Environment before you execute this script:
#                 Run in ./ppr-api: "source .venv/bin/activate"
#
# Usage:
#   ./reset_database.sh

# Shut down and remove the database existing database
echo "Bringing down Docker Compose"
docker-compose down 2> /dev/null
docker volume rm ppr_ppr_db_data 2> /dev/null

# Bring the PPR database up
./ready_local_db.sh

echo "Run the alembic migrations"
# Warning this will fail on your local workstation if you aren't in a Virtual Environment (venv)
pushd ppr-api > /dev/null
alembic upgrade head
popd > /dev/null

echo "Loading test data into the docker database"
docker container cp ppr-api/docs/sample_data ppr_ppr_db_1:/tmp/
docker container exec ppr_ppr_db_1 psql -U postgres -d ppr -f /tmp/sample_data/create_sample_financing_statements.sql > /dev/null
