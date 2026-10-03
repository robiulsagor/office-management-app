"use client";

import { useEffect, useState } from "react";
import { getFinancialSummary } from "@/actions/deposit/financial-summary";

type Summary = {
  totalDeposits: number;
  bazarSpending: number;
  otherExpenses: number;
  remainingBalance: number;
};

function money(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function FinancialSummary() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadSummary() {
      try {
        const result = await getFinancialSummary();

        if (ignore) return;

        if (!result.success) {
          setError(result.message ?? "Failed to load financial summary.");
          return;
        }

        if (!result.summary) {
          setError("Financial summary is unavailable.");
          return;
        }

        setSummary(result.summary);
      } catch {
        if (!ignore) {
          setError("Failed to load financial summary.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        Loading financial summary...
      </div>
    );
  }

  if (error || !summary) {
    return (
      <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        {error || "Financial summary unavailable."}
      </p>
    );
  }

  const cards = [
    {
      title: "Total Deposits",
      amount: summary.totalDeposits,
      color: "text-blue-700",
    },
    {
      title: "Bazar Spending",
      amount: summary.bazarSpending,
      color: "text-orange-700",
    },
    {
      title: "Other Expenses",
      amount: summary.otherExpenses,
      color: "text-purple-700",
    },
    {
      title: "Remaining Balance",
      amount: summary.remainingBalance,
      color: summary.remainingBalance < 0 ? "text-red-700" : "text-green-700",
    },
  ];

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">
        Financial Summary
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{card.title}</p>

            <p
              className={`mt-2 wrap-break-words text-2xl font-bold ${card.color}`}
            >
              ৳{money(card.amount)}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        Calculated from records dated 1 October 2026 onward.
      </p>
    </section>
  );
}
