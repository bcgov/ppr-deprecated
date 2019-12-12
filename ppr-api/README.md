# PPR API

## Setup 
Do the following once in your local devevlopment environment

Install python package in a virtual environment.

```
$ python3 -m venv .venv
```

Activate the virtual environment

```shell script
source ./.venv/bin/activate
```
Your prompt show now start with ```(.venv) ```. Install development requirements inside the .venv environment

```
pip3 install -r requirements/dev.txt
```


## Run the API server

Activate the virtual environment and once inside start the app

```shell script
source ./.venv/bin/activate
```
Your prompt show now start with ```(.venv) ```.
Run the server inside the .venv environment

```
uvicorn src.main:app --reload
```

This should bring the web service up on http://localhost:8000, 
with OpenAPI documentation available at http://localhost:8000/docs.

### Using a debugger

In order to connect to the application with a debugger, you need to run it as a script.
See [Run your code with your debugger](https://fastapi.tiangolo.com/tutorial/debugging/#run-your-code-with-your-debugger) for details.
