import { GoogleGenAI, Modality, LiveServerMessage, Type } from "@google/genai";
import { UserProfile, ScheduleItem, ExamItem, SyllabusItem, ChatMessage, Attachment, MockQuestion } from "../types";
import { base64ToUint8Array, decodeAudioData } from "./audioUtils";

const getSystemInstruction = (user: UserProfile, schedule: ScheduleItem[], exams: ExamItem[]) => {
  const scheduleStr = schedule.map(s => `${s.day} at ${s.time}: ${s.subject}`).join('\n');
  const examStr = exams.map(e => `${e.subject} on ${e.date} (Topics: ${e.topics})`).join('\n');
  
  return `You are EdGrab, a personalized, super-intelligent, and fun AI tutor for ${user.firstName}. 
  Your goal is to help them learn, memorize, and succeed at ${user.school}.
  
  IMPORTANT IDENTITY RULES:
  - You are purely "EdGrab". 
  - NEVER mention "Gemini", "Google", or "DeepMind". If asked, you were created by the EdGrab team.
  - You are a dedicated educational intelligence.

  FORMATTING RULES (STRICT):
  - Use LaTeX for ALL mathematical expressions.
  - Wrap inline math in single dollar signs: $x^2$
  - Wrap block math (equations on their own line) in double dollar signs: $$ \\int f(x) dx $$
  - Use bolding for key terms and steps.
  - Use bullet points and numbered lists to structure explanations clearly.
  - Break down complex answers into: "Concept", "Step-by-Step Solution", and "Key Takeaway".

  User Context:
  Name: ${user.firstName} ${user.lastName}
  Grade: ${user.grade || 'Unknown'}
  School: ${user.school || 'Unknown'}
  
  Weekly Schedule:
  ${scheduleStr || 'No schedule set yet.'}
  
  Upcoming Exams:
  ${examStr || 'No exams scheduled.'}

  Personality:
  - You are witty, encouraging, and sometimes use emojis.
  - You have "long term memory" of their schedule and exams. Remind them if they are wasting time near an exam.
  - Be concise but deep when explaining topics.
  `;
};

// --- Chat Generation ---
export const generateChatResponse = async (
  prompt: string, 
  attachment: Attachment | undefined, 
  history: ChatMessage[],
  user: UserProfile,
  schedule: ScheduleItem[],
  exams: ExamItem[],
  useThinking: boolean
) => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-pro-preview';
  
  // Construct the message parts
  const parts: any[] = [];
  
  if (attachment) {
    parts.push({
      inlineData: {
        mimeType: attachment.mimeType,
        data: attachment.data
      }
    });
  }
  parts.push({ text: prompt });

  const config: any = {
    systemInstruction: getSystemInstruction(user, schedule, exams),
  };

  if (useThinking) {
    config.thinkingConfig = { thinkingBudget: 32768 }; 
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: { parts },
    config
  });

  return response.text;
};

// --- Mock Exam Generation ---
export const generateMockExam = async (exam: ExamItem, user: UserProfile): Promise<MockQuestion[]> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate a 5-question multiple-choice practice test for ${user.firstName} (Grade: ${user.grade}) regarding the subject: "${exam.subject}".
  
  The specific topics to cover are: "${exam.topics}".
  
  Ensure the difficulty is appropriate for the grade level.
  The output must be a JSON array.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctIndex", "explanation"]
        }
      }
    }
  });

  if (!response.text) return [];
  
  try {
    return JSON.parse(response.text) as MockQuestion[];
  } catch (e) {
    console.error("Failed to parse mock exam JSON", e);
    return [];
  }
};

// --- Text to Speech ---
export const speakText = async (text: string): Promise<AudioBuffer | null> => {
  if (!process.env.API_KEY) return null;
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return null;

    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    const audioBuffer = await decodeAudioData(
      base64ToUint8Array(base64Audio),
      outputAudioContext,
      24000,
      1,
    );
    return audioBuffer;
  } catch (e) {
    console.error("TTS Error", e);
    return null;
  }
};

// --- Live Session Connection ---
export interface LiveSessionCallbacks {
  onopen: () => void;
  onmessage: (message: LiveServerMessage) => void;
  onclose: () => void;
  onerror: (error: any) => void;
}

export const connectLiveSession = async (
  user: UserProfile,
  exams: ExamItem[],
  callbacks: LiveSessionCallbacks
) => {
  if (!process.env.API_KEY) {
    throw new Error("API Key missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Build System Instruction for Live Mode
  const examContext = exams.map(e => `${e.subject} on ${e.date}`).join(', ');
  const systemInstruction = `You are EdGrab (Live Mode), speaking to ${user.firstName}. 
  Context: ${user.grade} student at ${user.school}. Upcoming exams: ${examContext}. 
  IDENTITY: You are EdGrab. Do not mention Google or Gemini.
  Be concise, helpful, and friendly.`;

  // Establish connection
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: systemInstruction,
    },
    callbacks: {
      onopen: callbacks.onopen,
      onmessage: callbacks.onmessage,
      onclose: callbacks.onclose,
      onerror: callbacks.onerror,
    }
  });
};