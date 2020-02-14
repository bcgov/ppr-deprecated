#!/bin/bash

# Deploy PPR API to the development environment

export NAME_PLATE=zwmtib
export ENVIRONMENT=dev
export SOURCE_TAG=latest

export AUTH_API_URL=https://auth-api-dev.pathfinder.gov.bc.ca/api/v1
export CORS_ORIGINS="http://localhost:8080 https://dev.bcregistry.ca https://ppr-dev.pathfinder.gov.bc.ca"
export PAY_API_URL=https://pay-api-dev.pathfinder.gov.bc.ca/api/v1
export ROUTE_URL=ppr-api-dev.pathfinder.gov.bc.ca

./deploy_ppr_api.sh
