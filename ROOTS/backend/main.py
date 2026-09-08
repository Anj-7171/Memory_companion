from fastapi import FastAPI

from database.database import Base, engine
from database import models
from routers.memories import router as memories_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ROOTS Memory OS API", version="1.0.0")
app.include_router(memories_router)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
	return {"status": "ok"}
