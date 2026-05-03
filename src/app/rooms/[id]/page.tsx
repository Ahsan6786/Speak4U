"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { ArrowLeft, Send, User, Hash, Users, Info } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RoomChatPage() {
  const { id: roomId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomInfo, setRoomInfo] = useState<any>(null);
  const [memberInfo, setMemberInfo] = useState<Record<string, any>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomId || !user) return;

    // Fetch room info
    const fetchRoom = async () => {
      const roomSnap = await getDoc(doc(db, "rooms", roomId as string));
      if (roomSnap.exists()) {
        const data = roomSnap.data();
        setRoomInfo(data);
        
        // Fetch member profiles
        const membersData: Record<string, any> = {};
        await Promise.all(
          data.members.slice(0, 10).map(async (uid: string) => {
            const uSnap = await getDoc(doc(db, "users", uid));
            if (uSnap.exists()) {
              membersData[uid] = uSnap.data();
            }
          })
        );
        setMemberInfo(membersData);
      } else {
        router.push("/rooms");
      }
    };

    fetchRoom();

    const q = query(
      collection(db, "rooms", roomId as string, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [roomId, user, router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !roomId) return;

    const text = newMessage;
    setNewMessage("");
    
    try {
      await addDoc(collection(db, "rooms", roomId as string, "messages"), {
        senderId: user.uid,
        senderName: user.displayName || "Unknown",
        text,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    }
  };

  if (!roomInfo) return null;

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/60 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/rooms"
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-all active:scale-95 shrink-0 shadow-sm"
            title="Back to Rooms"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <ThemeToggle />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center border border-border">
              <Hash className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black italic tracking-tight uppercase text-foreground">{roomInfo.name}</h2>
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-blue-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500/70">{roomInfo.members?.length || 0} Members Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
      >
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
                <div className="w-8 h-8 rounded-lg bg-muted flex-shrink-0 overflow-hidden border border-white/10">
                  {sender?.avatar ? (
                    <img src={sender.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold uppercase">{sender?.name?.[0] || "?"}</div>
                  )}
                </div>
              )}
              
              <div className={cn(
                "flex flex-col space-y-1 max-w-[80%] md:max-w-[60%]",
                isMine ? "items-end" : "items-start"
              )}>
                {!isMine && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{sender?.name || "Speaker"}</span>
                )}
                <div
                  className={cn(
                    "px-5 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-lg",
                    isMine 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-card border border-white/5 text-foreground rounded-tl-none"
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
      <footer className="p-6 border-t border-white/5 bg-card/60 backdrop-blur-xl">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto group">
          <input
            type="text"
            placeholder="Broadcast to room..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full bg-muted border border-white/5 px-8 py-5 pr-16 rounded-[1.5rem] text-sm font-medium outline-none focus:border-blue-500/50 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:scale-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}

// Fixed missing function
