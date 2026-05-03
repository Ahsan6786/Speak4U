"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutGrid, Mic, Camera, StopCircle, RefreshCw, 
  ChevronRight, ArrowLeft, Flame, Sparkles, Brain,
  MessageSquare, Trash2, Save, Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { detectFillers, FillerCounts } from "@/lib/filler-detector";
import { computeSessionAnalytics } from "@/lib/session-analytics";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function MirrorClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { 
    isRecording, transcript, audioBlob, startRecording, stopRecording, clearTranscript 
  } = useVoiceRecorder();

  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // App State
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [realTimeFillers, setRealTimeFillers] = useState<FillerCounts | null>(null);
  const [lastFiller, setLastFiller] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);

  // Initialize Camera
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false // useVoiceRecorder handles audio
      });
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Camera access denied. Please check your permissions.");
    }
  }, []);

  // Set video source when active
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraActive]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function init() {
      if (!authLoading && !user) {
        router.push("/");
        return;
      }

      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" },
          audio: false 
        });
        activeStream = stream;
        streamRef.current = stream;
        setCameraActive(true);
      } catch (err) {
        console.error("Camera access error:", err);
        setCameraError("Camera access denied. Please check your permissions.");
      }
    }

    init();

    return () => {
      setCameraActive(false);
      if (activeStream) {
        activeStream.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.load();
      }
    };
  }, [user, authLoading, router]);

  // Real-time Filler Detection
  useEffect(() => {
    if (isRecording && transcript) {
      const fillers = detectFillers(transcript);
      setRealTimeFillers(fillers);
      
      // Detect new fillers for a quick alert
      const lastWord = transcript.trim().split(" ").pop()?.toLowerCase();
      if (lastWord && ["umm", "uh", "like", "basically", "matlab"].includes(lastWord)) {
        setLastFiller(lastWord);
        setTimeout(() => setLastFiller(null), 2000);
      }
    }
  }, [isRecording, transcript]);

  // Session Management
  const handleStart = () => {
    setCountdown(3);
    setFeedback(null);
    setIsSaved(false);
    clearTranscript();
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      startRecording();
      
      // Take snapshot after 5 seconds of speaking
      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          const canvas = document.createElement("canvas");
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);
            setSnapshot(canvas.toDataURL("image/jpeg", 0.7));
          }
        }
      }, 5000);
    }
  }, [countdown, startRecording]);

  const handleStop = async () => {
    stopRecording();
    // Auto-analyze after short delay
    setTimeout(() => analyzeSpeech(), 500);
  };

  const analyzeSpeech = async () => {
    if (!transcript) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          prompt: "Mirror Mode Practice",
          brutalMode: false,
          imageData: snapshot
        })
      });
      const data = await res.json();
      setFeedback(data);
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveSession = async () => {
    if (!user || !transcript || !feedback || isSaved) return;
    
    try {
      const analytics = computeSessionAnalytics(transcript, 60);
      await addDoc(collection(db, "users", user.uid, "sessions"), {
        mode: "mirror",
        prompt: "Mirror Mode Session",
        transcript,
        feedback,
        timestamp: serverTimestamp(),
        scores: {
          confidence_score: feedback.confidence_score ?? 0,
          clarity_score: feedback.clarity_score ?? 0,
          fluency_score: feedback.fluency_score ?? 0,
          tone_score: feedback.tone_score ?? 0,
        },
        fillers: analytics.fillers,
        meta: analytics.meta,
      });
      setIsSaved(true);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // Rendering
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col">
      
      {/* Header */}
      <nav className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-zinc-800 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Training Mode</p>
            <h1 className="text-xl font-black italic tracking-tighter uppercase">Mirror Mode</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isRecording && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Recording</span>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 grid lg:grid-cols-2 overflow-hidden relative">
        
        {/* Left Panel: Camera View */}
        <div className="relative bg-zinc-900 flex items-center justify-center border-r border-white/5 overflow-hidden min-h-[40vh] lg:min-h-0">
          {cameraActive ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" 
            />
          ) : (
            <div className="text-center space-y-4">
              <Camera size={48} className="mx-auto text-zinc-700" />
              <p className="text-zinc-500 font-bold">{cameraError || "Initializing Camera..."}</p>
              {cameraError && (
                <button onClick={startCamera} className="px-6 py-2 rounded-full bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all">
                  Retry Camera
                </button>
              )}
            </div>
          )}

          {/* Overlays */}
          <div className="absolute inset-0 border-[32px] border-black/40 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[80%] h-[80%] border-2 border-white/10 rounded-[3rem] border-dashed" />
          </div>

          {/* Real-time Alerts */}
          <AnimatePresence>
            {lastFiller && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute top-1/4 left-1/2 -translate-x-1/2 px-8 py-4 rounded-3xl bg-red-500 text-white font-black italic text-2xl shadow-2xl z-50 uppercase tracking-tighter"
              >
                {lastFiller}!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Countdown */}
          <AnimatePresence>
            {countdown !== null && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/60 z-50"
              >
                <span className="text-[12rem] font-black italic tracking-tighter text-white">
                  {countdown === 0 ? "GO!" : countdown}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel: Feedback & Analysis */}
        <div className="relative bg-black flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            
            {/* Prompt / Instructions */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Training Prompt</h2>
              <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20">
                <p className="text-xl font-bold italic leading-relaxed text-zinc-300">
                  "Introduce yourself to the world. Speak for at least <span className="text-primary">60 seconds</span>. Don't hesitate, don't overthink—just speak your truth. Take your time, we're listening."
                </p>
              </div>
            </div>

            {/* Real-time Transcript */}
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Live Transcript</h2>
              <p className={cn(
                "text-2xl md:text-3xl font-bold tracking-tight leading-relaxed italic",
                transcript ? "text-white" : "text-zinc-800"
              )}>
                {transcript || "Your voice will be visualized here as you speak..."}
              </p>
            </div>

            {/* AI Analysis View */}
            <AnimatePresence>
              {feedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 pb-32"
                >
                  <div className="h-[1px] bg-white/5 w-full" />
                  
                  {/* Scores Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Confidence</p>
                      <p className="text-4xl font-black italic text-primary">{feedback.confidence_score}%</p>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2">Clarity</p>
                      <p className="text-4xl font-black italic text-emerald-500">{feedback.clarity_score}%</p>
                    </div>
                  </div>

                  {/* Expression Analysis - NEW */}
                  <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/20 space-y-4">
                    <div className="flex items-center gap-3">
                      <Camera size={20} className="text-primary" />
                      <h3 className="font-black italic uppercase tracking-tighter text-xl">Visual Feedback</h3>
                    </div>
                    <p className="text-zinc-300 font-medium text-lg leading-relaxed italic">
                      "{feedback.expression_analysis || "No visual data captured."}"
                    </p>
                  </div>

                  {/* Feedback Summary */}
                  <div className="p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                      <Brain size={20} className="text-primary" />
                      <h3 className="font-black italic uppercase tracking-tighter text-xl">Coach Feedback</h3>
                    </div>
                    <p className="text-zinc-400 font-medium text-lg leading-relaxed">{feedback.feedback_summary}</p>
                  </div>

                  {/* Mistakes & Tips */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Mistakes</h4>
                      <div className="space-y-2">
                        {feedback.mistakes.map((m: string, i: number) => (
                          <div key={i} className="flex gap-3 text-sm text-zinc-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Tips</h4>
                      <div className="space-y-2">
                        {feedback.improvement_tips.map((t: string, i: number) => (
                          <div key={i} className="flex gap-3 text-sm text-zinc-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State / Loading */}
            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <RefreshCw size={48} className="text-primary animate-spin" />
                <p className="text-xl font-black italic uppercase tracking-tighter">Analyzing your performance...</p>
              </div>
            )}
          </div>
          
          {/* Bottom Controls */}
          <div className="p-8 bg-black/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-center gap-6">
            {!isRecording ? (
              <button 
                onClick={handleStart}
                className="px-12 py-5 rounded-full bg-white text-black font-black text-sm uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95"
              >
                <Mic size={20} /> START RECORDING
              </button>
            ) : (
              <button 
                onClick={handleStop}
                className="px-12 py-5 rounded-full bg-red-500 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-red-600 transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(239,68,68,0.2)] active:scale-95"
              >
                <StopCircle size={20} /> STOP RECORDING
              </button>
            )}

            {feedback && !isSaved && (
              <button 
                onClick={saveSession}
                className="px-10 py-5 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
              >
                <Save size={20} /> SAVE SESSION
              </button>
            )}

            {isSaved && (
              <div className="flex items-center gap-3 text-emerald-500 font-black italic uppercase tracking-widest text-xs px-8 py-5 border border-emerald-500/20 rounded-full">
                <Sparkles size={16} /> SESSION SAVED
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
