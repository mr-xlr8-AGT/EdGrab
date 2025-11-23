import React, { useState } from 'react';
import { ScheduleItem, ExamItem, SyllabusItem } from '../types';
import { Plus, Trash2, Clock, Calendar, Save, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';

interface MemoryProps {
  schedule: ScheduleItem[];
  exams: ExamItem[];
  syllabus: SyllabusItem[];
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  setExams: React.Dispatch<React.SetStateAction<ExamItem[]>>;
  setSyllabus: React.Dispatch<React.SetStateAction<SyllabusItem[]>>;
}

const Memory: React.FC<MemoryProps> = ({ schedule, setSchedule, exams, setExams, syllabus, setSyllabus }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'exams'>('schedule');
  
  // Form States
  const [newItemSubject, setNewItemSubject] = useState('');
  const [newItemTime, setNewItemTime] = useState('');
  const [newItemDay, setNewItemDay] = useState('Monday');
  const [newItemDate, setNewItemDate] = useState('');
  const [newItemContent, setNewItemContent] = useState('');
  
  // Mobile Form Collapse State
  const [isFormOpen, setIsFormOpen] = useState(true);

  const addSchedule = () => {
    if(!newItemSubject || !newItemTime) return;
    setSchedule(prev => [...prev, { id: Date.now().toString(), day: newItemDay, time: newItemTime, subject: newItemSubject }]);
    setNewItemSubject('');
  };

  const addExam = () => {
    if(!newItemSubject || !newItemDate) return;
    setExams(prev => [...prev, { id: Date.now().toString(), date: newItemDate, subject: newItemSubject, topics: newItemContent }]);
    setNewItemSubject(''); setNewItemDate(''); setNewItemContent('');
  };

  const deleteItem = (id: string, type: 'schedule' | 'exams') => {
    if(type === 'schedule') setSchedule(prev => prev.filter(i => i.id !== id));
    if(type === 'exams') setExams(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="h-full bg-black text-white overflow-y-auto custom-scrollbar p-4 md:p-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Memory Bank</h1>
          <p className="text-zinc-400 text-sm mt-1">Teach EdGrab about your life.</p>
        </div>
        
        {/* Tabs - Full width on mobile */}
        <div className="flex w-full md:w-auto p-1 bg-zinc-900 rounded-xl md:rounded-full border border-zinc-800 shrink-0">
          <button 
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg md:rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'schedule' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            Weekly Schedule
          </button>
          <button 
            onClick={() => setActiveTab('exams')}
            className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-lg md:rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'exams' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            Upcoming Exams
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Input Column - Collapsible on Mobile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800 rounded-3xl overflow-hidden relative lg:sticky lg:top-6 transition-all">
            
            <button 
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="w-full flex items-center justify-between p-5 md:p-6 text-left lg:cursor-default"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                 <div className="w-8 h-8 rounded-full bg-edgrab-accent/10 flex items-center justify-center text-edgrab-accent">
                    <Plus className="w-5 h-5" />
                 </div>
                 Add New
              </h3>
              <div className="lg:hidden text-zinc-500">
                {isFormOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>
            
            {/* Form Content */}
            <div className={`px-5 md:px-6 pb-6 space-y-4 ${isFormOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-500 ml-2">Subject</label>
                <input 
                  placeholder="e.g. Advanced Calculus" 
                  value={newItemSubject} 
                  onChange={e => setNewItemSubject(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:border-edgrab-accent focus:ring-1 focus:ring-edgrab-accent focus:outline-none transition-all text-sm md:text-base"
                />
              </div>
              
              {activeTab === 'schedule' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 ml-2">Day of Week</label>
                    <div className="relative">
                      <select 
                        value={newItemDay} 
                        onChange={e => setNewItemDay(e.target.value)}
                        className="w-full appearance-none bg-zinc-950/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-edgrab-accent focus:ring-1 focus:ring-edgrab-accent focus:outline-none transition-all text-sm md:text-base"
                      >
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                          <option key={d} value={d} className="bg-black">{d}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 ml-2">Time</label>
                    <input 
                      type="time" 
                      value={newItemTime}
                      onChange={e => setNewItemTime(e.target.value)}
                      className="w-full bg-zinc-950/50 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:border-edgrab-accent focus:ring-1 focus:ring-edgrab-accent focus:outline-none transition-all text-sm md:text-base"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 ml-2">Exam Date</label>
                    <input 
                      type="date" 
                      value={newItemDate}
                      onChange={e => setNewItemDate(e.target.value)}
                      className="w-full bg-zinc-950/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:border-edgrab-accent focus:ring-1 focus:ring-edgrab-accent focus:outline-none transition-all text-sm md:text-base"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500 ml-2">Topics / Syllabus</label>
                    <textarea 
                      placeholder="Chapters 1-4, Algebra basics..." 
                      value={newItemContent}
                      onChange={e => setNewItemContent(e.target.value)}
                      className="w-full bg-zinc-950/50 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:border-edgrab-accent focus:ring-1 focus:ring-edgrab-accent focus:outline-none h-24 transition-all resize-none text-sm md:text-base"
                    />
                  </div>
                </>
              )}

              <button 
                onClick={activeTab === 'schedule' ? addSchedule : addExam}
                className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-white/5 active:scale-95"
              >
                <Save className="w-4 h-4" /> Save Entry
              </button>
            </div>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4 px-2">
             <h3 className="text-zinc-400 uppercase text-xs font-bold tracking-wider">
               {activeTab === 'schedule' ? 'Weekly Routine' : 'Upcoming Tests'}
             </h3>
             <div className="text-xs text-zinc-600">
               {activeTab === 'schedule' ? schedule.length : exams.length} items
             </div>
          </div>
          
          <div className="space-y-3">
            {activeTab === 'schedule' && schedule.map(item => (
              <div key={item.id} className="group flex items-center justify-between bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 p-4 md:p-5 rounded-2xl transition-all hover:bg-zinc-900/60">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-black rounded-xl border border-zinc-800 flex items-center justify-center text-blue-400 group-hover:text-blue-300 group-hover:border-blue-500/30 transition-colors">
                    <Clock className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-base md:text-lg text-white group-hover:text-blue-200 transition-colors truncate pr-2">{item.subject}</div>
                    <div className="text-xs md:text-sm text-zinc-500 flex items-center gap-2 truncate">
                       <span className="px-2 py-0.5 bg-zinc-800 rounded text-xs shrink-0 text-zinc-400">{item.day}</span>
                       <span>{item.time}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => deleteItem(item.id, 'schedule')} 
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl text-zinc-600 bg-zinc-900/50 hover:bg-red-500/20 hover:text-red-500 transition-all ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {activeTab === 'exams' && exams.map(item => (
              <div key={item.id} className="group flex items-center justify-between bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 p-4 md:p-5 rounded-2xl transition-all hover:bg-zinc-900/60">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-black rounded-xl border border-zinc-800 flex items-center justify-center text-purple-400 group-hover:text-purple-300 group-hover:border-purple-500/30 transition-colors">
                    <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-base md:text-lg text-white group-hover:text-purple-200 transition-colors truncate pr-2">{item.subject}</div>
                    <div className="text-xs md:text-sm text-zinc-500 mt-0.5 flex items-center gap-2">
                       <Calendar size={12} className="shrink-0" />
                       {item.date}
                    </div>
                    {item.topics && <div className="text-xs text-zinc-600 mt-1 truncate">{item.topics}</div>}
                  </div>
                </div>
                <button 
                  onClick={() => deleteItem(item.id, 'exams')} 
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl text-zinc-600 bg-zinc-900/50 hover:bg-red-500/20 hover:text-red-500 transition-all ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {activeTab === 'schedule' && schedule.length === 0 && (
               <div className="flex flex-col items-center justify-center py-16 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl">
                 <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-zinc-700" />
                 </div>
                 <p className="text-zinc-500 font-medium">No classes added yet.</p>
                 <p className="text-xs text-zinc-600 mt-1">Add your weekly routine to get started.</p>
               </div>
            )}
            {activeTab === 'exams' && exams.length === 0 && (
               <div className="flex flex-col items-center justify-center py-16 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl">
                 <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-3">
                    <GraduationCap className="w-6 h-6 text-zinc-700" />
                 </div>
                 <p className="text-zinc-500 font-medium">No exams coming up.</p>
                 <p className="text-xs text-zinc-600 mt-1">Enjoy your free time!</p>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Memory;