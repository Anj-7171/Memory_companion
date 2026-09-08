from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.database import Base, engine
from database import models

from routers.memories import router as memories_router
from routers.moods import router as moods_router


# ============================================================
# DATABASE INITIALIZATION
# ============================================================

Base.metadata.create_all(
    bind=engine
)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="ROOTS Memory OS API",
    version="1.0.0",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# MODULE 1 — MEMORY MANAGEMENT
# ============================================================

app.include_router(
    memories_router
)


# ============================================================
# MODULE 2 — MOOD TRACKING
# ============================================================

app.include_router(
    moods_router
)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get(
    "/health",
    tags=["health"],
)
def health_check():
    return {
        "status": "ok"
    }