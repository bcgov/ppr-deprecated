# Use fastapi 0.52.0 (https://github.com/tiangolo/uvicorn-gunicorn-fastapi-docker)
FROM tiangolo/uvicorn-gunicorn-fastapi:uvicorn-gunicorn-fastapi:python3.7-2020-03-01

COPY ./openshift/prestart.sh /app
COPY ./alembic.ini /app
COPY ./migrations /app/migrations

COPY ./src /app
COPY ./requirements.txt /tmp
RUN pip install -r /tmp/requirements.txt
