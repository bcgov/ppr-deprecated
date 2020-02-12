FROM tiangolo/uvicorn-gunicorn-fastapi:python3.7-2019-10-15

COPY ./openshift/prestart.sh /app
COPY ./alembic.ini /app
COPY ./migrations /app/migrations

COPY ./src /app
COPY ./requirements.txt /tmp
RUN pip install -r /tmp/requirements.txt
