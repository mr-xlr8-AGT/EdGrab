import React, { useEffect, useRef, useState } from 'react';
import { LiveServerMessage } from '@google/genai';
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from '../services/audioUtils';
import { connectLiveSession } from '../services/geminiService';
import { Mic, MicOff, X, Radio, Volume2, Loader, Activity } from 'lucide-react';
import { UserProfile, ScheduleItem, ExamItem } from '../types';

interface LiveProps {
  user: UserProfile;
  schedule: ScheduleItem[];
  exams: ExamItem[];
}

const Live: React.FC<LiveProps> = ({ user, schedule, exams }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0); // Visualizer value
  
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setIsConnected(false);
  };

  const connect = async () => {
    try {
      // Setup Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      const outputNode = outputAudioContextRef.current.createGain();
      outputNode.connect(outputAudioContextRef.current.destination);

      // Get Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect via Service Layer (No API Key in Component)
      const sessionPromise = connectLiveSession(user, exams, {
        onopen: () => {
            setIsConnected(true);
            if (!inputAudioContextRef.current) return;
            
            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
                if (isMuted) return; 
                const inputData = e.inputBuffer.getChannelData(0);
                
                // Visualizer math
                let sum = 0;
                for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
                const rms = Math.sqrt(sum / inputData.length);
                setVolume(rms * 5); // Amplify for visual

                const pcmBlob = createPcmBlob(inputData);
                sessionPromise.then(session => {
                    session.sendRealtimeInput({ media: pcmBlob });
                });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
                const ctx = outputAudioContextRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                const audioBuffer = await decodeAudioData(
                    base64ToUint8Array(base64Audio),
                    ctx,
                    24000,
                    1
                );
                
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNode);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                
                sourcesRef.current.add(source);
                source.onended = () => sourcesRef.current.delete(source);
            }
            
            if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
            }
        },
        onclose: () => {
            console.log("Live session closed");
            setIsConnected(false);
        },
        onerror: (err: any) => {
            console.error("Live session error", err);
            setIsConnected(false);
            alert("Connection Error. Please check your internet.");
        }
      });
      
      sessionPromiseRef.current = sessionPromise;

    } catch (error) {
      console.error("Failed to connect live session", error);
      alert("Failed to connect. Ensure your API Key is valid.");
      cleanup();
    }
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  return (
    <div className="flex flex-col h-full bg-black p-6 relative overflow-hidden">
       {/* Glow Effects */}
       <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-1000 ${isConnected ? 'bg-edgrab-accent/20' : 'bg-zinc-900/0'}`}></div>
       
       {/* Connection Status Overlay */}
       <div className="absolute top-6 right-6 z-20">
         <div className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-colors ${isConnected ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}`}>
           <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-zinc-600'}`}></div>
           <span className="text-xs font-bold uppercase tracking-wider">{isConnected ? 'Live Connected' : 'Offline'}</span>
         </div>
       </div>

       <div className="z-10 flex flex-col items-center justify-center h-full space-y-16">
          <div className="text-center space-y-2">
             <div className="inline-block p-3 bg-zinc-900 rounded-2xl border border-zinc-800 mb-4 shadow-xl">
                <Activity className={`w-8 h-8 ${isConnected ? 'text-edgrab-accent animate-pulse' : 'text-zinc-600'}`} />
             </div>
             <h2 className="text-4xl font-bold text-white tracking-tight">Live Tutor</h2>
             <p className="text-zinc-400 text-lg">Real-time voice conversation with EdGrab.</p>
          </div>

          {/* Visualizer */}
          <div className="relative w-64 h-64 flex items-center justify-center">
             {/* Ripple Waves */}
             {[1, 2, 3].map((i) => (
               <div 
                 key={i}
                 className={`absolute rounded-full border border-edgrab-accent/30 transition-all duration-75 ease-out`}
                 style={{ 
                   width: '100%', 
                   height: '100%',
                   transform: `scale(${1 + (volume * i * 0.5)})`, 
                   opacity: Math.max(0, 0.5 - volume),
                   borderWidth: isConnected ? '1px' : '0px'
                 }}
               ></div>
             ))}
             
             {/* Center Button Area */}
             <div className="relative z-10 w-40 h-40 rounded-full bg-gradient-to-b from-zinc-800 to-black border border-zinc-700 flex items-center justify-center shadow-2xl">
                {isConnected ? (
                   <Volume2 className="w-16 h-16 text-edgrab-accent" style={{ transform: `scale(${1 + volume * 0.5})` }} />
                ) : (
                   <Radio className="w-16 h-16 text-zinc-700" />
                )}
             </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-8">
             {!isConnected ? (
                <button 
                  onClick={connect}
                  className="group relative bg-white text-black px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                   <span className="flex items-center gap-3">
                     <Mic className="w-5 h-5" /> Start Session
                   </span>
                </button>
             ) : (
                <>
                   <button 
                     onClick={() => setIsMuted(!isMuted)}
                     className={`p-5 rounded-full border transition-all duration-300 ${isMuted ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 hover:border-white'}`}
                   >
                      {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                   </button>
                   <button 
                     onClick={cleanup}
                     className="bg-red-600 text-white px-8 py-5 rounded-full font-bold text-lg hover:bg-red-700 transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center gap-2"
                   >
                      <X className="w-5 h-5" /> End Call
                   </button>
                </>
             )}
          </div>
          
          {isConnected && (
             <p className="text-zinc-500 text-xs font-mono animate-pulse">Listening...</p>
          )}
       </div>
    </div>
  );
};

export default Live;