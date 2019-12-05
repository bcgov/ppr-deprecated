# How to Apply

The following commands are used to apply these files.

## Tools Namespace `BuildConfig`s

```
$ oc process -f ppr-ui/openshift/ppr-ui-inter-bc.yaml | oc -n zwmtib-tools apply -f -
$ oc process -f ppr-ui/openshift/ppr-ui-bc.yaml | oc -n zwmtib-tools apply -f -
```

## Development Namespace `DeploymentConfig`

```
$ oc process -f ppr-ui/openshift/ppr-ui-dc.yaml -p ENVIRONMENT=dev -p IMAGE_TAG=dev -p ROUTE_URL=ppr-dev.pathfinder.gov.bc.ca | oc -n zwmtib-dev apply -f -
```

## Test Namespace `DeploymentConfig`

```
$ oc process -f ppr-ui/openshift/ppr-ui-dc.yaml -p ENVIRONMENT=test -p IMAGE_TAG=test -p ROUTE_URL=ppr-test.pathfinder.gov.bc.ca | oc -n zwmtib-test apply -f -
```

## Production Namespace `DeploymentConfig`

```
$ oc process -f ppr-ui/openshift/ppr-ui-dc.yaml -p ENVIRONMENT=prod -p IMAGE_TAG=prod -p ROUTE_URL=ppr.pathfinder.gov.bc.ca | oc -n zwmtib-prod apply -f -
```
