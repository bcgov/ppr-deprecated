# PPR API

The PPR API is currently a passthrough API that calls the IMS Transaction Manager via the `ims-api`.

## Developer Setup

1. Copy the [dotenv template file](../docs/dotenv_template) to somewhere above the source code and rename to `.env`.
1. `$ pip install -r requirements/dev.txt`
1. `$ (cd src && uvicorn main:app --reload)`
1. View the [OpenAPI Docs](http://127.0.0.1:8000/docs).


## Developer virtual environment setup

To do development in a virtual environment you need to install the python virtual environment package.
```bash
python3 -m venv .venv

# pip may need to be updated ... not sure if it helps to run this outside of the virtual environment, just in case ....
python3 -m pip install --upgrade pip
```

### Virtual environment activation and deactivation

Thereafter you can activate the virtual environment with:

```bash
source ./.venv/bin/activate
```
When the virtual environment is active the shell prompt starts ith ```(.venv) ```.  Once inside the virtual environment you can
run the server, unit tests, code coverage tests and static analysis tools.
To exit the virtual environment run ```deactivate``` in the virtual environment.

```
deactivate
``` 

### Api server
```
# In the (.venv) virtual environment ....
# to run the server
pip3 install -r requirements/dev.txt
uvicorn src.main:app --reload

# This should bring the web service up on http://localhost:8000, 
# with OpenAPI documentation available at http://localhost:8000/docs.

# to exit the app press Ctrl-C
```

### Static analysis

```
# In the (.venv) virtual environment ....
# to run lint and show warnings
pylint src
# lint show errors only
pylint -E src
# to run the common flake8 static analysis tools 
flake8 src
```
Flake8 (https://pypi.org/project/flake8/) runs
- PyFlakes (Python error checker)  https://pypi.org/project/pyflakes/
- pycodestyle (Python style checker) https://pypi.org/project/pycodestyle/
- Ned Batchelder’s McCabe script (complexity)  https://github.com/PyCQA/mccabe


### Unit tests
```
# to avoid a warning of newer versions being available update pip prior to running unit tests:
pip install --upgrade pip

# to run the unit tests
pip install .
pytest tests/unit
```

### Coverage

To add coverage we use ```pytest-cov```.  See https://pytest-cov.readthedocs.io/en/latest/index.html

> All features offered by the coverage package should work, either through pytest-cov’s command line options or through coverage’s config file.

To set up for coverage create a ```.coveragerc``` file with the following to ignore the .venv files

```
# .coveragerc to control coverage.py
[run]
omit =
    .venv/*
```
To install the package:
```
# In the (.venv) virtual environment ....
pip install pytest-cov
```
Thereafter to run unit tests with coverage:
```
pytest --cov=. tests/unit
```



### Local Dependencies

The api requires a **PostgreSQL** database which can be launched locally with docker compose. You must specify a
password for the database using the `DB_PASSWORD` environment variable. This is required by both docker compose PPR API.

Docker compose will also bring up an instance of Jaeger.

From the project root folder:
```
$ docker-compose up -d
```

## Application Configuration

### OpenShift Configuration

Note that if the pods are not starting, and producing errors like:

> [CRITICAL] WORKER TIMEOUT (pid:10)

it can be that there isn't enough CPU to start the uvicorn processes within gunicorn's 30 second timeout. Try giving the
pods a little more CPU.

### Uvicorn/Gunicon Configuration

These settings configure the [Uvicorn/Gunicon](https://github.com/tiangolo/uvicorn-gunicorn-fastapi-docker) web server.
Although the server is tuned down to 4 processes to lighten the resource usage, with three pods it still has a dozen
worker processes running.

| Environment Variable | Description             |
| -------------------- | ----------------------- |
| PORT                 | Port to listen on: 8080 |
| WEB_CONCURRENCY      | Number of processes: 4  |

### PostgreSQL Database Configuration

These settings are for building connections to the database.

| Environment Variable | Description                        |
| -------------------- | ---------------------------------- |
| PPR_API_DB_HOSTNAME  | Host where the database is located |
| PPR_API_DB_PORT      | Port to listen on: 5432            |
| PPR_API_DB_NAME      | The name of the database           |
| PPR_API_DB_USERNAME  | The username to connect with       |
| PPR_API_DB_PASSWORD  | The password of the user           |

### Sentry Configuration

These settings configure [Sentry](https://sentry.io) for error monitoring.

| Environment Variable | Description                    |
| -------------------- | ------------------------------ |
| SENTRY_DSN           | Sentry key for the PPR project |
| SENTRY_ENVIRONMENT   | Environment: Dev/Test/Prod     |

### Jaeger Configuration

# TODO - Update for Python

See the [Jaeger Client Config Documentation]
(https://github.com/jaegertracing/jaeger-client-java/blob/v1.0.0/jaeger-core/README.md#configuration-via-environment)
for detailed instructions on how to configure instrumentation. If not specified, defaults will be used.
`JAEGER_SERVICE_NAME` will be overriden with `ims-api`.

By default the `JAEGER_SAMPLER_PARAM` is set to `0.001`, so you are unlikely to see spans reported locally unless you
override this value.

The [docker-compose.yml](../docker-compose.yml) in the project root directory can be used to run Jaeger on your local
system. The Jaeger Java client will use the instance running on `localhost` by default.
