import fastapi

router = fastapi.APIRouter()


@router.get("/health")
async def health():
    return {"status": "UP"}
