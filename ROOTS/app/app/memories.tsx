import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useEffect, useCallback } from "react";

import { COLORS } from "../constants/colors";
import { getMemories, deleteMemory, Memory } from "../services/api";

import RootLogo from "../components/RootLogo";
import BottomDock from "../components/BottomDock";
import MemoryCard from "../components/MemoryCard";

const getMoodIcon = (mood: string | null) => {
  const normalized = (mood || "").toLowerCase();
  if (normalized.includes("peace")) return "◌";
  if (normalized.includes("reflect")) return "✦";
  if (normalized.includes("proud") || normalized.includes("win")) return "↑";
  if (normalized.includes("inspir")) return "✧";
  if (normalized.includes("nostalg")) return "◎";
  if (normalized.includes("energ") || normalized.includes("happy")) return "⚡";
  return "◈";
};

const formatMemoryDateTime = (isoString: string) => {
  try {
    const d = new Date(isoString);
    const date = d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    const time = d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  } catch {
    return { date: "Recent", time: "" };
  }
};

export default function MemoriesScreen() {
  const [memoriesList, setMemoriesList] = useState<Memory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMemories = useCallback(async () => {
    try {
      const data = await getMemories();
      setMemoriesList(data);
    } catch {
      // Fallback silently if server offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    getMemories()
      .then((data) => {
        if (isMounted) setMemoriesList(data);
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
    await fetchMemories();
    setRefreshing(false);
  };

  const handleDelete = (id: number, title: string) => {
    Alert.alert(
      "Delete Memory",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMemory(id);
              setMemoriesList((prev) => prev.filter((m) => m.id !== id));
            } catch (error: any) {
              Alert.alert("Error", error?.message || "Failed to delete memory.");
            }
          },
        },
      ]
    );
  };

  const filteredMemories = memoriesList.filter((memory) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = memory.title.toLowerCase().includes(query);
    const contentMatch = memory.content.toLowerCase().includes(query);
    const moodMatch = (memory.mood || "").toLowerCase().includes(query);
    const typeMatch = (memory.memory_type || "").toLowerCase().includes(query);

    return titleMatch || contentMatch || moodMatch || typeMatch;
  });

  return (
    <View style={styles.container}>
      <View style={styles.glow} />

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

          <View style={styles.memoryCount}>
            <Text style={styles.countNumber}>
              {memoriesList.length}
            </Text>

            <Text style={styles.countLabel}>
              MEMORIES
            </Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>
            PERSONAL ARCHIVE
          </Text>

          <Text style={styles.title}>
            Your life,
            {"\n"}
            <Text style={styles.highlight}>
              remembered.
            </Text>
          </Text>

          <Text style={styles.description}>
            Every thought, moment, and experience
            connected into your personal story.
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            placeholder="Search your memories..."
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery
              ? "SEARCH RESULTS"
              : "RECENT MEMORIES"}
          </Text>

          <Text style={styles.sectionCount}>
            {filteredMemories.length} FOUND
          </Text>
        </View>

        {/* Memory Cards */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ marginTop: 40 }}
          />
        ) : filteredMemories.length > 0 ? (
          filteredMemories.map((memory) => {
            const { date, time } = formatMemoryDateTime(memory.created_at);
            return (
              <MemoryCard
                key={memory.id}
                title={memory.title}
                description={memory.content}
                date={date}
                time={time}
                mood={memory.mood || "Moment"}
                type={memory.memory_type.toUpperCase()}
                icon={getMoodIcon(memory.mood)}
                onDelete={() => handleDelete(memory.id, memory.title)}
              />
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⌕</Text>

            <Text style={styles.emptyTitle}>
              No memories found
            </Text>

            <Text style={styles.emptyDescription}>
              {searchQuery
                ? "Try searching for a different thought, mood, or memory."
                : "Tap '+' on Home to capture your very first memory."}
            </Text>
          </View>
        )}
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

  glow: {
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

  memoryCount: {
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
    marginBottom: 32,
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

  searchContainer: {
    height: 54,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#0D1315",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    marginBottom: 36,
  },

  searchIcon: {
    color: COLORS.primary,
    fontSize: 22,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
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
    maxWidth: 260,
  },
});