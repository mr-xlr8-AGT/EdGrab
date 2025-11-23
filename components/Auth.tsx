import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Mail, ArrowRight, School, GraduationCap, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      const dbString = localStorage.getItem('edgrab_users_db');
      const db = dbString ? JSON.parse(dbString) : {};

      if (isLoginMode) {
        // LOGIN LOGIC
        const userRecord = db[email.toLowerCase()];
        if (userRecord && userRecord.password === password) {
          onLogin(userRecord.profile);
        } else {
          setError('Invalid email or password.');
          setLoading(false);
        }
      } else {
        // SIGNUP LOGIC
        if (db[email.toLowerCase()]) {
          setError('User already exists. Please log in.');
          setLoading(false);
          return;
        }

        const newUser: UserProfile = {
          id: Date.now().toString(),
          firstName: firstName || 'Student',
          lastName: lastName || '',
          email,
          school: school || 'EdGrab Academy',
          grade: grade || '10th Grade',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`
        };

        // Save to "DB"
        db[email.toLowerCase()] = {
          password: password, // In a real app, never store plain passwords
          profile: newUser
        };
        localStorage.setItem('edgrab_users_db', JSON.stringify(db));
        
        onLogin(newUser);
      }
    }, 1500);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setFirstName('');
    setLastName('');
    setSchool('');
    setGrade('');
    setPassword('');
    setShowPassword(false);
  };

  return (
    <div className="flex min-h-screen bg-black text-white relative overflow-hidden font-sans">
       {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-edgrab-accent/10 rounded-full blur-[150px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-edgrab-secondary/10 rounded-full blur-[150px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center p-6 gap-12 z-10">
        
        {/* Left Side: Brand */}
        <div className="flex-1 text-center md:text-left space-y-6">
           <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase animate-pulse">
             GRAB KNOWLEDGE • UNLOCK SUCCESS
           </p>
           <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-zinc-800 to-black rounded-2xl border border-zinc-700 shadow-[0_0_40px_rgba(255,255,255,0.1)] mb-4">
             <span className="font-serif text-4xl italic bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Eg</span>
           </div>
           <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
             Ed<span className="text-transparent bg-clip-text bg-gradient-to-r from-edgrab-accent to-edgrab-secondary">Grab</span>
           </h1>
           <p className="text-xl text-zinc-400 max-w-md leading-relaxed">
             Your personalized AI tutor. Master your syllabus, schedule your success, and never forget a thing.
           </p>
        </div>

        {/* Right Side: Auth Card */}
        <div className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-edgrab-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-bold">{isLoginMode ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-zinc-500 text-sm mt-1">
              {isLoginMode ? 'Enter your credentials to access your tutor.' : 'Start your personalized learning journey.'}
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500 ml-1">First Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-edgrab-accent transition-colors" />
                    <input 
                      type="text" 
                      required={!isLoginMode}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-edgrab-accent focus:ring-1 focus:ring-edgrab-accent transition-all"
                      placeholder="Alex"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500 ml-1">Last Name</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      required={!isLoginMode}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-edgrab-accent focus:ring-1 focus:ring-edgrab-accent transition-all"
                      placeholder="Morgan"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-500 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-edgrab-accent transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-zinc-700 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-edgrab-accent focus:ring-1 focus:ring-edgrab-accent transition-all"
                  placeholder="student@school.edu"
                />
              </div>
            </div>

            {!isLoginMode && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500 ml-1">School/College Name</label>
                  <div className="relative group">
                    <School className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-edgrab-accent transition-colors" />
                    <input 
                      type="text" 
                      required={!isLoginMode}
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-edgrab-accent focus:ring-1 focus:ring-edgrab-accent transition-all"
                      placeholder="Lincoln High School"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-500 ml-1">Grade / Year</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-edgrab-accent transition-colors" />
                    <input 
                      type="text" 
                      required={!isLoginMode}
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full bg-black/40 border border-zinc-700 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:border-edgrab-accent focus:ring-1 focus:ring-edgrab-accent transition-all"
                      placeholder="10th Grade"
                    />
                  </div>
                </div>
              </>
            )}
            
             <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500 group-focus-within:text-edgrab-accent transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-zinc-700 rounded-xl py-2.5 pl-9 pr-10 text-sm focus:outline-none focus:border-edgrab-accent focus:ring-1 focus:ring-edgrab-accent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-zinc-500 hover:text-white transition-colors"
                    tabIndex={-1} 
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-edgrab-accent to-edgrab-secondary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 shadow-[0_0_20px_rgba(157,78,221,0.3)]"
            >
              {isLoginMode ? (
                <>Log In <LogIn className="h-4 w-4" /></>
              ) : (
                <>Get Started <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={toggleMode}
              className="text-sm text-zinc-500 hover:text-white transition-colors underline decoration-zinc-700 underline-offset-4"
            >
              {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;