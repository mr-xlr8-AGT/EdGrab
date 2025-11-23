
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { UserProfile, ScheduleItem, ExamItem, SyllabusItem, ChatMessage, ChatSession, MockExamAttempt } from './types';
import Auth from './components/Auth';
import Chat from './pages/Chat';
import Live from './pages/Live';
import Memory from './pages/Memory';
import Profile from './pages/Profile';
import MockExams from './pages/MockExams';
import { Mic, Database, LogOut, Sparkles, ClipboardList } from 'lucide-react';

// --- Layout Component ---
const Layout: React.FC<{ children: React.ReactNode; user: UserProfile; onLogout: () => void }> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ icon: Icon, label, path }: any) => (
    <button 
      onClick={() => navigate(path)}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full group
        ${isActive(path) 
          ? 'bg-white text-black font-semibold shadow-lg shadow-white/10' 
          : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
        }`}
    >
      <Icon className={`w-5 h-5 ${isActive(path) ? 'text-black' : 'group-hover:text-edgrab-accent'}`} />
      <span className="text-sm">{label}</span>
      {isActive(path) && (
        <div className="absolute right-2 w-1.5 h-1.5 bg-edgrab-accent rounded-full animate-pulse"></div>
      )}
    </button>
  );

  const MobileNavItem = ({ icon: Icon, label, path }: any) => (
    <button 
      onClick={() => navigate(path)}
      className={`flex flex-col items-center justify-center w-full py-2 transition-colors
        ${isActive(path) ? 'text-white' : 'text-zinc-600'}`}
    >
      <div className={`p-1 rounded-xl mb-1 transition-all ${isActive(path) ? 'bg-zinc-800 text-edgrab-accent' : ''}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden font-sans selection:bg-edgrab-accent/30">
      
      {/* --- Desktop Sidebar --- */}
      <div className="hidden md:flex flex-col w-72 border-r border-zinc-900 bg-zinc-950/50 p-6 backdrop-blur-xl">
        
        {/* Spacer since Logo is removed */}
        <div className="mt-8"></div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <NavItem icon={Sparkles} label="Edtutor" path="/" />
          <NavItem icon={Mic} label="Live Session" path="/live" />
          <NavItem icon={ClipboardList} label="Mock Exams" path="/exams" />
          <NavItem icon={Database} label="Memory Bank" path="/memory" />
        </nav>

        {/* User Profile Card (Desktop) */}
        <div className="mt-auto pt-6 border-t border-zinc-900">
          <div 
            onClick={() => navigate('/profile')}
            className={`bg-zinc-900/50 border p-3 rounded-2xl flex items-center gap-3 transition-colors group cursor-pointer relative overflow-hidden ${isActive('/profile') ? 'border-white/20 bg-zinc-900' : 'border-zinc-800/50 hover:border-zinc-700'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <img 
              src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full bg-zinc-800 object-cover border border-zinc-700" 
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate text-white">{user.firstName} {user.lastName}</div>
              <div className="text-xs text-zinc-500 truncate">{user.grade} • {user.school}</div>
            </div>
            {/* Stop propagation to avoid navigating when clicking logout */}
            <button 
              onClick={(e) => { e.stopPropagation(); onLogout(); }} 
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-red-400 transition-colors z-10"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- Mobile Header --- */}
      <div className="md:hidden bg-black/80 backdrop-blur-md border-b border-zinc-900 p-4 flex items-center justify-between z-50 sticky top-0">
         <div className="flex items-center gap-2">
            {/* Minimal Mobile Branding */}
            <span className="font-bold font-serif italic text-xl">Eg</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block" onClick={() => navigate('/profile')}>
               <div className="text-xs font-bold">{user.firstName}</div>
               <div className="text-[10px] text-zinc-500">{user.grade}</div>
            </div>
            <img 
              src={user.avatar} 
              alt="User" 
              className="w-8 h-8 rounded-full border border-zinc-700"
              onClick={() => navigate('/profile')} 
            />
         </div>
      </div>

      {/* --- Main Content --- */}
      <div className="flex-1 relative overflow-hidden h-full bg-black mb-[80px] md:mb-0">
        {children}
      </div>

      {/* --- Mobile Bottom Nav --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-zinc-800 px-2 pb-safe pt-2 flex justify-around z-50 h-[80px]">
        <MobileNavItem icon={Sparkles} label="Edtutor" path="/" />
        <MobileNavItem icon={ClipboardList} label="Exams" path="/exams" />
        
        <div className="relative -top-6">
           <button 
             onClick={() => navigate('/live')}
             className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.3)] border-4 border-black transition-all
              ${isActive('/live') ? 'bg-white text-black' : 'bg-edgrab-accent text-black'}`}
           >
             <Mic className="w-6 h-6" />
           </button>
        </div>

        <MobileNavItem icon={Database} label="Memory" path="/memory" />
      </div>
    </div>
  );
};

