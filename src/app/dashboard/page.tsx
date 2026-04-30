"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, StopCircle, RotateCcw, ArrowRight, Timer, Brain, Flame, Sparkles, ChevronRight, History, Calendar, Play, MessageSquare, Trash2, LayoutGrid } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, onSnapshot, collection, query, orderBy, limit, deleteDoc } from "firebase/firestore";
import { Onboarding } from "@/components/onboarding";

const DAILY_PROMPTS = [
  "Introduce yourself confidently to a potential employer.",
  "Explain a complex project you built in simple terms.",
  "Why are you the best fit for your dream role?",
  "Describe a situation where you showed leadership.",
  "How do you handle high-pressure environments?",
  "What is your biggest professional achievement so far?",
];

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isRecording, transcript, startRecording, stopRecording, audioBlob, requestPermission } = useVoiceRecorder();
  const [timeLeft, setTimeLeft] = useState(60);
  const [prompt, setPrompt] = useState("");
  const [streak, setStreak] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userName, setUserName] = useState("");
  const [view, setView] = useState<"history" | "practice">("history");
  const [sessions, setSessions] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNewQuestion = async () => {
    try {
      const history = JSON.parse(sessionStorage.getItem("question_history") || "[]");
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history }),
      });
      const data = await response.json();
      setPrompt(data.question);
      
      // Update history (keep last 5)
      const newHistory = [data.question, ...history].slice(0, 5);
      sessionStorage.setItem("question_history", JSON.stringify(newHistory));
    } catch (err) {
      console.error("Failed to fetch question:", err);
      setPrompt("Describe a challenge you overcame recently.");
    }
  };

  const startPractice = async () => {
    const granted = await requestPermission();
    if (granted) {
      setView("practice");
      await fetchNewQuestion();
    } else {
      alert("Microphone access is required to practice. Please enable it in your browser settings.");
    }
  };

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      startPractice();
    }
  }, [searchParams]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/");
      return;
    }
    
    // Initial prompt if needed
    if (!prompt) fetchNewQuestion();
    
    // Listen to user data from Firestore
    const userDocRef = doc(db, "users", user.uid);
    const unsubUser = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setStreak(data.streak || 0);
        setUserName(data.name || "");
        setShowOnboarding(!data.onboarded);
      } else {
        setDoc(userDocRef, { streak: 0, onboarded: false }, { merge: true });
        setShowOnboarding(true);
      }
    });

    // Listen to History
    const sessionsRef = collection(db, "users", user.uid, "sessions");
    const q = query(sessionsRef, orderBy("timestamp", "desc"), limit(10));
    const unsubHistory = onSnapshot(q, (snapshot) => {
      setSessions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubUser();
      unsubHistory();
    };
  }, [user, authLoading, router]);

  useEffect(() => {
    if (isRecording && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 || !isRecording) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeLeft === 0 && isRecording) {
        stopRecording();
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, timeLeft, stopRecording]);

  const deleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!user || !window.confirm("Delete this report forever?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "sessions", sessionId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleStart = () => {
    setTimeLeft(60);
    startRecording();
  };

  const handleFinish = async () => {
    if (isRecording) stopRecording();
    setIsAnalyzing(true);

    try {
      sessionStorage.setItem("last_transcript", transcript);
      sessionStorage.setItem("last_prompt", prompt);
      
      if (audioBlob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          sessionStorage.setItem("last_audio", reader.result as string);
          router.push("/results");
        };
        reader.readAsDataURL(audioBlob);
      } else {
        router.push("/results");
      }
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 overflow-hidden selection:bg-primary/30 transition-colors duration-300 relative">
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding 
            user={user} 
            onComplete={(name) => {
              setUserName(name);
              setShowOnboarding(false);
            }} 
          />
        )}
      </AnimatePresence>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Simplified Top Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => view === "practice" ? setView("history") : router.push("/")}
              className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-105"
              title="Menu"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-12 px-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-2 text-orange-500 font-black">
              <Flame className="w-5 h-5 fill-current" />
              <span>{streak}</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === "history" ? (
            <motion.div
              key="history-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Menu Hero */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 glass-card rounded-[2.5rem] p-10 md:p-14 border-primary/20 bg-primary/5">
                <div>
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 italic">
                    Hello, {userName || "Speaker"}
                  </h1>
                  <p className="text-xl text-muted-foreground font-medium max-w-md leading-relaxed">
                    Look at your progress below. Ready for more?
                  </p>
                </div>
                <button 
                  onClick={startPractice}
                  className="group flex items-center gap-4 bg-primary text-white px-10 py-6 rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-primary/20 whitespace-nowrap"
                >
                  <Play className="w-6 h-6 fill-current" />
                  PRACTICE MORE
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Previous Reports Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center">
                    <History className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">Your Past Reports</h2>
                </div>

                {sessions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {sessions.map((session, i) => (
                      <motion.div 
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card rounded-[2rem] p-4 sm:p-6 border-border/50 hover:border-primary/30 transition-all group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-muted flex flex-col items-center justify-center border border-border text-muted-foreground shrink-0">
                               <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mb-0.5 sm:mb-1" />
                               <span className="text-[8px] sm:text-[10px] font-black">{session.timestamp?.toDate ? new Date(session.timestamp.toDate()).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'Today'}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-primary mb-0.5 sm:mb-1">Topic</p>
                              <h4 className="font-bold text-sm sm:text-lg leading-tight line-clamp-1 italic text-foreground/90 group-hover:text-foreground transition-colors">"{session.prompt}"</h4>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 pt-3 sm:pt-0 border-t sm:border-0 border-border/50">
                            <div className="text-left sm:text-right">
                              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5 sm:mb-1">Score</p>
                              <span className="font-black text-lg sm:text-2xl tracking-tighter">{session.feedback?.confidence_score}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => deleteSession(e, session.id)}
                                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                title="Delete Report"
                              >
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <button 
                                onClick={() => {
                                  sessionStorage.setItem("last_transcript", session.transcript);
                                  sessionStorage.setItem("last_prompt", session.prompt);
                                  router.push("/results");
                                }}
                                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted border border-border hover:bg-primary hover:text-white transition-all group-hover:scale-105"
                              >
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 glass-card rounded-[2.5rem] border-dashed border-2 opacity-50">
                    <p className="text-muted-foreground font-medium">No reports yet. Click "Practice More" to start!</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="practice-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Prompt Card / Live Transcript Area */}
              <AnimatePresence mode="wait">
                {!isRecording ? (
                  <motion.div 
                    key="prompt-card"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0, y: -20 }}
                    className="glass-card rounded-[2.5rem] p-10 md:p-14 mb-12 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-10">
                      <Brain className="w-20 h-20 text-primary opacity-10 group-hover:opacity-20 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-primary font-black text-xs uppercase tracking-[0.2em]">Goal</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-10 leading-[1.1] max-w-3xl tracking-tight">
                      "{prompt}"
                    </h2>
                    <div className="flex flex-wrap gap-8 text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted border border-border"><Timer className="w-4 h-4 text-foreground" /></div>
                        <span className="font-bold text-sm uppercase tracking-widest">60 SECONDS</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted border border-border"><Mic className="w-4 h-4 text-foreground" /></div>
                        <span className="font-bold text-sm uppercase tracking-widest">ANALYSIS</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="live-transcript-area"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="min-h-[400px] flex flex-col items-center justify-center text-center px-4"
                  >
                    <div className="relative mb-12">
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-40 h-40 rounded-full blue-gradient flex items-center justify-center blue-glow relative z-10"
                      >
                        <span className="text-5xl font-black text-white">{timeLeft}</span>
                      </motion.div>
                      <motion.div 
                        animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 border-4 border-primary rounded-full"
                      ></motion.div>
                    </div>
                    <p className="text-xl md:text-3xl font-bold text-foreground leading-tight max-w-4xl italic">
                      {transcript || "Speak now. I am listening..."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recording Interface */}
              <div className="flex flex-col items-center justify-center py-8">
                <AnimatePresence mode="wait">
                  {isRecording ? (
                    <motion.div 
                      key="recording"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex flex-col items-center gap-12 w-full"
                    >
                      <button 
                        onClick={stopRecording}
                        className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-red-500 text-white font-bold shadow-2xl shadow-red-500/20 hover:scale-105 transition-transform mt-8"
                      >
                        <StopCircle className="w-6 h-6" />
                        STOP NOW
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="start"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-10"
                    >
                      {!transcript ? (
                        <button 
                          onClick={handleStart}
                          className="w-32 h-32 rounded-[2.5rem] blue-gradient flex items-center justify-center blue-glow hover:scale-110 transition-transform group relative"
                        >
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-[2.5rem] transition-opacity"></div>
                          <Mic className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
                        </button>
                      ) : (
                        <div className="flex flex-col items-center gap-10 w-full max-w-2xl">
                           <div className="w-full glass-card rounded-3xl p-8 border-border">
                            <h3 className="text-xs font-black text-muted-foreground mb-4 uppercase tracking-[0.2em]">What you said</h3>
                            <p className="text-xl text-foreground leading-relaxed font-medium">{transcript}</p>
                          </div>
                          <div className="flex gap-6">
                            <button 
                              onClick={handleStart}
                              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-muted border border-border hover:bg-muted/80 transition-colors font-bold"
                            >
                              <RotateCcw className="w-5 h-5" />
                              RETAKE
                            </button>
                            <button 
                              onClick={handleFinish}
                              disabled={isAnalyzing}
                              className="flex items-center gap-3 px-10 py-4 rounded-2xl blue-gradient text-white font-bold blue-glow hover:opacity-90 disabled:opacity-50 transition-all"
                            >
                              {isAnalyzing ? "SAVING..." : "SEE RESULT"}
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
