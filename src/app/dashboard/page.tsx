"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Flame, History, LayoutGrid, Mic, Play, RotateCcw, StopCircle, Trash2, ChevronRight, LogOut, Timer, Brain, Sparkles, Calendar, MessageSquare, Wand2, FastForward } from "lucide-react";
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
  const { user, loading: authLoading, logout } = useAuth();
  const { isRecording, transcript, startRecording, stopRecording, audioBlob, requestPermission } = useVoiceRecorder();
  const [timeLeft, setTimeLeft] = useState(60);
  const [prompt, setPrompt] = useState("");
  const [streak, setStreak] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [view, setView] = useState<"history" | "practice">("history");
  const [sessions, setSessions] = useState<any[]>([]);
  const [assistMode, setAssistMode] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFetchingAssist, setIsFetchingAssist] = useState(false);
  const searchParams = useSearchParams();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const fetchNewQuestion = async () => {
    try {
      const history = JSON.parse(sessionStorage.getItem("question_history") || "[]");
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, streak }),
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
        if (!data.onboarded) {
          router.push("/onboarding");
        } else {
          setDataLoading(false);
        }
      } else {
        setDoc(userDocRef, { streak: 0, onboarded: false }, { merge: true });
        router.push("/onboarding");
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

  useEffect(() => {
    if (!isRecording || !assistMode || !transcript || transcript.length < 10) return;

    const timeoutId = setTimeout(async () => {
      setIsFetchingAssist(true);
      try {
        const response = await fetch("/api/assist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript, prompt }),
        });
        const data = await response.json();
        if (data.suggestions) {
          setSuggestions(data.suggestions);
        }
      } catch (err) {
        console.error("Assist failed:", err);
      } finally {
        setIsFetchingAssist(false);
      }
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [transcript, isRecording, assistMode, prompt]);



  const confirmDelete = async () => {
    if (!user || !sessionToDelete) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "sessions", sessionToDelete));
      setSessionToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const deleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setSessionToDelete(sessionId);
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

  // Loading Screen
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-bold animate-pulse uppercase tracking-widest text-xs">Preparing Dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 overflow-hidden selection:bg-primary/30 transition-colors duration-300 relative">
      <AnimatePresence>
        {sessionToDelete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border p-8 rounded-[2rem] shadow-2xl max-w-md w-full text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-2">Delete Report?</h3>
              <p className="text-muted-foreground mb-8">This action cannot be undone. Are you sure you want to permanently delete this practice report?</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setSessionToDelete(null)}
                  className="flex-1 py-4 rounded-xl font-bold bg-muted text-foreground hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-4 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showSignOutConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border p-8 rounded-[2rem] shadow-2xl max-w-md w-full text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mx-auto mb-6">
                <LogOut className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-2">Sign Out?</h3>
              <p className="text-muted-foreground mb-8">Are you sure you want to sign out of your account?</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowSignOutConfirm(false)}
                  className="flex-1 py-4 rounded-xl font-bold bg-muted text-foreground hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="flex-1 py-4 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
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
              className="w-12 h-12 rounded-2xl bg-card border-2 border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all hover:scale-105 shadow-sm"
              title="Menu"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <button 
              onClick={() => setShowSignOutConfirm(true)}
              className="w-12 h-12 rounded-2xl bg-card border-2 border-border flex items-center justify-center text-foreground hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all hover:scale-105 shadow-sm"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-12 px-6 rounded-2xl bg-orange-500/10 border-2 border-orange-500/30 flex items-center gap-2 text-orange-600 dark:text-orange-400 font-black shadow-sm">
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
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 rounded-[2.5rem] p-10 md:p-14 bg-emerald-600 text-white shadow-2xl shadow-emerald-600/20 mb-12 relative overflow-hidden group">
                <div className="relative z-10">
                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-3 italic">
                    Hello, {userName || "Speaker"}
                  </h1>
                  <p className="text-xl text-emerald-50 font-medium max-w-md leading-relaxed">
                    Look at your progress below. Ready for more?
                  </p>
                </div>
                <button 
                  onClick={startPractice}
                  className="relative z-10 w-full md:w-auto group flex items-center justify-center gap-4 bg-white text-emerald-600 px-10 py-6 rounded-[2rem] font-black text-xl hover:bg-emerald-50 transition-all shadow-xl hover:scale-105 active:scale-95"
                >
                  <Play className="w-6 h-6 fill-current" />
                  PRACTICE MORE
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Independent Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                <Link 
                  href="/speak-with-me"
                  className="group relative flex items-center justify-between p-8 rounded-[2.5rem] bg-sky-500 text-white hover:bg-sky-600 transition-all shadow-xl shadow-sky-500/20"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-white/20 text-white flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <FastForward className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight italic">Speak With Me</h3>
                      <p className="text-sm text-sky-100 font-medium opacity-90">Teleprompter Challenge</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white text-sky-600 flex items-center justify-center group-hover:scale-110 transition-all shadow-sm">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </Link>

                <Link 
                  href="/reports"
                  className="group relative flex items-center justify-between p-8 rounded-[2.5rem] bg-card border-2 border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <History className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight italic">Your Reports</h3>
                      <p className="text-sm text-muted-foreground font-medium">Analytics & Progress</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </Link>
              </div>

              {/* Removed History Section as requested */}
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
                {!isRecording && !isAnalyzing && !transcript ? (
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
                    <div className="flex flex-wrap gap-8 text-muted-foreground items-center justify-between w-full mt-10 border-t border-border/50 pt-8">
                      <div className="flex gap-8">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted border border-border"><Timer className="w-4 h-4 text-foreground" /></div>
                          <span className="font-bold text-sm uppercase tracking-widest">60 SECONDS</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-muted border border-border"><Mic className="w-4 h-4 text-foreground" /></div>
                          <span className="font-bold text-sm uppercase tracking-widest">ANALYSIS</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setAssistMode(!assistMode)}
                          className={cn("flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all text-sm uppercase tracking-widest border", assistMode ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground border-border hover:bg-muted/80")}
                        >
                          <Wand2 className="w-4 h-4" />
                          Assist Mode {assistMode ? "ON" : "OFF"}
                        </button>
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
                    <p className="text-xl md:text-3xl font-bold text-foreground leading-tight max-w-4xl italic mb-12">
                      {transcript || "Speak now. I am listening..."}
                    </p>

                    <AnimatePresence>
                      {assistMode && isRecording && (suggestions.length > 0 || isFetchingAssist) && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-col items-center mt-8 w-full max-w-3xl"
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="relative">
                              <Wand2 className={cn("w-5 h-5 text-emerald-500", isFetchingAssist ? "animate-spin" : "animate-pulse")} />
                              {isFetchingAssist && (
                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                              )}
                            </div>
                            <span className="text-emerald-600 font-black text-sm uppercase tracking-[0.2em]">
                              {isFetchingAssist ? "Thinking..." : "Live Suggestions"}
                            </span>
                          </div>
                          <div className="flex flex-wrap justify-center gap-4">
                            {suggestions.map((sug, i) => (
                              <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="px-6 py-4 rounded-[1.5rem] bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-lg md:text-xl shadow-xl shadow-emerald-500/5 backdrop-blur-xl"
                              >
                                {sug}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
                            <button 
                              onClick={handleStart}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-5 rounded-[1.8rem] bg-card border-2 border-border text-foreground hover:bg-muted hover:border-primary/30 transition-all font-black text-lg shadow-sm active:scale-95"
                            >
                              <RotateCcw className="w-5 h-5" />
                              RETAKE
                            </button>
                            <button 
                              onClick={handleFinish}
                              disabled={isAnalyzing}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-[1.8rem] blue-gradient text-white font-black text-lg blue-glow hover:scale-[1.03] active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-blue-500/20"
                            >
                              {isAnalyzing ? "ANALYZING..." : "SEE RESULT"}
                              <ChevronRight className="w-6 h-6" />
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
