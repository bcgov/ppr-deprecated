
## Tools Namespace `BuildConfig`s

```bash
$ oc process -f ppr-ui-inter-bc.yaml --param-file=ppr-ui-inter-bc.param | oc apply -n zwmtib-tools -f -
$ oc process -f ppr-ui-bc.yaml --param-file=ppr-ui-bc.param | oc apply -n zwmtib-tools -f -
```

## Tagging builds

The following process of tagging is temporary as it will change once we build out our CI/CD pipeline. After building an
image on the Tools namespace you will want to tag a build with the 'dev', 'test', or 'prod' tag.

```bash
$ oc tag -n zwmtib-tools ppr-ui:latest ppr-ui:dev
```

## Development Namespace `DeploymentConfig`

```bash
$ oc process -f ppr-ui-dc.yaml \
    -p LAUNCH_DARKLY_CLIENT_KEY=ld_key \
    -p SENTRY_DSN=sentry_dsn \
    --param-file=ppr-ui-dc.dev.param \
    | oc -n 1rdehl-dev apply -f -
```

## Test Namespace `DeploymentConfig`

```bash
$ oc process -f ppr-ui-dc.yaml \
    -p LAUNCH_DARKLY_CLIENT_KEY=ld_key \
    -p SENTRY_DSN=sentry_dsn \
    --param-file=ppr-ui-dc.test.param \
    | oc -n 1rdehl-test apply -f -
```

## Production Namespace `DeploymentConfig`

```bash
$ oc process -f ppr-ui-dc.yaml \
    -p LAUNCH_DARKLY_CLIENT_KEY=ld_key \
    -p SENTRY_DSN=sentry_dsn \
    --param-file=ppr-ui-dc.prod.param \
    | oc -n 1rdehl-prod apply -f -
```
