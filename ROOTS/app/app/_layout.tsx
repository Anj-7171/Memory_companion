import { useEffect } from "react";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#060A0C" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="memories" />
        <Stack.Screen name="capsules" />
        <Stack.Screen name="mood" />
        <Stack.Screen name="games" />
        <Stack.Screen name="memory-match" />
        <Stack.Screen name="timeline-challenge" />
        <Stack.Screen name="profile" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
