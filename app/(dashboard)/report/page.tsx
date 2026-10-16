import { Suspense } from "react";

import FinancialReport from "@/components/report/financial-report";

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl border p-10 text-center text-sm text-muted-foreground">
          Loading financial report...
        </div>
      }
    >
      <FinancialReport />
    </Suspense>
  );
}