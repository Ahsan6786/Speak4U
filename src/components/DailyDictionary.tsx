"use client";

import React, { useState, useMemo } from "react";
import { Search, Book, Sparkles, ChevronRight, Hash, X, Globe, MessageSquare } from "lucide-react";
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Simple Header Section */}
      <div className="relative p-10 md:p-16 rounded-[3.5rem] bg-card/40 border border-white/5 shadow-2xl overflow-hidden ring-1 ring-white/10 text-center flex flex-col items-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] -ml-24 -mb-24 pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-2xl">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/70">Elite Vocabulary</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-none">
            REVIAL <span className="text-primary">Dictionary</span>
          </h1>
          <p className="text-muted-foreground/80 text-lg md:text-2xl font-black italic tracking-tight leading-relaxed">
            Learn elite words, speak fluently.
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                  selectedCategory === cat 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110" 
                    : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
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
            className="group cursor-pointer rounded-[2rem] bg-card/30 border-2 border-white/5 hover:border-primary/50 transition-all duration-500 hover:scale-[1.05] active:scale-[0.95] shadow-xl flex flex-col relative overflow-hidden aspect-square md:aspect-video items-center justify-center text-center p-6"
          >
            {/* Category Accent Line */}
            <div className={cn(
              "absolute top-0 left-0 w-full h-1 opacity-40 group-hover:opacity-100 transition-opacity",
              item.category === "Professional" ? "bg-blue-500" :
              item.category === "Emotional" ? "bg-rose-500" :
              item.category === "Social" ? "bg-emerald-500" : "bg-orange-500"
            )} />

            <div className="relative z-10 space-y-4">
              <div className={cn(
                "mx-auto px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border w-fit transition-all",
                item.category === "Professional" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                item.category === "Emotional" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                item.category === "Social" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                "bg-orange-500/10 text-orange-500 border-orange-500/20"
              )}>
                {item.category}
              </div>
              
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter group-hover:text-primary transition-colors italic leading-none">
                {item.word}
              </h3>

              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground/40 group-hover:text-primary/60 transition-colors uppercase tracking-widest">
                <span>View Meaning</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>

            {/* Subtle Sparkle on Hover */}
            <div className="absolute bottom-4 right-4">
              <Sparkles className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-100" />
            </div>
          </div>
        ))}
      </div>

      {filteredWords.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-[2rem] bg-muted flex items-center justify-center mb-6">
            <X className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <h2 className="text-2xl font-black text-muted-foreground italic">No words found...</h2>
          <p className="text-muted-foreground/50 text-sm mt-2 font-medium">Try searching for something else</p>
        </div>
      )}

      {/* Detail Modal Overlay */}
      {selectedWord && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedWord(null)}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
          <div 
            className="relative w-full max-w-2xl bg-card border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedWord(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-border transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-12 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/80 italic">{selectedWord.category} Usage</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic">{selectedWord.word}</h2>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 w-fit">
                  <Globe className="w-5 h-5 text-emerald-500" />
                  <span className="text-xl md:text-2xl font-black text-emerald-500 italic">{selectedWord.hinglish}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 p-6 rounded-[2rem] bg-muted/30 border border-white/5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Book className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Meaning</span>
                  </div>
                  <p className="text-lg font-medium leading-relaxed">{selectedWord.meaning}</p>
                </div>

                <div className="space-y-4 p-6 rounded-[2rem] bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-2 text-primary">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Kab use karein?</span>
                  </div>
                  <p className="text-lg font-bold italic text-primary/80">{selectedWord.usage}</p>
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-foreground text-background relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-background/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-background/50">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Perfect Example</span>
                  </div>
                  <p className="text-xl md:text-3xl font-black italic tracking-tight leading-tight">
                    "{selectedWord.example}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
