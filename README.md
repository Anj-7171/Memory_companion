# ROOTS — Memory OS

> A personal memory and connection companion designed to help users capture meaningful moments, understand their moods, and strengthen social connections through memories and interactive games.

---

## Overview

**ROOTS — Memory OS** is a mobile-first personal memory companion built around the idea that memories are more than stored information — they are connected to emotions, experiences, and people.

The application provides a unified space where users can:

- Store and manage personal memories
- Track and reflect on moods
- Play simple connection-oriented memory games
- Explore a home-based memory feed/reel
- Organize and eventually share memories through capsules
- Extend stored memories with AI-powered analysis and recommendations

The project follows a modular architecture so that individual features can be developed, tested, and connected independently.

---

# Key Features

## Memory Management

The Memory Management module provides the core memory storage layer of ROOTS.

Users can:

- Create a memory
- Store a title and description
- Associate a mood with a memory
- Categorize memories by type
- Retrieve individual memories
- Retrieve stored memories
- Delete memories

### Backend API

```text
GET     /api/memories
POST    /api/memories
GET     /api/memories/{memory_id}
DELETE  /api/memories/{memory_id}
```

---

## Mood Tracking

The Mood Tracking module allows users to record their current emotional state and associate it with a numerical mood score.

The module provides:

- Mood selection
- Mood score storage
- Mood history
- Current mood retrieval
- Average mood calculation
- Mood summary information

### Backend API

```text
GET     /api/moods
POST    /api/moods
GET     /api/moods/summary
```

The current implementation provides the backend foundation required for the frontend mood dashboard and future AI-based sentiment/emotion analysis.

---

## Connection Games

The Connection Games module introduces lightweight games designed around memory and social interaction.

The current backend implementation includes **Memory Match**.

The module supports:

- Viewing available games
- Viewing game details
- Starting a game session
- Tracking player information
- Tracking moves
- Tracking scores
- Completing a game session
- Persisting game-session results

### Backend API

```text
GET     /api/games
GET     /api/games/{game_id}

POST    /api/games/{game_id}/sessions
GET     /api/games/sessions/{session_id}

POST    /api/games/sessions/{session_id}/complete
```

---

# System Architecture

ROOTS follows a modular client-server architecture.

```text
                    ┌──────────────────────┐
                    │      ROOTS USER      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Native App   │
                    │        Expo          │
                    └──────────┬───────────┘
                               │
                         REST / JSON
                               │
                               ▼
                    ┌──────────────────────┐
                    │    FastAPI Backend   │
                    ├──────────────────────┤
                    │ Memory Management    │
                    │ Mood Tracking        │
                    │ Connection Games     │
                    │ Future AI Services   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      SQLAlchemy      │
                    │         ORM          │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    SQLite Database   │
                    ├──────────────────────┤
                    │ Memories             │
                    │ Moods                │
                    │ Games                │
                    │ Game Sessions        │
                    └──────────────────────┘
```

---

# Project Modules

ROOTS is being developed as a collection of independent but interconnected modules.

| Module | Description |
|---|---|---|
| **Module 1** | Memory Management |
| **Module 2** | Mood Tracking |
| **Module 3** | Connection Games |
| **Home / Memory Reel** | Memory-based home experience |
| **Memory Capsules** | Grouped/shared memories |
| **AI Engine** | Sentiment, emotion and memory analysis |
| **Recommendations** | Personalized memory/recommendation layer |
| **Frontend–Backend Integration** | Connect mobile UI to APIs |

---

# Frontend

The ROOTS frontend is built using **React Native with Expo and TypeScript**.

The application follows a modular screen-based structure.

```text
ROOTS/app/
│
├── app/
│   ├── index.tsx
│   ├── memories.tsx
│   ├── games.tsx
│   ├── mood.tsx
│   └── profile.tsx
│
├── components/
│
├── constants/
│
├── hooks/
│
├── assets/
│
└── scripts/
```

The frontend provides the main ROOTS user experience, including navigation between:

```text
Memories
Capsules
Games
Mood
Profile
```

The UI specification defines a reusable visual system based around components such as glass cards, navigation controls, memory capsules, mood summaries, game cards, and other reusable widgets.

---

# Backend

The backend is implemented using:

- **Python**
- **FastAPI**
- **SQLAlchemy**
- **SQLite**
- **Pydantic**
- **Uvicorn**

Backend structure:

```text
ROOTS/backend/
│
├── main.py
│
├── database/
│   ├── database.py
│   └── models.py
│
├── routers/
│   ├── memories.py
│   ├── moods.py
│   └── games.py
│
├── schemas/
│
├── services/
│
└── seed_games.py
```

The backend exposes REST APIs that can be tested independently through FastAPI's automatically generated Swagger/OpenAPI interface.

---

# Database

ROOTS currently uses **SQLite** as the structured persistence layer.

The database contains entities for:

