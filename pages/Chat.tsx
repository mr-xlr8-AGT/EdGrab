import React, { useState, useRef, useEffect } from 'react';
import { Send, BrainCircuit, Volume2, Sparkles, ArrowUp, Plus, Paperclip, X, Menu, MessageSquare, Trash2, Clock } from 'lucide-react';
import { ChatMessage, UserProfile, ScheduleItem, ExamItem, Attachment, ChatSession } from '../types';
import { generateChatResponse, speakText } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface ChatProps {
  user: UserProfile;
  schedule: ScheduleItem[];
  exams: ExamItem[];
  messages: ChatMessage[];
  updateMessages: (msgs: ChatMessage[]) => void;
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string) => void;
}

const Chat: React.FC<ChatProps> = ({ 
  user, 
  schedule, 
  exams, 
  messages, 
  updateMessages,
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | undefined>(undefined);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine if we are in "Hero/New Tab" mode
  const isHeroMode = messages.length === 0;

  useEffect(() => {
    if (scrollRef.current && !isHeroMode) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isHeroMode, isLoading]);

  // Focus input when loading finishes
  useEffect(() => {
    if (!isLoading && !isHeroMode) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, isHeroMode]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      setAttachment({
        data: base64Data,
        mimeType: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachment) || isLoading) return;

    const userMsgText = input;
    const currentAttachment = attachment;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userMsgText,
      timestamp: Date.now(),
      isThinking,
      attachment: currentAttachment
    };

    // Optimistic update
    const newHistory = [...messages, newMessage];
    updateMessages(newHistory);
    
    setInput('');
    setAttachment(undefined);
    setIsLoading(true);

    try {
      const responseText = await generateChatResponse(
        newMessage.text,
        currentAttachment, 
        newHistory,
        user,
        schedule,
        exams,
        isThinking
      );

      updateMessages([...newHistory, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "Sorry, I couldn't think of a response.",
        timestamp: Date.now()
      }]);
    } catch (error) {
      console.error(error);
      updateMessages([...newHistory, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Oops! My brain froze. Try again?",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleTTS = async (text: string) => {
    const buffer = await speakText(text);
    if (buffer) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    }
  };

  // Input Component
  const InputArea = ({ className, variant = 'default' }: { className?: string, variant?: 'hero' | 'default' }) => (
    <div className={`relative ${className}`}>
      {attachment && (
        <div className={`absolute ${variant === 'hero' ? '-top-24 left-0' : '-top-20 left-0'} z-10`}>
          <div className="relative group">
             <img 
               src={`data:${attachment.mimeType};base64,${attachment.data}`} 
               alt="Preview" 
               className="h-16 w-auto rounded-lg border border-zinc-700 shadow-xl bg-black"
             />
             <button 
               onClick={() => setAttachment(undefined)}
               className="absolute -top-2 -right-2 bg-zinc-800 text-white rounded-full p-1 border border-zinc-600 hover:bg-red-500 hover:border-red-500 transition-colors"
             >
               <X size={12} />
             </button>
          </div>
        </div>
      )}

      <div className={`
          flex items-center gap-3 p-2 transition-all
          ${variant === 'hero' 
            ? 'bg-zinc-950 border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:border-white/20' 
            : 'bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-full shadow-2xl'
          }
      `}>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
          title="Upload Image"
        >
          <Paperclip size={18} />
        </button>
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={variant === 'hero' ? "Ask Edtutor anything..." : "Message Edtutor..."}
          className={`flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none py-2 font-medium ${variant === 'default' ? 'text-sm' : ''}`}
          autoFocus={true}
        />
        
        <button 
          onClick={handleSend}
          disabled={(!input.trim() && !attachment) || isLoading}
          className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center
            ${(!input.trim() && !attachment) || isLoading 
            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
            : 'bg-white text-black hover:bg-zinc-200 shadow-lg'
            }
            ${variant === 'default' ? 'rounded-full' : ''}
          `}
        >
          {variant === 'hero' ? <ArrowUp size={20} /> : <Send size={18} className="ml-0.5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-black text-white relative">
      
      {/* --- Header --- */}
      <div className="px-6 py-4 border-b border-zinc-900 bg-black/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2">
           <Sparkles className="w-4 h-4 text-white" /> 
           <span className="font-bold text-sm">Edtutor</span>
        </div>

        <div className="flex items-center gap-4">
           <button 
              onClick={() => setIsThinking(!isThinking)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${isThinking ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
            >
              <BrainCircuit size={12} />
              <span className="hidden sm:inline">THINKING {isThinking ? 'ON' : 'OFF'}</span>
           </button>

           <button 
             onClick={() => setIsHistoryOpen(true)}
             className="p-2 text-zinc-400 hover:text-white transition-colors"
           >
             <Menu size={24} />
           </button>
        </div>
      </div>

      {/* --- History Sidebar (Drawer) --- */}
      {isHistoryOpen && (
        <div className="absolute inset-0 z-50 flex justify-end">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
             onClick={() => setIsHistoryOpen(false)}
           ></div>

           {/* Drawer Content */}
           <div className="w-80 bg-zinc-950 border-l border-zinc-800 h-full shadow-2xl relative flex flex-col transform transition-transform animate-slide-in-right">
              <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
                 <h2 className="text-lg font-bold">History</h2>
                 <button onClick={() => setIsHistoryOpen(false)} className="text-zinc-500 hover:text-white">
                   <X size={20} />
                 </button>
              </div>

              <div className="p-4">
                 <button 
                   onClick={() => {
                     onCreateSession();
                     setIsHistoryOpen(false);
                   }}
                   className="w-full flex items-center gap-3 p-3 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors mb-4"
                 >
                   <Plus size={18} /> New Chat
                 </button>

                 <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-1">Past Conversations</div>
                 
                 <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar pr-2">
                    {sessions.map(session => (
                      <div 
                        key={session.id}
                        className={`group flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer border ${activeSessionId === session.id ? 'bg-zinc-900 border-zinc-700 text-white' : 'border-transparent hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-300'}`}
                        onClick={() => {
                          onSelectSession(session.id);
                          setIsHistoryOpen(false);
                        }}
                      >
                         <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                            <MessageSquare size={16} className="flex-shrink-0" />
                            <div className="truncate text-sm font-medium">{session.title}</div>
                         </div>
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             onDeleteSession(session.id);
                           }}
                           className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded transition-all"
                         >
                           <Trash2 size={14} />
                         </button>
                      </div>
                    ))}
                    {sessions.length === 0 && (
                       <div className="text-center py-8 text-zinc-600 text-sm">
                          <Clock size={24} className="mx-auto mb-2 opacity-50" />
                          No history yet.
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* --- Mode 1: Hero (Empty State) --- */}
      {isHeroMode && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
           <div className="mb-2 text-center space-y-0">
              <p className="text-zinc-400 text-lg font-medium mb-1">Greetings from Edtutor</p>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">{user.firstName}</span>
              </h1>
           </div>

           <div className="w-full max-w-2xl animate-slide-up mt-2" style={{ animationDelay: '0.1s' }}>
              <InputArea variant="hero" />
              <div className="flex justify-center gap-4 mt-6 text-xs text-zinc-600 font-medium">
                 <button className="hover:text-zinc-400 transition-colors">Analyze Image</button>
                 <span>•</span>
                 <button className="hover:text-zinc-400 transition-colors">Solve Math</button>
                 <span>•</span>
                 <button className="hover:text-zinc-400 transition-colors">Study Schedule</button>
              </div>
           </div>
        </div>
      )}

      {/* --- Mode 2: Chat (Active State) --- */}
      {!isHeroMode && (
        <>
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 custom-scrollbar" ref={scrollRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
                <div className={`max-w-[90%] md:max-w-[80%] space-y-2`}>
                  
                  {msg.role === 'model' && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[10px] font-bold text-black font-serif italic">Eg</div>
                      <span className="text-xs text-zinc-500">EdGrab</span>
                    </div>
                  )}

                  <div className={`p-5 rounded-3xl relative text-sm md:text-base leading-relaxed shadow-md ${
                      msg.role === 'user' 
                        ? 'bg-zinc-900 text-white border border-zinc-800 rounded-tr-none ml-auto' 
                        : 'bg-transparent text-zinc-200 pl-0'
                    }`}>
                      
                      {msg.attachment && (
                        <div className="mb-3 rounded-lg overflow-hidden border border-white/10 inline-block">
                           <img 
                              src={`data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} 
                              alt="Attachment" 
                              className="max-h-64 max-w-full object-cover"
                           />
                        </div>
                      )}

                      {msg.role === 'model' ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown
                              remarkPlugins={[remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                              components={{
                                p: ({children}) => <p className="mb-4 last:mb-0 leading-7">{children}</p>,
                                h1: ({children}) => <h1 className="text-xl font-bold text-white mt-6 mb-4">{children}</h1>,
                                h2: ({children}) => <h2 className="text-lg font-bold text-white mt-5 mb-3">{children}</h2>,
                                ul: ({children}) => <ul className="list-disc pl-5 space-y-2 mb-4 marker:text-zinc-500">{children}</ul>,
                                ol: ({children}) => <ol className="list-decimal pl-5 space-y-2 mb-4 marker:text-zinc-500">{children}</ol>,
                                code: ({children}) => <code className="bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                                pre: ({children}) => <pre className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl overflow-x-auto my-4 text-sm font-mono">{children}</pre>,
                                blockquote: ({children}) => <blockquote className="border-l-2 border-zinc-700 pl-4 text-zinc-400 italic">{children}</blockquote>,
                              }}
                          >
                            {msg.text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p>{msg.text}</p>
                      )}
                    </div>
                  
                  {msg.role === 'model' && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-0 pl-1">
                      <button 
                        onClick={() => handleTTS(msg.text)}
                        className="text-zinc-600 hover:text-white transition-colors p-1"
                        title="Listen"
                      >
                        <Volume2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start animate-fade-in mt-4">
                 <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500 font-serif italic">Eg</div>
                   <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      {isThinking && <span className="text-[10px] font-bold text-zinc-500 uppercase ml-2 tracking-wider">Thinking</span>}
                   </div>
                 </div>
              </div>
            )}
            <div className="h-4"></div>
          </div>

          {/* Bottom Input Bar */}
          <div className="p-4 md:p-6 bg-gradient-to-t from-black via-black to-transparent">
             <div className="max-w-4xl mx-auto">
                <InputArea variant="default" />
                <div className="text-center mt-3">
                  <span className="text-[10px] text-zinc-700">EdGrab can make mistakes. Check important info.</span>
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;