#!/usr/bin/env groovy
// Copyright © 2018 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// ================================================================================================
// SonarQube Scanner Settings
// ------------------------------------------------------------------------------------------------

// The name of the SonarQube route.  Used to dynamically get the URL for SonarQube.
def SONAR_ROUTE_NAME = 'sonarqube'

// The namespace in which the SonarQube route resides.  Used to dynamically get the URL for SonarQube.
// Leave blank if the pipeline is running in same namespace as the route.
def SONAR_ROUTE_NAMESPACE = 'zwmtib-tools'

// The name of your SonarQube project
def SONAR_PROJECT_NAME = 'PPR'

// The project key of your SonarQube project
def SONAR_PROJECT_KEY = 'ppr'

// The base directory of your project.
// This is relative to the location of the `sonar-runner` directory within your project.
// More accurately this is relative to the Gradle build script(s) that manage the SonarQube Scanning
def SONAR_PROJECT_BASE_DIR = '../'

// The source code directory you want to scan.
// This is relative to the project base directory.
def SONAR_SOURCES = 'ppr-api/src,ppr-ui/src'
// ================================================================================================

// Gets the URL associated to a named route.
// If you are attempting to access a route outside the local namespace (the namespace in which this script is running)
// The Jenkins service account from the local namespace will need 'view' access to the remote namespace.
// For example:
// Using the oc cli directly:
//   oc policy add-role-to-user view system:serviceaccount:devex-von-bc-registries-agent-tools:jenkins -n view devex-von-tools
// Or using the openshift-developer-tools (https://github.com/BCDevOps/openshift-developer-tools) sripts:
//   assignRole.sh -u system:serviceaccount:devex-von-bc-registries-agent-tools:jenkins -r view devex-von-tools
@NonCPS
String getUrlForRoute(String routeName, String projectNameSpace = '') {

  def nameSpaceFlag = ''
  if(projectNameSpace?.trim()) {
    nameSpaceFlag = "-n ${projectNameSpace}"
  }
  
  def url = sh (
    script: "oc get routes ${nameSpaceFlag} -o wide --no-headers | awk \'/${routeName}/{ print match(\$0,/edge/) ?  \"https://\"\$2 : \"http://\"\$2 }\'",
    returnStdout: true
  ).trim()

  return url
}

@NonCPS
String getSonarQubePwd() {

  sonarQubePwd = sh (
    script: 'oc env dc/sonarqube --list | awk  -F  "=" \'/SONARQUBE_ADMINPW/{print $2}\'',
    returnStdout: true
  ).trim()

  return sonarQubePwd
}

// The jenkins-python3nodejs template has been purpose built for supporting SonarQube scanning.
podTemplate(
  label: 'jenkins-slave',
  name: 'jenkins-slave',
  serviceAccount: 'jenkins',
  cloud: 'openshift',
  containers: [
    containerTemplate(
      name: 'jnlp',
      image: 'docker-registry.default.svc:5000/zwmtib-tools/dotnet-20-jenkins-slave-rhel7',
      resourceRequestCpu: '1000m',
      resourceLimitCpu: '2000m',
      resourceRequestMemory: '2Gi',
      resourceLimitMemory: '4Gi',
      workingDir: '/tmp',
      command: '',
      args: '${computer.jnlpmac} ${computer.name}'
    )
  ]
){
  node('jenkins-slave') {

    stage('Checkout Source') {
      echo "Checking out source code ..."
      checkout scm
    }

    stage('SonarQube Analysis') {
      echo "Performing static SonarQube code analysis ..."

      SONARQUBE_URL = getUrlForRoute(SONAR_ROUTE_NAME, SONAR_ROUTE_NAMESPACE).trim()
      SONARQUBE_PWD = getSonarQubePwd().trim()
      echo "URL: ${SONARQUBE_URL}"
      echo "PWD: ${SONARQUBE_PWD}"

      // The `sonar-runner` MUST exist in your project and contain a Gradle environment consisting of:
      // - Gradle wrapper script(s)
      // - A simple `build.gradle` file that includes the SonarQube plug-in.
      //
      // An example can be found here:
      // - https://github.com/BCDevOps/sonarqube
      dir('sonar-runner') {
        // ======================================================================================================
        // Set your SonarQube scanner properties at this level, not at the Gradle Build level.
        // The only thing that should be defined at the Gradle Build level is a minimal set of generic defaults.
        //
        // For more information on available properties visit:
        // - https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner+for+Gradle
        // ======================================================================================================
        sh (
          returnStdout: true,
          script: "./gradlew sonarqube --stacktrace --info \
            -Dsonar.verbose=true \
            -Dsonar.host.url=${SONARQUBE_URL} \
            -Dsonar.projectName='${SONAR_PROJECT_NAME}' \
            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
            -Dsonar.projectBaseDir=${SONAR_PROJECT_BASE_DIR} \
            -Dsonar.sources=${SONAR_SOURCES}"
        )
      }
    }
  }
}