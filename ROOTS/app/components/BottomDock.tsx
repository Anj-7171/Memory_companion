import { View, Text, Pressable, StyleSheet } from "react-native";
import { usePathname, useRouter } from "expo-router";

import { COLORS } from "../constants/colors";

const navItems = [
  {
    label: "Home",
    icon: "⌂",
    route: "/",
  },
  {
    label: "Memories",
    icon: "◈",
    route: "/memories",
  },
  {
    label: "Mood",
    icon: "◌",
    route: "/mood",
  },
  {
    label: "Games",
    icon: "◇",
    route: "/games",
  },
  {
    label: "Profile",
    icon: "●",
    route: "/profile",
  },
];

export default function BottomDock() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (route: string) => {
    const isCurrentRoute =
      route === "/"
        ? pathname === "/"
        : pathname.startsWith(route);

    if (isCurrentRoute) return;

    router.navigate(route as any);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.dock}>
        {navItems.map((item) => {
          const isActive =
            item.route === "/"
              ? pathname === "/"
              : pathname.startsWith(item.route);

          return (
            <Pressable
              key={item.label}
              style={styles.navItem}
              onPress={() => handleNavigation(item.route)}
            >
              <View
                style={[
                  styles.iconContainer,
                  isActive && styles.activeIconContainer,
                ]}
              >
                <Text
                  style={[
                    styles.icon,
                    isActive && styles.activeIcon,
                  ]}
                >
                  {item.icon}
                </Text>
              </View>

              <Text
                style={[
                  styles.label,
                  isActive && styles.activeLabel,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
  },

  dock: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#0D1315",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",

    borderRadius: 28,
    paddingVertical: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,

    elevation: 10,
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },

  iconContainer: {
    width: 38,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },

  activeIconContainer: {
    backgroundColor: "rgba(124,255,178,0.12)",
  },

  icon: {
    color: COLORS.muted,
    fontSize: 19,
  },

  activeIcon: {
    color: COLORS.primary,
  },

  label: {
    color: COLORS.muted,
    fontSize: 8,
    marginTop: 3,
  },

  activeLabel: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});