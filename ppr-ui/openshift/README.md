# How to Apply

The following commands are used to apply our project's yaml configuration files to OpenShift.  Before usage you need to logon.  Open OpenShift in your browser. 
Find your name in the top right corner. Select 'Copy Login Command'.  
Paste the ```oc login``` command into your terminal.  
As well cd into the openshift subfolder.

```bash
oc login https://console.pathfinder.gov.bc.ca:8443 --token=....
cd ppr-ui/openshift
```

## Validation

To any oc apply command you can append ```--validate``` to check for errors in the configuration.  Note that there is a known
issue with a validation error saying that Route needs a status property. It doesn't so ignore.  

## Tools Namespace `BuildConfig`s

```bash
oc process -f ppr-ui-inter-bc.yaml | oc -n zwmtib-tools apply -f -
oc process -f ppr-ui-bc.yaml | oc -n zwmtib-tools apply -f -
```

## Tagging builds

The following process of tagging is temporary as it will change once we build out our CI/CD pipeline.
After building an image on the Tools namespace you will want to tag a build with the 'dev', 'test', or ... tag.

```bash
oc tag -n zwmtib-tools ppr-ui:latest ppr-ui:dev
```  


## Development Namespace `DeploymentConfig`

```
oc process -f ppr-ui-dc.yaml -p ENVIRONMENT=dev -p IMAGE_TAG=dev -p ROUTE_URL=ppr-dev.pathfinder.gov.bc.ca | oc -n zwmtib-dev apply -f -
```

## Test Namespace `DeploymentConfig`

```
oc process -f ppr-ui-dc.yaml -p ENVIRONMENT=test -p IMAGE_TAG=test -p ROUTE_URL=ppr-test.pathfinder.gov.bc.ca | oc -n zwmtib-test apply -f -
```

## Production Namespace `DeploymentConfig`

```
oc process -f ppr-ui-dc.yaml -p ENVIRONMENT=prod -p IMAGE_TAG=prod -p ROUTE_URL=ppr.pathfinder.gov.bc.ca | oc -n zwmtib-prod apply -f -
```
