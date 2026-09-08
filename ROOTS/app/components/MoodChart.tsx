import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { COLORS } from "../constants/colors";

interface MoodChartProps {
  data: {
    day: string;
    value: number;
  }[];
}

export default function MoodChart({
  data,
}: MoodChartProps) {
  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.map((item) => (
          <View
            key={item.day}
            style={styles.barWrapper}
          >
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${item.value}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.day}>
              {item.day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  chart: {
    height: 190,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  barWrapper: {
    flex: 1,
    alignItems: "center",
  },

  barBackground: {
    height: 150,
    width: 10,
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
    marginTop: 10,
  },
});