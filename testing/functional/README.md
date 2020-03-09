# Functional Tests

## Description

These are the automated functional tests that prove the User Stories to be functional.

## Usage (Local)

1. Start the application under test
2. Make sure you have Java installed (Min. Version 1.8)
3. Navigate to the /testing/functional directory and...

The following commands will launch the tests with the individual browsers:

    ./gradlew chromeTest

Alternative commands (might require additional set up):

    ./gradlew chromeHeadlessTest //Will run in pipeline as well
    ./gradlew firefoxTest
    ./gradlew firefoxHeadlessTest //Will run in pipeline as well
    ./gradlew edgeTest //only on windows
    ./gradlew ieTest //Read wiki for set up instructions, only on windows
    ./gradlew safariTest //Only for MacOS, read [wiki](https://github.com/BCDevOps/BDDStack/wiki) for instructions.

## Test result reports

After the tests have been run (with chromeTest), you can find the test reports here:

- testing\functional\build\reports\spock\index.html _Showing the BDD results per User Story (Business focused view)_
- testing\functional\build\reports\tests\chromeTest\index.html _Showing the test results (more technical view)_
- testing\functional\build\test-results\chromeTest _Contains individual XML test result files that can be consumed by Jenkins in the pipeline to provide consolidated test result reporting._
