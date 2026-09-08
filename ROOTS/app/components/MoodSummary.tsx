import { View, Text, StyleSheet } from "react-native";

import GlassCard from "./GlassCard";
import { COLORS } from "../constants/colors";

const moodData = [60, 70, 55, 78, 82, 75, 90];

const days = ["M", "T", "W", "T", "F", "S", "S"];

const moods = ["😊", "😌", "😐", "😌", "😊", "😌", "⚡"];

export default function MoodSummary() {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>
            EMOTIONAL RHYTHM
          </Text>

          <Text style={styles.title}>
            Balanced
          </Text>
        </View>

        <View style={styles.changeContainer}>
          <Text style={styles.change}>
            +12.4%
          </Text>

          <Text style={styles.changeLabel}>
            THIS WEEK
          </Text>
        </View>
      </View>

      <View style={styles.chart}>
        {moodData.map((value, index) => (
          <View
            key={index}
            style={styles.column}
          >
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${value}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.day}>
              {days[index]}
            </Text>

            <Text style={styles.mood}>
              {moods[index]}
            </Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 24,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },

  label: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.8,
    marginBottom: 8,
  },

  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700",
  },

  changeContainer: {
    alignItems: "flex-end",
  },

  change: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
  },

  changeLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 4,
  },

  chart: {
    height: 175,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  column: {
    flex: 1,
    alignItems: "center",
  },

  barBackground: {
    width: 10,
    height: 100,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "flex-end",
    overflow: "hidden",
  },

  bar: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },

  day: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 9,
  },

  mood: {
    fontSize: 14,
    marginTop: 7,
  },
});