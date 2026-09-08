from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database.models import Mood
from schemas.mood import MoodCreate


# ============================================================
# MODULE 2 — MOOD TRACKING
# ============================================================

MOOD_SCORES = {
    "anxious": 2,
    "low": 4,
    "neutral": 6,
    "content": 8,
    "energized": 10,
}


def create_mood(
    db: Session,
    mood_data: MoodCreate,
) -> Mood:

    mood_name = mood_data.mood.strip().lower()

    if mood_name not in MOOD_SCORES:
        raise ValueError(
            f"Unsupported mood: {mood_data.mood}"
        )

    mood = Mood(
        mood=mood_name,
        score=MOOD_SCORES[mood_name],
    )

    db.add(mood)
    db.commit()
    db.refresh(mood)

    return mood


def list_moods(
    db: Session,
) -> list[Mood]:

    statement = (
        select(Mood)
        .order_by(
            Mood.created_at.desc(),
            Mood.id.desc(),
        )
    )

    return list(
        db.scalars(statement).all()
    )


def get_mood_summary(
    db: Session,
) -> dict:

    total_entries = db.scalar(
        select(
            func.count(Mood.id)
        )
    ) or 0

    average_score = db.scalar(
        select(
            func.avg(Mood.score)
        )
    )

    latest_mood = db.scalars(
        select(Mood)
        .order_by(
            Mood.created_at.desc(),
            Mood.id.desc(),
        )
        .limit(1)
    ).first()

    return {
        "average_score": round(
            float(average_score or 0),
            2,
        ),
        "total_entries": total_entries,
        "current_mood": (
            latest_mood.mood
            if latest_mood
            else None
        ),
    }