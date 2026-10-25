import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from database.database import Base, get_db
from database import models  # Ensures all models are registered
from main import app

# StaticPool ensures the in-memory SQLite database persists across all connections
SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables in the shared in-memory test database
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_memories_crud():
    # 1. Create memory
    payload = {
        "title": "Evening Walk",
        "content": "Saw a beautiful orange sky near the park.",
        "mood": "peaceful",
        "memory_type": "moment",
    }
    create_res = client.post("/api/memories", json=payload)
    assert create_res.status_code == 201
    created = create_res.json()
    assert created["id"] is not None
    assert created["title"] == "Evening Walk"
    memory_id = created["id"]

    # 2. Get list of memories
    list_res = client.get("/api/memories")
    assert list_res.status_code == 200
    memories_list = list_res.json()
    assert len(memories_list) >= 1
    assert any(m["id"] == memory_id for m in memories_list)

    # 3. Get single memory
    get_res = client.get(f"/api/memories/{memory_id}")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Evening Walk"

    # 4. Delete memory
    del_res = client.delete(f"/api/memories/{memory_id}")
    assert del_res.status_code == 204

    # 5. Verify 404 after deletion
    get_after_del = client.get(f"/api/memories/{memory_id}")
    assert get_after_del.status_code == 404


def test_moods_tracking():
    # 1. Post valid mood
    post_res = client.post("/api/moods", json={"mood": "content"})
    assert post_res.status_code == 201
    data = post_res.json()
    assert data["mood"] == "content"
    assert data["score"] == 8

    # 2. Post another mood
    client.post("/api/moods", json={"mood": "energized"})

    # 3. Read moods
    list_res = client.get("/api/moods")
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 2

    # 4. Read mood summary
    summary_res = client.get("/api/moods/summary")
    assert summary_res.status_code == 200
    summary = summary_res.json()
    assert summary["total_entries"] >= 2
    assert summary["average_score"] > 0
    assert summary["current_mood"] == "energized"

    # 5. Post invalid mood (should return 400)
    bad_res = client.post("/api/moods", json={"mood": "unsupported_mood_name"})
    assert bad_res.status_code == 400


def test_games_and_sessions():
    # 1. Seed a game into the test DB
    from database.models import Game
    db = TestingSessionLocal()
    game = Game(
        name="Memory Match",
        description="Match the cards",
        game_type="memory_match",
    )
    db.add(game)
    db.commit()
    db.refresh(game)
    game_id = game.id
    db.close()

    # 2. Get games list
    games_res = client.get("/api/games")
    assert games_res.status_code == 200
    games_list = games_res.json()
    assert any(g["id"] == game_id for g in games_list)

    # 3. Start a game session
    start_res = client.post(
        f"/api/games/{game_id}/sessions",
        json={"player_name": "TestPlayer"},
    )
    assert start_res.status_code == 201
    session = start_res.json()
    assert session["completed"] is False
    assert session["player_name"] == "TestPlayer"
    session_id = session["id"]

    # 4. Complete the session
    complete_res = client.post(
        f"/api/games/sessions/{session_id}/complete",
        json={"score": 85, "moves": 14},
    )
    assert complete_res.status_code == 200
    completed_session = complete_res.json()
    assert completed_session["completed"] is True
    assert completed_session["score"] == 85
    assert completed_session["moves"] == 14
    assert completed_session["completed_at"] is not None


def test_capsules_crud_and_join():
    # 1. Create a capsule
    capsule_data = {
        "title": "Dorm Room 304",
        "description": "Memories from freshman year with roommates",
    }
    create_res = client.post("/api/capsules", json=capsule_data)
    assert create_res.status_code == 201
    capsule = create_res.json()
    assert capsule["title"] == "Dorm Room 304"
    assert capsule["invite_code"].startswith("ROOT-")
    capsule_id = capsule["id"]
    invite_code = capsule["invite_code"]

    # 2. List capsules
    list_res = client.get("/api/capsules")
    assert list_res.status_code == 200
    capsules = list_res.json()
    assert any(c["id"] == capsule_id for c in capsules)

    # 3. Join capsule by invite code
    join_res = client.post("/api/capsules/join", json={"invite_code": invite_code})
    assert join_res.status_code == 200
    assert join_res.json()["id"] == capsule_id

    # 4. Add a memory to this capsule
    memory_payload = {
        "title": "Late Night Pizza",
        "content": "Ordered pizza at 2 AM while studying for midterms.",
        "mood": "joyful",
        "memory_type": "moment",
        "capsule_id": capsule_id,
    }
    mem_res = client.post("/api/memories", json=memory_payload)
    assert mem_res.status_code == 201
    created_memory = mem_res.json()
    assert created_memory["capsule_id"] == capsule_id

    # 5. Retrieve memories inside this capsule
    capsule_mems_res = client.get(f"/api/capsules/{capsule_id}/memories")
    assert capsule_mems_res.status_code == 200
    capsule_mems = capsule_mems_res.json()
    assert len(capsule_mems) >= 1
    assert any(m["title"] == "Late Night Pizza" for m in capsule_mems)


def test_ai_endpoints():
    # 1. Analyze positive text
    pos_res = client.post(
        "/api/ai/analyze-text",
        json={"text": "I had an amazing and wonderful day celebrating with good friends!"},
    )
    assert pos_res.status_code == 200
    pos_data = pos_res.json()
    assert pos_data["polarity_score"] > 0
    assert pos_data["suggested_mood"] in ["Joyful", "Peaceful", "Proud", "Inspired", "Reflective"]
    assert len(pos_data["emotions"]) > 0

    # 2. Analyze anxious / stressed text
    stress_res = client.post(
        "/api/ai/analyze-text",
        json={"text": "Feeling anxious, overwhelmed and worried about the upcoming exam."},
    )
    assert stress_res.status_code == 200
    stress_data = stress_res.json()
    assert stress_data["polarity_score"] < 0
    assert "anxiety" in stress_data["emotions"]

    # 3. Generate AI memory reel
    reel_res = client.get("/api/ai/reel")
    assert reel_res.status_code == 200
    reel_data = reel_res.json()
    assert "title" in reel_data
    assert "narration" in reel_data
    assert "emotional_tone" in reel_data
    assert "highlight_count" in reel_data

    # 4. Voice transcription test
    transcribe_res = client.post(
        "/api/ai/transcribe",
        json={"audio_base64": "dGVzdF9hdWRpb19kYXRh"},
    )
    assert transcribe_res.status_code == 200
    assert "transcript" in transcribe_res.json()
    assert transcribe_res.json()["duration"] > 0

