from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

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