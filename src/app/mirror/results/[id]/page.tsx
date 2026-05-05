import { Suspense } from "react";
import MirrorResultsClient from "./MirrorResultsClient";

export const metadata = {
  title: "Mirror Performance Audit – REVIAL",
  description: "Detailed analysis of your facial expressions, body language, and talking style.",
};

export default async function MirrorResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
          <div className="w-20 h-20 rounded-3xl bg-primary/20 animate-pulse mb-8" />
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-500">Retrieving Performance Data...</h2>
        </div>
      }
    >
      <MirrorResultsClient sessionId={resolvedParams.id} />
    </Suspense>
  );
}
