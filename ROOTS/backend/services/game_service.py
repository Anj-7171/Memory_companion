from datetime import datetime

from sqlalchemy.orm import Session

from database.models import Game, GameSession


# ============================================================
# MODULE 3 — CONNECTION GAMES SERVICE
# ============================================================


def list_games(db: Session):

    return (
        db.query(Game)
        .order_by(Game.id)
        .all()
    )


def get_game(
    db: Session,
    game_id: int,
):

    return (
        db.query(Game)
        .filter(Game.id == game_id)
        .first()
    )


def create_game_session(
    db: Session,
    game_id: int,
    player_name: str,
):

    game = get_game(
        db,
        game_id,
    )

    if not game:
        raise ValueError(
            "Game not found"
        )

    session = GameSession(
        game_id=game_id,
        player_name=player_name,
        score=0,
        moves=0,
        completed=False,
        started_at=datetime.utcnow(),
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


def get_game_session(
    db: Session,
    session_id: int,
):

    return (
        db.query(GameSession)
        .filter(
            GameSession.id == session_id
        )
        .first()
    )


def complete_game_session(
    db: Session,
    session_id: int,
    score: int,
    moves: int,
):

    session = get_game_session(
        db,
        session_id,
    )

    if not session:
        raise ValueError(
            "Game session not found"
        )

    session.score = score
    session.moves = moves
    session.completed = True
    session.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(session)

    return session