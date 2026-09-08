from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from database.database import get_db

from schemas.game import (
    GameResponse,
    GameSessionCreate,
    GameSessionResponse,
    GameSessionComplete,
)

from services.game_service import (
    list_games,
    get_game,
    create_game_session,
    get_game_session,
    complete_game_session,
)


# ============================================================
# MODULE 3 — CONNECTION GAMES API
# ============================================================

router = APIRouter(
    prefix="/api/games",
    tags=["games"],
)


@router.get(
    "",
    response_model=list[GameResponse],
)
def read_games(
    db: Session = Depends(get_db),
):

    return list_games(db)


@router.get(
    "/{game_id}",
    response_model=GameResponse,
)
def read_game(
    game_id: int,
    db: Session = Depends(get_db),
):

    game = get_game(
        db,
        game_id,
    )

    if not game:
        raise HTTPException(
            status_code=404,
            detail="Game not found",
        )

    return game


@router.post(
    "/{game_id}/sessions",
    response_model=GameSessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def start_game_session(
    game_id: int,
    session_data: GameSessionCreate,
    db: Session = Depends(get_db),
):

    try:

        return create_game_session(
            db,
            game_id,
            session_data.player_name,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error),
        )


@router.get(
    "/sessions/{session_id}",
    response_model=GameSessionResponse,
)
def read_game_session(
    session_id: int,
    db: Session = Depends(get_db),
):

    session = get_game_session(
        db,
        session_id,
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Game session not found",
        )

    return session


@router.post(
    "/sessions/{session_id}/complete",
    response_model=GameSessionResponse,
)
def finish_game_session(
    session_id: int,
    result: GameSessionComplete,
    db: Session = Depends(get_db),
):

    try:

        return complete_game_session(
            db,
            session_id,
            result.score,
            result.moves,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error),
        )