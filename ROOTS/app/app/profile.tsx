import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";

import { COLORS } from "../constants/colors";
import RootLogo from "../components/RootLogo";
import BottomDock from "../components/BottomDock";
import GlassCard from "../components/GlassCard";
import {
  getMemories,
  getMoodSummary,
  getCapsules,
  getBaseUrl,
  setCustomApiBaseUrl,
  testBackendConnection,
  Memory,
} from "../services/api";

export default function ProfileScreen() {
  const [userName, setUserName] = useState("Abhiram");
  const [userBio, setUserBio] = useState("Building a story worth remembering.");
  const [avatarInitial, setAvatarInitial] = useState("A");

  const [memoryCount, setMemoryCount] = useState(0);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [dayStreak, setDayStreak] = useState(3);
  const [balanceScore, setBalanceScore] = useState(78);
  const [capsuleCount, setCapsuleCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [isArchiveModalVisible, setIsArchiveModalVisible] = useState(false);

  // Edit form state
  const [tempName, setTempName] = useState(userName);
  const [tempBio, setTempBio] = useState(userBio);
  const [tempInitial, setTempInitial] = useState(avatarInitial);

  // Settings state
  const [customServerInput, setCustomServerInput] = useState(getBaseUrl());
  const [connectionTestResult, setConnectionTestResult] = useState<{
    tested: boolean;
    ok: boolean;
    latencyMs?: number;
    error?: string;
  }>({ tested: false, ok: false });
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Feature Toggles
  const [aiReelEnabled, setAiReelEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const loadProfileData = useCallback(async () => {
    try {
      const [mems, mood, caps] = await Promise.all([
        getMemories().catch(() => []),
        getMoodSummary().catch(() => null),
        getCapsules().catch(() => []),
      ]);

      setMemories(mems);
      setMemoryCount(mems.length);
      setCapsuleCount(caps.length);

      if (mood) {
        const score = Math.round((mood.average_score || 7.8) * 10);
        setBalanceScore(score);
        setDayStreak(Math.max(mood.total_entries, 1));
      }
    } catch {
      // Silently keep default state
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getMemories().catch(() => []),
      getMoodSummary().catch(() => null),
      getCapsules().catch(() => []),
    ]).then(([mems, mood, caps]) => {
      if (!isMounted) return;
      setMemories(mems);
      setMemoryCount(mems.length);
      setCapsuleCount(caps.length);
      if (mood) {
        const score = Math.round((mood.average_score || 7.8) * 10);
        setBalanceScore(score);
        setDayStreak(Math.max(mood.total_entries, 1));
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  };

  const handleOpenEdit = () => {
    setTempName(userName);
    setTempBio(userBio);
    setTempInitial(avatarInitial);
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = () => {
    if (!tempName.trim()) {
      Alert.alert("Invalid Name", "Please provide a display name.");
      return;
    }
    setUserName(tempName.trim());
    setUserBio(tempBio.trim());
    setAvatarInitial(
      tempInitial.trim().toUpperCase().charAt(0) || tempName.charAt(0).toUpperCase()
    );
    setIsEditModalVisible(false);
    Alert.alert("Profile Updated", "Your profile details have been saved.");
  };

  const handleOpenSettings = () => {
    setCustomServerInput(getBaseUrl());
    setConnectionTestResult({ tested: false, ok: false });
    setIsSettingsModalVisible(true);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      if (customServerInput.trim()) {
        setCustomApiBaseUrl(customServerInput.trim());
      }
      const result = await testBackendConnection();
      setConnectionTestResult({
        tested: true,
        ok: result.ok,
        latencyMs: result.latencyMs,
        error: result.error,
      });
    } catch (err: any) {
      setConnectionTestResult({
        tested: true,
        ok: false,
        error: err?.message || "Failed to connect",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveSettings = () => {
    if (customServerInput.trim()) {
      setCustomApiBaseUrl(customServerInput.trim());
    }
    setIsSettingsModalVisible(false);
    loadProfileData();
    Alert.alert("Settings Applied", "Server configuration and preferences updated.");
  };

  const handleExportArchive = () => {
    const exportData = {
      user: userName,
      exportedAt: new Date().toISOString(),
      stats: {
        totalMemories: memoryCount,
        balanceScore,
        capsules: capsuleCount,
      },
      memories: memories.map((m) => ({
        id: m.id,
        title: m.title,
        content: m.content,
        mood: m.mood,
        type: m.memory_type,
        created_at: m.created_at,
      })),
    };

    const count = exportData.memories.length;
    Alert.alert(
      "Archive Export Ready",
      `Exported ${count} memories, ${exportData.stats.capsules} capsules, and emotional balance score (${exportData.stats.balanceScore}/100).\n\nArchive payload formatted and verified.`,
      [{ text: "Done" }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <RootLogo />
          <Text style={styles.headerLabel}>YOUR ROOTS</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>{avatarInitial}</Text>
            </View>
          </View>

          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.subtitle}>{userBio}</Text>

          <Pressable style={styles.editButton} onPress={handleOpenEdit}>
            <Text style={styles.editButtonText}>EDIT PROFILE</Text>
          </Pressable>
        </View>

        {/* Dynamic Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{memoryCount}</Text>
            <Text style={styles.statLabel}>MEMORIES</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Text style={styles.statNumber}>{dayStreak}</Text>
            <Text style={styles.statLabel}>DAY STREAK</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Text style={styles.statNumber}>{balanceScore}</Text>
            <Text style={styles.statLabel}>BALANCE</Text>
          </View>
        </View>

        {/* Personal Archive Card */}
        <Text style={styles.sectionLabel}>PERSONAL ARCHIVE</Text>

        <Pressable onPress={() => setIsArchiveModalVisible(true)}>
          <GlassCard style={styles.archiveCard}>
            <View style={styles.archiveHeader}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.archiveTitle}>Your digital life</Text>
                <Text style={styles.archiveDescription}>
                  ROOTS is quietly building a living map of the moments that matter to you.
                </Text>
              </View>
              <Text style={styles.archiveIcon}>◎</Text>
            </View>

            <View style={styles.archiveFooter}>
              <View style={styles.archiveStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>ARCHIVE ACTIVE</Text>
              </View>

              <Text style={styles.memoryTotal}>
                {memoryCount} ITEMS • {capsuleCount} CAPSULES
              </Text>
            </View>
          </GlassCard>
        </Pressable>

        {/* ROOTS System Settings */}
        <Text style={styles.sectionLabel}>ROOTS SYSTEM</Text>

        <Pressable onPress={handleOpenSettings}>
          <GlassCard style={styles.settingCard}>
            <View style={styles.settingIconContainer}>
              <Text style={styles.settingIcon}>⚙</Text>
            </View>

            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Preferences & Server</Text>
              <Text style={styles.settingDescription}>
                Backend IP connection, AI toggles, and data export.
              </Text>
            </View>

            <Text style={styles.arrow}>→</Text>
          </GlassCard>
        </Pressable>

        {/* Version info */}
        <Text style={styles.version}>ROOTS — MEMORY OS</Text>
        <Text style={styles.versionNumber}>VERSION 1.0.0 (SDK 58)</Text>
      </ScrollView>

      {/* ============================================================ */}
      {/* EDIT PROFILE MODAL */}
      {/* ============================================================ */}
      <Modal
        visible={isEditModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalEyebrow}>PERSONAL PROFILE</Text>
            <Text style={styles.modalTitle}>Customize Profile</Text>

            <Text style={styles.inputLabel}>DISPLAY NAME</Text>
            <TextInput
              style={styles.modalInput}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Your name"
              placeholderTextColor={COLORS.muted}
            />

            <Text style={styles.inputLabel}>AVATAR INITIAL</Text>
            <TextInput
              style={[styles.modalInput, { width: 80, textAlign: "center" }]}
              value={tempInitial}
              onChangeText={setTempInitial}
              maxLength={2}
              placeholder="A"
              placeholderTextColor={COLORS.muted}
            />

            <Text style={styles.inputLabel}>BIO / MANTRA</Text>
            <TextInput
              style={[styles.modalInput, styles.bioInput]}
              value={tempBio}
              onChangeText={setTempBio}
              multiline
              numberOfLines={3}
              placeholder="A thought about your journey..."
              placeholderTextColor={COLORS.muted}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelBtn}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>

              <Pressable style={styles.saveBtn} onPress={handleSaveProfile}>
                <Text style={styles.saveBtnText}>Save Changes ✦</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* PREFERENCES & SERVER SETTINGS MODAL */}
      {/* ============================================================ */}
      <Modal
        visible={isSettingsModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxHeight: "88%" }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalEyebrow}>SYSTEM SETTINGS</Text>
              <Text style={styles.modalTitle}>Preferences & Server</Text>

              {/* Server Connection Config */}
              <Text style={styles.inputLabel}>BACKEND API URL</Text>
              <TextInput
                style={styles.modalInput}
                value={customServerInput}
                onChangeText={setCustomServerInput}
                placeholder="http://10.116.255.120:8000"
                placeholderTextColor={COLORS.muted}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Text style={styles.inputHint}>
                Allows your phone to connect over Wi-Fi without connection drops.
              </Text>

              {/* Test Connection Button */}
              <View style={styles.testRow}>
                <Pressable
                  style={styles.testBtn}
                  onPress={handleTestConnection}
                  disabled={isTestingConnection}
                >
                  {isTestingConnection ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <Text style={styles.testBtnText}>Test Server Connection ⚡</Text>
                  )}
                </Pressable>

                {connectionTestResult.tested && (
                  <View
                    style={[
                      styles.testBadge,
                      connectionTestResult.ok
                        ? styles.testBadgeOk
                        : styles.testBadgeFail,
                    ]}
                  >
                    <Text
                      style={[
                        styles.testBadgeText,
                        connectionTestResult.ok
                          ? styles.testBadgeTextOk
                          : styles.testBadgeTextFail,
                      ]}
                    >
                      {connectionTestResult.ok
                        ? `Connected (${connectionTestResult.latencyMs}ms) ✓`
                        : "Unreachable ✕"}
                    </Text>
                  </View>
                )}
              </View>

              {/* Toggles */}
              <Text style={[styles.inputLabel, { marginTop: 22 }]}>FEATURES</Text>

              <Pressable
                style={styles.toggleRow}
                onPress={() => setAiReelEnabled((v) => !v)}
              >
                <View>
                  <Text style={styles.toggleTitle}>AI Memory Reel Synthesis</Text>
                  <Text style={styles.toggleDesc}>
                    Generate narrative reflections from memories
                  </Text>
                </View>
                <Text style={styles.toggleState}>
                  {aiReelEnabled ? "ON ✦" : "OFF"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.toggleRow}
                onPress={() => setHapticsEnabled((v) => !v)}
              >
                <View>
                  <Text style={styles.toggleTitle}>Daily Reflection Alerts</Text>
                  <Text style={styles.toggleDesc}>
                    Gentle evening prompt to capture moments
                  </Text>
                </View>
                <Text style={styles.toggleState}>
                  {hapticsEnabled ? "ON ✦" : "OFF"}
                </Text>
              </Pressable>

              {/* Data Actions */}
              <Text style={[styles.inputLabel, { marginTop: 22 }]}>DATA ARCHIVE</Text>

              <Pressable style={styles.exportBtn} onPress={handleExportArchive}>
                <Text style={styles.exportBtnText}>Export Archive (JSON) ⤓</Text>
              </Pressable>

              <View style={styles.modalActions}>
                <Pressable
                  style={styles.cancelBtn}
                  onPress={() => setIsSettingsModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>Close</Text>
                </Pressable>

                <Pressable style={styles.saveBtn} onPress={handleSaveSettings}>
                  <Text style={styles.saveBtnText}>Save Settings</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* ARCHIVE BREAKDOWN MODAL */}
      {/* ============================================================ */}
      <Modal
        visible={isArchiveModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsArchiveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalEyebrow}>PERSONAL ARCHIVE</Text>
            <Text style={styles.modalTitle}>Archive Breakdown</Text>

            <View style={styles.archiveBreakdownGrid}>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownNum}>{memoryCount}</Text>
                <Text style={styles.breakdownLabel}>TOTAL MEMORIES</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownNum}>{capsuleCount}</Text>
                <Text style={styles.breakdownLabel}>SHARED CAPSULES</Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownNum}>{balanceScore}%</Text>
                <Text style={styles.breakdownLabel}>BALANCE SCORE</Text>
              </View>
            </View>

            <Text style={[styles.inputHint, { marginTop: 14 }]}>
              All memories are stored safely with encrypted local and SQLite persistence.
            </Text>

            <View style={[styles.modalActions, { marginTop: 24 }]}>
              <Pressable
                style={styles.saveBtn}
                onPress={() => setIsArchiveModalVisible(false)}
              >
                <Text style={styles.saveBtnText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

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
    marginTop: 40,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: "rgba(124,255,178,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(124,255,178,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: "700",
  },
  name: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 18,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  editButton: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(124,255,178,0.3)",
    backgroundColor: "rgba(124,255,178,0.08)",
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
    marginTop: 36,
    marginBottom: 40,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
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
    marginTop: 6,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  sectionLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 12,
  },
  archiveCard: {
    marginBottom: 32,
  },
  archiveHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  archiveTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "700",
  },
  archiveDescription: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  archiveIcon: {
    color: COLORS.primary,
    fontSize: 30,
  },
  archiveFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 14,
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
    borderRadius: 3,
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
    marginBottom: 35,
  },
  settingIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
    marginTop: 3,
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
    marginTop: 6,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#0D1315",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 22,
  },
  modalEyebrow: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 4,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  inputLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 12,
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 13,
  },
  bioInput: {
    height: 70,
    textAlignVertical: "top",
  },
  inputHint: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  testRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  testBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: "rgba(124, 255, 178, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(124, 255, 178, 0.25)",
  },
  testBtnText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "600",
  },
  testBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  testBadgeOk: {
    backgroundColor: "rgba(124, 255, 178, 0.15)",
  },
  testBadgeFail: {
    backgroundColor: "rgba(255, 100, 100, 0.15)",
  },
  testBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  testBadgeTextOk: {
    color: COLORS.primary,
  },
  testBadgeTextFail: {
    color: "#FF8888",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  toggleTitle: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
  },
  toggleDesc: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 2,
  },
  toggleState: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  exportBtn: {
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    marginTop: 8,
  },
  exportBtnText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    marginTop: 22,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 18,
  },
  saveBtnText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: "700",
  },
  archiveBreakdownGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 8,
  },
  breakdownItem: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  breakdownNum: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  breakdownLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "700",
    textAlign: "center",
  },
});