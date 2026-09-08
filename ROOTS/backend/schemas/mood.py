from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class MoodCreate(BaseModel):
    mood: str = Field(
        min_length=1,
        max_length=50,
    )


class MoodResponse(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
    )

    id: int
    mood: str
    score: int
    created_at: datetime


class MoodSummary(BaseModel):
    average_score: float
    total_entries: int
    current_mood: str | None