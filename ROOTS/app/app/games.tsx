import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import { router } from "expo-router";

import { COLORS } from "../constants/colors";
import { games } from "../constants/mockData";

import RootLogo from "../components/RootLogo";
import BottomDock from "../components/BottomDock";
import GlassCard from "../components/GlassCard";
import GameCard from "../components/GameCard";

export default function GamesScreen() {
    const handleGamePress = (title: string) => {
    if (title === "Memory Match") {
        router.push("../memory-match");
        return;
    }

    Alert.alert(
        title,
        `${title} will be available to play soon.`,
        [
        {
            text: "Got it",
        },
        ]
    );
    };

  return (
    <View style={styles.container}>
      <View style={styles.glow} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <RootLogo />

          <Text style={styles.level}>
            LEVEL 03
          </Text>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            MEMORY PLAYGROUND
          </Text>

          <Text style={styles.title}>
            Learn through{"\n"}

            <Text style={styles.highlight}>
              play.
            </Text>
          </Text>

          <Text style={styles.description}>
            Explore your memories in a different way
            and discover patterns about yourself.
          </Text>
        </View>

        {/* Daily Challenge */}
        <GlassCard style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <View>
              <Text style={styles.challengeLabel}>
                DAILY CHALLENGE
              </Text>

              <Text style={styles.challengeTitle}>
                Recall 3 memories
              </Text>
            </View>

            <Text style={styles.challengeIcon}>
              ✦
            </Text>
          </View>

          <Text style={styles.challengeDescription}>
            Complete today's memory challenge to
            continue your streak.
          </Text>

          <View style={styles.challengeProgress}>
            <View style={styles.challengeProgressBackground}>
              <View style={styles.challengeProgressBar} />
            </View>

            <Text style={styles.challengeCount}>
              2 / 3
            </Text>
          </View>
        </GlassCard>

        {/* Games Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            YOUR GAMES
          </Text>

          <Text style={styles.gameCount}>
            {games.length} AVAILABLE
          </Text>
        </View>

        {/* Game Cards */}
        {games.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            description={game.description}
            icon={game.icon}
            category={game.category}
            difficulty={game.difficulty}
            progress={game.progress}
            onPress={() => handleGamePress(game.title)}
          />
        ))}
      </ScrollView>

      <BottomDock />
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
    paddingTop: 70,
    paddingBottom: 130,
  },

  glow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(124, 255, 178, 0.04)",
    top: -100,
    right: -120,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  level: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  hero: {
    marginTop: 55,
    marginBottom: 36,
  },

  eyebrow: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 14,
  },

  title: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: "700",
    lineHeight: 45,
  },

  highlight: {
    color: COLORS.primary,
  },

  description: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 16,
    maxWidth: 310,
  },

  challengeCard: {
    marginBottom: 40,
  },

  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  challengeLabel: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 8,
  },

  challengeTitle: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: "700",
  },

  challengeIcon: {
    color: COLORS.primary,
    fontSize: 30,
  },

  challengeDescription: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 14,
  },

  challengeProgress: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  challengeProgressBackground: {
    flex: 1,
    height: 5,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
    marginRight: 12,
  },

  challengeProgressBar: {
    width: "66%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },

  challengeCount: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  gameCount: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 1,
  },
});