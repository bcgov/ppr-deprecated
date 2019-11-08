# Developer Notes

## Python Virtual Environment

This information below is taken from the [VS Code Documentation](#https://code.visualstudio.com/docs/python/environments). Refer to it for clarification or to expand your knowledge.

After pulling down the PPR repository, open the `/ppr-api` directory in VS Code. You will want to install python package in a virtual environment, rather than in the global installation:

```
$ python3 -m venv .venv
```

Popup: "We noticed a new virtual environment has been created. Do you want to select it for the workspace folder?" (`Yes`, and choose the .venv one)

Popup: "Linter pylint is not installed." (`Install`)

Ensure the command line prompt starts with something like `(.venv)`, otherwise ... (TBD: how to activate?).

Or from the bash command line activate the virtual environment

```shell script
source ./.venv/bin/activate
```

## Installing Development Requirements

```
(.venv) $ pip3 install -r requirements/dev.txt
```

This will install what is needed to run in VS Code. Note that there will be errors regarding an invalid command 'bdist_wheel', but these don't appear to be a problem.

## Start a local PostgreSQL database

The web service is dependent on a postgres database which can be launched with docker compose.  You **must** specify a
password for the database using the `DB_PASSWORD` environment variable.  This is required by both docker compose
and the service.

In the root project directory, run:
```
$ docker-compose up -d
```

## Start the Web Service

```
(.venv) $ uvicorn src.main:app --reload
```

This should bring the web service up on http://localhost:8000, with OpenAPI documentation available at http://localhost:8000/docs.

**Note:** The webservice requires the `DB_PASSWORD` environment variable, which should be the same as the one
provided when you ran *docker-compose*.

### Using a debugger

In order to connect to the application with a debugger, you need to run it as a script.
See [Run your code with your debugger](https://fastapi.tiangolo.com/tutorial/debugging/#run-your-code-with-your-debugger) for details.
