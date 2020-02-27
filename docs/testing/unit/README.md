# Unit Testing

The following is our implementation of the automated Unit tests.
We have an API built in Python and an UI built in Vue with Vuetify.

The setups do support generating coverage information that will be consumed by [CodeCov](https://codecov.io/gh/bcgov/ppr) when we merge our code with Master.

We use GitHub Actions to run all our unit tests during PR and Merge, but the individual will run their unit tests on their own workstations as well before committing their code. As a general rule we want all the tests to run when the code moves.

Last but not least, [SonarCloud](https://sonarcloud.io/dashboard?id=bcgov_ppr) will automatically scan the code on any PR and Merge, keeping track of code changes and flagging any code issues.

## API (Python)

### Linting

Both pylint and flake8 are used for linting.
Configuration for these can be found in the setup.cfg file in the ppr-api root.
Updates to this configuration are due to bring it in line with the other Registry projects.

### Unit Test Configuration

We are using pytest for our unit testing. In our ./requirements/dev.txt we have defined the dependencies for our testing and linting needs:

```
flake8==3.7.9
flake8-quotes==2.1.1
pylint==2.4.3
pytest==5.2.2
pytest-cov==2.8.1
```

In the setup.cfg the following lines were added for pytest:

```
[tool:pytest]
addopts = --cov=src --cov-report html:htmlcov --cov-report xml:coverage.xml
testpaths = tests/unit
```

### Code Coverage Setup

In order to run code coverage on our code we need to:

- Add the following configuration line to the setup.cfg:

```
[tool:pytest]
addopts = --cov=src --cov-report html:htmlcov --cov-report xml:coverage.xml
...
```

This will run and generate the coverage report at every unit test.
There are 2 different outputs:

- **htmlcov directory** with the coverage reports in html format: index.html. This is meant for the developer to have easy access to the coverage results.
- **coverage.xml** which is placed in the ppr-api directory and will be consumed by CodeCov and potentially by SonarQube for coverage reports

Both outputs are included in .gitignore and will not be pushed to our repository.

### Commands

With the above setup, our coverage reports are generated everytime we run

```
pytest
```

The full sequence of activities to run our unit tests would be:

```
python -m pip install --upgrade pip
pip install -r requirements/dev.txt
pip install -e .

pylint -E src
pylint -E --disable=E1101 migrations
flake8 src migrations tests *.py

pytest
```

Please see our GitHub Actions on the implementation during PRs and Merges.
In the actions, we also consume the coverage information for reporting up to [CodeCov](https://codecov.io/gh/bcgov/ppr).

## GUI (Vue)

### Linting

ESLinting is use for the UI Components.
Linting requires:

```
"eslint": "<Target latest version>",
"eslint-plugin-vue": "<Target latest version>",
```

Additional configuration is kept in `.eslintrc.js`

### Unit Test Configuration

We are using [jest](https://jestjs.io/) for our unit testing.
jest for Vue requires:

```
npm install --save-dev jest @vue/test-utils
```

The following testing related scripts have been set up in `package.json`:

```
"scripts": {
...
    "test": "npm run test:unit && npm run test:e2e",
    "test:unit": "vue-cli-service test:unit",
    "test:unit:cov": "vue-cli-service test:unit --coverage",
    "test:e2e": "vue-cli-service test:e2e",
...
  }
```

### Code Coverage Setup

Adding code coverage is simply done by adding `--coverage` to the test command resulting in:
'"test:unit:cov": "vue-cli-service test:unit --coverage"`

This will generate a `coverage` directory containing the lcov-report html files and the clover.xml which gets consumed by [CodeCov](https://codecov.io/gh/bcgov/ppr).

### Commands

In the ppr-ui directory:

```
npm ci
npm run lint -- --no-fix
npm run test:unit:cov
```

Please see our GitHub Actions on the implementation during PRs and Merges.
In the actions, we also consume the coverage information for reporting up to [CodeCov](https://codecov.io/gh/bcgov/ppr).