// --- Authenticated App Wrapper to Handle User-Specific Data ---
const AuthenticatedApp: React.FC<{ user: UserProfile; onLogout: () => void; onUpdateUser: (u: UserProfile) => void }> = ({ user, onLogout, onUpdateUser }) => {
  // User-Specific Keys
  const SCHEDULE_KEY = `edgrab_schedule_${user.id}`;
  const EXAMS_KEY = `edgrab_exams_${user.id}`;
  const ATTEMPTS_KEY = `edgrab_attempts_${user.id}`;
  const OLD_CHAT_KEY = `edgrab_chat_history_${user.id}`; // Backwards compatibility
  const SESSIONS_KEY = `edgrab_sessions_${user.id}`;

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem(SCHEDULE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [exams, setExams] = useState<ExamItem[]>(() => {
    const saved = localStorage.getItem(EXAMS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [attempts, setAttempts] = useState<MockExamAttempt[]>(() => {
    const saved = localStorage.getItem(ATTEMPTS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [syllabus, setSyllabus] = useState<SyllabusItem[]>([]); 

  // --- Session Management ---
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const savedSessions = localStorage.getItem(SESSIONS_KEY);
    if (savedSessions) {
      return JSON.parse(savedSessions);
    }

    // Migration logic: If old chat history exists but no sessions, wrap it
    const oldHistory = localStorage.getItem(OLD_CHAT_KEY);
    if (oldHistory) {
      const messages = JSON.parse(oldHistory);
      if (messages.length > 0) {
        const newSession: ChatSession = {
          id: Date.now().toString(),
          title: 'Previous Conversation',
          messages: messages,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        return [newSession];
      }
    }
    return [];
  });

  // Default to the most recent session or create a blank one ID if none exist
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
     if (sessions.length > 0) return sessions[0].id;
     return null;
  });

  // Persistence
  useEffect(() => localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule)), [schedule, SCHEDULE_KEY]);
  useEffect(() => localStorage.setItem(EXAMS_KEY, JSON.stringify(exams)), [exams, EXAMS_KEY]);
  useEffect(() => localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts)), [attempts, ATTEMPTS_KEY]);
  useEffect(() => localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions)), [sessions, SESSIONS_KEY]);

  const handleAddAttempt = (attempt: MockExamAttempt) => {
    setAttempts(prev => [attempt, ...prev]);
  };

  // --- Session Actions ---

  const handleCreateSession = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (id: string) => {
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (activeSessionId === id) {
      setActiveSessionId(newSessions.length > 0 ? newSessions[0].id : null);
    }
  };

  // Helper to update messages for the active session
  // If no session exists when adding a message, create one
  const updateActiveSessionMessages = (newMessages: ChatMessage[]) => {
    if (!activeSessionId) {
      // Create new session immediately
      const newId = Date.now().toString();
      
      // Generate Title from first user message
      const firstUserMsg = newMessages.find(m => m.role === 'user');
      const title = firstUserMsg ? (firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '')) : 'New Chat';

      const newSession: ChatSession = {
        id: newId,
        title: title,
        messages: newMessages,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newId);
    } else {
      setSessions(prev => prev.map(session => {
        if (session.id === activeSessionId) {
          // Auto-update title if it's "New Chat" and we have a user message
          let title = session.title;
          if (title === 'New Chat') {
            const firstUserMsg = newMessages.find(m => m.role === 'user');
            if (firstUserMsg) {
              title = firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '');
            }
          }
          return { ...session, messages: newMessages, title, updatedAt: Date.now() };
        }
        return session;
      }));
    }
  };

  // Get Active Messages
  const activeMessages = sessions.find(s => s.id === activeSessionId)?.messages || [];

  return (
    <Router>
      <Layout user={user} onLogout={onLogout}>
        <Routes>
          <Route path="/" element={
            <Chat 
              user={user} 
              schedule={schedule} 
              exams={exams} 
              messages={activeMessages}
              updateMessages={updateActiveSessionMessages}
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={setActiveSessionId}
              onCreateSession={handleCreateSession}
              onDeleteSession={handleDeleteSession}
            />
          } />
          <Route path="/live" element={<Live user={user} schedule={schedule} exams={exams} />} />
          <Route path="/exams" element={
            <MockExams 
              exams={exams} 
              user={user} 
              attempts={attempts}
              onAddAttempt={handleAddAttempt}
            />
          } />
          <Route path="/memory" element={
            <Memory 
              schedule={schedule} setSchedule={setSchedule} 
              exams={exams} setExams={setExams}
              syllabus={syllabus} setSyllabus={setSyllabus}
            />
          } />
          <Route path="/profile" element={
            <Profile user={user} onUpdateUser={onUpdateUser} onLogout={onLogout} />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const App: React.FC = () => {
  // Auth State Management
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('edgrab_active_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  // Persistence for Active Session
  useEffect(() => {
    if (user) localStorage.setItem('edgrab_active_user', JSON.stringify(user));
    else localStorage.removeItem('edgrab_active_user');
  }, [user]);

  const handleLogin = (newUser: UserProfile) => {
    window.location.hash = '/';
    setUser(newUser);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    const dbString = localStorage.getItem('edgrab_users_db');
    if (dbString) {
      const db = JSON.parse(dbString);
      if (db[updatedUser.email.toLowerCase()]) {
        db[updatedUser.email.toLowerCase()].profile = updatedUser;
        localStorage.setItem('edgrab_users_db', JSON.stringify(db));
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return <AuthenticatedApp user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
};

export default App;
