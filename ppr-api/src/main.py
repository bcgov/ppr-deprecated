import fastapi
import sentry_sdk
from starlette.middleware import cors
import uvicorn

import config
from endpoints import api

sentry_sdk.init(config.SENTRY_DSN, environment=config.SENTRY_ENVIRONMENT)

app = fastapi.FastAPI()
app.include_router(api.router)

origins = [
    "http://localhost:8080",
    "https://ppr-dev.pathfinder.gov.bc.ca"
    "https://dev.bcregistry.ca"
]

app.add_middleware(
    cors.CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# You should use uvicorn to run the app locally.  __main__ is provided to run it in a debugger. See
# https://fastapi.tiangolo.com/tutorial/debugging/
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
