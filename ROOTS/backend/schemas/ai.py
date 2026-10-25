from pydantic import BaseModel, Field


class TextAnalysisRequest(BaseModel):
    text: str = Field(min_length=1)


class TextAnalysisResponse(BaseModel):
    sentiment: str
    polarity_score: float
    emotions: list[str]
    suggested_mood: str
    suggested_type: str


class MemoryReelHighlight(BaseModel):
    id: int
    title: str
    mood: str | None = None
    created_at: str


class MemoryReelResponse(BaseModel):
    title: str
    subtitle: str
    narration: str
    emotional_tone: str
    highlight_count: int
    key_moments: list[MemoryReelHighlight] = []


class TranscriptionRequest(BaseModel):
    audio_base64: str | None = None


class TranscriptionResponse(BaseModel):
    transcript: str
    duration: float | None = None
