import fastapi
from starlette.middleware import cors
import uvicorn

from endpoints import healthcheck

app = fastapi.FastAPI()
app.include_router(healthcheck.router)

origins = [
    "http://localhost:8080",
    "https://ppr-dev.pathfinder.gov.bc.ca"
]

app.add_middleware(
    cors.CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


# sample setting status code
# sample read header
# sample return json structure
@app.get("/auth/{user_name}", status_code=201)
async def read_item(user_name: str, user_agent: str = fastapi.Header(None)):
    my_list = ["justin", "walter", "bryan"]
    print(my_list)
    print(user_name)
    if user_name in my_list:
        return {"user_name": user_name, "user_agent": user_agent}
    raise fastapi.HTTPException(status_code=404, detail="Invalid user name")


# You should use uvicorn to run the app locally.  __main__ is provided to run it in a debugger. See
# https://fastapi.tiangolo.com/tutorial/debugging/
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
