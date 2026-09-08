from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MemoryCreate(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    content: str = Field(min_length=1)
    mood: str | None = Field(default=None, max_length=50)
    memory_type: str = Field(default="moment", min_length=1, max_length=50)


class MemoryResponse(MemoryCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
