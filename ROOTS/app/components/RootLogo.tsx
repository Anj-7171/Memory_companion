import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export default function RootLogo() {
  return (
    <View>
      <Text style={styles.logo}>ROOTS</Text>

      <Text style={styles.subtitle}>
        MEMORY OS
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 5,
  },

  subtitle: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 3,
    marginTop: 4,
  },
});