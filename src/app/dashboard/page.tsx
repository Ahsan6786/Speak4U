import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-bold animate-pulse uppercase tracking-widest text-xs">Preparing Dashboard</p>
        </div>
      </div>
    }>
      <DashboardClient />
    </Suspense>
  );
}
