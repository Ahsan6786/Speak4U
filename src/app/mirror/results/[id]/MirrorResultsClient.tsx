"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Download, LayoutGrid, 
  Camera, Sparkles, Brain, Gauge, TrendingUp,
  XCircle, Lightbulb, User
} from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer
} from "recharts";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/components/auth-provider";
import jsPDF from "jspdf";

export default function MirrorResultsClient({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (authLoading || !user) return;
      try {
        const docRef = doc(db, "users", user.uid, "sessions", sessionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [sessionId, user, authLoading, router]);

  const exportReport = (format: 'pdf' | 'word') => {
    if (!data) return;
    const { feedback } = data;
    
    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("REVIAL - Performance Audit", 20, 20);
      doc.setFontSize(14);
      doc.text(`Confidence: ${feedback.confidence_score}%`, 20, 40);
      doc.text(`Clarity: ${feedback.clarity_score}%`, 20, 50);
      doc.text("Visual Insights:", 20, 70);
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize(feedback.expression_analysis, 170), 20, 80);
      doc.setFontSize(14);
      doc.text("Talking Style:", 20, 110);
      doc.setFontSize(10);
      doc.text(doc.splitTextToSize(feedback.tone_analysis, 170), 20, 120);
      doc.save(`Mirror_Report_${sessionId}.pdf`);
    } else {
      const content = `
        REVIAL - Performance Audit
        Confidence: ${feedback.confidence_score}%
        Clarity: ${feedback.clarity_score}%
        
        Visual Insights:
        ${feedback.expression_analysis}
        
        Talking Style:
        ${feedback.tone_analysis}
        
        Coach Feedback:
        ${feedback.feedback_summary}
      `;
      const blob = new Blob([content], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Mirror_Report_${sessionId}.doc`;
      link.click();
    }
  };

  if (loading || authLoading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 rounded-[2rem] bg-primary/20 animate-pulse mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-emerald-500 opacity-20 animate-spin" />
      </div>
      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-500">Processing Visual Audit...</h2>
      <p className="text-zinc-600 font-bold mt-4 animate-pulse">Syncing with your Performance Cloud</p>
    </div>
  );

  if (!data) return null;

  const feedback = data.feedback;
  const visualScores = feedback.visual_scores || {
    eye_contact: 40,
    facial_expression: 50,
    body_language: 45,
    vocal_energy: 55,
    smile_score: 30
  };

  const radarData = [
    { subject: 'Eye Contact', A: visualScores.eye_contact, fullMark: 100 },
    { subject: 'Expression', A: visualScores.facial_expression, fullMark: 100 },
    { subject: 'Body Language', A: visualScores.body_language, fullMark: 100 },
    { subject: 'Energy', A: visualScores.vocal_energy, fullMark: 100 },
    { subject: 'Style', A: visualScores.smile_score, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 selection:bg-primary/30">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push("/dashboard")}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Performance Audit</p>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Mirror Results</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <ThemeToggle />
             <div className="flex gap-2">
               <button 
                onClick={() => exportReport('pdf')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
               >
                 <Download size={14} /> PDF
               </button>
               <button 
                onClick={() => exportReport('word')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
               >
                 <Download size={14} /> Word
               </button>
             </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Column: Scores & Visuals */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Primary Scores */}
            <div className="grid grid-cols-2 gap-4">
              <ScoreCard label="Confidence" score={feedback.confidence_score} color="text-primary" />
              <ScoreCard label="Clarity" score={feedback.clarity_score} color="text-emerald-500" />
            </div>

            {/* Visual Dynamics Radar Chart */}
            <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-6">
              <div className="flex items-center gap-2">
                <Camera size={16} className="text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest">Visual Dynamics</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#ffffff10" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Talking Style Insight */}
            <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 space-y-4">
               <div className="flex items-center gap-2 text-emerald-500">
                <Sparkles size={16} />
                <h3 className="text-xs font-black uppercase tracking-widest">Talking Style</h3>
              </div>
              <p className="text-xl font-bold italic leading-relaxed text-zinc-200">
                "{feedback.tone_analysis}"
              </p>
            </div>

          </div>

          {/* Right Column: Deep Analysis */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Visual Insight Card (Big) */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-emerald-500/20 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative p-10 md:p-14 rounded-[3rem] bg-card border border-border space-y-8 overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                  <User size={200} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">Visual Insights</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-1">Movement & Presence Audit</p>
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-medium italic leading-relaxed text-foreground/80">
                  {feedback.expression_analysis}
                </p>
              </div>
            </div>

            {/* Coach Feedback & Pace */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 rounded-[2.5rem] bg-muted/30 border border-border space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Brain size={18} />
                  <h3 className="text-xs font-black uppercase tracking-widest">Coach Feedback</h3>
                </div>
                <p className="text-lg font-medium leading-relaxed text-foreground/70">
                  {feedback.feedback_summary}
                </p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Brain size={18} />
                  <h3 className="text-xs font-black uppercase tracking-widest">Pace Analysis</h3>
                </div>
                <p className="text-lg font-medium leading-relaxed text-foreground/80 italic">
                  {feedback.pace_feedback}
                </p>
              </div>
            </div>

            {/* Weaknesses & Improvement */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-10 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 space-y-6">
                 <div className="flex items-center gap-3 text-red-500">
                  <XCircle size={20} />
                  <h3 className="text-xl font-black italic tracking-tighter uppercase">Weaknesses</h3>
                </div>
                <ul className="space-y-4">
                  {feedback.mistakes.map((m: string, i: number) => (
                    <li key={i} className="flex gap-4 text-zinc-400 font-medium leading-tight">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/40 mt-1.5 flex-shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 space-y-6">
                 <div className="flex items-center gap-3 text-emerald-500">
                  <Lightbulb size={20} />
                  <h3 className="text-xl font-black italic tracking-tighter uppercase">How to improve</h3>
                </div>
                <ul className="space-y-4">
                  {feedback.improvement_tips.map((t: string, i: number) => (
                    <li key={i} className="flex gap-4 text-zinc-400 font-medium leading-tight">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 mt-1.5 flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Better Version */}
            <div className="p-10 rounded-[3rem] bg-white text-black space-y-6">
              <div className="flex items-center gap-3 text-black/40">
                <Sparkles size={20} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Elite Re-Delivery</h3>
              </div>
              <p className="text-2xl md:text-4xl font-black italic tracking-tight leading-tight">
                "{feedback.better_version}"
              </p>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <footer className="flex justify-center pt-8">
           <button 
            onClick={() => router.push("/dashboard")}
            className="group px-12 py-6 rounded-full bg-primary text-white font-black text-xl flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-primary/20 active:scale-95"
          >
            RETURN TO DASHBOARD
            <LayoutGrid size={24} />
          </button>
        </footer>

      </div>
    </div>
  );
}

function ScoreCard({ label, score, color }: { label: string, score: number, color: string }) {
  return (
    <div className="p-8 rounded-[2rem] bg-card border border-border flex flex-col items-center justify-center text-center group hover:border-primary/20 transition-all">
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">{label}</p>
      <div className="relative">
        <span className={cn("text-6xl font-black italic tracking-tighter", color)}>{score}%</span>
        <div className={cn("absolute -inset-4 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full", color.replace("text-", "bg-"))} />
      </div>
    </div>
  );
}
