// ============================================================
// ROOTS API SERVICE
// ============================================================


// ============================================================
// MODULE 1 — MEMORY MANAGEMENT
// ============================================================

export interface Memory {
  id: number;
  title: string;
  content: string;
  mood: string | null;
  memory_type: string;
  created_at: string;
}

export interface MemoryCreate {
  title: string;
  content: string;
  mood?: string;
  memory_type?: string;
}


// ============================================================
// MODULE 2 — MOOD TRACKING
// ============================================================

export interface Mood {
  id: number;
  mood: string;
  score: number;
  created_at: string;
}

export interface MoodCreate {
  mood: string;
}

export interface MoodSummary {
  average_score: number;
  total_entries: number;
  current_mood: string | null;
}


// ============================================================
// API CONFIGURATION
// ============================================================

/*
 * For development/testing on your computer:
 *
 *     http://127.0.0.1:8000
 *
 * For Android emulator:
 *
 *     http://10.0.2.2:8000
 *
 * For Expo Go on your physical phone:
 *
 *     http://YOUR_PC_IP:8000
 *
 * Example:
 *
 *     http://192.168.1.105:8000
 *
 * We will change this when we connect the
 * frontend to your phone.
 */

const API_BASE_URL = "http://127.0.0.1:8000";


// ============================================================
// MODULE 1 — MEMORY API
// ============================================================


export async function getMemories(): Promise<Memory[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/memories`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch memories: ${response.status}`
    );
  }

  return response.json();
}


export async function createMemory(
  memory: MemoryCreate
): Promise<Memory> {

  const response = await fetch(
    `${API_BASE_URL}/api/memories`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: memory.title,
        content: memory.content,
        mood: memory.mood || null,
        memory_type:
          memory.memory_type || "moment",
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Failed to create memory: ${errorText}`
    );
  }

  return response.json();
}


export async function deleteMemory(
  id: number
): Promise<void> {

  const response = await fetch(
    `${API_BASE_URL}/api/memories/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to delete memory: ${response.status}`
    );
  }
}


// ============================================================
// MODULE 2 — MOOD API
// ============================================================


export async function getMoods(): Promise<Mood[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/moods`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch moods: ${response.status}`
    );
  }

  return response.json();
}


export async function createMood(
  mood: MoodCreate
): Promise<Mood> {

  const response = await fetch(
    `${API_BASE_URL}/api/moods`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        mood: mood.mood,
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Failed to create mood: ${errorText}`
    );
  }

  return response.json();
}


export async function getMoodSummary(): Promise<MoodSummary> {
  const response = await fetch(
    `${API_BASE_URL}/api/moods/summary`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch mood summary: ${response.status}`
    );
  }

  return response.json();
}