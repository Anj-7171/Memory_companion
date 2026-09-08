from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ============================================================
# MODULE 3 — CONNECTION GAMES
# ============================================================


class GameResponse(BaseModel):
    id: int
    name: str
    description: str
    game_type: str

    model_config = ConfigDict(
        from_attributes=True
    )


class GameSessionCreate(BaseModel):
    player_name: str


class GameSessionResponse(BaseModel):
    id: int
    game_id: int
    player_name: str
    score: int
    moves: int
    completed: bool
    started_at: datetime
    completed_at: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )


class GameSessionComplete(BaseModel):
    score: int
    moves: int