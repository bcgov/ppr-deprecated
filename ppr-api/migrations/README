# Alembic Migration Tool

Commands in this document assume you are running in the `ppr-api` folder. For detailed information refer to
[Alembic's documentation](https://alembic.sqlalchemy.org/en/latest/index.html)

PPR uses a generic single-database configuration.

## Create a new migration

`alembic revision -m "<description>"`

See [Create a Migration Script](https://alembic.sqlalchemy.org/en/latest/tutorial.html#create-a-migration-script) for
migration script basics

Each script should have an `upgrade` function and a `downgrade` function that reverses the upgrade.

## Run migrations up to the most recent revision

`alembic upgrade head`

## Downgrade from the most recent revision

This will run the `downgrade` function in the most recently applied version

`alembic downgrade -1`
