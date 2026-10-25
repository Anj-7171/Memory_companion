from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models import Memory
from ai.sentiment_service import analyze_text


def generate_memory_reel(db: Session, limit: int = 7) -> dict:
    """Generate an AI-driven narrative summary and reflection reel from recent memories."""
    statement = (
        select(Memory)
        .order_by(Memory.created_at.desc(), Memory.id.desc())
        .limit(limit)
    )
    memories = list(db.scalars(statement).all())

    if not memories:
        return {
            "title": "Your Story Begins Today",
            "subtitle": "No memories captured yet",
            "narration": "Every journey begins with a single moment. Capture your thoughts, feelings, and experiences to see your AI memory story come alive.",
            "emotional_tone": "Reflective",
            "highlight_count": 0,
            "key_moments": [],
        }

    # Aggregate emotional analysis across all memories
    all_emotions = []
    total_polarity = 0.0
    titles = []

    for mem in memories:
        analysis = analyze_text(f"{mem.title} {mem.content}")
        all_emotions.extend(analysis["emotions"])
        total_polarity += analysis["polarity_score"]
        titles.append(mem.title)

    avg_polarity = total_polarity / max(len(memories), 1)

    # Determine dominant emotional tone
    if avg_polarity >= 0.3:
        tone = "Uplifting & Connected"
        reel_title = "Golden Moments & Growth"
    elif avg_polarity <= -0.2:
        tone = "Gentle Resilience"
        reel_title = "Navigating Challenges & Moving Forward"
    elif "nostalgia" in all_emotions:
        tone = "Warm & Nostalgic"
        reel_title = "Familiar Echoes of the Past"
    elif "calm" in all_emotions:
        tone = "Peaceful & Grounded"
        reel_title = "Quiet Reflections"
    else:
        tone = "Thoughtful Balance"
        reel_title = "Fragments of a Beautiful Week"

    # Construct the cohesive narration
    first_title = titles[0]
    older_titles = ", ".join(titles[1:3]) if len(titles) > 1 else "small quiet moments"

    narration_parts = [
        f"Looking back at your recent archive of {len(memories)} {'moments' if len(memories) > 1 else 'moment'}, a clear rhythm emerges.",
        f"Most recently, you reflected on '{first_title}'.",
    ]

    if len(titles) > 1:
        narration_parts.append(f"Earlier entries like {older_titles} added layers of warmth and perspective to your week.")

    if avg_polarity >= 0.2:
        narration_parts.append("Your journey reflects growing joy, optimism, and genuine appreciation for the present.")
    else:
        narration_parts.append("Taking time to pause, notice, and write down these feelings is quietly building your inner foundation.")

    full_narration = " ".join(narration_parts)

    return {
        "title": reel_title,
        "subtitle": f"Synthesized from {len(memories)} recent memories",
        "narration": full_narration,
        "emotional_tone": tone,
        "highlight_count": len(memories),
        "key_moments": [
            {
                "id": m.id,
                "title": m.title,
                "mood": m.mood,
                "created_at": m.created_at.isoformat(),
            }
            for m in memories[:3]
        ],
    }
