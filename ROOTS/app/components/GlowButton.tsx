import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { COLORS } from "../constants/colors";

interface GlowButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "glass";
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function GlowButton({
  title,
  onPress,
  variant = "primary",
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
}: GlowButtonProps) {
  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";
  const isGlass = variant === "glass";

  return (
    <Pressable
      style={[
        styles.button,
        isPrimary && styles.primaryButton,
        isDanger && styles.dangerButton,
        isGlass && styles.glassButton,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? COLORS.background : COLORS.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text
            style={[
              styles.text,
              isPrimary && styles.primaryText,
              isDanger && styles.dangerText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  dangerButton: {
    backgroundColor: "rgba(255, 107, 107, 0.15)",
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  glassButton: {
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  disabled: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
    fontSize: 16,
    color: COLORS.background,
  },
  text: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  primaryText: {
    color: COLORS.background,
  },
  dangerText: {
    color: COLORS.danger,
  },
});
