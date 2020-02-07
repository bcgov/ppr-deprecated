#!/bin/bash

# Leverage oc to deploy the PPR API to an openshift environment

: ${NAME_PLATE:?"NAME_PLATE environment variable is required"}
: ${ENVIRONMENT:?"ENVIRONMENT environment variable is required"}
: ${SOURCE_TAG:?"SOURCE_TAG environment variable is required"}
: ${AUTH_API_URL:?"AUTH_API_URL environment variable is required"}
: ${CORS_ORIGINS:?"CORS_ORIGINS environment variable is required"}
: ${ROUTE_URL:?"ROUTE_URL environment variable is required"}

env_namespace=${NAME_PLATE}-$ENVIRONMENT
tools_namespace=${NAME_PLATE}-tools
source_tag=$SOURCE_TAG
target_tag=$ENVIRONMENT

# Apply the current configuration to the environment. There is no rollout trigger on configuration changes.
oc process -f ppr-api-dc.yaml \
  -p AUTH_API_URL=$AUTH_API_URL \
  -p CORS_ORIGINS="$CORS_ORIGINS" \
  -p ENVIRONMENT=$ENVIRONMENT \
  -p IMAGE_TAG=$ENVIRONMENT \
  -p ROUTE_URL=$ROUTE_URL \
  | oc apply -f - -n $env_namespace

# Tag the new image which triggers a rollout. In the future we may consider removing the trigger to explicitly run:
#   `oc rollout latest dc/ppr-api -n $env_namespace`
oc tag ppr-api:$source_tag ppr-api:$target_tag -n $tools_namespace

# Wait for rollout to finish
oc rollout status dc/ppr-api -w --timeout=10m -n $env_namespace
