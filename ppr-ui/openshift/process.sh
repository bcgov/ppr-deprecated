#!/usr/bin/env bash

# Git repo values as used in the yaml config files:
#REPO=https://github.com/bcgov/ppr
#BRANCH=master

REPO=https://github.com/bryan-gilbert/ppr
BRANCH=caddyExper


APP_PATH=/cooperatives/ppr
# To revert to a root context (say when PPR has it's own domain
# APP_PATH=/
# To revert to a PPR specific context (say when PPR can be hosted at bcregistry.ca/ppr
# APP_PATH=/ppr

APP_BASE=ppr-ui
APP_BASE=ppr-oct

APP_TAG=
APP_TAG=-bg

APP_NAME=$APP_BASE$APP_TAG
APP_UI_NAME=$APP_BASE$APP_TAG
APP_INTER_NAME=$APP_BASE-inter$APP_TAG

# PPR_GROUP
# This label is applied to all resources (buildconfigs, deployconfigs, images, routes, services, etc
# created by these openshift configuration files.  Usage includes get, describe and delete all
# of these resources.  See the echo at the end of this file.
PPR_GROUP=$APP_NAME

HOST=dev.bcregistry.ca
DEPLOY_TARGET=1rdehl-dev

# To deploy to ppr dev project:
#HOST=ppr-dev.pathfinder.gov.bc.ca
#DEPLOY_TARGET=zwmtib-dev

# Generate temporary env files for use with oc process
# For the intermediate buildconfig
echo "PPR_GROUP=$PPR_GROUP
APP_NAME=$APP_INTER_NAME
APP_PATH=$APP_PATH
GIT_URI=$REPO
GIT_REF=$BRANCH
" > .env.inter

# For buildconfig
echo "PPR_GROUP=$PPR_GROUP
APP_NAME=$APP_UI_NAME
APP_INTER_NAME=$APP_INTER_NAME
APP_INTER_TAG=latest
APP_PATH=$APP_PATH
" > .env.bc

# For deploy
echo "PPR_GROUP=$PPR_GROUP
APP_NAME=$APP_UI_NAME
APP_PATH=$APP_PATH
CADDY_CONFIG=$APP_NAME-caddy-config$APP_TAG
IMAGE_TAG=latest
ROUTE_HOST=$HOST
" > .env.dc

# Process and apply the build configs
echo "oc process -f ppr-ui-inter-bc.yaml --param-file=.env.inter | oc -n zwmtib-tools apply -f -"
echo ".env.inter"
cat .env.inter
#oc process -f ppr-ui-inter-bc.yaml --param-file=.env.inter | oc -n zwmtib-tools apply -f -

echo "oc process -f ppr-ui-bc.yaml --param-file=.env.bc | oc -n zwmtib-tools apply -f -"
echo ".env.bc"
cat .env.bc
#oc process -f ppr-ui-bc.yaml --param-file=.env.bc | oc -n zwmtib-tools apply -f -

# Kick off the intermediate build from the command line and see our logs (because it takes up to 12 minutes)
# and then kick off the caddy image build
echo "oc start-build $APP_INTER_NAME --follow --wait  &&  oc start-build $APP_UI_NAME"
#oc start-build $APP_INTER_NAME --follow --wait  &&  oc start-build $APP_UI_NAME

# Process and apply the deployment config
echo "oc process -f ppr-ui-dc.yaml --param-file=.env.dc | oc -n $DEPLOY_TARGET apply -f -"
echo ".env.dc"
cat .env.dc
#oc process -f ppr-ui-dc.yaml --param-file=.env.dc | oc -n $DEPLOY_TARGET apply -f -


echo "

# To list all related resources
    oc -n zwmtib-tools get all -l pprgroup=$PPR_GROUP
    oc -n 1rdehl-dev get all,configmap -l pprgroup=$PPR_GROUP
# To clean up all related resources
    oc -n zwmtib-tools delete all -l pprgroup=$PPR_GROUP
    oc -n 1rdehl-dev delete all,configmap -l pprgroup=$PPR_GROUP
"