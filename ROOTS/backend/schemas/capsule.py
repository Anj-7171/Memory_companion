from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class CapsuleCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=100,
    )
    description: str | None = Field(
        default=None,
    )


class CapsuleJoin(BaseModel):
    invite_code: str = Field(
        min_length=3,
        max_length=16,
    )


class CapsuleResponse(BaseModel):
    id: int
    title: str
    description: str | None = None
    invite_code: str
    created_at: datetime
    memory_count: int = 0

    model_config = ConfigDict(
        from_attributes=True,
    )
