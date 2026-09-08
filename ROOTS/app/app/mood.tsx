import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import { COLORS } from "../constants/colors";
import { weeklyMoodData } from "../constants/mockData";

import RootLogo from "../components/RootLogo";
import BottomDock from "../components/BottomDock";
import GlassCard from "../components/GlassCard";
import MoodChart from "../components/MoodChart";

export default function MoodScreen() {
  return (
    <View style={styles.container}>
      {/* Background glow */}
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <RootLogo />

          <View style={styles.liveStatus}>
            <View style={styles.liveDot} />

            <Text style={styles.liveText}>
              ANALYZING
            </Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            EMOTIONAL INTELLIGENCE
          </Text>

          <Text style={styles.title}>
            Understand
            {"\n"}

            <Text style={styles.highlight}>
              yourself.
            </Text>
          </Text>

          <Text style={styles.description}>
            Discover patterns hidden inside your
            thoughts, memories, and everyday moments.
          </Text>
        </View>

        {/* Current Mood */}
        <GlassCard style={styles.currentMoodCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>
              CURRENT STATE
            </Text>

            <Text style={styles.statusText}>
              TODAY
            </Text>
          </View>

          <View style={styles.moodContent}>
            <View>
              <Text style={styles.moodName}>
                Reflective
              </Text>

              <Text style={styles.moodDescription}>
                Calm, observant, and introspective.
              </Text>
            </View>

            <View style={styles.moodOrb}>
              <View style={styles.moodOrbInner}>
                <Text style={styles.orbIcon}>
                  ◌
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>
              EMOTIONAL BALANCE
            </Text>

            <Text style={styles.score}>
              78
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View style={styles.progress} />
          </View>
        </GlassCard>

        {/* Weekly Mood */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Emotional rhythm
            </Text>

            <Text style={styles.sectionSubtitle}>
              YOUR LAST 7 DAYS
            </Text>
          </View>

          <Text style={styles.average}>
            AVG 74
          </Text>
        </View>

        <GlassCard style={styles.chartCard}>
          <MoodChart data={weeklyMoodData} />
        </GlassCard>

        {/* AI Insight */}
        <GlassCard style={styles.insightCard}>
          <Text style={styles.insightLabel}>
            AI INSIGHT
          </Text>

          <Text style={styles.insightTitle}>
            Your mood tends to improve
            toward the weekend.
          </Text>

          <Text style={styles.insightDescription}>
            Your recent memories show a pattern of
            increasing positivity after Friday.
          </Text>

          <View style={styles.insightFooter}>
            <View style={styles.insightDot} />

            <Text style={styles.insightMeta}>
              BASED ON 12 MEMORIES
            </Text>
          </View>
        </GlassCard>
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

  glowOne: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(124, 255, 178, 0.04)",
    top: -100,
    right: -120,
  },

  glowTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(155, 140, 255, 0.035)",
    top: 480,
    left: -110,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  liveStatus: {
    flexDirection: "row",
    alignItems: "center",
  },

  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },

  liveText: {
    color: COLORS.muted,
    fontSize: 8,
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

  currentMoodCard: {
    marginBottom: 42,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
  },

  statusText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },

  moodContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },

  moodName: {
    color: COLORS.text,
    fontSize: 27,
    fontWeight: "700",
  },

  moodDescription: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 7,
  },

  moodOrb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "rgba(124,255,178,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  moodOrbInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(124,255,178,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  orbIcon: {
    color: COLORS.primary,
    fontSize: 30,
  },

  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
  },

  scoreLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  score: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "700",
  },

  progressBackground: {
    height: 5,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginTop: 10,
    overflow: "hidden",
  },

  progress: {
    width: "78%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 6,
  },

  average: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },

  chartCard: {
    marginBottom: 20,
  },

  insightCard: {
    marginBottom: 20,
  },

  insightLabel: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 14,
  },

  insightTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 28,
  },

  insightDescription: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
  },

  insightFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  insightDot: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },

  insightMeta: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.3,
  },
});