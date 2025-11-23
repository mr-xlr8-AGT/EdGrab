
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  school: string;
  grade: string;
  avatar?: string;
}

export interface ScheduleItem {
  id: string;
  day: string; // Monday, Tuesday...
  time: string;
  subject: string;
}

export interface ExamItem {
  id: string;
  date: string;
  subject: string;
  topics: string;
}

export interface SyllabusItem {
  id: string;
  subject: string;
  content: string;
  completed: boolean;
}

export interface Attachment {
  data: string; // base64
  mimeType: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
  attachment?: Attachment;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface MockQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MockExamAttempt {
  id: string;
  examId: string;
  subject: string;
  dateTaken: number;
  score: number;
  totalQuestions: number;
}

export enum Tab {
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  LIVE = 'live',
  MEMORY = 'memory',
  PROFILE = 'profile',
  MOCK_EXAMS = 'mock_exams'
}
