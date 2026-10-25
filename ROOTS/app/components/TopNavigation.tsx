import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

import RootLogo from "./RootLogo";
import { COLORS } from "../constants/colors";

interface TopNavigationProps {
  title?: string;
  showAvatar?: boolean;
}

export default function TopNavigation({
  title,
  showAvatar = true,
}: TopNavigationProps) {
  return (
    <View style={styles.container}>
      <RootLogo />

      {title && <Text style={styles.title}>{title}</Text>}

      {showAvatar && (
        <Pressable
          style={styles.avatar}
          onPress={() => router.push("/profile" as any)}
        >
          <Text style={styles.avatarText}>R</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.glass,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
