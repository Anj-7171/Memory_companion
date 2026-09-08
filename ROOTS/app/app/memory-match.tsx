import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";

import { COLORS } from "../constants/colors";

const symbols = ["✦", "◈", "◌", "◎"];

const createCards = () => {
  const cards = [...symbols, ...symbols]
    .map((symbol, index) => ({
      id: `${symbol}-${index}`,
      symbol,
      isFlipped: false,
      isMatched: false,
    }))
    .sort(() => Math.random() - 0.5);

  return cards;
};

export default function MemoryMatchScreen() {
  const [cards, setCards] = useState(createCards);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  const matchedPairs = cards.filter(
    (card) => card.isMatched
  ).length / 2;

  const handleCardPress = (id: string) => {
    if (isChecking) return;

    const selectedCard = cards.find(
      (card) => card.id === id
    );

    if (
      !selectedCard ||
      selectedCard.isFlipped ||
      selectedCard.isMatched
    ) {
      return;
    }

    const updatedCards = cards.map((card) =>
      card.id === id
        ? { ...card, isFlipped: true }
        : card
    );

    const newFlippedCards = [
      ...flippedCards,
      id,
    ];

    setCards(updatedCards);
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setMoves((previousMoves) => previousMoves + 1);

      const firstCard = updatedCards.find(
        (card) => card.id === newFlippedCards[0]
      );

      const secondCard = updatedCards.find(
        (card) => card.id === newFlippedCards[1]
      );

      if (
        firstCard?.symbol === secondCard?.symbol
      ) {
        const matchedCards = updatedCards.map(
          (card) =>
            newFlippedCards.includes(card.id)
              ? { ...card, isMatched: true }
              : card
        );

        setTimeout(() => {
          setCards(matchedCards);
          setFlippedCards([]);
          setIsChecking(false);

          const completed =
            matchedCards.every(
              (card) => card.isMatched
            );

          if (completed) {
            setTimeout(() => {
              Alert.alert(
                "Memory Complete ✦",
                `You completed the challenge in ${moves + 1} moves.`,
                [
                  {
                    text: "Play Again",
                    onPress: resetGame,
                  },
                  {
                    text: "Back",
                    onPress: () => router.back(),
                  },
                ]
              );
            }, 300);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(
            updatedCards.map((card) =>
              newFlippedCards.includes(card.id)
                ? {
                    ...card,
                    isFlipped: false,
                  }
                : card
            )
          );

          setFlippedCards([]);
          setIsChecking(false);
        }, 900);
      }
    }
  };

  const resetGame = () => {
    setCards(createCards());
    setFlippedCards([]);
    setMoves(0);
    setIsChecking(false);
  };

  return (
    <View style={styles.container}>
      {/* Background glow */}
      <View style={styles.glow} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ←
          </Text>
        </Pressable>

        <View>
          <Text style={styles.headerLabel}>
            MEMORY GAME
          </Text>

          <Text style={styles.headerTitle}>
            Memory Match
          </Text>
        </View>

        <Pressable
          style={styles.resetButton}
          onPress={resetGame}
        >
          <Text style={styles.resetText}>
            ↻
          </Text>
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {moves}
          </Text>

          <Text style={styles.statLabel}>
            MOVES
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {matchedPairs} / 4
          </Text>

          <Text style={styles.statLabel}>
            MATCHED
          </Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>
          Find the matching memories
        </Text>

        <Text style={styles.instructionsText}>
          Reveal two cards at a time and match
          every symbol.
        </Text>
      </View>

      {/* Game Grid */}
      <View style={styles.grid}>
        {cards.map((card) => {
          const isVisible =
            card.isFlipped || card.isMatched;

          return (
            <Pressable
              key={card.id}
              style={[
                styles.card,
                isVisible && styles.cardFlipped,
                card.isMatched &&
                  styles.cardMatched,
              ]}
              onPress={() =>
                handleCardPress(card.id)
              }
            >
              <Text
                style={[
                  styles.cardSymbol,
                  !isVisible &&
                    styles.hiddenSymbol,
                ]}
              >
                {isVisible
                  ? card.symbol
                  : "?"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${
                  (matchedPairs / 4) * 100
                }%`,
              },
            ]}
          />
        </View>

        <Text style={styles.progressText}>
          {matchedPairs} of 4 pairs discovered
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 70,
  },

  glow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(124, 255, 178, 0.04)",
    top: -120,
    right: -100,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0D1315",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    color: COLORS.text,
    fontSize: 24,
  },

  headerLabel: {
    color: COLORS.primary,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.5,
    textAlign: "center",
  },

  headerTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },

  resetButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0D1315",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  resetText: {
    color: COLORS.primary,
    fontSize: 22,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 45,
  },

  stat: {
    alignItems: "center",
    width: 110,
  },

  statValue: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "700",
  },

  statLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 6,
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  instructions: {
    alignItems: "center",
    marginTop: 42,
    marginBottom: 32,
  },

  instructionsTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: "700",
  },

  instructionsText: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "47%",
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 24,

    backgroundColor: "#0D1315",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",

    alignItems: "center",
    justifyContent: "center",
  },

  cardFlipped: {
    backgroundColor: "rgba(124, 255, 178, 0.07)",
    borderColor: "rgba(124, 255, 178, 0.30)",
  },

  cardMatched: {
    backgroundColor: "rgba(124, 255, 178, 0.13)",
    borderColor: COLORS.primary,
  },

  cardSymbol: {
    color: COLORS.primary,
    fontSize: 38,
    fontWeight: "700",
  },

  hiddenSymbol: {
    color: COLORS.muted,
  },

  progressContainer: {
    marginTop: 15,
  },

  progressBackground: {
    height: 5,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },

  progressText: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 10,
  },
});