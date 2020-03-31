# How to Apply

The following commands are used to apply these files.

## Development Namespace `DeploymentConfig`

```bash
export DB_PASSWORD=<secret> DB_USERNAME=<secret> SENTRY_DSN=<secret>
oc process -f ppr-api-dc.yaml --param-file=ppr-api-dc.dev.param -p DB_PASSWORD=$DB_PASSWORD -p DB_USERNAME=$DB_USERNAME -p SENTRY_DSN=$SENTRY_DSN | oc apply -n zwmtib-dev -f -
```

## Test Namespace `DeploymentConfig`

```bash
export DB_PASSWORD=<secret> DB_USERNAME=<secret> SENTRY_DSN=<secret>
oc process -f ppr-api-dc.yaml --param-file=ppr-api-dc.test.param -p DB_PASSWORD=$DB_PASSWORD -p DB_USERNAME=$DB_USERNAME -p SENTRY_DSN=$SENTRY_DSN | oc apply -n zwmtib-test -f -
```

## Production Namespace `DeploymentConfig`

```bash
export DB_PASSWORD=<secret> DB_USERNAME=<secret> SENTRY_DSN=<secret>
oc process -f ppr-api-dc.yaml --param-file=ppr-api-dc.prod.param -p DB_PASSWORD=$DB_PASSWORD -p DB_USERNAME=$DB_USERNAME -p SENTRY_DSN=$SENTRY_DSN | oc apply -n zwmtib-prod -f -
```
