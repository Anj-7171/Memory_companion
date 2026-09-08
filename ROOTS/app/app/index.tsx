import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";

import { COLORS } from "../constants/colors";
import RootLogo from "../components/RootLogo";
import GlassCard from "../components/GlassCard";
import BottomDock from "../components/BottomDock";
import MoodSummary from "../components/MoodSummary";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Ambient glow */}
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      {/* Scrollable content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <RootLogo />

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            PERSONAL INTELLIGENCE
          </Text>

          <Text style={styles.heroTitle}>
            Your memories.
            {"\n"}
            <Text style={styles.heroHighlight}>
              Connected.
            </Text>
          </Text>

          <Text style={styles.heroDescription}>
            A living archive of your thoughts, moments,
            and emotions.
          </Text>
        </View>

        {/* Memory Pulse */}
        <GlassCard style={styles.pulseCard}>
          <View style={styles.pulseHeader}>
            <Text style={styles.cardLabel}>
              MEMORY PULSE
            </Text>

            <View style={styles.liveContainer}>
              <View style={styles.liveDot} />

              <Text style={styles.liveText}>
                LIVE
              </Text>
            </View>
          </View>

          <View style={styles.pulseContent}>
            <View>
              <Text style={styles.bigNumber}>
                12
              </Text>

              <Text style={styles.numberLabel}>
                memories captured
              </Text>
            </View>

            <View style={styles.orb}>
              <View style={styles.orbInner}>
                <Text style={styles.orbText}>
                  ✦
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Capture Button */}
        <Pressable style={styles.captureButton}>
          <View style={styles.captureIcon}>
            <Text style={styles.plus}>+</Text>
          </View>

          <View>
            <Text style={styles.captureTitle}>
              Capture a moment
            </Text>

            <Text style={styles.captureSubtitle}>
              Add something to your story
            </Text>
          </View>

          <Text style={styles.arrow}>
            →
          </Text>
        </Pressable>

        {/* Mood Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Emotional landscape
          </Text>

          <Text style={styles.sectionAction}>
            VIEW ALL
          </Text>
        </View>

        <GlassCard style={styles.moodCard}>
          <View style={styles.moodTop}>
            <View>
              <Text style={styles.moodLabel}>
                TODAY'S STATE
              </Text>

              <Text style={styles.moodTitle}>
                Reflective
              </Text>
            </View>

            <Text style={styles.moodIcon}>
              ◌
            </Text>
          </View>

          <Text style={styles.moodDescription}>
            Your thoughts today feel calm, observant,
            and introspective.
          </Text>

          <View style={styles.moodBar}>
            <View style={styles.moodProgress} />
          </View>
        </GlassCard>

        {/* Weekly Mood Summary */}
        <MoodSummary />
      </ScrollView>

      {/* Bottom Navigation Dock */}
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
    backgroundColor: "rgba(124, 255, 178, 0.06)",
    top: -80,
    right: -100,
  },

  glowTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(79, 209, 197, 0.04)",
    top: 420,
    left: -100,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.glass,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },

  hero: {
    marginTop: 60,
    marginBottom: 38,
  },

  eyebrow: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 14,
  },

  heroTitle: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: "700",
    lineHeight: 45,
    letterSpacing: -1,
  },

  heroHighlight: {
    color: COLORS.primary,
  },

  heroDescription: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 16,
    maxWidth: 300,
  },

  pulseCard: {
    marginBottom: 16,
  },

  pulseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },

  liveContainer: {
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
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1,
  },

  pulseContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 25,
  },

  bigNumber: {
    color: COLORS.text,
    fontSize: 52,
    fontWeight: "700",
    letterSpacing: -2,
  },

  numberLabel: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: -4,
  },

  orb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: "rgba(124, 255, 178, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  orbInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(124, 255, 178, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  orbText: {
    color: COLORS.primary,
    fontSize: 22,
  },

  captureButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 22,
    backgroundColor: "rgba(124, 255, 178, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(124, 255, 178, 0.20)",
    marginBottom: 40,
  },

  captureIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  plus: {
    color: COLORS.background,
    fontSize: 28,
    fontWeight: "500",
  },

  captureTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },

  captureSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 3,
  },

  arrow: {
    color: COLORS.primary,
    fontSize: 24,
    marginLeft: "auto",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "700",
  },

  sectionAction: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  moodCard: {
    marginBottom: 20,
  },

  moodTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  moodLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 8,
  },

  moodTitle: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: "700",
  },

  moodIcon: {
    color: COLORS.primary,
    fontSize: 34,
  },

  moodDescription: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 18,
  },

  moodBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    marginTop: 22,
    overflow: "hidden",
  },

  moodProgress: {
    width: "68%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
});