```text
┌──────────────┐
│   Memories   │
├──────────────┤
│ id           │
│ title        │
│ content      │
│ mood         │
│ memory_type  │
│ created_at   │
└──────────────┘

┌──────────────┐
│    Moods     │
├──────────────┤
│ id           │
│ mood         │
│ score        │
│ created_at   │
└──────────────┘

┌──────────────┐
│    Games     │
├──────────────┤
│ id           │
│ name         │
│ description  │
│ game_type    │
└──────────────┘

┌──────────────────┐
│  Game Sessions   │
├──────────────────┤
│ id               │
│ game_id          │
│ player_name      │
│ score            │
│ moves            │
│ completed        │
│ started_at       │
│ completed_at     │
└──────────────────┘
```

---

# API Architecture

The application communicates using REST APIs.

```text
React Native Frontend
        │
        │ HTTP Request
        ▼
     FastAPI
        │
        ├──────────────► Memory Router
        │
        ├──────────────► Mood Router
        │
        └──────────────► Games Router
                         │
                         ▼
                     Services
                         │
                         ▼
                     SQLAlchemy
                         │
                         ▼
                       SQLite
```

---

# API Testing

FastAPI automatically generates an interactive Swagger interface.

Run the backend:

```bash
uvicorn main:app --reload
```

Then open:

```text
http://127.0.0.1:8000/docs
```

The Swagger interface can be used to test:

- Memory creation and retrieval
- Memory deletion
- Mood creation and retrieval
- Mood summaries
- Game catalogue retrieval
- Game session creation
- Game session retrieval
- Game completion

This allows backend modules to be independently validated before connecting them to the mobile frontend.

---

# Getting Started

## Prerequisites

Make sure the following are installed:

- Python 3.10+
- Node.js
- npm
- Expo
- Git

---

## 1. Clone the repository

```bash
git clone https://github.com/Anj-7171/Memory_companion.git
cd Memory_companion
```

---

# 2. Start the Backend

Navigate to the backend:

```bash
cd ROOTS/backend
```

Create and activate a virtual environment.

### Windows

```powershell
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Start FastAPI:

```powershell
uvicorn main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 3. Seed the Game Database

To add the initial Memory Match game:

```powershell
python seed_games.py
```

Expected output:

```text
Memory Match game added successfully.
```

If it has already been added:

```text
Memory Match already exists.
```

---

# 4. Start the Frontend

Open another terminal and navigate to:

```bash
cd ROOTS/app
```

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

The application can then be opened using:

- Expo Go
- Android emulator
- iOS simulator
- Web browser

---

# Frontend–Backend Configuration

The frontend API configuration is located in:

```text
ROOTS/app/api.ts
```

The backend base URL depends on where the application is running.

### Desktop browser

```typescript
const API_BASE_URL = "http://127.0.0.1:8000";
```

### Android emulator

```typescript
const API_BASE_URL = "http://10.0.2.2:8000";
```

### Physical phone

Use the local IP address of the computer running the backend:

```typescript
const API_BASE_URL = "http://YOUR_PC_IP:8000";
```

Both the phone and computer must be connected to the same network.

---

# Planned AI Layer

The long-term ROOTS architecture includes an AI layer for analyzing memories and mood.

The planned pipeline is:

```text
User Memory
     │
     ▼
Text Preprocessing
     │
     ▼
Sentiment Analysis
     │
     ▼
Emotion Classification
     │
     ▼
Mood Engine
     │
     ▼
Recommendation Engine
     │
     ▼
ROOTS Dashboard
```

Potential AI capabilities include:

- Sentiment analysis
- Emotion classification
- Mood scoring
- Memory summarization
- Personalized recommendations
- Mood analytics

The current backend establishes the structured data foundation required for these capabilities.

---

# Project Goals

ROOTS aims to evolve into a personal memory operating system that combines:

```text
             ROOTS MEMORY OS
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
   Memories       Mood        Connections
       │            │            │
       └────────────┼────────────┘
                    │
                    ▼
               AI ENGINE
                    │
                    ▼
          Personalized Experience
```

The goal is not simply to store memories, but to create meaningful connections between:

**memories → emotions → people → experiences → recommendations**

---

# Repository Structure

```text
Memory_companion/
│
├── ROOTS/
│   │
│   ├── app/
│   │   ├── app/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── assets/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── backend/
│   │   ├── database/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── main.py
│   │   └── seed_games.py
│   │
│   ├── ROOTSAppUI.txt
│   └── README.md
│
└── ROOTS_Project_Proposal.docx
```

---

# Technology Stack

| Layer | Technology |
|---|---|
| Mobile Frontend | React Native |
| App Framework | Expo |
| Language | TypeScript |
| Backend | FastAPI |
| Backend Language | Python |
| ORM | SQLAlchemy |
| Database | SQLite |
| API Format | REST / JSON |
| API Documentation | OpenAPI / Swagger |
| Development Server | Uvicorn |
| Version Control | Git / GitHub |

---

# Development Philosophy

ROOTS is being developed incrementally.

Each module is first:

```text
Designed
   ↓
Implemented
   ↓
Connected to database
   ↓
Exposed through API
   ↓
Tested through Swagger
   ↓
Connected to frontend
```

This modular approach makes the system easier to test, maintain, and extend.

---


# Project

**ROOTS — Memory OS**

A modular memory companion focused on helping users preserve experiences, understand emotional patterns, and strengthen connections.

---
