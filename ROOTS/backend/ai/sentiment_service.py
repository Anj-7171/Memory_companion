import re

# Comprehensive emotion keyword dictionaries
EMOTION_LEXICON = {
    "joy": [
        "happy", "joy", "laugh", "fun", "excited", "smile", "great",
        "amazing", "wonderful", "celebrat", "delight", "love", "cheer"
    ],
    "nostalgia": [
        "remember", "miss", "past", "childhood", "old", "familiar",
        "memories", "back then", "remind", "yesterday", "years ago", "hometown"
    ],
    "calm": [
        "quiet", "peace", "calm", "relax", "sunset", "breeze", "still",
        "gentle", "serene", "cozy", "soft", "silence", "rest"
    ],
    "gratitude": [
        "thank", "grateful", "blessed", "appreciate", "kindness", "helped",
        "support", "friend", "warmth", "gift"
    ],
    "pride": [
        "proud", "win", "finished", "accomplish", "solved", "succeeded",
        "finally", "progress", "achieve", "worked hard"
    ],
    "reflection": [
        "thought", "think", "wonder", "realize", "noticed", "future",
        "meaning", "observe", "introspect", "learn", "perspective"
    ],
    "anxiety": [
        "stress", "anxious", "worried", "nervous", "scared", "overwhelm",
        "deadline", "pressure", "uncertain", "panic", "fear"
    ],
    "fatigue": [
        "tired", "exhaust", "sleepy", "burnout", "drain", "heavy",
        "long day", "hard day", "weary"
    ],
    "hope": [
        "hope", "aspire", "dream", "optimis", "looking forward", "better",
        "bright", "opportunity", "start"
    ]
}

POSITIVE_WORDS = {
    "good", "great", "wonderful", "amazing", "beautiful", "happy", "joy",
    "love", "fun", "peace", "proud", "inspired", "delight", "awesome",
    "blessed", "sweet", "sunshine", "friend", "succeed", "smile", "win"
}

NEGATIVE_WORDS = {
    "sad", "bad", "terrible", "awful", "tired", "stressed", "anxious",
    "worry", "lonely", "exhausted", "pain", "hurt", "difficult", "tough",
    "burnout", "upset", "angry", "lost", "regret"
}

NEGATIONS = {"not", "never", "no", "hardly", "barely", "scarcely", "without"}


def analyze_text(text: str) -> dict:
    """Analyze memory text to extract sentiment polarity, emotion tags, and suggested moods."""
    cleaned = re.sub(r"[^\w\s]", " ", text.lower())
    words = cleaned.split()

    if not words:
        return {
            "sentiment": "neutral",
            "polarity_score": 0.0,
            "emotions": ["reflection"],
            "suggested_mood": "Reflective",
            "suggested_type": "thought",
        }

    # Polarity calculation with negation awareness
    score = 0.0
    for i, word in enumerate(words):
        negated = (i > 0 and words[i - 1] in NEGATIONS) or (i > 1 and words[i - 2] in NEGATIONS)
        weight = -1.0 if negated else 1.0

        if word in POSITIVE_WORDS or any(word.startswith(p) for p in ["happi", "excit", "amaz", "wonder"]):
            score += weight * 0.2
        elif word in NEGATIVE_WORDS or any(word.startswith(n) for n in ["stress", "anxio", "exhaust", "worri"]):
            score -= weight * 0.2

    # Clamp polarity score between -1.0 and 1.0
    polarity = max(min(round(score, 2), 1.0), -1.0)

    # Emotion detection
    detected_emotions = []
    text_lower = text.lower()
    for emotion, keywords in EMOTION_LEXICON.items():
        if any(kw in text_lower for kw in keywords):
            detected_emotions.append(emotion)

    if not detected_emotions:
        if polarity > 0.2:
            detected_emotions = ["joy"]
        elif polarity < -0.2:
            detected_emotions = ["reflection"]
        else:
            detected_emotions = ["calm"]

    # Sentiment categorization
    if polarity >= 0.25:
        sentiment_label = "positive"
    elif polarity <= -0.25:
        sentiment_label = "challenging"
    elif "reflection" in detected_emotions:
        sentiment_label = "reflective"
    else:
        sentiment_label = "neutral"

    # Suggest mood & category
    if "joy" in detected_emotions or polarity >= 0.5:
        suggested_mood = "Joyful"
    elif "calm" in detected_emotions or "peace" in text_lower:
        suggested_mood = "Peaceful"
    elif "pride" in detected_emotions or "win" in text_lower:
        suggested_mood = "Proud"
    elif "nostalgia" in detected_emotions:
        suggested_mood = "Nostalgic"
    elif "hope" in detected_emotions or polarity > 0:
        suggested_mood = "Inspired"
    else:
        suggested_mood = "Reflective"

    if any(k in text_lower for k in ["park", "beach", "city", "lake", "cafe", "room", "campus", "visited", "place"]):
        suggested_type = "place"
    elif any(k in text_lower for k in ["finished", "win", "solved", "accomplished", "passed", "exam"]):
        suggested_type = "achievement"
    elif any(k in text_lower for k in ["thought", "realized", "wonder", "idea"]):
        suggested_type = "thought"
    else:
        suggested_type = "moment"

    return {
        "sentiment": sentiment_label,
        "polarity_score": polarity,
        "emotions": detected_emotions[:4],
        "suggested_mood": suggested_mood,
        "suggested_type": suggested_type,
    }
