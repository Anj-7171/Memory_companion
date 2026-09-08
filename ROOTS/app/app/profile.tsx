import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";

import { COLORS } from "../constants/colors";

import RootLogo from "../components/RootLogo";
import BottomDock from "../components/BottomDock";
import GlassCard from "../components/GlassCard";

export default function ProfileScreen() {
  const handleEditProfile = () => {
    Alert.alert(
      "Edit Profile",
      "Profile customization will be available soon."
    );
  };

  const handleSettings = () => {
    Alert.alert(
      "Settings",
      "ROOTS settings will be available soon."
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <RootLogo />

          <Text style={styles.headerLabel}>
            YOUR ROOTS
          </Text>
        </View>

        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>
                R
              </Text>
            </View>
          </View>

          <Text style={styles.name}>
            ROOTS User
          </Text>

          <Text style={styles.subtitle}>
            Building a story worth remembering.
          </Text>

          <Pressable
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>
              EDIT PROFILE
            </Text>
          </Pressable>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              5
            </Text>

            <Text style={styles.statLabel}>
              MEMORIES
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              3
            </Text>

            <Text style={styles.statLabel}>
              DAY STREAK
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              78
            </Text>

            <Text style={styles.statLabel}>
              BALANCE
            </Text>
          </View>
        </View>

        {/* Archive */}
        <Text style={styles.sectionLabel}>
          PERSONAL ARCHIVE
        </Text>

        <GlassCard style={styles.archiveCard}>
          <View style={styles.archiveHeader}>
            <View>
              <Text style={styles.archiveTitle}>
                Your digital life
              </Text>

              <Text style={styles.archiveDescription}>
                ROOTS is quietly building a map of
                the moments that matter to you.
              </Text>
            </View>

            <Text style={styles.archiveIcon}>
              ◎
            </Text>
          </View>

          <View style={styles.archiveFooter}>
            <View style={styles.archiveStatus}>
              <View style={styles.statusDot} />

              <Text style={styles.statusText}>
                ARCHIVE ACTIVE
              </Text>
            </View>

            <Text style={styles.memoryTotal}>
              5 ITEMS
            </Text>
          </View>
        </GlassCard>

        {/* Settings */}
        <Text style={styles.sectionLabel}>
          ROOTS SYSTEM
        </Text>

        <Pressable onPress={handleSettings}>
          <GlassCard style={styles.settingCard}>
            <View style={styles.settingIconContainer}>
              <Text style={styles.settingIcon}>
                ⚙
              </Text>
            </View>

            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                Preferences
              </Text>

              <Text style={styles.settingDescription}>
                Customize your ROOTS experience.
              </Text>
            </View>

            <Text style={styles.arrow}>
              →
            </Text>
          </GlassCard>
        </Pressable>

        {/* Version */}
        <Text style={styles.version}>
          ROOTS — MEMORY OS
        </Text>

        <Text style={styles.versionNumber}>
          VERSION 1.0.0
        </Text>
      </ScrollView>

      <BottomDock />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 130,
  },

  glowOne: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(124, 255, 178, 0.04)",
    top: -100,
    right: -120,
  },

  glowTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(124, 255, 178, 0.025)",
    bottom: 100,
    left: -100,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerLabel: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  profileSection: {
    alignItems: "center",
    marginTop: 50,
  },

  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1,
    borderColor: "rgba(124,255,178,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarInner: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "rgba(124,255,178,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: COLORS.primary,
    fontSize: 36,
    fontWeight: "700",
  },

  name: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 20,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 7,
  },

  editButton: {
    marginTop: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(124,255,178,0.25)",
    backgroundColor: "rgba(124,255,178,0.06)",
  },

  editButtonText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 45,
    marginBottom: 48,
  },

  stat: {
    alignItems: "center",
    flex: 1,
  },

  statNumber: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700",
  },

  statLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 7,
  },

  statDivider: {
    width: 1,
    height: 35,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  sectionLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 14,
  },

  archiveCard: {
    marginBottom: 38,
  },

  archiveHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  archiveTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
  },

  archiveDescription: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
    maxWidth: 250,
  },

  archiveIcon: {
    color: COLORS.primary,
    fontSize: 32,
  },

  archiveFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },

  archiveStatus: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    marginRight: 8,
  },

  statusText: {
    color: COLORS.primary,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  memoryTotal: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 45,
  },

  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(124,255,178,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  settingIcon: {
    color: COLORS.primary,
    fontSize: 20,
  },

  settingContent: {
    flex: 1,
  },

  settingTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
  },

  settingDescription: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },

  arrow: {
    color: COLORS.primary,
    fontSize: 20,
  },

  version: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    textAlign: "center",
  },

  versionNumber: {
    color: "rgba(255,255,255,0.25)",
    fontSize: 8,
    letterSpacing: 1.2,
    textAlign: "center",
    marginTop: 7,
  },
});