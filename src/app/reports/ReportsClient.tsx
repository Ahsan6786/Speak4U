"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  History, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  Search,
  LayoutGrid,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "@/components/theme-toggle";

interface Session {
  id: string;
  prompt: string;
  transcript: string;
  timestamp: any;
  feedback: {
    confidence_score: number;
    clarity_score: number;
    fluency_score: number;
    tone_score: number;
    feedback_summary: string;
  };
  isRapidFire?: boolean;
}

export default function ReportsClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, "users", user.uid, "sessions"),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const fetchedSessions = snapshot.docs.map(d => ({
          id: d.id,
          ...d.data()
        })) as Session[];
        setSessions(fetchedSessions);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (!user) {
        router.push("/");
      } else {
        fetchSessions();
      }
    }
  }, [user, authLoading, router]);

  const confirmDelete = async () => {
    if (!user || !sessionToDelete) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "sessions", sessionToDelete));
      setSessions(prev => prev.filter(s => s.id !== sessionToDelete));
      setSessionToDelete(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.transcript.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10 space-y-20">
          {/* Header Skeleton */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
            <div className="space-y-6 w-full lg:w-auto">
              <div className="w-32 h-10 bg-muted animate-pulse rounded-full" />
              <div className="space-y-4">
                <div className="w-64 h-20 bg-muted animate-pulse rounded-3xl" />
                <div className="w-96 h-6 bg-muted animate-pulse rounded-xl" />
              </div>
            </div>
            <div className="w-full lg:w-96 h-16 bg-muted animate-pulse rounded-[2rem]" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-8 md:p-10 rounded-[2.5rem] bg-card/30 border-2 border-border flex flex-col md:flex-row justify-between gap-8 animate-pulse">
                <div className="flex-1 space-y-6">
                  <div className="w-32 h-4 bg-muted rounded-full" />
                  <div className="space-y-4">
                    <div className="w-3/4 h-8 bg-muted rounded-xl" />
                    <div className="w-full h-12 bg-muted rounded-xl" />
                  </div>
                </div>
                <div className="w-32 h-32 bg-muted rounded-3xl shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 selection:bg-primary/30 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -ml-64 -mb-64 pointer-events-none" />

      {/* Delete Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border p-8 rounded-[2rem] shadow-2xl max-w-md w-full text-center">
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
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 mb-20">
          <div className="space-y-6 w-full lg:w-auto">
            <div className="flex items-center justify-between lg:justify-start gap-4">
              <Link href="/dashboard" className="inline-flex items-center gap-3 bg-white text-black hover:bg-zinc-200 transition-all group px-4 py-2 rounded-full shadow-lg">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dashboard</span>
              </Link>
              <ThemeToggle />
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic leading-none text-foreground">
                SPEECH <br /><span className="text-primary">ARCHIVE.</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl font-medium italic max-w-lg">
                Your journey to vocal mastery, preserved in high-fidelity neural audits.
              </p>
            </div>
          </div>

          <div className="relative w-full lg:w-96 group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors z-20" />
            <input 
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border-2 border-border rounded-[2rem] py-6 pl-16 pr-8 outline-none focus:border-primary/50 focus:bg-muted transition-all font-bold text-base relative z-10"
            />
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <div
                key={session.id}
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
                className="group relative flex flex-col p-8 md:p-10 rounded-[2.5rem] bg-card/30 border-2 border-border hover:border-primary/50 hover:bg-card/50 transition-all duration-300 cursor-pointer backdrop-blur-md overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                  <div className="flex-1 space-y-6">
                    {/* Header: Date & Type */}
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">
                        {session.timestamp?.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) || "MAY 3, 2026"}
                      </span>
                      {session.isRapidFire && (
                        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest border border-red-500/20">
                          Rapid Fire
                        </span>
                      )}
                    </div>

                    {/* Prompt & Transcript */}
                    <div className="space-y-4">
                      <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight text-foreground italic">
                        "{session.prompt}"
                      </h3>
                      <p className="text-muted-foreground/80 text-sm md:text-base font-medium italic line-clamp-2 leading-relaxed border-l-2 border-primary/20 pl-6">
                        {session.transcript}
                      </p>
                    </div>
                  </div>

                  {/* Metrics HUD */}
                  <div className="flex md:flex-col items-center justify-between md:justify-center gap-6 bg-muted/30 p-6 rounded-3xl border border-border min-w-[140px]">
                    <div className="text-center md:w-full">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Impact</p>
                      <p className="text-2xl font-black text-foreground leading-none">{session.feedback.confidence_score}%</p>
                    </div>
                    <div className="hidden md:block w-full h-[1px] bg-border" />
                    <div className="text-center md:w-full">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Clarity</p>
                      <p className="text-2xl font-black text-primary leading-none">{session.feedback.clarity_score}%</p>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                   <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity">
                     VIEW FULL PERFORMANCE AUDIT <ChevronRight className="w-4 h-4" />
                   </div>
                   <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSessionToDelete(session.id);
                    }}
                    className="p-3 rounded-xl text-muted-foreground hover:bg-red-500 hover:text-white transition-all border border-transparent hover:border-red-500"
                    title="Delete Report"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-40 text-center space-y-8 bg-muted/20 rounded-[4rem] border-4 border-dashed border-border">
              <div className="w-32 h-32 rounded-[3rem] bg-muted flex items-center justify-center text-muted-foreground relative">
                <History className="w-16 h-16" />
                <div className="absolute inset-0 blur-3xl bg-primary/10 rounded-full" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter text-foreground">THE ARCHIVE IS SILENT.</h3>
                <p className="text-muted-foreground text-lg font-medium italic max-w-sm mx-auto">
                  Your journey to vocal mastery begins with your first recording.
                </p>
              </div>
              <button 
                onClick={() => router.push("/dashboard")}
                className="px-12 py-6 rounded-full bg-foreground text-background font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
              >
                INITIATE PRACTICE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
