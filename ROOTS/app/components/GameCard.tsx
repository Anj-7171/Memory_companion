import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

import GlassCard from "./GlassCard";
import { COLORS } from "../constants/colors";

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  category: string;
  difficulty: string;
  progress: number;
  onPress: () => void;
}

export default function GameCard({
  title,
  description,
  icon,
  category,
  difficulty,
  progress,
  onPress,
}: GameCardProps) {
  return (
    <Pressable onPress={onPress}>
      <GlassCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>

          <View style={styles.categoryContainer}>
            <Text style={styles.category}>
              {category}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.description}>
          {description}
        </Text>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.difficulty}>
              {difficulty}
            </Text>

            <Text style={styles.progressText}>
              {progress}%
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressBar,
                { width: `${progress}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.playRow}>
          <Text style={styles.playText}>
            PLAY NOW
          </Text>

          <Text style={styles.arrow}>
            →
          </Text>
        </View>
      </GlassCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(124, 255, 178, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(124, 255, 178, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    color: COLORS.primary,
    fontSize: 24,
  },

  categoryContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.04)",
  },

  category: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  title: {
    color: COLORS.text,
    fontSize: 21,
    fontWeight: "700",
    marginTop: 20,
  },

  description: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },

  progressSection: {
    marginTop: 22,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  difficulty: {
    color: COLORS.muted,
    fontSize: 10,
  },

  progressText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
  },

  progressBackground: {
    height: 5,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },

  playRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },

  playText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  arrow: {
    color: COLORS.primary,
    fontSize: 20,
  },
});