import { Suspense } from "react";
import ResultsClient from "./ResultsClient";

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground">
        <div className="w-16 h-16 rounded-2xl blue-gradient blue-glow flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
        <p className="mt-8 text-xl font-bold animate-pulse">Analyzing Results...</p>
      </div>
    }>
      <ResultsClient />
    </Suspense>
  );
}
