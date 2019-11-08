# PPR API

The PPR API is currently a passthrough API that calls the IMS Transaction Manager via the `ims-api`.

## Developer Setup

1. `$ pip install -r requirements/dev.txt`
1. `$ (cd src && uvicorn main:app --reload)`
1. View the [OpenAPI Docs](http://127.0.0.1:8000/docs).

### Local Dependencies

The api requires a **PostgreSQL** database which can be launched locally with docker compose. You must specify a password for
the database using the `DB_PASSWORD` environment variable. This is required by both docker compose PPR API.

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

| Environment Variable | Description                                   |
| -------------------- | --------------------------------------------- |
| DB_HOSTNAME          | Host where the database is located: localhost |
| DB_PORT              | Port to listen on: 5432                       |
| DB_NAME              | The name of the database: ppr                 |
| DB_USERNAME          | The username to connect with: postgres        |
| DB_PASSWORD          | The password of the user. **Required**        |

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
