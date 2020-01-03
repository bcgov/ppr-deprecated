# PPR API

The PPR API is currently a passthrough API that calls the IMS Transaction Manager via the `ims-api`.


## Development Setup

Open the ppr-api directory in VS Code to treat it as a project. To prevent version clashes, set up a virtual environment
to install the Python packages used by this project.

1. To activate the *Python* plugin, open any *.py* file. You will get error notifications about missing linters, test
suites, and interpreters - these can be ignored.
1. Run `python3 -m venv .venv` to create the virtual environment in the directory *.venv*. You should get a notification
allowing you to choose it as your enviroment.
1. Start a new terminal window to activate the `(.venv)` environment (or run `source .venv/bin/activate` in an existing
terminal).
1. In that terminal do `pip install -r requirements/dev.txt` to install the required packages.
1. Next run `pip install .` to set up the environment for running tests.

You also need to set up the variables used for environment-specific settings:
1. Copy the [dotenv template file](../docs/dotenv_template) to somewhere above the source code and rename to `.env`. You
will need to fill in missing values.


## Running PPR-API

1. Start the uvicorn server with `(cd src && uvicorn main:app --reload)`
1. View the [OpenAPI Docs](http://127.0.0.1:8000/docs).


## Debugging PPR-API

1. ???


## Running Unit Tests

Tests are run from the Status bar at the bottom of the workbench. This will also run the coverage report, which appears
in the *htmlcov* directory.


## Debugging Unit Tests

1. ???


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
