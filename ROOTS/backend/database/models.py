from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.database import Base


# ============================================================
# MODULE 1 — MEMORY MANAGEMENT
# ============================================================

class Memory(Base):
    __tablename__ = "memories"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    mood: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    memory_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="moment",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )


# ============================================================
# MODULE 2 — MOOD TRACKING
# ============================================================

class Mood(Base):
    __tablename__ = "moods"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    mood: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )


# ============================================================
# MODULE 3 — CONNECTION GAMES
# ============================================================

class Game(Base):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    game_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    sessions: Mapped[list["GameSession"]] = relationship(
        back_populates="game",
        cascade="all, delete-orphan",
    )


class GameSession(Base):
    __tablename__ = "game_sessions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    game_id: Mapped[int] = mapped_column(
        ForeignKey("games.id"),
        nullable=False,
    )

    player_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    moves: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=0,
    )

    completed: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    game: Mapped["Game"] = relationship(
        back_populates="sessions",
    )