from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from database.database import get_db

from schemas.mood import (
    MoodCreate,
    MoodResponse,
    MoodSummary,
)

from services.mood_service import (
    create_mood,
    get_mood_summary,
    list_moods,
)


# ============================================================
# MODULE 2 — MOOD TRACKING API
# ============================================================

router = APIRouter(
    prefix="/api/moods",
    tags=["moods"],
)


@router.post(
    "",
    response_model=MoodResponse,
    status_code=status.HTTP_201_CREATED,
)
def write_mood(
    mood_data: MoodCreate,
    db: Session = Depends(get_db),
):

    try:
        return create_mood(
            db,
            mood_data,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.get(
    "",
    response_model=list[MoodResponse],
)
def read_moods(
    db: Session = Depends(get_db),
):

    return list_moods(db)


@router.get(
    "/summary",
    response_model=MoodSummary,
)
def read_mood_summary(
    db: Session = Depends(get_db),
):

    return get_mood_summary(db)