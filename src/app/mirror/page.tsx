import { Suspense } from "react";
import MirrorClient from "./MirrorClient";

export const metadata = {
  title: "Mirror Mode – REVIAL",
  description: "Master your body language and speaking style with real-time video feedback.",
};

export default function MirrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background p-6 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-4xl aspect-video rounded-[3rem] bg-muted/40 animate-pulse border border-white/5" />
        </div>
      }
    >
      <MirrorClient />
    </Suspense>
  );
}
