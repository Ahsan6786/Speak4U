"use client";

import { handleFriendRequest } from "@/lib/social";
import { Check, X, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FriendRequestItemProps {
  request: {
    id: string;
    senderId: string;
    senderName?: string;
    senderAvatar?: string;
  };
  onUpdate: () => void;
}

export function FriendRequestItem({ request, onUpdate }: FriendRequestItemProps) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (status: "accepted" | "rejected") => {
    setLoading(true);
    try {
      await handleFriendRequest(request.id, status);
      onUpdate();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-white/10">
          {request.senderAvatar ? (
            <img src={request.senderAvatar} alt={request.senderName} className="w-full h-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-white/20" />
          )}
        </div>
        <div>
          <h4 className="font-bold text-sm tracking-tight">{request.senderName || "Unknown User"}</h4>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Sent a request</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleAction("rejected")}
          disabled={loading}
          className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center hover:bg-red-500 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-red-600/20"
          title="Decline"
        >
          <X className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleAction("accepted")}
          disabled={loading}
          className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-600/20"
          title="Accept"
        >
          <Check className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
