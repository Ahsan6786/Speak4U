import ReportsClient from "./ReportsClient";
import { Suspense } from "react";

export default function ReportsPage() {
  return (
    <Suspense fallback={<div>Loading Archive...</div>}>
      <ReportsClient />
    </Suspense>
  );
}
