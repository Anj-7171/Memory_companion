import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

import { COLORS } from "../constants/colors";
import {
  createMemory,
  getCapsules,
  analyzeMemoryText,
  Capsule,
  Memory,
} from "../services/api";

interface CreateMemoryModalProps {
  visible: boolean;
  onClose: () => void;
  onMemoryCreated: (memory: Memory) => void;
}

const MOOD_OPTIONS = [
  "Peaceful",
  "Reflective",
  "Proud",
  "Inspired",
  "Nostalgic",
  "Joyful",
];

const TYPE_OPTIONS = ["Moment", "Thought", "Achievement", "Place"];

export default function CreateMemoryModal({
  visible,
  onClose,
  onMemoryCreated,
}: CreateMemoryModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("Peaceful");
  const [selectedType, setSelectedType] = useState("Moment");
  const [selectedCapsuleId, setSelectedCapsuleId] = useState<number | null>(null);
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (visible) {
      getCapsules()
        .then((data) => setCapsules(data))
        .catch(() => {});
    }
  }, [visible]);

  const handleAutoDetectMood = async () => {
    const combined = `${title} ${content}`.trim();
    if (!combined) {
      Alert.alert(
        "Input Needed",
        "Please write a title or thoughts first so AI can analyze the emotion."
      );
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeMemoryText(combined);

      if (analysis.suggested_mood) {
        const match = MOOD_OPTIONS.find(
          (m) => m.toLowerCase() === analysis.suggested_mood.toLowerCase()
        );
        if (match) {
          setSelectedMood(match);
        } else {
          setSelectedMood("Reflective");
        }
      }

      if (analysis.suggested_type) {
        const typeMatch = TYPE_OPTIONS.find(
          (t) => t.toLowerCase() === analysis.suggested_type.toLowerCase()
        );
        if (typeMatch) {
          setSelectedType(typeMatch);
        }
      }
    } catch {
      Alert.alert(
        "AI Analysis",
        "Could not auto-detect mood. Please ensure backend is reachable."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedMood("Peaceful");
    setSelectedType("Moment");
    setSelectedCapsuleId(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Missing Title", "Please give your memory a title.");
      return;
    }

    if (!content.trim()) {
      Alert.alert("Missing Content", "Please write a few thoughts about this memory.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newMemory = await createMemory({
        title: title.trim(),
        content: content.trim(),
        mood: selectedMood,
        memory_type: selectedType.toLowerCase(),
        capsule_id: selectedCapsuleId || undefined,
      });

      resetForm();
      onMemoryCreated(newMemory);
      onClose();
    } catch (error: any) {
      Alert.alert("Failed to Save", error?.message || "Could not save your memory. Please ensure the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.eyebrow}>NEW MEMORY</Text>
                <Text style={styles.title}>Capture a moment</Text>
              </View>

              <Pressable onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            {/* Title Input */}
            <Text style={styles.label}>TITLE</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Sunset at the lake"
              placeholderTextColor={COLORS.muted}
              value={title}
              onChangeText={setTitle}
              maxLength={120}
            />

            {/* Content Input */}
            <Text style={styles.label}>WHAT HAPPENED?</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write your thoughts, feelings, or details..."
              placeholderTextColor={COLORS.muted}
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* AI Auto-Detect Mood Trigger */}
            <Pressable
              style={[
                styles.aiDetectButton,
                isAnalyzing && styles.aiDetectButtonDisabled,
              ]}
              onPress={handleAutoDetectMood}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <>
                  <Text style={styles.aiSparkle}>✦</Text>
                  <Text style={styles.aiDetectText}>
                    Auto-detect Mood with AI
                  </Text>
                </>
              )}
            </Pressable>

            {/* Mood Selector */}
            <Text style={styles.label}>MOOD</Text>
            <View style={styles.chipRow}>
              {MOOD_OPTIONS.map((mood) => {
                const isSelected = selectedMood === mood;
                return (
                  <Pressable
                    key={mood}
                    style={[styles.chip, isSelected && styles.activeChip]}
                    onPress={() => setSelectedMood(mood)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.activeChipText,
                      ]}
                    >
                      {mood}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Type Selector */}
            <Text style={styles.label}>CATEGORY</Text>
            <View style={styles.chipRow}>
              {TYPE_OPTIONS.map((type) => {
                const isSelected = selectedType === type;
                return (
                  <Pressable
                    key={type}
                    style={[styles.chip, isSelected && styles.activeChip]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.activeChipText,
                      ]}
                    >
                      {type}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Optional Capsule Selector */}
            {capsules.length > 0 && (
              <>
                <Text style={styles.label}>SHARE TO CAPSULE (OPTIONAL)</Text>
                <View style={styles.chipRow}>
                  <Pressable
                    style={[
                      styles.chip,
                      selectedCapsuleId === null && styles.activeChip,
                    ]}
                    onPress={() => setSelectedCapsuleId(null)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedCapsuleId === null && styles.activeChipText,
                      ]}
                    >
                      Personal Only
                    </Text>
                  </Pressable>
                  {capsules.map((cap) => {
                    const isSelected = selectedCapsuleId === cap.id;
                    return (
                      <Pressable
                        key={cap.id}
                        style={[styles.chip, isSelected && styles.activeChip]}
                        onPress={() => setSelectedCapsuleId(cap.id)}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.activeChipText,
                          ]}
                        >
                          {cap.title}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.cancelButton}
                onPress={handleClose}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.submitButton,
                  isSubmitting && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={COLORS.background} />
                ) : (
                  <Text style={styles.submitText}>Save Memory ✦</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxHeight: "90%",
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  eyebrow: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: COLORS.muted,
    fontSize: 16,
  },
  label: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  activeChip: {
    backgroundColor: "rgba(124, 255, 178, 0.15)",
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "600",
  },
  activeChipText: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 26,
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  cancelText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 20,
    minWidth: 130,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: "700",
  },
  aiDetectButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: "rgba(124, 255, 178, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(124, 255, 178, 0.3)",
    gap: 6,
  },
  aiDetectButtonDisabled: {
    opacity: 0.6,
  },
  aiSparkle: {
    color: COLORS.primary,
    fontSize: 12,
  },
  aiDetectText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
