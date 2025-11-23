<div align="center">

# 🎓 EdGrab

### AI-Powered Personalized Study Assistant with Long-Term Memory

[![Version](https://img.shields.io/badge/version-1.2-blue.svg)](https://github.com/mr-xlr8-AGT/EdGrab)
[![Status](https://img.shields.io/badge/status-Production%20Ready-success.svg)](https://github.com/mr-xlr8-AGT/EdGrab)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/mr-xlr8-AGT/EdGrab/pulls)

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Roadmap](#-roadmap)

</div>

---

## 🌟 Overview

**EdGrab** bridges the gap between static Learning Management Systems and expensive human tutors. Unlike generic AI chatbots, EdGrab possesses **Long-Term Memory** of your schedule, syllabus, and upcoming exams—providing truly personalized, context-aware learning support.

Powered by **Google's Gemini API** (multimodal + live audio), EdGrab delivers:
- 🧠 Context-rich text reasoning with LaTeX math rendering
- 🎤 Real-time voice tutoring with <500ms latency
- 📝 AI-generated mock exams with performance analytics
- 📊 Smart dashboard tracking study patterns and progress

---

## ✨ Features

### 🗂️ Memory Bank (Context Engine)
- **Weekly Schedule Management**: CRUD operations for recurring classes
- **Exam Tracking**: Store subjects, dates, and specific syllabus topics
- **Context Injection**: Every AI interaction leverages your saved academic data

### 💬 EdTutor Chat Interface
- **Dual Models**: `gemini-3-pro-preview` for complex reasoning, `gemini-2.5-flash` for speed
- **Thinking Mode**: Chain-of-thought reasoning for STEM problems
- **Multimodal Support**: Upload images of math problems for instant analysis
- **Rich Formatting**: Full Markdown + LaTeX (KaTeX) rendering
- **Text-to-Speech**: Listen to AI explanations via Gemini TTS
- **Session History**: Save and retrieve past conversations

### 🎙️ Live Mode (Real-Time Voice Tutoring)
- **WebSocket Integration**: Full-duplex voice conversations
- **Audio Visualization**: Real-time waveform display
- **Natural Interaction**: Ask questions while walking, studying, or multitasking
- **Controls**: Mute, end call, connection status indicators

### 📝 Mock Exams & Analytics
- **AI-Generated MCQs**: 5 unique questions per exam based on your syllabus
- **Instant Grading**: Immediate feedback with explanations
- **Performance Tracking**: Average scores, total exams, improvement trends
- **Insights Dashboard**: Area charts showing progress over time

### 📈 Smart Dashboard
- **Up Next Card**: Shows your immediate next class
- **Streak Counter**: Gamification for daily usage
- **Study Visualizations**: Hours tracked, subject mastery estimates
- **Quick Actions**: Shortcuts to chat, memory, and exams

---

## 🎬 Demo

> *Screenshots and demo video coming soon!*

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (EdGrab Dark theme)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Math Rendering**: KaTeX + React-Markdown

### AI & Audio
- **AI Models**: Google Gemini API (Vertex AI/Studio)
  - `gemini-3-pro-preview` (complex reasoning)
  - `gemini-2.5-flash` (standard queries)
  - `gemini-2.5-flash-native-audio-preview` (voice)
- **Audio Processing**: Web Audio API (PCM encoding: 16kHz input, 24kHz output)
- **Real-time Communication**: WebSockets

### Storage & Security
- **Current**: localStorage (client-side)
- **Authentication**: SHA-256 password hashing
- **Future**: Supabase/Firebase for cloud sync

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mr-xlr8-AGT/EdGrab.git
   cd EdGrab
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Add your GEMINI_API_KEY to .env.local
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   Navigate to http://localhost:5173
   ```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
EdGrab/
├── components/       # React components
├── pages/           # Page components
├── server/          # Backend logic
├── services/        # API integrations
├── App.tsx          # Root component
├── index.html       # Entry point
└── README.md        # This file
```

---

## 🎯 Success Metrics

| Goal | Metric |
|------|--------|
| **Contextual Awareness** | 100% of AI responses consider user's grade and upcoming exams |
| **Exam Readiness** | Users complete ≥3 mock exams per subject before real exam |
| **Low Latency** | Live Voice interaction <500ms latency |
| **Security** | CIA principles (Confidentiality, Integrity, Availability) |

---

## 🗺️ Roadmap

### ✅ MVP (Current - v1.2)
- [x] Memory Bank (schedule + exams)
- [x] EdTutor Chat with multimodal support
- [x] Live Mode voice tutoring
- [x] Mock Exams with analytics
- [x] Dashboard with visualizations

### 🔜 Post-MVP
- [ ] **Cloud Sync**: Migrate to Supabase/Firebase for cross-device access
- [ ] **File Knowledge Base**: Upload PDFs for RAG (Retrieval-Augmented Generation)
- [ ] **Gamification V2**: Badges, leaderboards, "Study with Friends" mode
- [ ] **Calendar Integration**: Sync with Google Calendar/Outlook
- [ ] **Mobile Apps**: Native iOS/Android versions
- [ ] **Collaborative Study**: Group study sessions and shared notes

---

## 👥 User Personas

### 🕐 The Procrastinator (Sam)
- Needs reminders for upcoming exams
- Uses Live Mode for quick Q&A while commuting
- Benefits from auto-generated study summaries

### 🎯 The Overachiever (Alex)
- Uses Mock Exams to test mastery
- Leverages Thinking Mode for complex calculus/physics
- Tracks performance trends to optimize study strategy

---

## 🔒 Security & Privacy

- **Password Security**: SHA-256 hashing before storage
- **Data Isolation**: Client-side localStorage for MVP
- **Input Validation**: Strict regex enforcement for emails
- **Session Management**: Persistent, secure session handling

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Aditya Gaurav**  
Product Owner & Engineering Lead  

[![GitHub](https://img.shields.io/badge/GitHub-mr--xlr8--AGT-181717?logo=github)](https://github.com/mr-xlr8-AGT)  
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?logo=linkedin)](https://linkedin.com/in/your-profile)

---

## 🙏 Acknowledgments

- **Google Gemini API** for powering AI capabilities
- **React Team** for the amazing framework
- **Tailwind CSS** for beautiful, responsive design
- **Open Source Community** for invaluable tools and libraries

---

## 📊 Project Status

```
██████████████████████░░ 90% Complete (MVP)
```

**Last Updated**: November 23, 2025  
**Version**: 1.2  
**Status**: Production Ready (MVP)

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Built with ❤️ by students, for students**

[Report Bug](https://github.com/mr-xlr8-AGT/EdGrab/issues) • [Request Feature](https://github.com/mr-xlr8-AGT/EdGrab/issues)

</div>
