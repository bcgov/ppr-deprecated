from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:8080",
    "https://ppr-dev.pathfinder.gov.bc.ca"
]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
    allow_origins=origins
)


def custom_openapi():
    if not app.openapi_schema:
        app.openapi_schema = get_openapi(
            description="A nice description of our nice API.",
            title="Personal Property Registry API",
            routes=app.routes,
            version="0.0.0"
        )

        # Logo for redoc.
        app.openapi_schema["info"]["x-logo"] = {
            "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
        }

    return app.openapi_schema






app.openapi = custom_openapi


@app.get("/")
async def hello_world():
    return {"message": "Hello World"}
