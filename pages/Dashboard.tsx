import React from 'react';
import { UserProfile, ScheduleItem, ExamItem } from '../types';
import { Clock, Calendar, Zap, Trophy, Activity, ArrowUpRight, BookOpen, Target, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface DashboardProps {
  user: UserProfile;
  schedule: ScheduleItem[];
  exams: ExamItem[];
  onNavigate: (tab: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, schedule, exams, onNavigate }) => {
  // Minimalist Data for charts
  const masteryData = [
    { name: 'Math', value: 400, color: '#fff' },
    { name: 'Sci', value: 300, color: '#333' },
    { name: 'Hist', value: 200, color: '#666' },
    { name: 'Eng', value: 100, color: '#222' },
  ];

  const weeklyActivity = [
    { day: 'M', hours: 4 },
    { day: 'T', hours: 6 },
    { day: 'W', hours: 3 },
    { day: 'T', hours: 7 },
    { day: 'F', hours: 5 },
    { day: 'S', hours: 2 },
    { day: 'S', hours: 1 },
  ];

  const nextClass = schedule.length > 0 ? schedule[0] : null;

  return (
    <div className="min-h-full bg-black text-white p-8 pb-32 overflow-y-auto custom-scrollbar font-sans selection:bg-white/20">
      
      {/* --- Hero Section: Centered Branding & Welcome --- */}
      <div className="flex flex-col items-center justify-center py-16 space-y-8 animate-fade-in">
        
        {/* Logo Construction */}
        <div className="relative group cursor-default">
          <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
          <div className="relative w-28 h-28 bg-black rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.05)] z-10 transition-transform duration-500 group-hover:scale-105">
             <div className="flex flex-col items-center leading-none mt-2">
               <span className="font-serif text-4xl italic text-white tracking-tighter">Ed<span className="font-serif not-italic">Grab</span></span>
               <div className="w-8 h-[1px] bg-white/30 mt-1"></div>
             </div>
          </div>
        </div>
        
        {/* Welcome Text */}
        <div className="text-center space-y-3 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">{user.firstName}</span>
          </h1>
          <p className="text-zinc-500 text-lg font-light tracking-wide">
            Your personal intelligence engine is online.
          </p>
        </div>

        {/* Quick Action Pill */}
        <div className="flex gap-4 mt-4">
            <button 
              onClick={() => onNavigate('chat')}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium text-sm hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
               <Zap size={16} className="fill-black" /> Quick Session
            </button>
            <button 
              onClick={() => onNavigate('memory')}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-full font-medium text-sm hover:bg-zinc-800 hover:text-white transition-all"
            >
               <Calendar size={16} /> Schedule
            </button>
        </div>
      </div>

      {/* --- Dashboard Grid --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Stats & Context (4 cols) */}
        <div className="md:col-span-4 space-y-6">
            
            {/* Next Class Card (Premium Minimal) */}
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Clock size={80} className="text-white" />
               </div>
               <div className="relative z-10">
                 <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Up Next</div>
                 {nextClass ? (
                   <>
                     <div className="text-3xl font-bold text-white mb-1">{nextClass.subject}</div>
                     <div className="text-zinc-400 font-mono text-sm">{nextClass.time} • {nextClass.day}</div>
                     <div className="mt-6 inline-flex items-center gap-2 text-xs text-white font-bold border-b border-white/20 pb-0.5">
                        View Materials <ArrowUpRight size={12} />
                     </div>
                   </>
                 ) : (
                   <>
                     <div className="text-2xl font-bold text-zinc-300">Free Time</div>
                     <div className="text-zinc-500 text-sm mt-1">No classes scheduled.</div>
                   </>
                 )}
               </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 flex flex-col justify-between min-h-[140px] hover:border-white/20 transition-colors">
                  <div className="p-2 bg-white/5 w-fit rounded-full text-white"><Target size={18} /></div>
                  <div>
                     <div className="text-3xl font-bold text-white">{exams.length}</div>
                     <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Exams</div>
                  </div>
               </div>
               <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 flex flex-col justify-between min-h-[140px] hover:border-white/20 transition-colors relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 w-16 h-1 bg-gradient-to-r from-transparent to-white"></div>
                  <div className="p-2 bg-white/5 w-fit rounded-full text-white"><Activity size={18} /></div>
                  <div>
                     <div className="text-3xl font-bold text-white">5<span className="text-lg text-zinc-500 font-normal ml-1">day</span></div>
                     <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Streak</div>
                  </div>
               </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6">
               <div className="flex justify-between items-center mb-6">
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Activity</div>
                  <div className="text-xs text-white font-mono">Total: 28h</div>
               </div>
               <div className="h-[120px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={weeklyActivity}>
                     <Bar 
                        dataKey="hours" 
                        fill="#fff" 
                        radius={[4, 4, 4, 4]} 
                        barSize={4}
                        className="hover:opacity-80 transition-opacity"
                      />
                      <Tooltip 
                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }}
                      />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
        </div>

        {/* Right Column: Content & Mastery (8 cols) */}
        <div className="md:col-span-8 grid grid-cols-1 gap-6 content-start">
            
            {/* Schedule / Content List */}
            <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 min-h-[400px]">
               <div className="flex justify-between items-baseline mb-8">
                  <h3 className="text-xl font-bold text-white">Schedule</h3>
                  <button onClick={() => onNavigate('memory')} className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                    Manage <ChevronRight size={12} />
                  </button>
               </div>

               <div className="space-y-2">
                  {schedule.slice(0, 5).map((item, idx) => (
                    <div key={item.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-zinc-600 transition-all font-bold text-lg">
                              {item.subject.charAt(0)}
                           </div>
                           <div>
                              <div className="font-bold text-white text-base">{item.subject}</div>
                              <div className="text-zinc-500 text-xs mt-0.5 flex items-center gap-2">
                                 <span className="uppercase tracking-wider">{item.day}</span>
                                 <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                                 <span>{item.time}</span>
                              </div>
                           </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="p-2 rounded-full bg-white text-black">
                              <ArrowUpRight size={16} />
                           </div>
                        </div>
                    </div>
                  ))}
                  {schedule.length === 0 && (
                     <div className="h-full flex flex-col items-center justify-center text-zinc-600 py-10">
                        <Calendar size={40} strokeWidth={1} className="mb-4 opacity-50" />
                        <p>Your timeline is empty.</p>
                     </div>
                  )}
               </div>
            </div>

            {/* Mastery Section Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-zinc-950 border border-white/10 rounded-3xl p-6 flex flex-col">
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Mastery</div>
                  <div className="flex-1 flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie
                            data={masteryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                          >
                            {masteryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="text-center">
                            <div className="text-2xl font-bold text-white">88%</div>
                         </div>
                      </div>
                  </div>
               </div>

               <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                   <div className="relative z-10 h-full flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Goal</div>
                        <h4 className="text-2xl font-bold text-white leading-tight">Finish Calculus<br/>Chapter 4</h4>
                      </div>
                      <div className="mt-4">
                         <div className="flex justify-between text-xs text-zinc-400 mb-2">
                            <span>Progress</span>
                            <span>75%</span>
                         </div>
                         <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-white w-3/4 rounded-full"></div>
                         </div>
                      </div>
                   </div>
               </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;