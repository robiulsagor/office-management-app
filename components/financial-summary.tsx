"use client";

import { useEffect, useState } from "react";

import { getFinancialSummary } from "@/actions/deposit/financial-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FinancialSummaryData = {
  totalDeposits: number;
  bazarSpending: number;
  otherExpenses: number;
  remainingBalance: number;
};

type FinancialSummaryProps = {
  month?: string;
};

function getCurrentMonth() {
  // Use Bangladesh local time to determine the current month.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;

  return `${year}-${month}`;
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function FinancialSummary({
  month,
}: FinancialSummaryProps) {
  const selectedMonth = month ?? getCurrentMonth();

  const [summary, setSummary] =
    useState<FinancialSummaryData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadSummary() {
      setLoading(true);
      setError(null);

      const result = await getFinancialSummary(selectedMonth);

      if (ignore) return;

      if (!result.success) {
        setError(result.message);
        setSummary(null);
      } else {
        setSummary(result.summary);
      }

      setLoading(false);
    }

    void loadSummary();

    return () => {
      ignore = true;
    };
  }, [selectedMonth]);

  const cards = [
    {
      title: "Total Deposits",
      value: summary?.totalDeposits,
    },
    {
      title: "Bazar Spending",
      value: summary?.bazarSpending,
    },
    {
      title: "Other Expenses",
      value: summary?.otherExpenses,
    },
    {
      title: "Remaining Balance",
      value: summary?.remainingBalance,
    },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-700">
        Financial Summary
      </h2>

      {loading ? (
        <p className="text-sm text-muted-foreground">
          Loading financial summary...
        </p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-2xl font-bold">
                  {formatMoney(card.value ?? 0)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}