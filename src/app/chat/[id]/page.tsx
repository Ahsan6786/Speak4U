"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { ArrowLeft, Send, User, MoreVertical, Phone, Video } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { sendMessage } from "@/lib/social";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ChatPage() {
  const { id: chatId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId || !user) return;

    // Fetch data in parallel
    const initChat = async () => {
      try {
        const chatSnap = await getDoc(doc(db, "chats", chatId as string));
        if (!chatSnap.exists()) {
          router.push("/friends");
          return;
        }

        const data = chatSnap.data();
        setChatInfo(data);
        
        const otherUserId = data.participants.find((p: string) => p !== user.uid);
        if (otherUserId) {
          const userSnap = await getDoc(doc(db, "users", otherUserId));
          if (userSnap.exists()) {
            setOtherUser({ uid: otherUserId, ...userSnap.data() });
          }
        }
      } catch (err) {
        console.error("Error loading chat:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initChat();

    // Listen to messages
    const q = query(
      collection(db, "chats", chatId as string, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]);
    });

    return () => unsub();
  }, [chatId, user, router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !chatId) return;

    const text = newMessage;
    setNewMessage("");
    
    try {
      await sendMessage(chatId as string, user.uid, text);
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/60 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-all active:scale-95 shrink-0 shadow-sm"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="w-24 h-4 bg-muted animate-pulse rounded" />
                <div className="w-12 h-2 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ) : otherUser ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-white/10">
                {otherUser.avatar ? (
                  <img src={otherUser.avatar} alt={otherUser.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-white/20" />
                )}
              </div>
              <div>
                <h2 className="font-black italic tracking-tight">{otherUser.name}</h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/70">Online</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"><Phone className="w-4 h-4" /></button>
          <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"><Video className="w-4 h-4" /></button>
          <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"><MoreVertical className="w-4 h-4" /></button>
        </div>
      </header>

      {/* Messages Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02)_0%,transparent_70%)]"
      >
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={cn("flex w-full", i % 2 === 0 ? "justify-start" : "justify-end")}>
                <div className="w-2/3 h-16 bg-muted animate-pulse rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center py-12 space-y-4 opacity-20">
              <div className="w-16 h-16 rounded-[1.5rem] border border-white/20 flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">
                Encryption Enabled<br/>Start of secure conversation
              </p>
            </div>

            {messages.map((msg) => {
              const isMine = msg.senderId === user?.uid;
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    isMine ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] md:max-w-[60%] px-5 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-lg",
                      isMine 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-card border border-white/5 text-foreground rounded-tl-none"
                    )}
                  >
                    {msg.text}
                    <div className={cn(
                      "text-[8px] mt-1 font-black uppercase tracking-widest opacity-40",
                      isMine ? "text-right" : "text-left"
                    )}>
                      {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </main>

      {/* Input Area */}
      <footer className="p-6 border-t border-white/5 bg-card/60 backdrop-blur-xl shrink-0">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto group">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isLoading}
            className="w-full bg-muted border border-white/5 px-8 py-5 pr-16 rounded-[1.5rem] text-sm font-medium outline-none focus:border-primary/50 transition-all shadow-inner disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}
