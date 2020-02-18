# How to Apply

The following commands are used to apply these files.

## Tools Namespace `BuildConfig`

```
$ oc process -f ppr-api/openshift/ppr-api-bc.yaml | oc -n zwmtib-tools apply -f -
```

## Development Namespace `DeploymentConfig`

```bash
oc process -f ppr-api-dc.yaml --param-file=ppr-api-dc.dev.param | oc apply -n zwmtib-dev -f -
```

## Test Namespace `DeploymentConfig`

```bash
oc process -f ppr-api-dc.yaml --param-file=ppr-api-dc.test.param | oc apply -n zwmtib-test -f -
```

## Production Namespace `DeploymentConfig`

```bash
oc process -f ppr-api-dc.yaml --param-file=ppr-api-dc.prod.param | oc apply -n zwmtib-prod -f -
```
