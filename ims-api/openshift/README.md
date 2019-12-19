# How to Apply

The following commands are used to apply these files.

## Tools Namespace `BuildConfig`

```
$ oc process -f ims-api/openshift/ims-api-bc.yaml | oc -n zwmtib-tools apply -f -
```

## Development Namespace `DeploymentConfig`

```
$ oc process -f ims-api/openshift/ims-api-dc.yaml -p ENVIRONMENT=dev -p IMAGE_TAG=dev | oc -n zwmtib-dev apply -f -
```

## Test Namespace `DeploymentConfig`

```
$ oc process -f ims-api/openshift/ims-api-dc.yaml -p ENVIRONMENT=test -p IMAGE_TAG=test | oc -n zwmtib-test apply -f -
```

## Production Namespace `DeploymentConfig`

```
$ oc process -f ims-api/openshift/ims-api-dc.yaml -p ENVIRONMENT=prod -p IMAGE_TAG=prod | oc -n zwmtib-prod apply -f -
```
