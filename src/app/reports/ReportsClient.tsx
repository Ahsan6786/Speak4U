"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Calendar, Trash2, ArrowRight, LayoutGrid, Flame, Brain, Gauge, Target } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ReportsClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    getDoc(userDocRef).then(doc => {
      if (doc.exists()) {
        setStreak(doc.data().streak || 0);
      }
    });

    const sessionsRef = collection(db, "users", user.uid, "sessions");
    const q = query(sessionsRef, orderBy("timestamp", "desc"));
    const unsubHistory = onSnapshot(q, (snapshot) => {
      setSessions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsubHistory();
  }, [user, authLoading, router]);

  const confirmDelete = async () => {
    if (!user || !sessionToDelete) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "sessions", sessionToDelete));
      setSessionToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const avgConfidence = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + (s.feedback?.confidence_score || 0), 0) / sessions.length) 
    : 0;

  const avgFluency = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + (s.feedback?.fluency_score || 0), 0) / sessions.length) 
    : 0;

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-400 text-black hover:bg-yellow-500 transition-all font-black text-xs uppercase tracking-widest shadow-lg shadow-yellow-400/20"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Menu</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 italic">Performance Reports</h1>
          <p className="text-xl text-muted-foreground font-medium max-w-2xl">
            Track your journey, analyze your speech patterns, and watch your confidence grow over time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatCard label="Avg Confidence" value={`${avgConfidence}%`} icon={Brain} color="text-emerald-500" bg="bg-emerald-500/10" />
          <StatCard label="Current Level" value={`Level ${Math.floor(sessions.length / 5) + 1}`} icon={Target} color="text-blue-500" bg="bg-blue-500/10" />
          <StatCard label="Avg Fluency" value={`${avgFluency}%`} icon={Gauge} color="text-purple-500" bg="bg-purple-500/10" />
          <StatCard label="Practice Streak" value={`${streak} Days`} icon={Flame} color="text-orange-500" bg="bg-orange-500/10" />
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {sessions.length > 0 ? (
              sessions.map((session, i) => (
                <motion.div 
                  key={session.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-[2rem] p-5 sm:p-6 border-border/50 hover:border-primary/30 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex flex-col items-center justify-center text-muted-foreground shrink-0">
                         <Calendar className="w-3.5 h-3.5 mb-0.5" />
                         <span className="text-[9px] font-black uppercase">{session.timestamp?.toDate ? new Date(session.timestamp.toDate()).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'Today'}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary">Topic</span>
                          {session.isRapidFire && <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[8px] font-black uppercase shadow-lg shadow-red-500/20">Rapid Fire</span>}
                          {session.brutalMode && <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[8px] font-black uppercase">Strict</span>}
                        </div>
                        <h4 className="font-bold text-lg italic text-foreground/90 leading-tight line-clamp-1 group-hover:text-foreground transition-colors">
                          "{session.prompt}"
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 md:gap-8 pt-4 md:pt-0 border-t md:border-0 border-border/50">
                      <div className="flex items-center gap-6 sm:gap-10">
                        <div className="text-left md:text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Confidence</p>
                          <span className="font-black text-xl sm:text-2xl tracking-tighter text-emerald-500 leading-none">{session.feedback?.confidence_score}%</span>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Fluency</p>
                          <span className="font-black text-xl sm:text-2xl tracking-tighter text-purple-500 leading-none">{session.feedback?.fluency_score}%</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button 
                          onClick={() => setSessionToDelete(session.id)}
                          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-red-500/5 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => {
                            sessionStorage.setItem("last_transcript", session.transcript);
                            sessionStorage.setItem("last_prompt", session.prompt);
                            sessionStorage.setItem("last_result", JSON.stringify({
                              transcript: session.transcript,
                              prompt: session.prompt,
                              data: session.feedback
                            }));
                            router.push("/results");
                          }}
                          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                        >
                          <ArrowRight className="w-4 h-4 sm:w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-24 glass-card rounded-[3rem] border-dashed border-2 opacity-50 flex flex-col items-center">
                <History className="w-12 h-12 mb-4 text-muted-foreground" />
                <p className="text-xl font-bold">No performance reports found</p>
                <p className="text-muted-foreground mt-2">Start practicing to see your analytics here.</p>
                <Link href="/dashboard" className="mt-8 px-8 py-4 rounded-2xl bg-foreground text-background font-black hover:scale-105 transition-all">
                  Go Practice
                </Link>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {sessionToDelete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border-2 border-border p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-8">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tight">Delete Report?</h3>
              <p className="text-muted-foreground mb-10 text-lg">This analysis will be permanently removed. You cannot undo this action.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setSessionToDelete(null)}
                  className="flex-1 py-5 rounded-2xl font-black text-lg bg-muted text-foreground hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-5 rounded-2xl font-black text-lg bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function StatCard({ label, value, icon: Icon, color, bg }: { label: string, value: string, icon: any, color: string, bg: string }) {
  return (
    <div className="glass-card p-8 rounded-[2.5rem] border-border/50 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", bg, color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{label}</p>
        <p className="text-3xl font-black tracking-tight">{value}</p>
      </div>
    </div>
  );
}
