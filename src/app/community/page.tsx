"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { searchUsers, UserProfile, FriendRequest } from "@/lib/social";
import { UserCard, UserSkeleton } from "@/components/UserCard";
import { LayoutGrid, Search, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ThemeToggle } from "@/components/theme-toggle";

export default function CommunityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    // Listen to current user's friends and pending requests to show correct button state
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        setFriends(doc.data().friends || []);
      }
    });

    const q = query(
      collection(db, "friendRequests"),
      where("senderId", "==", user.uid),
      where("status", "==", "pending")
    );
    const unsubRequests = onSnapshot(q, (snapshot) => {
      setPendingRequests(snapshot.docs.map(d => d.data().receiverId));
    });

    return () => {
      unsubUser();
      unsubRequests();
    };
  }, [user]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const results = await searchUsers(user.uid, searchTerm);
        setUsers(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [user, searchTerm]);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 selection:bg-primary/30">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between gap-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-all active:scale-95 shrink-0 shadow-sm"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <ThemeToggle />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70">Social Discovery</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-foreground italic leading-none">COMMUNITY</h1>
            </div>
          </div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="SEARCH SPEAKERS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card/60 border border-white/5 px-14 py-4 sm:py-5 rounded-[1.5rem] font-black text-[10px] sm:text-xs uppercase tracking-widest outline-none focus:border-primary/50 transition-all shadow-xl"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <UserSkeleton key={i} />)}
          </div>
        ) : users.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((u) => (
              <UserCard
                key={u.uid}
                user={u}
                currentUserId={user?.uid || ""}
                isFriend={friends.includes(u.uid)}
                hasPendingRequest={pendingRequests.includes(u.uid)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center">
            <div className="w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
              <Users className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black italic tracking-tight">No Speakers Found</h3>
              <p className="text-muted-foreground font-medium max-w-xs">Try adjusting your search terms or check back later for new members.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to avoid build error
import { doc } from "firebase/firestore";
