"use client";

import React, { useState, useMemo } from "react";
import { Search, Book, Sparkles, ChevronRight, Hash, X, Globe, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DICTIONARY_DATA, DictionaryWord } from "@/lib/dictionary-data";
import { cn } from "@/lib/utils";

export function DailyDictionary() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "All">("All");
  const [selectedWord, setSelectedWord] = useState<DictionaryWord | null>(null);

  const categories = ["All", "Daily", "Professional", "Emotional", "Social"];

  const filteredWords = useMemo(() => {
    return DICTIONARY_DATA.filter(w => {
      const matchesSearch = w.word.toLowerCase().includes(search.toLowerCase()) || 
                            w.hinglish.toLowerCase().includes(search.toLowerCase()) ||
                            w.meaning.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || w.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Simple Header Section */}
      <div className="relative p-12 md:p-20 rounded-[4rem] bg-card/40 border border-border/50 shadow-2xl overflow-hidden text-center flex flex-col items-center">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none opacity-30" />

        <div className="relative z-10 space-y-8 max-w-3xl">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Elite Vocabulary</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-none">
              REVIAL <span className="text-primary">LEXICON</span>
            </h1>
            <p className="text-muted-foreground/60 text-lg md:text-xl font-medium italic tracking-tight">
              Master the words that command respect.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full max-w-xl mx-auto group">
            <div className="absolute inset-0 bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-500 rounded-full" />
            <div className="relative flex items-center bg-background/50 backdrop-blur-xl border border-border rounded-full px-6 py-4 transition-all focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
              <Search className="w-5 h-5 text-muted-foreground mr-4" />
              <input 
                type="text"
                placeholder="Search words, meanings, or Hinglish context..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-foreground font-medium placeholder:text-muted-foreground/40 text-lg"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border",
                  selectedCategory === cat 
                    ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-105" 
                    : "bg-background/50 text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredWords.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedWord(item)}
            className="group cursor-pointer rounded-[2.5rem] bg-card/40 border border-border/50 hover:border-primary/40 transition-all duration-700 hover:scale-[1.02] active:scale-[0.98] shadow-lg flex flex-col relative overflow-hidden aspect-square items-center justify-center text-center p-8"
          >
            {/* Category Indicator */}
            <div className={cn(
              "absolute top-6 left-6 w-1.5 h-1.5 rounded-full",
              item.category === "Professional" ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" :
              item.category === "Emotional" ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" :
              item.category === "Social" ? "bg-emerald-500 shadow-[0_0_100px_rgba(16,185,129,0.5)]" : 
              "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
            )} />

            <div className="relative z-10 space-y-3">
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter group-hover:text-primary transition-colors italic leading-tight uppercase break-words hyphens-auto max-w-full">
                {item.word}
              </h3>
              <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] group-hover:text-primary/40 transition-colors">
                {item.hinglish}
              </p>
            </div>

            {/* Hover Reveal */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
               <div className="px-4 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-[8px] font-black uppercase tracking-widest text-primary">View Meaning</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-[3rem] bg-muted/50 border border-border flex items-center justify-center mb-8">
            <X className="w-10 h-10 text-muted-foreground/20" />
          </div>
          <h2 className="text-3xl font-black text-muted-foreground italic tracking-tight">No results for "{search}"</h2>
          <p className="text-muted-foreground/40 text-lg mt-3 font-medium">Try broadening your search or choosing another category.</p>
        </div>
      )}

      {/* Detail Modal Overlay */}
      <AnimatePresence>
        {selectedWord && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedWord(null)}
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-2xl" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-card border border-border rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              {/* Premium Background Accents */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] -ml-40 -mb-40 pointer-events-none" />

              {/* Close Button */}
              <div className="absolute top-8 right-8 z-50">
                <button 
                  onClick={() => setSelectedWord(null)}
                  className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center hover:bg-muted/80 hover:scale-110 transition-all active:scale-90 group"
                >
                  <X className="w-6 h-6 text-foreground group-hover:rotate-90 transition-transform duration-500" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-10 md:p-16 space-y-16 scrollbar-hide custom-scrollbar">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="px-5 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">{selectedWord.category} Usage</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter italic leading-[0.9] bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 uppercase break-words hyphens-auto">
                      {selectedWord.word}
                    </h2>
                    
                    <div className="flex items-center gap-5 p-6 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 w-fit">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                        <Globe className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-1">In Context (Hinglish)</p>
                        <span className="text-3xl md:text-4xl font-black text-emerald-500 italic leading-none">{selectedWord.hinglish}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6 p-10 rounded-[3rem] bg-muted/30 border border-border group hover:bg-muted/50 transition-all">
                    <div className="flex items-center gap-3 text-muted-foreground group-hover:text-primary transition-colors">
                      <Book className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Formal Definition</span>
                    </div>
                    <p className="text-2xl font-bold leading-tight text-foreground/90 group-hover:text-foreground">
                      {selectedWord.meaning}
                    </p>
                  </div>

                  <div className="space-y-6 p-10 rounded-[3rem] bg-primary/5 border border-primary/10 group hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-3 text-primary">
                      <Sparkles className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Social Command</span>
                    </div>
                    <p className="text-2xl font-black italic text-primary group-hover:scale-[1.05] transition-transform origin-left leading-tight">
                      {selectedWord.usage}
                    </p>
                  </div>
                </div>

                <div className="relative group overflow-hidden rounded-[3.5rem]">
                  <div className="absolute inset-0 bg-foreground group-hover:bg-foreground/90 transition-colors" />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-background/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                  <div className="relative z-10 p-12 md:p-16 space-y-8">
                    <div className="flex items-center gap-4 text-background/30">
                      <MessageSquare className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Natural Application</span>
                    </div>
                    <p className="text-3xl md:text-5xl font-black italic tracking-tighter leading-tight text-background">
                      "{selectedWord.example}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
