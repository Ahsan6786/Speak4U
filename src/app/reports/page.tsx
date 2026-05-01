import { Suspense } from "react";
import ReportsClient from "./ReportsClient";

export default function ReportsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-bold animate-pulse">Loading Reports...</p>
      </div>
    }>
      <ReportsClient />
    </Suspense>
  );
}
