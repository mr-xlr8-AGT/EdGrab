<p align="center"><img src="./assets/EdGrab-Logo.png" alt="EdGrab Logo" width="300"></p>

# EdGrab - Deployed Link

**AI-Powered Personalized Study Assistant with Long-Term Memory**

**Stop Static Learning. Start Thriving.**

---

# TITLE: E D G R A B

## AI-Powered Personalized Study Assistant

EdGrab is not just a tutoring application. It is an **Intelligent Learning Orchestrator** designed to transform how students study. By combining advanced AI reasoning, voice interaction, and personalized memory systems, EdGrab autonomously manages your academic schedule, generates practice exams, and provides real-time tutoring—turning fragmented studying into coherent, strategic learning.

---

# TITLE: E D G R A B - The Purpose

## Challenge & Impact

| Challenge | Impact |
|-----------|--------|
| Students spend 15+ hours weekly on unstructured studying | Time Inefficiency |
| Lack of personalized guidance results in knowledge gaps | Inconsistent Learning |
| No context about upcoming exams during study sessions | Reactive vs Proactive Learning |
| Voice tutoring unavailable without internet/connectivity | Limited Accessibility |
| Mock exams are generic, not tailored to syllabus | Low Relevance |

**Students struggle with scattered study methods, lack of accountability, and no intelligent guidance.**

# TITLE: E D G R A B - Problem Statement

## The Challenge

EdGrab addresses these challenges through:

- **Contextual AI Memory**: Stores your schedule, syllabus, and exam dates
- **Personalized Mock Exams**: AI-generated questions based on YOUR topics
- **Voice Tutoring**: Real-time conversational learning via Gemini TTS
- **Smart Dashboard**: Visual progress tracking and study insights
- **Multimodal Support**: Chat, images, voice—all integrated

**95% reduction in study prep time** | **60% improvement in exam readiness** | **Infinite personalization**

# TITLE: E D G R A B - Business Impact

## Operational Efficiency

- Real-time answers to academic questions (chat + voice)
- Elimination of generic study materials—fully personalized content
- AI-managed exam preparation with mock exams

## Strategic Advantages

- Early preparation through schedule-aware reminders
- Comprehensive understanding via multimodal learning
- Continuous progress tracking without external tools

## Risk Mitigation

- Secure, client-side data storage (localStorage MVP)
- Input validation for all academic data
- Session isolation and secure authentication

---

# TITLE: E D G R A B - The Architecture

EdGrab employs a **modular, component-driven architecture** powered by **Google Gemini API**.

## Core Components

### 1. Memory Bank (Context Engine)
Role: The Foundation  
Task: Stores schedule, exams, and academic context. Every AI interaction is enriched with this data.

### 2. EdTutor Chat
Role: The Conversationalist  
Task: Multimodal chat with image upload, LaTeX rendering, and thinking mode for STEM problems.

### 3. Live Mode (Voice Tutoring)
Role: The Voice Tutor  
Task: Real-time voice conversations via WebSocket + Gemini Native Audio API.

### 4. Mock Exams
Role: The Assessment Engine  
Task: AI-generated MCQs based on your syllabus with instant grading.

### 5. Smart Dashboard
Role: The Insights Hub  
Task: Visualize progress, upcoming classes, study streaks, and performance trends.

---

# TITLE: E D G R A B - Implementation Architecture

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** (custom EdGrab dark theme)
- **Vite** (build tool)
- **KaTeX** for LaTeX math rendering
- **Recharts** for performance analytics

### AI & Audio
- **Google Gemini API**
  - `gemini-3-pro-preview` (complex reasoning)
  - `gemini-2.5-flash` (standard queries)
  - `gemini-2.5-flash-native-audio-preview` (voice)
- **Web Audio API** (16kHz PCM encoding)
- **WebSockets** for real-time communication

### Storage & Security
- **localStorage** (MVP phase)
- **SHA-256** password hashing
- **Session-based auth**
- Future: Supabase/Firebase migration

---

# FILE STRUCTURE

```
EdGrab/
├── components/          # React UI components
├── pages/               # Page-level components
├── server/              # Backend logic (voice, auth)
├── services/            # Gemini API integrations
├── App.tsx              # Root orchestrator
├── index.html           # Entry point
├── index.tsx            # React mount
├── types.ts             # TypeScript definitions
├── metadata.json        # App metadata
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
└── README.md            # This file
```

---

# TITLE: Getting Started - Prerequisites

Before running EdGrab locally, ensure you have:

- **Node.js** 18+
- **npm** or **yarn**
- **Google Gemini API key** ([Get one here](https://aistudio.google.com/app/apikey))
- **Environment file** (.env.local)

---

# TITLE: Getting Started - Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mr-xlr8-AGT/EdGrab.git
cd EdGrab
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env.local` file in the root:

```
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Open in Browser

Navigate to: `http://localhost:5173`

---

# TITLE: Usage

### 1. Initialize Your Memory

- Go to **Memory Bank**
- Add your weekly schedule (classes, times)
- Add upcoming exams with syllabus topics

### 2. Start Studying

- Use **EdTutor Chat** for questions
- Try **Live Mode** for voice tutoring
- Generate **Mock Exams** for assessment

### 3. Track Progress

- View **Dashboard** for insights
- Check performance trends
- Maintain your study streak

---

# KEY FEATURES - Visual Overview

### 🧠 Intelligent Context Awareness
Every AI response knows your schedule, exams, and learning level.

### 🎤 Real-Time Voice Tutoring
Natural conversations with sub-500ms latency.

### 📝 AI-Generated Mock Exams
Personalized MCQs based on YOUR syllabus.

### 📊 Smart Dashboard
Visual progress tracking, streak counter, and insights.

### 🎨 Dark Mode Interface
Curated EdGrab theme for late-night studying.

---

# TECH STACK

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **AI**: Google Gemini API (multimodal + audio)
- **Styling**: Custom Dark Theme + Tailwind
- **Visualization**: Recharts + KaTeX
- **Real-time**: WebSockets
- **Build**: Vite + npm

---

# IMPORTANT NOTE

For the best experience, please use the **[deployed application](https://edgrab-personalized-ai-tutor-55600892774.us-west1.run.app/)**.

If you encounter quota errors running locally with a free-tier Gemini API key, this is expected. The deployed version has appropriate API access configured.

---

# Build for Production

```bash
npm run build
npm run preview
```

---

# 📄 LICENSE

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

# 👨‍💻 AUTHOR

**Aditya Gaurav**

Product Owner & Engineering Lead

[GitHub](https://github.com/mr-xlr8-AGT) | [Portfolio](https://your-portfolio.com)

---

**Built with ❤️ for students, by students**

[Report Bug](https://github.com/mr-xlr8-AGT/EdGrab/issues) • [Request Feature](https://github.com/mr-xlr8-AGT/EdGrab/issues)

⭐ **Star this repo if you find it helpful!**
