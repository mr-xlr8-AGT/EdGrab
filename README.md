EdGrab
Version: 1.2
Status: Production Ready (MVP)
Last Updated: 23-11-2025

Overview
EdGrab is an AI-first personalized study assistant bridging the gap between static LMS platforms and costly tutors. Leveraging Google’s Gemini API (text, voice, multimodal), EdGrab maintains long-term memory of your study schedule, syllabus, and exams, providing context-rich, engaging support.

Features
Memory Bank: Schedule & exam tracking with CRUD support

EdTutor Chat: Gemini-powered, multimodal math rendering (Markdown/LaTeX)

Live Mode: Real-time voice tutoring (<500ms latency)

Mock Exams: AI-generated MCQs, instant grading, analytics

Dashboard: Visualize next class, streaks, study hours

Stack
Frontend: React 18+, Vite, Tailwind CSS

AI: Gemini API (Vertex AI/Studio), WebSocket

Storage: localStorage (MVP), future: Supabase/Firebase

Getting Started
Clone the repo:

bash
git clone https://github.com/yourusername/edgrab.git
Install dependencies:

bash
npm install
Start the development server:

bash
npm run dev
Architecture
Modular React app with TypeScript

Secure authentication (SHA-256 passwords)

Real-time audio via Web Audio API

Roadmap (post-MVP)
Cloud sync (Supabase/Firebase)

File uploads for RAG

Gamification: badges, leaderboards

Google Calendar integration

License
MIT
