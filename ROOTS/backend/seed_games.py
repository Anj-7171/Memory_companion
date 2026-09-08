from database.database import SessionLocal
from database.models import Game


def seed_games():
    db = SessionLocal()

    try:
        existing_game = (
            db.query(Game)
            .filter(Game.game_type == "memory_match")
            .first()
        )

        if existing_game:
            print("Memory Match already exists.")
            return

        game = Game(
            name="Memory Match",
            description="Match the pairs and test your memory.",
            game_type="memory_match",
        )

        db.add(game)
        db.commit()

        print("Memory Match game added successfully.")

    finally:
        db.close()


if __name__ == "__main__":
    seed_games()