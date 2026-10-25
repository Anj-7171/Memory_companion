import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { router } from "expo-router";

import { COLORS } from "../constants/colors";
import GlassCard from "../components/GlassCard";
import {
  getMemories,
  createGameSession,
  completeGameSession,
  Memory,
} from "../services/api";

interface TimelineItem {
  id: string;
  title: string;
  timeHint: string;
  order: number;
  mood?: string | null;
}

const DEFAULT_MILESTONES: TimelineItem[] = [
  { id: "d1", title: "Sunrise Walk & Coffee", timeHint: "7:00 AM", order: 1, mood: "Peaceful" },
  { id: "d2", title: "Focused Writing Block", timeHint: "10:30 AM", order: 2, mood: "Inspired" },
  { id: "d3", title: "Lunch with Old Friends", timeHint: "1:15 PM", order: 3, mood: "Joyful" },
  { id: "d4", title: "Sunset at the Hillside", timeHint: "6:45 PM", order: 4, mood: "Reflective" },
  { id: "d5", title: "Stargazing & Diary Entry", timeHint: "10:30 PM", order: 5, mood: "Calm" },
];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function TimelineChallengeScreen() {
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [moves, setMoves] = useState(0);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const initGame = useCallback((sourceMemories: Memory[] = []) => {
    let rawItems: TimelineItem[] = [];

    if (sourceMemories.length >= 4) {
      // Sort oldest to newest to assign correct order
      const sorted = [...sourceMemories]
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .slice(0, 5);

      rawItems = sorted.map((m, index) => ({
        id: String(m.id),
        title: m.title,
        timeHint: new Date(m.created_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        order: index + 1,
        mood: m.mood,
      }));
    } else {
      rawItems = DEFAULT_MILESTONES;
    }

    // Ensure it starts scrambled
    let scrambled = shuffle(rawItems);
    while (scrambled.every((item, i) => item.order === i + 1) && scrambled.length > 1) {
      scrambled = shuffle(rawItems);
    }

    setItems(scrambled);
    setMoves(0);
    setIsCompleted(false);
    setScore(null);
    setFeedback(null);

    // Create session in backend
    createGameSession(2, "Player")
      .then((session) => setSessionId(session.id))
      .catch(() => {});
  }, []);

  useEffect(() => {
    getMemories()
      .then((mems) => initGame(mems))
      .catch(() => initGame([]));
  }, [initGame]);

  const moveUp = (index: number) => {
    if (index === 0 || isCompleted) return;
    const newItems = [...items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
    setMoves((m) => m + 1);
    setFeedback(null);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1 || isCompleted) return;
    const newItems = [...items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    setItems(newItems);
    setMoves((m) => m + 1);
    setFeedback(null);
  };

  const checkSolution = async () => {
    const isCorrect = items.every((item, idx) => item.order === idx + 1);

    if (isCorrect) {
      const calculatedScore = Math.max(100 - moves * 5, 40);
      setIsCompleted(true);
      setScore(calculatedScore);
      setFeedback("✦ Perfect Timeline! Memories aligned in perfect sequence.");

      if (sessionId) {
        completeGameSession(sessionId, calculatedScore, moves).catch(() => {});
      }

      Alert.alert(
        "Timeline Restored!",
        `You reconstructed the sequence in ${moves} moves with a score of ${calculatedScore} points!`,
        [{ text: "Awesome!" }]
      );
    } else {
      setFeedback("Not quite right yet — check the flow of events and try rearranging.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.glow} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Navigation Bar */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <View style={styles.movesBadge}>
            <Text style={styles.movesText}>{moves} MOVES</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>TIMELINE CHALLENGE</Text>
          <Text style={styles.title}>
            Reorder the{"\n"}
            <Text style={styles.highlight}>moments.</Text>
          </Text>
          <Text style={styles.description}>
            Use the arrow controls to arrange these memories in chronological order from earliest to latest.
          </Text>
        </View>

        {/* Feedback / Status */}
        {feedback && (
          <GlassCard
            style={[
              styles.feedbackCard,
              isCompleted && styles.feedbackCardSuccess,
            ]}
          >
            <Text
              style={[
                styles.feedbackText,
                isCompleted && styles.feedbackTextSuccess,
              ]}
            >
              {feedback}
            </Text>
          </GlassCard>
        )}

        {/* Timeline Items List */}
        <View style={styles.timelineList}>
          {items.map((item, index) => {
            return (
              <GlassCard key={item.id} style={styles.itemCard}>
                <View style={styles.orderBadge}>
                  <Text style={styles.orderNumber}>{index + 1}</Text>
                </View>

                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <View style={styles.itemMeta}>
                    <Text style={styles.itemHint}>⏱ {item.timeHint}</Text>
                    {item.mood && (
                      <Text style={styles.itemMood}>• {item.mood}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.controls}>
                  <Pressable
                    style={[
                      styles.arrowButton,
                      index === 0 && styles.arrowDisabled,
                    ]}
                    onPress={() => moveUp(index)}
                    disabled={index === 0 || isCompleted}
                  >
                    <Text style={styles.arrowText}>▲</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.arrowButton,
                      index === items.length - 1 && styles.arrowDisabled,
                    ]}
                    onPress={() => moveDown(index)}
                    disabled={index === items.length - 1 || isCompleted}
                  >
                    <Text style={styles.arrowText}>▼</Text>
                  </Pressable>
                </View>
              </GlassCard>
            );
          })}
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionRow}>
          {!isCompleted ? (
            <Pressable style={styles.checkButton} onPress={checkSolution}>
              <Text style={styles.checkButtonText}>Check Sequence ✦</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.playAgainButton}
              onPress={() => {
                getMemories()
                  .then((m) => initGame(m))
                  .catch(() => initGame([]));
              }}
            >
              <Text style={styles.playAgainText}>Play Another Round ↺</Text>
            </Pressable>
          )}
        </View>

        {score !== null && (
          <GlassCard style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>SCORE EARNED</Text>
            <Text style={styles.scoreNumber}>{score} PTS</Text>
          </GlassCard>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 60,
  },
  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(124, 255, 178, 0.04)",
    top: -60,
    right: -80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  backText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  movesBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(124, 255, 178, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(124, 255, 178, 0.2)",
  },
  movesText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  hero: {
    marginBottom: 24,
  },
  eyebrow: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 40,
  },
  highlight: {
    color: COLORS.primary,
  },
  description: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  feedbackCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  feedbackCardSuccess: {
    borderColor: "rgba(124, 255, 178, 0.4)",
    backgroundColor: "rgba(124, 255, 178, 0.08)",
  },
  feedbackText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  feedbackTextSuccess: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  timelineList: {
    gap: 12,
    marginBottom: 26,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  orderBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(124, 255, 178, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  orderNumber: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  itemHint: {
    color: COLORS.muted,
    fontSize: 11,
  },
  itemMood: {
    color: COLORS.primary,
    fontSize: 11,
    fontStyle: "italic",
  },
  controls: {
    flexDirection: "column",
    gap: 4,
    marginLeft: 8,
  },
  arrowButton: {
    width: 32,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowDisabled: {
    opacity: 0.25,
  },
  arrowText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  actionRow: {
    marginTop: 10,
    marginBottom: 20,
  },
  checkButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 22,
    alignItems: "center",
  },
  checkButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: "700",
  },
  playAgainButton: {
    backgroundColor: "rgba(124, 255, 178, 0.15)",
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 22,
    alignItems: "center",
  },
  playAgainText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  scoreCard: {
    alignItems: "center",
    paddingVertical: 16,
    marginTop: 8,
  },
  scoreLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  scoreNumber: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: "700",
  },
});
