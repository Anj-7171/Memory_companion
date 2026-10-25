import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";

import { COLORS } from "../constants/colors";
import RootLogo from "../components/RootLogo";
import GlassCard from "../components/GlassCard";
import BottomDock from "../components/BottomDock";
import GlowButton from "../components/GlowButton";
import {
  getCapsules,
  createCapsule,
  joinCapsule,
  getCapsuleMemories,
  Capsule,
  Memory,
} from "../services/api";

export default function CapsulesScreen() {
  const [capsulesList, setCapsulesList] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals state
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isJoinVisible, setIsJoinVisible] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [capsuleMemories, setCapsuleMemories] = useState<Memory[]>([]);
  const [loadingMemories, setLoadingMemories] = useState(false);

  // Create form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Join form state
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const fetchCapsules = useCallback(async () => {
    try {
      const data = await getCapsules();
      setCapsulesList(data);
    } catch {
      // Backend offline; fallback silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getCapsules()
      .then((data) => {
        if (isMounted) setCapsulesList(data);
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCapsules();
    setRefreshing(false);
  };

  const handleCreateCapsule = async () => {
    if (!newTitle.trim()) {
      Alert.alert("Missing Name", "Please give your capsule a name.");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createCapsule({
        title: newTitle.trim(),
        description: newDescription.trim() || undefined,
      });

      setNewTitle("");
      setNewDescription("");
      setIsCreateVisible(false);
      setCapsulesList((prev) => [created, ...prev]);
      Alert.alert(
        "Capsule Created ✦",
        `Share invite code: ${created.invite_code} with your friends or roommates!`
      );
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to create capsule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinCapsule = async () => {
    if (!joinCode.trim()) {
      Alert.alert("Missing Code", "Please enter a capsule invite code.");
      return;
    }

    setIsJoining(true);
    try {
      const joined = await joinCapsule(joinCode.trim());
      setJoinCode("");
      setIsJoinVisible(false);
      await fetchCapsules();
      Alert.alert("Welcome!", `You joined ${joined.title} successfully.`);
    } catch (error: any) {
      Alert.alert("Could Not Join", error?.message || "Invalid invite code.");
    } finally {
      setIsJoining(false);
    }
  };

  const openCapsuleDetails = async (capsule: Capsule) => {
    setSelectedCapsule(capsule);
    setLoadingMemories(true);
    try {
      const mems = await getCapsuleMemories(capsule.id);
      setCapsuleMemories(mems);
    } catch {
      setCapsuleMemories([]);
    } finally {
      setLoadingMemories(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.glowOne} />

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

          <View style={styles.capsuleCount}>
            <Text style={styles.countNumber}>{capsulesList.length}</Text>
            <Text style={styles.countLabel}>CAPSULES</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>SHARED MEMORY SPACES</Text>
          <Text style={styles.title}>
            Connect with{"\n"}
            <Text style={styles.highlight}>your circle.</Text>
          </Text>
          <Text style={styles.description}>
            Create shared capsules for roommates, dorms, and friend groups to collect moments together.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <GlowButton
            title="+ New Capsule"
            onPress={() => setIsCreateVisible(true)}
            variant="primary"
            style={{ flex: 1, marginRight: 8 }}
          />

          <GlowButton
            title="Join with Code"
            onPress={() => setIsJoinVisible(true)}
            variant="glass"
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>

        {/* Capsule List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>YOUR CAPSULES</Text>
          <Text style={styles.sectionCount}>{capsulesList.length} ACTIVE</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 40 }}
          />
        ) : capsulesList.length > 0 ? (
          capsulesList.map((capsule) => (
            <Pressable
              key={capsule.id}
              onPress={() => openCapsuleDetails(capsule)}
            >
              <GlassCard style={styles.capsuleCard}>
                <View style={styles.capsuleHeader}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.capsuleIcon}>◈</Text>
                  </View>

                  <View style={styles.codeBadge}>
                    <Text style={styles.codeText}>{capsule.invite_code}</Text>
                  </View>
                </View>

                <Text style={styles.capsuleTitle}>{capsule.title}</Text>
                {capsule.description && (
                  <Text style={styles.capsuleDesc}>{capsule.description}</Text>
                )}

                <View style={styles.capsuleFooter}>
                  <Text style={styles.metaCount}>
                    {capsule.memory_count} memories shared
                  </Text>
                  <Text style={styles.arrowText}>View →</Text>
                </View>
              </GlassCard>
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>◈</Text>
            <Text style={styles.emptyTitle}>No capsules yet</Text>
            <Text style={styles.emptyDescription}>
              Create a capsule for your dorm, room, or friends to start sharing private moments together.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create Capsule Modal */}
      <Modal
        visible={isCreateVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsCreateVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEyebrow}>NEW CAPSULE</Text>
            <Text style={styles.modalTitle}>Create a shared space</Text>

            <Text style={styles.inputLabel}>CAPSULE NAME</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Dorm Room 304, Summer Trip"
              placeholderTextColor={COLORS.muted}
              value={newTitle}
              onChangeText={setNewTitle}
              maxLength={100}
            />

            <Text style={styles.inputLabel}>DESCRIPTION (OPTIONAL)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="What is this space for?"
              placeholderTextColor={COLORS.muted}
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtonRow}>
              <Pressable
                onPress={() => setIsCreateVisible(false)}
                style={styles.cancelBtn}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleCreateCapsule}
                style={[styles.submitBtn, isSubmitting && styles.disabledBtn]}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={COLORS.background} />
                ) : (
                  <Text style={styles.submitText}>Create ✦</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Join with Code Modal */}
      <Modal
        visible={isJoinVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setIsJoinVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEyebrow}>JOIN CAPSULE</Text>
            <Text style={styles.modalTitle}>Enter invite code</Text>

            <Text style={styles.inputLabel}>INVITE CODE</Text>
            <TextInput
              style={[styles.textInput, styles.codeInput]}
              placeholder="e.g. ROOT-4X7B"
              placeholderTextColor={COLORS.muted}
              value={joinCode}
              onChangeText={setJoinCode}
              autoCapitalize="characters"
            />

            <View style={styles.modalButtonRow}>
              <Pressable
                onPress={() => setIsJoinVisible(false)}
                style={styles.cancelBtn}
                disabled={isJoining}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={handleJoinCapsule}
                style={[styles.submitBtn, isJoining && styles.disabledBtn]}
                disabled={isJoining}
              >
                {isJoining ? (
                  <ActivityIndicator size="small" color={COLORS.background} />
                ) : (
                  <Text style={styles.submitText}>Join ✦</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Capsule Details Modal */}
      <Modal
        visible={selectedCapsule !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedCapsule(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: "85%" }]}>
            <View style={styles.detailHeader}>
              <View>
                <Text style={styles.modalEyebrow}>CAPSULE ARCHIVE</Text>
                <Text style={styles.modalTitle}>{selectedCapsule?.title}</Text>
              </View>
              <Pressable
                onPress={() => setSelectedCapsule(null)}
                style={styles.closeBtn}
              >
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.codeShareBox}>
              <Text style={styles.codeShareLabel}>INVITE CODE</Text>
              <Text style={styles.codeShareValue}>
                {selectedCapsule?.invite_code}
              </Text>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 16, marginBottom: 10 }]}>
              MEMORIES IN THIS CAPSULE
            </Text>

            {loadingMemories ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : capsuleMemories.length > 0 ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {capsuleMemories.map((mem) => (
                  <View key={mem.id} style={styles.memItem}>
                    <Text style={styles.memTitle}>{mem.title}</Text>
                    <Text style={styles.memContent}>{mem.content}</Text>
                    <Text style={styles.memMood}>{mem.mood || "Moment"}</Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.noMemText}>
                No memories have been added to this capsule yet.
              </Text>
            )}
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
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(124, 255, 178, 0.04)",
    top: -80,
    right: -100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  capsuleCount: {
    alignItems: "flex-end",
  },
  countNumber: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  countLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 2,
  },
  hero: {
    marginTop: 55,
    marginBottom: 28,
  },
  eyebrow: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 14,
  },
  title: {
    color: COLORS.text,
    fontSize: 38,
    fontWeight: "700",
    lineHeight: 45,
  },
  highlight: {
    color: COLORS.primary,
  },
  description: {
    color: COLORS.muted,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 16,
    maxWidth: 310,
  },
  actionRow: {
    flexDirection: "row",
    marginBottom: 34,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  sectionCount: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 1,
  },
  capsuleCard: {
    marginBottom: 16,
  },
  capsuleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(124, 255, 178, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(124, 255, 178, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  capsuleIcon: {
    color: COLORS.primary,
    fontSize: 18,
  },
  codeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: "rgba(124, 255, 178, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(124, 255, 178, 0.25)",
  },
  codeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  capsuleTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  capsuleDesc: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 14,
  },
  capsuleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
  },
  metaCount: {
    color: COLORS.muted,
    fontSize: 11,
  },
  arrowText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 50,
  },
  emptyIcon: {
    color: COLORS.primary,
    fontSize: 40,
    marginBottom: 16,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyDescription: {
    color: COLORS.muted,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 280,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#0D1315",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
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
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 18,
  },
  inputLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 16,
  },
  codeInput: {
    letterSpacing: 3,
    fontSize: 16,
    textAlign: "center",
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 10,
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 20,
    minWidth: 110,
    alignItems: "center",
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: "700",
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: COLORS.muted,
    fontSize: 15,
  },
  codeShareBox: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(124, 255, 178, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(124, 255, 178, 0.20)",
    alignItems: "center",
    marginBottom: 12,
  },
  codeShareLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  codeShareValue: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
  },
  memItem: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  memTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  memContent: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  memMood: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "600",
  },
  noMemText: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: "center",
    marginVertical: 20,
  },
});
