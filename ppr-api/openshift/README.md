# How to Apply

The following commands are used to apply these files.

## Tools Namespace `BuildConfig`

```
$ oc process -f ppr-api/openshift/ppr-api-bc.yaml | oc -n zwmtib-tools apply -f -
```

## Development Namespace `DeploymentConfig`

```bash
oc process -f ppr-api/openshift/ppr-api-dc.yaml \
    -p AUTH_API_URL=https://auth-api-dev.pathfinder.gov.bc.ca/api/v1 \
    -p CORS_ORIGINS="http://localhost:8080 https://dev.bcregistry.ca https://ppr-dev.pathfinder.gov.bc.ca" \
    -p ENVIRONMENT=dev \
    -p IMAGE_TAG=dev \
    -p PAY_API_URL=https://pay-api-dev.pathfinder.gov.bc.ca/api/v1 \
    -p ROUTE_URL=ppr-api-dev.pathfinder.gov.bc.ca \
    | oc -n zwmtib-dev apply -f -
```

## Test Namespace `DeploymentConfig`

```bash
oc process -f ppr-api/openshift/ppr-api-dc.yaml \
    -p AUTH_API_URL=https://auth-api-test.pathfinder.gov.bc.ca/api/v1 \
    -p CORS_ORIGINS=https://test.bcregistry.ca \
    -p ENVIRONMENT=test \
    -p IMAGE_TAG=test \
    -p PAY_API_URL=https://pay-api-test.pathfinder.gov.bc.ca/api/v1 \
    -p ROUTE_URL=ppr-api-test.pathfinder.gov.bc.ca \
    | oc -n zwmtib-test apply -f -
```

## Production Namespace `DeploymentConfig`

```bash
oc process -f ppr-api/openshift/ppr-api-dc.yaml \
    -p AUTH_API_URL=https://auth-api.pathfinder.gov.bc.ca/api/v1 \
    -p CORS_ORIGINS=https://www.bcregistry.ca \
    -p ENVIRONMENT=prod \
    -p IMAGE_TAG=prod \
    -p PAY_API_URL=https://pay-api.pathfinder.gov.bc.ca/api/v1 \
    -p ROUTE_URL=ppr-api.pathfinder.gov.bc.ca \
    | oc -n zwmtib-prod apply -f -
```
