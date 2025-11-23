
import React, { useState, useMemo } from 'react';
import { ExamItem, UserProfile, MockQuestion, MockExamAttempt } from '../types';
import { generateMockExam } from '../services/geminiService';
import { FileText, Play, CheckCircle2, XCircle, ArrowRight, RotateCcw, BrainCircuit, AlertCircle, BarChart3, History, TrendingUp, Trophy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface MockExamsProps {
  exams: ExamItem[];
  user: UserProfile;
  attempts: MockExamAttempt[];
  onAddAttempt: (attempt: MockExamAttempt) => void;
}

const MockExams: React.FC<MockExamsProps> = ({ exams, user, attempts, onAddAttempt }) => {
  const [viewMode, setViewMode] = useState<'practice' | 'insights'>('practice');
  const [activeExam, setActiveExam] = useState<ExamItem | null>(null);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]); // index of selected option per question
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Analytics Data Preparation
  const stats = useMemo(() => {
    if (attempts.length === 0) return { avgScore: 0, total: 0, bestSubject: 'N/A' };
    
    const total = attempts.length;
    const avgScore = Math.round(attempts.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0) / total);
    
    const subjectCounts: Record<string, number> = {};
    attempts.forEach(a => { subjectCounts[a.subject] = (subjectCounts[a.subject] || 0) + 1; });
    const bestSubject = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1])[0][0];

    return { avgScore, total, bestSubject };
  }, [attempts]);

  const chartData = useMemo(() => {
    return [...attempts]
      .sort((a, b) => a.dateTaken - b.dateTaken)
      .slice(-10) // Last 10 attempts
      .map((a, i) => ({
        name: i + 1,
        score: Math.round((a.score / a.totalQuestions) * 100),
        subject: a.subject,
        date: new Date(a.dateTaken).toLocaleDateString()
      }));
  }, [attempts]);

  const startExam = async (exam: ExamItem) => {
    setLoading(true);
    setActiveExam(exam);
    try {
      const generatedQuestions = await generateMockExam(exam, user);
      setQuestions(generatedQuestions);
      setUserAnswers(new Array(generatedQuestions.length).fill(-1));
      setCurrentQIndex(0);
      setIsFinished(false);
    } catch (e) {
      console.error(e);
      alert("Failed to generate exam. Please try again.");
      setActiveExam(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (isFinished) return;
    const newAnswers = [...userAnswers];
    newAnswers[currentQIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      finishExam();
    }
  };

  const finishExam = () => {
    setIsFinished(true);
    if (!activeExam) return;

    // Calculate score and save attempt
    const score = userAnswers.reduce((acc, ans, idx) => acc + (ans === questions[idx].correctIndex ? 1 : 0), 0);
    
    const attempt: MockExamAttempt = {
      id: Date.now().toString(),
      examId: activeExam.id,
      subject: activeExam.subject,
      dateTaken: Date.now(),
      score: score,
      totalQuestions: questions.length
    };
    
    onAddAttempt(attempt);
  };

  const reset = () => {
    setActiveExam(null);
    setQuestions([]);
    setIsFinished(false);
    setCurrentQIndex(0);
  };

  // --- View 1: Loading ---
  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-6 animate-fade-in p-8 text-center">
        <div className="w-20 h-20 border-4 border-zinc-800 border-t-edgrab-accent rounded-full animate-spin"></div>
        <div className="space-y-2">
            <h2 className="text-2xl font-bold">Generating Mock Exam...</h2>
            <p className="text-zinc-500 max-w-md">EdGrab is analyzing your syllabus for {activeExam?.subject} and crafting specific questions.</p>
        </div>
      </div>
    );
  }

  // --- View 2: Taking Exam ---
  if (activeExam && !isFinished) {
    const currentQ = questions[currentQIndex];
    return (
      <div className="flex flex-col h-full bg-black p-6 md:p-12 max-w-4xl mx-auto">
         {/* Header / Progress */}
         <div className="flex justify-between items-center mb-8">
            <div>
               <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{activeExam.subject}</h2>
               <div className="text-xs text-zinc-600 mt-1">Question {currentQIndex + 1} of {questions.length}</div>
            </div>
            <button onClick={reset} className="text-zinc-500 hover:text-white transition-colors">
               <XCircle size={24} />
            </button>
         </div>

         {/* Progress Bar */}
         <div className="w-full h-1 bg-zinc-900 rounded-full mb-10 overflow-hidden">
            <div 
              className="h-full bg-edgrab-accent transition-all duration-500 ease-out" 
              style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
            ></div>
         </div>

         {/* Question */}
         <div className="flex-1 overflow-y-auto custom-scrollbar">
            <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-8 animate-slide-up">
              <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                     p: ({children}) => <span>{children}</span>,
                     code: ({children}) => <code className="bg-zinc-800 px-1 py-0.5 rounded text-sm">{children}</code>
                  }}
              >
                 {currentQ.question}
              </ReactMarkdown>
            </h3>

            <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
               {currentQ.options.map((opt, idx) => (
                 <button
                   key={idx}
                   onClick={() => handleAnswer(idx)}
                   className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 group relative overflow-hidden
                      ${userAnswers[currentQIndex] === idx 
                         ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                         : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600'
                      }`}
                 >
                   <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold transition-colors
                         ${userAnswers[currentQIndex] === idx ? 'border-black text-black' : 'border-zinc-600 text-zinc-500 group-hover:border-zinc-400 group-hover:text-zinc-300'}`}>
                         {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="font-medium text-lg">{opt}</span>
                   </div>
                 </button>
               ))}
            </div>
         </div>

         {/* Footer */}
         <div className="mt-8 pt-6 border-t border-zinc-900 flex justify-end">
            <button 
               onClick={nextQuestion}
               disabled={userAnswers[currentQIndex] === -1}
               className="px-8 py-4 bg-edgrab-accent text-black rounded-full font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.2)]"
            >
               {currentQIndex === questions.length - 1 ? 'Finish' : 'Next'} <ArrowRight size={20} />
            </button>
         </div>
      </div>
    );
  }

  // --- View 3: Results ---
  if (isFinished) {
    const score = userAnswers.reduce((acc, ans, idx) => acc + (ans === questions[idx].correctIndex ? 1 : 0), 0);
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="p-6 md:p-8 bg-black h-full text-white pb-32 overflow-y-auto custom-scrollbar animate-fade-in">
         <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
               <div className="inline-block p-4 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
                  <span className={`text-4xl font-bold ${percentage >= 70 ? 'text-green-400' : 'text-orange-400'}`}>{percentage}%</span>
               </div>
               <h2 className="text-2xl font-bold">Practice Complete</h2>
               <p className="text-zinc-500">You got {score} out of {questions.length} correct.</p>
               <div className="mt-2 text-xs text-zinc-600">Result saved to Insights.</div>
            </div>

            <div className="space-y-6">
               {questions.map((q, idx) => {
                  const isCorrect = userAnswers[idx] === q.correctIndex;
                  return (
                    <div key={q.id} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                       <div className="flex items-start gap-3 mb-3">
                          {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                          <div>
                             <p className="font-medium text-lg">{q.question}</p>
                          </div>
                       </div>
                       
                       <div className="ml-8 space-y-2">
                          <div className="text-sm">
                             <span className="text-zinc-500">Your Answer: </span>
                             <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>{q.options[userAnswers[idx]] || 'Skipped'}</span>
                          </div>
                          {!isCorrect && (
                             <div className="text-sm">
                                <span className="text-zinc-500">Correct Answer: </span>
                                <span className="text-green-400">{q.options[q.correctIndex]}</span>
                             </div>
                          )}
                          <div className="mt-3 p-3 bg-black/40 rounded-lg text-sm text-zinc-400 border border-zinc-800/50">
                             <span className="font-bold text-zinc-500 uppercase text-xs block mb-1">Explanation</span>
                             {q.explanation}
                          </div>
                       </div>
                    </div>
                  );
               })}
            </div>

            <div className="mt-8 text-center">
               <button onClick={reset} className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-colors inline-flex items-center gap-2">
                  <RotateCcw size={18} /> Back to Exams
               </button>
            </div>
         </div>
      </div>
    );
  }

  // --- View 4: Dashboard (Tabs) ---
  return (
    <div className="p-6 md:p-8 bg-black h-full text-white pb-32 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mock Exams</h1>
          <p className="text-zinc-400 text-sm mt-1">Practice for your upcoming exams.</p>
        </div>
        
        {/* View Toggles */}
        <div className="flex p-1 bg-zinc-900 rounded-full border border-zinc-800">
          <button 
            onClick={() => setViewMode('practice')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${viewMode === 'practice' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            <BrainCircuit size={16} /> Practice
          </button>
          <button 
            onClick={() => setViewMode('insights')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${viewMode === 'insights' ? 'bg-white text-black shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            <BarChart3 size={16} /> Insights
          </button>
        </div>
      </div>

      {viewMode === 'practice' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {exams.map((exam) => (
            <div key={exam.id} className="group bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-900 transition-all hover:border-zinc-700 flex flex-col justify-between h-[220px]">
               <div>
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-10 h-10 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-edgrab-accent">
                        <FileText size={20} />
                     </div>
                     <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded-md">{exam.date}</span>
                  </div>
                  <h3 className="text-xl font-bold truncate mb-1">{exam.subject}</h3>
                  <p className="text-sm text-zinc-500 line-clamp-2">{exam.topics || "General Review"}</p>
               </div>
               
               <button 
                 onClick={() => startExam(exam)}
                 className="w-full mt-4 py-3 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors opacity-90 hover:opacity-100"
               >
                 <Play size={16} fill="currentColor" /> Start Practice
               </button>
            </div>
          ))}
          
          {exams.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
               <AlertCircle className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
               <p className="text-zinc-500">No exams found in Memory.</p>
               <p className="text-xs text-zinc-600 mt-1">Add an exam in the Memory tab to generate practice tests.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
           {/* Insights View */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Stat Cards */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between h-[150px]">
                 <div className="flex items-start justify-between">
                    <div>
                       <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Exams</div>
                       <div className="text-4xl font-bold text-white mt-2">{stats.total}</div>
                    </div>
                    <div className="p-2 bg-zinc-800 rounded-full text-zinc-400"><History size={20} /></div>
                 </div>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between h-[150px]">
                 <div className="flex items-start justify-between">
                    <div>
                       <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Avg. Score</div>
                       <div className="text-4xl font-bold text-white mt-2">{stats.avgScore}%</div>
                    </div>
                    <div className="p-2 bg-zinc-800 rounded-full text-zinc-400"><TrendingUp size={20} /></div>
                 </div>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between h-[150px]">
                 <div className="flex items-start justify-between">
                    <div>
                       <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Top Subject</div>
                       <div className="text-xl font-bold text-white mt-2 truncate">{stats.bestSubject}</div>
                    </div>
                    <div className="p-2 bg-zinc-800 rounded-full text-zinc-400"><Trophy size={20} /></div>
                 </div>
              </div>
           </div>

           {/* Chart Section */}
           <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6">
              <h3 className="text-lg font-bold mb-6">Performance Trend</h3>
              <div className="h-[250px] w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="name" hide />
                      <YAxis stroke="#52525b" fontSize={12} tickFormatter={(v) => `${v}%`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ display: 'none' }}
                        formatter={(value: any, name: any, props: any) => [`${value}%`, props.payload.subject]}
                      />
                      <Area type="monotone" dataKey="score" stroke="#00D4FF" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-zinc-600">
                    No data available. Take a test to see your analytics.
                  </div>
                )}
              </div>
           </div>

           {/* Detailed List */}
           <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6">
             <h3 className="text-lg font-bold mb-4">Attempt History</h3>
             <div className="space-y-2">
               {[...attempts].reverse().map((attempt) => {
                 const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                 return (
                   <div key={attempt.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-zinc-800/30 transition-colors border border-transparent hover:border-zinc-800">
                      <div>
                        <div className="font-bold text-white">{attempt.subject}</div>
                        <div className="text-xs text-zinc-500">{new Date(attempt.dateTaken).toLocaleDateString()} • {new Date(attempt.dateTaken).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="text-right">
                           <div className={`text-lg font-bold ${percentage >= 70 ? 'text-green-400' : 'text-orange-400'}`}>{percentage}%</div>
                           <div className="text-[10px] text-zinc-500">{attempt.score}/{attempt.totalQuestions}</div>
                         </div>
                      </div>
                   </div>
                 );
               })}
               {attempts.length === 0 && (
                 <div className="text-center py-8 text-zinc-600 text-sm">No attempts yet.</div>
               )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MockExams;
