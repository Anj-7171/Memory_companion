import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

import GlassCard from "./GlassCard";
import { COLORS } from "../constants/colors";

interface MemoryCardProps {
  title: string;
  description: string;
  date: string;
  time: string;
  mood: string;
  type: string;
  icon: string;
  onDelete?: () => void;
}

export default function MemoryCard({
  title,
  description,
  date,
  time,
  mood,
  type,
  icon,
  onDelete,
}: MemoryCardProps) {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        <View style={styles.meta}>
          <Text style={styles.type}>{type}</Text>

          <Text style={styles.date}>
            {date} · {time}
          </Text>
        </View>

        {onDelete && (
          <Pressable onPress={onDelete} style={styles.deleteButton} hitSlop={8}>
            <Text style={styles.deleteText}>✕</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.moodTag}>
          <Text style={styles.moodText}>
            {mood}
          </Text>
        </View>

        <Text style={styles.archiveText}>
          ARCHIVED
        </Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,

    backgroundColor: "rgba(124, 255, 178, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(124, 255, 178, 0.15)",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  icon: {
    color: COLORS.primary,
    fontSize: 20,
  },

  meta: {
    flex: 1,
  },

  type: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  date: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },

  title: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "700",
    marginTop: 20,
  },

  description: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  },

  moodTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,

    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  moodText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "600",
  },

  archiveText: {
    color: COLORS.muted,
    fontSize: 8,
    letterSpacing: 1.5,
  },

  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 107, 107, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  deleteText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: "700",
  },
});