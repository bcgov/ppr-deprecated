# How to Apply

The following commands are used to apply our project's yaml configuration files to OpenShift.  Before usage you need to
logon.  Open OpenShift in your browser. Find your name in the top right corner. Select 'Copy Login Command'. Paste the
`oc login` command into your terminal. As well cd into the openshift subfolder.

```bash
oc login https://console.pathfinder.gov.bc.ca:8443 --token=....
cd ppr-ui/openshift
```

Take a close look at `process.sh` to see how to set up parameters for build and deploy configs.

## Validation

To any oc apply command you can append `--validate` to check for errors in the configuration.  Note that there is a
known issue with a validation error saying that Route needs a status property. It doesn't so ignore.

## Tools Namespace `BuildConfig`s

```bash
oc process -f ppr-ui-inter-bc.yaml | oc -n zwmtib-tools apply -f -
oc process -f ppr-ui-bc.yaml | oc -n zwmtib-tools apply -f -
```

## Tagging builds

The following process of tagging is temporary as it will change once we build out our CI/CD pipeline. After building an
image on the Tools namespace you will want to tag a build with the 'dev', 'test', or 'prod' tag.

```bash
oc tag -n zwmtib-tools ppr-ui:latest ppr-ui:dev
```

## Development Namespace `DeploymentConfig`

```bash
oc process -f ppr-ui-dc.yaml \
    -p LAUNCH_DARKLY_CLIENT_KEY=ld_key \
    -p SENTRY_DSN=sentry_dsn \
    --param-file=ppr-ui-dc.dev.param \
    | oc -n 1rdehl-dev apply -f -
```

## Test Namespace `DeploymentConfig`

```bash
oc process -f ppr-ui-dc.yaml \
    -p LAUNCH_DARKLY_CLIENT_KEY=ld_key \
    -p SENTRY_DSN=sentry_dsn \
    --param-file=ppr-ui-dc.test.param \
    | oc -n 1rdehl-test apply -f -
```

## Production Namespace `DeploymentConfig`

```bash
oc process -f ppr-ui-dc.yaml \
    -p LAUNCH_DARKLY_CLIENT_KEY=ld_key \
    -p SENTRY_DSN=sentry_dsn \
    --param-file=ppr-ui-dc.prod.param \
    | oc -n 1rdehl-prod apply -f -
```
