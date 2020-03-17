import fastapi
import sentry_sdk
import sentry_sdk.integrations.sqlalchemy
import uvicorn
from starlette.middleware import cors

import config
from endpoints import api


sentry_sdk.init(config.SENTRY_DSN, environment=config.SENTRY_ENVIRONMENT,
                integrations=[sentry_sdk.integrations.sqlalchemy.SqlalchemyIntegration()])

app = fastapi.FastAPI()
app.include_router(api.router)

app.add_middleware(
    cors.CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

# You should use uvicorn to run the app locally.  __main__ is provided to run it in a debugger. See
# https://fastapi.tiangolo.com/tutorial/debugging/
if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
