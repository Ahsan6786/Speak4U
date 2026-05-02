"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Flame, History, LayoutGrid, Mic, Play, RotateCcw, StopCircle, Trash2, ChevronRight, LogOut, Timer, Brain, Sparkles, Calendar, MessageSquare, Wand2, FastForward, CheckCircle2, Command, Settings, User } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot, collection, query, orderBy, limit, deleteDoc } from "firebase/firestore";

export default function DashboardClient() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { isRecording, transcript, error: micError, startRecording, stopRecording, clearTranscript, audioBlob, requestPermission } = useVoiceRecorder();
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
  const [isFetchingQuestion, setIsFetchingQuestion] = useState(false);
  const [isRapidFire, setIsRapidFire] = useState(false);
  const [rapidFireStep, setRapidFireStep] = useState(0);
  const [rapidFireAnswers, setRapidFireAnswers] = useState<{ q: string, a: string }[]>([]);
  const searchParams = useSearchParams();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  const fetchNewQuestion = async (force = false) => {
    if (isFetchingQuestion && !force) return;
    setIsFetchingQuestion(true);
    try {
      const history = JSON.parse(sessionStorage.getItem("question_history") || "[]");
      const response = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, streak }),
      });
      const data = await response.json();
      setPrompt(data.question);

      const newHistory = [data.question, ...history].slice(0, 5);
      sessionStorage.setItem("question_history", JSON.stringify(newHistory));
    } catch (err) {
      console.error("Failed to fetch question:", err);
      if (!prompt) setPrompt("Describe a challenge you overcame recently.");
    } finally {
      setIsFetchingQuestion(false);
    }
  };

  const startPractice = async (rapid = false) => {
    const granted = await requestPermission();
    if (granted) {
      if (rapid) {
        setIsRapidFire(true);
        setRapidFireStep(1);
        setRapidFireAnswers([]);
        setView("practice");
        await fetchNewQuestion();
        // AUTO START RECORDING FOR RAPID FIRE
        setTimeout(() => {
          handleStart();
        }, 800);
      } else {
        setIsRapidFire(false);
        setRapidFireStep(0);
        setView("practice");
        await fetchNewQuestion();
      }
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

    if (!prompt) fetchNewQuestion();

    const userDocRef = doc(db, "users", user.uid);
    const unsubUser = onSnapshot(userDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserName(data.name || "");
        setNewUserName(data.name || "");

        // --- STREAK LOGIC ---
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD
        const lastDate = data.lastActivityDate || "";

        if (lastDate !== todayStr) {
          const lastDateObj = lastDate ? new Date(lastDate) : null;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split("T")[0];

          if (lastDate !== yesterdayStr && lastDate !== todayStr) {
            // Missed a day or first time
            if (data.streak !== 0) {
              await setDoc(userDocRef, { streak: 0 }, { merge: true });
            }
          }
        }

        setStreak(data.streak || 0);

        if (!data.onboarded) {
          router.push("/onboarding");
        } else {
          setDataLoading(false);
        }
      } else {
        await setDoc(userDocRef, {
          streak: 0,
          onboarded: false,
          lastActivityDate: ""
        }, { merge: true });
        router.push("/onboarding");
      }
    });

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

  // --- AUTO-REQUEST MIC PERMISSION ---
  useEffect(() => {
    if (!dataLoading && user) {
      requestPermission().catch(err => console.error("Mic permission denied:", err));
    }
  }, [dataLoading, user, requestPermission]);

  useEffect(() => {
    if (isRecording && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRecording) {
      if (timerRef.current) clearInterval(timerRef.current);
      handleFinish();
    } else if (!isRecording) {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, timeLeft]);

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
    if (isAnalyzing) return;
    if (isRecording) stopRecording();
    setIsAnalyzing(true);

    try {
      const currentAnswer = { q: prompt, a: transcript };

      if (isRapidFire && rapidFireStep < 6) {
        setRapidFireAnswers(prev => [...prev, currentAnswer]);
        const nextStep = rapidFireStep + 1;
        setRapidFireStep(nextStep);
        setIsAnalyzing(false);
        setTimeLeft(60);

        // INSTANT TRANSITION
        stopRecording();
        clearTranscript();
        await fetchNewQuestion(true);

        // AUTO-START NEXT RECORDING IMMEDIATELY
        setTimeout(() => {
          startRecording();
        }, 100);
        return;
      }

      // Final step
      const allAnswers = isRapidFire
        ? [...rapidFireAnswers, currentAnswer]
        : [currentAnswer];

      sessionStorage.setItem("last_transcript", transcript);
      sessionStorage.setItem("last_prompt", prompt);
      sessionStorage.setItem("is_rapid_fire", isRapidFire ? "true" : "false");
      sessionStorage.setItem("rapid_fire_data", JSON.stringify(allAnswers));

      if (isRapidFire) {
        setIsAnalyzing(false);
        setRapidFireStep(7);
        stopRecording();
        return;
      }

      if (audioBlob) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          sessionStorage.setItem("last_audio", reader.result as string);

          // Update Streak on Completion
          if (user) {
            const todayStr = new Date().toISOString().split("T")[0];
            const userDocRef = doc(db, "users", user.uid);

            // We use the 'streak' state from the component
            const lastActivity = sessionStorage.getItem("last_update_date");
            if (lastActivity !== todayStr) {
              await setDoc(userDocRef, {
                streak: streak + 1,
                lastActivityDate: todayStr
              }, { merge: true });
              sessionStorage.setItem("last_update_date", todayStr);
            }
          }

          fetchNewQuestion(true);
          router.push("/results");
        };
        reader.readAsDataURL(audioBlob);
      } else {
        // Handle case without audioBlob
        if (user) {
          const todayStr = new Date().toISOString().split("T")[0];
          const userDocRef = doc(db, "users", user.uid);
          await setDoc(userDocRef, {
            streak: streak + 1,
            lastActivityDate: todayStr
          }, { merge: true });
        }
        fetchNewQuestion(true);
        router.push("/results");
      }
    } catch (error) {
      console.error(error);
      setIsAnalyzing(false);
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-black animate-pulse uppercase tracking-[0.3em] text-[10px]">REVIAL Engine Loading</p>
        </div>
      </div>
    );
  }

  // --- RAPID FIRE FULLSCREEN MODE ---
  if (view === "practice" && isRapidFire && rapidFireStep <= 6) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#020202] text-white flex flex-col items-center justify-between p-8 md:p-16 overflow-hidden font-sans">
        {/* Cinematic Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-red-600/5 blur-[120px] rounded-full animate-pulse" />
        </div>

        {/* Top: Progress */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl flex items-center justify-between relative z-10"
        >
          <div className="flex items-center gap-6">
            <button
              onClick={() => setView("history")}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-95"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <h3 className="text-[10px] md:text-sm font-bold tracking-widest uppercase opacity-40">Phase {rapidFireStep} of 6</h3>
            </div>
          </div>

          <div className="hidden sm:flex gap-2">
            {[1, 2, 3, 4, 5, 6].map(s => (
              <div
                key={s}
                className={cn(
                  "h-1.5 w-10 rounded-full transition-all duration-700",
                  s < rapidFireStep ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]" :
                    s === rapidFireStep ? "bg-white animate-pulse" : "bg-white/10"
                )}
              />
            ))}
          </div>
        </motion.div>

        {/* Center: Question */}
        <div className="w-full max-w-4xl text-center flex flex-col items-center justify-center relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={prompt}
              initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8 md:space-y-12 w-full"
            >
              <h2 className="text-2xl md:text-7xl font-black leading-[1.1] tracking-tight italic bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 px-4">
                "{prompt}"
              </h2>

              {isRecording && (
                <div className="flex flex-col items-center gap-10">
                  <div className="flex items-center gap-6">
                    <div className="px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black text-xs tracking-[0.3em] flex items-center gap-3">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      {timeLeft}s REMAINING
                    </div>
                  </div>

                  {micError ? (
                    <div className="bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-2xl text-red-500 font-bold text-sm animate-bounce">
                      {micError}
                    </div>
                  ) : (
                    <p className="text-white/40 text-lg md:text-3xl font-medium italic max-w-3xl line-clamp-3 min-h-[4rem] px-4">
                      {transcript || "Speak now..."}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom: Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl flex flex-col items-center justify-center gap-8 relative z-10"
        >
          {!isRecording && !isAnalyzing ? (
            <button
              onClick={handleStart}
              className="group flex items-center justify-center gap-4 bg-emerald-600 text-white px-10 py-5 rounded-full font-black text-lg md:text-xl hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)]"
            >
              <Mic className="w-5 h-5 md:w-6 md:h-6" />
              BEGIN DRILL
            </button>
          ) : (
            <div className="flex flex-col items-center gap-8 w-full">
              <div className="flex gap-4">
                <button
                  onClick={stopRecording}
                  className="px-12 py-5 rounded-full bg-white/5 border border-white/10 text-white/60 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95"
                >
                  <StopCircle className="w-5 h-5 mb-1 mx-auto" />
                  ABORT
                </button>
                <button
                  onClick={handleFinish}
                  className="px-12 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all active:scale-95 shadow-xl"
                >
                  <ChevronRight className="w-5 h-5 mb-1 mx-auto" />
                  SUBMIT
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // --- FINAL CELEBRATION SCREEN ---
  if (view === "practice" && rapidFireStep === 7) {
    return (
      <div className="fixed inset-0 z-[300] bg-[#000000] text-white flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-red-500 flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(239,68,68,0.5)]">
            <CheckCircle2 className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic">DRILL COMPLETE</h2>
          <p className="text-xl md:text-2xl text-white/50 mb-16 max-w-2xl font-medium">
            Excellent focus. All 6 responses have been captured. Your performance audit is ready for analysis.
          </p>
          <button
            onClick={() => router.push("/results")}
            className="group px-16 py-8 rounded-[3rem] bg-white text-black font-black text-3xl flex items-center justify-center gap-6 hover:scale-105 transition-all shadow-2xl active:scale-95"
          >
            SEE YOUR RESULTS
            <ChevronRight className="w-10 h-10 group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 overflow-hidden selection:bg-primary/30 relative">
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
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/40 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-card/80 border border-white/10 p-10 rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.4)] max-w-md w-full relative overflow-hidden transform-gpu will-change-transform"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] -mr-16 -mt-16" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[1.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-inner">
                  <User className="w-10 h-10" />
                </div>
                
                <h3 className="text-3xl font-black tracking-tight mb-2">Profile Settings</h3>
                <p className="text-muted-foreground text-sm font-medium italic mb-10">Update your details for the dashboard.</p>
                
                <div className="w-full space-y-6 mb-10 text-left">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-3 block px-1">Display Name</label>
                    <input
                      type="text"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-bold text-foreground outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all placeholder:opacity-30"
                      placeholder="e.g. Ahsan"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 py-4 rounded-2xl font-bold bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (user) {
                        await setDoc(doc(db, "users", user.uid), { name: newUserName }, { merge: true });
                        setShowSettings(false);
                      }
                    }}
                    className="flex-1 py-4 rounded-2xl font-black bg-primary text-white hover:scale-[1.03] active:scale-95 transition-all shadow-lg shadow-primary/30"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full -mr-64 -mt-64 pointer-events-none opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] rounded-full -ml-64 -mb-64 pointer-events-none opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
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
              onClick={() => setShowSettings(true)}
              className="w-12 h-12 rounded-2xl bg-card border-2 border-border flex items-center justify-center text-foreground hover:text-primary hover:bg-primary/10 hover:border-primary/20 transition-all hover:scale-105 shadow-sm"
              title="Settings"
            >
              <Command className="w-5 h-5" />
            </button>
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
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-12 transform-gpu will-change-transform"
            >
              <div className="relative">
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 rounded-[2rem] p-8 md:p-10 bg-card/40 supports-[backdrop-filter]:backdrop-blur-xl border border-white/5 shadow-xl overflow-hidden ring-1 ring-white/10 transform-gpu will-change-transform translate-z-0">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -mr-32 -mt-32" />

                  <div className="relative z-10 space-y-3 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/70">Session Ready</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground italic leading-none">
                      Hello, {userName || "Speaker"}
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium italic">
                      Ready to perfect your delivery?
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10">
                    <button
                      onClick={() => startPractice(false)}
                      className="group flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      PRACTICE
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => startPractice(true)}
                      className="group flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-600/10"
                    >
                      <Flame className="w-5 h-5 fill-current" />
                      RAPID FIRE
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {/* THE TELEPROMPTER - GOD TIER */}
                <Link
                  href="/speak-with-me"
                  className="group relative flex flex-col items-start p-10 rounded-[3rem] bg-gradient-to-br from-white/[0.08] to-transparent supports-[backdrop-filter]:backdrop-blur-2xl border border-white/10 hover:border-primary/50 transition-all duration-700 shadow-[0_30px_60px_rgba(0,0,0,0.4)] overflow-hidden transform-gpu will-change-transform translate-z-0"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.2)_0%,transparent_50%)]" />
                  <div className="absolute -inset-[100%] group-hover:inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out" />
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full translate-x-1/4 translate-y-1/4 group-hover:scale-150 transition-transform duration-1000" />

                  <div className="relative z-10 w-16 h-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-[0_10px_40px_rgba(59,130,246,0.5)]">
                    <FastForward className="w-8 h-8" />
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-[2px] bg-primary rounded-full animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/80"></span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black tracking-tighter italic text-foreground leading-[0.85] uppercase">THE <br /> TELEPROMPTER</h3>
                    <p className="text-base md:text-lg text-muted-foreground font-medium italic opacity-70 group-hover:opacity-100 transition-opacity max-w-[280px]">
                      Practice your <span className="text-primary font-bold">speaking skills</span> for big moments.
                    </p>
                  </div>
                  <div className="relative z-10 mt-10 flex items-center gap-3 px-8 py-3.5 rounded-full bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-[0_15px_30px_rgba(59,130,246,0.4)] hover:scale-105 hover:bg-white hover:text-primary transition-all">
                    START NOW <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>

                {/* PERFORMANCE HISTORY - GOD TIER */}
                <Link
                  href="/reports"
                  className="group relative flex flex-col items-start p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.08] to-transparent supports-[backdrop-filter]:backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transform-gpu will-change-transform translate-z-0"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15)_0%,transparent_50%)]" />
                  <div className="absolute -inset-[100%] group-hover:inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out" />
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full translate-x-1/4 translate-y-1/4 group-hover:scale-150 transition-transform duration-1000" />

                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                    <History className="w-7 h-7" />
                  </div>

                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-[1.5px] bg-emerald-500 rounded-full" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500"></span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black tracking-tighter italic text-foreground leading-[0.9] uppercase">SPEECH <br /> ANALYTICS</h3>
                    <p className="text-sm md:text-base text-muted-foreground font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
                      See how <span className="text-emerald-500 font-bold">well you are doing</span> here.
                    </p>
                  </div>
                  <div className="relative z-10 mt-8 flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 text-white font-black uppercase tracking-widest text-[9px] shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all">
                    SEE REPORTS <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="practice-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AnimatePresence mode="wait">
                {rapidFireStep === 7 ? (
                  <motion.div
                    key="rapid-fire-finished"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card rounded-[2.5rem] p-10 md:p-14 text-center flex flex-col items-center shadow-2xl"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mb-8">
                      <Flame className="w-10 h-10 fill-current" />
                    </div>
                    <h2 className="text-4xl font-black mb-4 italic">Rapid Fire Complete! 🎉</h2>
                    <p className="text-xl text-muted-foreground mb-12 max-w-lg">
                      You've successfully powered through 6 intense speaking challenges. Ready to see your comprehensive performance audit?
                    </p>
                    <button
                      onClick={() => router.push("/results")}
                      className="w-full sm:w-auto px-12 py-6 rounded-[2rem] bg-red-500 text-white font-black text-2xl flex items-center justify-center gap-4 hover:scale-105 transition-transform shadow-2xl shadow-red-500/20"
                    >
                      SEE RESULT
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  </motion.div>
                ) : !isRecording && !isAnalyzing && !transcript ? (
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
                    <div className="flex items-center gap-4 mb-6">
                      <div className={cn("px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest", isRapidFire ? "bg-red-500 text-white shadow-lg shadow-red-500/30" : "bg-primary/10 text-primary border border-primary/20")}>
                        {isRapidFire ? `Rapid Fire: Round ${rapidFireStep}/6` : "Daily Challenge"}
                      </div>
                    </div>
                    {isFetchingQuestion && !prompt ? (
                      <div className="space-y-4 mb-10">
                        <div className="h-12 w-full bg-muted animate-pulse rounded-xl"></div>
                        <div className="h-12 w-3/4 bg-muted animate-pulse rounded-xl"></div>
                      </div>
                    ) : (
                      <h2 className="text-3xl md:text-5xl font-bold mb-10 leading-[1.1] max-w-3xl tracking-tight min-h-[3.3em]">
                        "{prompt}"
                      </h2>
                    )}
                    <div className="flex items-center justify-between w-full mt-10 border-t border-border/50 pt-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20"><Sparkles className="w-4 h-4 text-primary" /></div>
                        <span className="font-bold text-sm uppercase tracking-widest text-primary"></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setAssistMode(!assistMode)}
                          className={cn("flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all text-sm uppercase tracking-widest border", assistMode ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground border-border hover:bg-muted/80")}
                        >
                          <Wand2 className="w-4 h-4" />
                          Expert Guidance {assistMode ? "ON" : "OFF"}
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
                      {assistMode && isRecording && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50"
                        >
                          <div className="glass-card p-6 rounded-[2rem] border-primary/30 shadow-2xl flex flex-col items-center gap-4">
                            <div className="flex items-center gap-3">
                              <Sparkles className={cn("w-4 h-4 text-primary", isFetchingAssist && "animate-spin")} />
                              <span className="text-primary font-black text-xs uppercase tracking-[0.2em]">
                                {isFetchingAssist ? "AI Analysis in progress..." : "Recommended Talk Points"}
                              </span>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3">
                              {(suggestions.length > 0 ? suggestions : ["Loading points..."]).map((sug, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm md:text-base whitespace-nowrap"
                                >
                                  {sug}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

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
                      <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
                        <button
                          onClick={stopRecording}
                          className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-red-500/10 text-red-500 border-2 border-red-500/20 font-bold hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
                        >
                          <StopCircle className="w-6 h-6" />
                          STOP NOW
                        </button>
                        {isRapidFire && (
                          <button
                            onClick={handleFinish}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-12 py-5 rounded-2xl bg-foreground text-background font-black text-xl hover:scale-105 transition-all shadow-2xl active:scale-95"
                          >
                            NEXT QUESTION
                            <ChevronRight className="w-7 h-7" />
                          </button>
                        )}
                      </div>
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
                          className="w-32 h-32 rounded-[2.5rem] blue-gradient flex flex-col items-center justify-center blue-glow hover:scale-110 transition-transform group relative"
                        >
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 rounded-[2.5rem] transition-opacity"></div>
                          <Mic className="w-10 h-10 text-white mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-black text-white/80 tracking-widest">60S</span>
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
                              {isAnalyzing
                                ? "ANALYZING..."
                                : isRapidFire
                                  ? (rapidFireStep < 6 ? "NEXT QUESTION" : "FINISH ROUND")
                                  : "SEE RESULT"
                              }
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
