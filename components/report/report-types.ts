import type { getReportData } from "@/actions/report/get-report-data";

export type ReportResult = Extract<
  Awaited<ReturnType<typeof getReportData>>,
  { success: true }
>["data"];

export type BazarEntry = ReportResult["bazarEntries"][number];
export type Expense = ReportResult["expenses"][number];
export type Deposit = ReportResult["deposits"][number];

export type DayRow = {
  date: string;
  bazarEntries: BazarEntry[];
  expenses: Expense[];
  deposits: Deposit[];
};

export type ReportVisibility = {
  showBazar: boolean;
  showExpenses: boolean;
  showDeposits: boolean;
};