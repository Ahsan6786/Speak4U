"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc,
  setDoc
} from "firebase/firestore";
import { ArrowLeft, Send, User, Hash, Users, Flame } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const GLOBAL_ROOM_ID = "public-lounge";

export default function RoomsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [memberInfo, setMemberInfo] = useState<Record<string, any>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    // Ensure global room exists
    const ensureRoom = async () => {
      const roomRef = doc(db, "rooms", GLOBAL_ROOM_ID);
      const snap = await getDoc(roomRef);
      if (!snap.exists()) {
        await setDoc(roomRef, {
          name: "PUBLIC LOUNGE",
          members: [user.uid],
          createdAt: serverTimestamp(),
          isGlobal: true
        });
      }
    };

    ensureRoom();

    // Listen to messages
    const q = query(
      collection(db, "rooms", GLOBAL_ROOM_ID, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setMessages(msgs);

      // Fetch missing member info
      const uniqueSenders = Array.from(new Set(msgs.map((m: any) => m.senderId)));
      const newMemberInfo = { ...memberInfo };
      let changed = false;

      for (const uid of uniqueSenders) {
        if (!newMemberInfo[uid]) {
          const uSnap = await getDoc(doc(db, "users", uid));
          if (uSnap.exists()) {
            newMemberInfo[uid] = uSnap.data();
            changed = true;
          }
        }
      }

      if (changed) setMemberInfo(newMemberInfo);
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const text = newMessage;
    setNewMessage("");
    
    try {
      await addDoc(collection(db, "rooms", GLOBAL_ROOM_ID, "messages"), {
        senderId: user.uid,
        senderName: user.displayName || "Unknown",
        text,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/60 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-all active:scale-95 shrink-0 shadow-sm"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <ThemeToggle />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center border border-border">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black italic tracking-tight uppercase text-foreground">PUBLIC LOUNGE</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/70">Global Conversation</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-hide bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02)_0%,transparent_70%)]"
      >
        <div className="flex flex-col items-center py-12 space-y-4 opacity-20">
          <div className="w-16 h-16 rounded-[1.5rem] border border-white/20 flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-center">
            Welcome to the Public Lounge<br/>Everyone can participate here
          </p>
        </div>

        {messages.map((msg) => {
          const isMine = msg.senderId === user?.uid;
          const sender = memberInfo[msg.senderId];
          
          return (
            <div
              key={msg.id}
              className={cn(
                "flex w-full gap-3",
                isMine ? "flex-row-reverse" : "flex-row"
              )}
            >
              {!isMine && (
                <div className="w-8 h-8 rounded-lg bg-muted flex-shrink-0 overflow-hidden border border-border">
                  {sender?.avatar ? (
                    <img src={sender.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold uppercase">{sender?.name?.[0] || "?"}</div>
                  )}
                </div>
              )}
              
            <div className={cn(
              "flex flex-col space-y-1 max-w-[85%] md:max-w-[70%]",
              isMine ? "items-end" : "items-start"
            )}>
              {isMine ? (
                <div className="flex items-center gap-2 mb-1 mr-1">
                  {user?.uid && memberInfo[user.uid]?.streak !== undefined && memberInfo[user.uid].streak > 0 && (
                    <div className="flex items-center gap-0.5 bg-orange-500/10 px-1.5 py-0.5 rounded-full border border-orange-500/10">
                      <Flame className="w-2.5 h-2.5 text-orange-500 fill-current" />
                      <span className="text-[9px] font-black text-orange-500">{memberInfo[user.uid].streak}</span>
                    </div>
                  )}
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">You</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1 ml-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{sender?.name || "Speaker"}</span>
                  {sender?.streak !== undefined && sender.streak > 0 && (
                    <div className="flex items-center gap-0.5 bg-orange-500/10 px-1.5 py-0.5 rounded-full border border-orange-500/10">
                      <Flame className="w-2.5 h-2.5 text-orange-500 fill-current" />
                      <span className="text-[9px] font-black text-orange-500">{sender.streak}</span>
                    </div>
                  )}
                </div>
              )}
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-md",
                    isMine 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-card border border-border text-foreground rounded-tl-none"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Input Area */}
      <footer className="p-4 sm:p-6 border-t border-border bg-card/60 backdrop-blur-xl">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto group">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full bg-muted border border-border px-6 sm:px-8 py-4 sm:py-5 pr-16 rounded-2xl sm:rounded-[1.5rem] text-sm font-medium outline-none focus:border-blue-500/50 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:scale-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}
