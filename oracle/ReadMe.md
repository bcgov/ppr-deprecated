# Oracle Container

We have oracle running in our ppr tool namespace. To deploy an oracle image you need to:

- Build the Docker image from the [Dockerfile](./oracle/tools/Dockerfile): (docker build `<path to folder containing dockerfile + bin folder with scripts>` -t `<image name>`)
- Push image to openshift (I used script from bcdevops repo: https://github.com/BCDevOps/openshift-developer-tools) - ./oc-push-image.sh -i `<image name>` -n `oradb1`

## Deployment Steps:

- Create 2 PVCs (oradb and importoradb) each 24 GB large (netapp-file-standard)
- Deploy the image: use [Deployment config]()./oracle/openshift/oracleDeploymentConfig.yaml)
- Once it is deployed (actually start up is not quick), go in the pod and connect to the db as sysdba (`$ORACLE_HOME/bin/sqlplus / as sysdba`)
- Run `select * from tab` to verify the database engine is up and running

## Further configuration and set up

TBD
