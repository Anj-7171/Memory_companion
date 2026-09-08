from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.database import Base, engine
from database import models

from routers.memories import router as memories_router


Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="ROOTS Memory OS API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    memories_router
)


@app.get(
    "/health",
    tags=["health"],
)
def health_check():
    return {
        "status": "ok"
    }