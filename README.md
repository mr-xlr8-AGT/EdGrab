
<div align="center">

# E D G R A B
### Personalized AI Tutor

[**EdGrab :- Deployed Link**](https://edgrab-personalized-ai-tutor-55600892774.us-west1.run.app/)


[![License](https://img.shields.io/badge/license-apache2.0-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-v19.0-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-v5.0-3178c6.svg)](https://www.typescriptlang.org/)
[![Gemini API](https://img.shields.io/badge/Gemini-2.5%20Flash%20%7C%203.0%20Pro-8E44AD.svg)](https://ai.google.dev/)

**Your personal intelligence engine.**
*Master your syllabus, schedule your success, and never forget a thing.*

</div>

---

## ⚡ The Purpose

EdGrab is not just a chatbot. It is a **Context-Aware Educational Intelligence** designed to simulate the experience of a dedicated human tutor. 

Unlike generic LLM wrappers, EdGrab maintains a persistent "Memory Bank" of your school schedule, upcoming exams, and syllabus. It leverages **Gemini 3.0 Pro** for deep reasoning and complex math, while utilizing **Gemini 2.5 Flash Native Audio** for real-time, low-latency voice coaching sessions. It turns the chaos of student life into a structured path to mastery.

---

## 🛑 Problem Statement

Students face significant challenges in self-regulated learning:

| Challenge | Impact |
| :--- | :--- |
| **Generic Assistance** | AI tools lack context of grade level, school, or curriculum, leading to irrelevant answers. |
| **Passive Learning** | Text-only interactions fail to build retention compared to oral active recall. |
| **Disorganized Schedules** | Students cram 48 hours before exams due to poor time management. |
| **Math Hallucinations** | Standard LLMs struggle with complex STEM derivation without specific reasoning capabilities. |

### Solution
EdGrab addresses these challenges through a **multi-modal architecture** that combines deep reasoning, structured data generation (JSON exams), and real-time voice interaction to create a holistic learning environment.

---

## 🚀 Educational Impact

### Learning Efficiency
*   **Context Injection:** No need to explain "I'm in 10th grade" every time. EdGrab knows.
*   **Active Recall:** "Live Mode" quizzes you verbally to ensure true understanding.

### Strategic Advantages
*   **Thinking Models:** Uses `gemini-3-pro-preview` with thinking budgets for high-accuracy STEM solving.
*   **Structured Practice:** Generates strict JSON-based mock exams for objective scoring.

---

## 🔗 The AI Architecture

EdGrab employs a multi-model approach powered by the **Google GenAI SDK**, routing specific tasks to the most efficient model.

### 1. ⚡ The Tutor Core (`gemini-3-pro-preview`)
*   **Role:** The Professor.
*   **Task:** Handles complex chat interactions, math problems (LaTeX output), and deep concept explanation.
*   **Config:** Uses `thinkingConfig` to allocate token budgets for reasoning before answering.

### 2. 🎙️ Live Voice Agent (`gemini-2.5-flash-native-audio`)
*   **Role:** The Coach.
*   **Task:** Establishes a WebSocket connection for real-time, interruptible voice conversations.
*   **Latency:** Optimized for sub-500ms interaction.

### 3. 📝 Exam Generator (`gemini-2.5-flash`)
*   **Role:** The Examiner.
*   **Task:** Generates strictly typed JSON arrays of multiple-choice questions based on specific syllabus topics.

### 4. 🗣️ Speech Synthesis (`gemini-2.5-flash-tts`)
*   **Role:** The Narrator.
*   **Task:** Converts text responses into lifelike audio for accessibility and auditory learning.

---

## 📂 File Structure

```text
/EdGrab
├── components/
│   ├── Auth.tsx             # User authentication flow
│   └── ...
├── pages/
│   ├── Chat.tsx             # Main chat interface with Markdown/Math support
│   ├── Dashboard.tsx        # Visual progress tracking
│   ├── Live.tsx             # Real-time audio visualizer & connection
│   ├── Memory.tsx           # Schedule & Exam management
│   ├── MockExams.tsx        # AI-generated testing center
│   └── Profile.tsx          # User settings
├── services/
│   ├── audioUtils.ts        # PCM encoding/decoding for Live API
│   └── geminiService.ts     # Centralized GenAI SDK implementation
├── App.tsx                  # Routing & State Management
├── types.ts                 # TypeScript interfaces
└── metadata.json            # Permissions config
```

---

## 🏗️ Implementation Details

### 1. Context Injection (System Instructions)
EdGrab injects the user's "Memory Bank" (Schedule/Exams) directly into the model's system instruction, ensuring every response is personalized.

**Sample (`geminiService.ts`):**
```typescript
const getSystemInstruction = (user, schedule, exams) => {
  return `You are EdGrab, a tutor for ${user.firstName}.
  Context: ${user.grade} at ${user.school}.
  Upcoming Exams: ${exams.map(e => `${e.subject} on ${e.date}`).join(', ')}.
  
  IDENTITY RULES:
  - Remind them if they are wasting time near an exam.
  - Use LaTeX for math.
  `;
};
```

### 2. Real-time Audio (Live API)
Implemented via `ai.live.connect` with bi-directional streaming. We handle raw PCM audio processing in the browser.

**Sample (`services/geminiService.ts`):**
```typescript
export const connectLiveSession = async (user, exams, callbacks) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    config: {
      responseModalities: [Modality.AUDIO],
      systemInstruction: `Speaking to ${user.firstName}. Context: ${user.grade}...`
    },
    callbacks
  });
};
```

### 3. Structured Data (Mock Exams)
Uses `responseSchema` to force the model to output valid JSON for the exam engine, eliminating parsing errors.

**Sample (`services/geminiService.ts`):**
```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  config: {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.ARRAY,
      items: { type: Type.OBJECT, properties: { ... } }
    }
  }
});
```

---

## 🔑 Key Features

### 📊 Visual Intelligence Dashboard
*   **Metrics:** High-contrast tracking of exams, streaks, and study hours.
*   **Up Next:** Dynamic cards showing the immediate next class in your schedule.

### 🎙️ Live Tutor Mode
*   **Visualizer:** Real-time audio wave visualization driven by RMS amplitude.
*   **Bi-directional:** Interrupt the AI anytime, just like a real conversation.

### 🧠 Thinking Mode
*   Toggleable "Thinking" mode in chat that allocates a 32k token budget for the model to "think" before answering complex physics or calculus questions.

---

## 🛠️ Tech Stack

*   **Core:** React 19, TypeScript, Vite.
*   **AI:** `@google/genai` SDK.
*   **Styling:** Tailwind CSS (Custom "EdGrab Dark" Theme).
*   **Visualization:** Recharts.
*   **Math Rendering:** KaTeX + React Markdown.

---

## ⚠️ Important Note

**For the best experience, please use the [deployed application](https://edgrab-personalized-ai-tutor-55600892774.us-west1.run.app/).**

If you encounter quota-related errors when running locally with a free-tier Gemini API key, this is expected behavior due to API rate limitations. The deployed version is configured with appropriate API access to ensure uninterrupted service.

---

## 🏁 Getting Started

### Prerequisites
*   Node.js 18+
*   A Google Cloud Project with Gemini API enabled.

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/mr-xlr8-AGT/EdGrab.git
    cd EdGrab
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root (or rely on the app's internal handling if configured differently):
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the Tutor**
    ```bash
    npm run dev
    ```

---

## 🎮 Usage

1.  **Initialize:** Create your profile (Grade, School).
2.  **Memory:** Go to the "Memory" tab and add your weekly schedule and upcoming exams.
3.  **Chat:** Ask questions. EdGrab will reference your exams ("Don't forget your Calculus test on Friday!").
4.  **Live:** Click the microphone icon to practice orally.
5.  **Exam:** Generate a mock test to check your readiness.

---

*Created for the Future of Education.*
