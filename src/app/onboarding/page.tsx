"use client";

import { Onboarding } from "@/components/onboarding";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/");
      return;
    }

    // If user is already onboarded, send them back to dashboard
    const unsub = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists() && doc.data().onboarded) {
        router.push("/dashboard");
      }
    });

    return () => unsub();
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0e87cc] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Onboarding 
      user={user} 
      onComplete={() => {
        router.push("/dashboard");
      }} 
    />
  );
}
