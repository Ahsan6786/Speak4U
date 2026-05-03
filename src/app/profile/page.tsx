import { Suspense } from "react";
import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "Your Profile – REVIAL",
  description: "View your speaking analytics, session history, and performance trends.",
};

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-6 md:p-12 space-y-8 animate-pulse">
          <div className="h-40 rounded-[2.5rem] bg-muted/40 border border-white/5" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-[2rem] bg-muted/30 border border-white/5" />
            ))}
          </div>
          <div className="h-64 rounded-[2.5rem] bg-muted/30 border border-white/5" />
          <div className="h-64 rounded-[2.5rem] bg-muted/30 border border-white/5" />
        </div>
      }
    >
      <ProfileClient />
    </Suspense>
  );
}
