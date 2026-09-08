import { Tabs } from "expo-router";
import BottomDock from "../../components/BottomDock";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={() => <BottomDock />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="memories" />
      <Tabs.Screen name="mood" />
      <Tabs.Screen name="games" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}