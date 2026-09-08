import { ReactNode } from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export default function GlassCard({
  children,
  style,
}: GlassCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.inner}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 28,

    backgroundColor: "#0D1315",

    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",

    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.35,
    shadowRadius: 24,

    elevation: 8,
  },

  inner: {
    padding: 22,

    borderRadius: 27,

    backgroundColor: "rgba(255, 255, 255, 0.015)",
  },
});