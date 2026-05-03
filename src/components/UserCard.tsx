"use client";

import { UserProfile, sendFriendRequest } from "@/lib/social";
import { UserPlus, UserCheck, Clock, Flame } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface UserCardProps {
  user: UserProfile;
  currentUserId: string;
  isFriend?: boolean;
  hasPendingRequest?: boolean;
}

export function UserCard({ user, currentUserId, isFriend, hasPendingRequest: initialHasPending }: UserCardProps) {
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(initialHasPending);

  const handleAddFriend = async () => {
    if (loading || requestSent || isFriend) return;
    setLoading(true);
    try {
      await sendFriendRequest(currentUserId, user.uid);
      setRequestSent(true);
    } catch (err) {
      console.error(err);
      alert("Failed to send friend request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative p-6 rounded-[2rem] bg-card/60 border border-white/5 hover:border-primary/50 transition-all duration-500 shadow-xl overflow-hidden ring-1 ring-white/10">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 pointer-events-none group-hover:scale-150 transition-transform duration-700" />
      
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-colors shadow-lg">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-white/20 uppercase">{user.name?.[0] || "?"}</span>
            )}
          </div>
          {isFriend && (
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-background flex items-center justify-center text-white shadow-lg">
              <UserCheck className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h3 className="text-xl font-black tracking-tight italic text-foreground leading-tight">{user.name}</h3>
            {user.streak !== undefined && user.streak > 0 && (
              <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                <Flame className="w-3 h-3 text-orange-500 fill-current" />
                <span className="text-[10px] font-black text-orange-500">{user.streak}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em] opacity-60 line-clamp-1">{user.email}</p>
        </div>

        {user.bio && (
          <p className="text-sm text-muted-foreground/80 font-medium italic line-clamp-2 min-h-[2.5rem]">
            "{user.bio}"
          </p>
        )}

        <button
          onClick={handleAddFriend}
          disabled={loading || requestSent || isFriend}
          className={cn(
            "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95",
            isFriend 
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 cursor-default"
              : requestSent
              ? "bg-yellow-600 text-white shadow-lg shadow-yellow-600/20 cursor-default"
              : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20"
          )}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isFriend ? (
            <>
              <UserCheck className="w-4 h-4" />
              Friends
            </>
          ) : requestSent ? (
            <>
              <Clock className="w-4 h-4" />
              Pending
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Add Friend
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function UserSkeleton() {
  return (
    <div className="p-6 rounded-[2rem] bg-card/60 border border-white/5 shadow-xl animate-pulse">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-20 h-20 rounded-2xl bg-muted" />
        <div className="w-24 h-4 bg-muted rounded" />
        <div className="w-32 h-3 bg-muted rounded" />
        <div className="w-full h-10 bg-muted rounded-xl" />
      </div>
    </div>
  );
}
