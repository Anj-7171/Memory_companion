from database.database import SessionLocal
from database.models import Game


def seed_games():
    db = SessionLocal()

    games_to_seed = [
        {
            "name": "Memory Match",
            "description": "Match pairs of cards to sharpen recall and focus.",
            "game_type": "memory_match",
        },
        {
            "name": "Timeline Challenge",
            "description": "Reconstruct milestone memories in chronological sequence.",
            "game_type": "timeline_challenge",
        },
    ]

    try:
        for g in games_to_seed:
            existing = (
                db.query(Game)
                .filter(Game.game_type == g["game_type"])
                .first()
            )
            if not existing:
                game = Game(
                    name=g["name"],
                    description=g["description"],
                    game_type=g["game_type"],
                )
                db.add(game)
                print(f"Added game: {g['name']}")
            else:
                print(f"Game already exists: {g['name']}")

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_games()