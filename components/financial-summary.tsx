"use client";

import { useEffect, useRef, useState } from "react";
import {
  Wallet,
  ShoppingBasket,
  Receipt,
  Calculator,
  PiggyBank,
  RefreshCw,
} from "lucide-react";

import { getFinancialSummary } from "@/actions/deposit/financial-summary";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FinancialSummaryData = {
  totalDeposits: number;
  bazarSpending: number;
  otherExpenses: number;
  totalExpenses: number;
  remainingBalance: number;
};

type FinancialSummaryProps = {
  month?: string;
};

function getCurrentMonth() {
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

function getBalanceColors(balance: number) {
  if (balance < 0) {
    return {
      card: "border-red-300 bg-red-100",
      icon: "bg-red-200 text-red-800",
      title: "text-red-800",
      amount: "text-red-900",
      description: "text-red-700",
    };
  }

  if (balance <= 100) {
    return {
      card: "border-rose-200 bg-rose-50",
      icon: "bg-rose-100 text-rose-700",
      title: "text-rose-700",
      amount: "text-rose-800",
      description: "text-rose-600",
    };
  }

  if (balance <= 300) {
    return {
      card: "border-lime-200 bg-lime-50",
      icon: "bg-lime-100 text-lime-800",
      title: "text-lime-800",
      amount: "text-lime-900",
      description: "text-lime-700",
    };
  }

  return {
    card: "border-emerald-200 bg-emerald-100",
    icon: "bg-emerald-200 text-emerald-800",
    title: "text-emerald-800",
    amount: "text-emerald-900",
    description: "text-emerald-700",
  };
}

export default function FinancialSummary({
  month,
}: FinancialSummaryProps) {
  const selectedMonth = month ?? getCurrentMonth();

  const [summary, setSummary] =
    useState<FinancialSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasLoaded = useRef(false);

  useEffect(() => {
    let ignore = false;

    async function loadSummary() {
      if (!hasLoaded.current) {
        setLoading(true);
      }

      setRefreshing(true);

      try {
        const result = await getFinancialSummary(selectedMonth);

        if (ignore) return;

        if (!result.success) {
          setError(result.message);
          return;
        }

        setSummary(result.summary);
        setError(null);
      } catch {
        if (!ignore) {
          setError("Unable to update financial summary.");
        }
      } finally {
        if (!ignore) {
          hasLoaded.current = true;
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    const handleFinancialUpdate = () => {
      void loadSummary();
    };

    void loadSummary();

    window.addEventListener(
      "financial-summary-updated",
      handleFinancialUpdate,
    );

    return () => {
      ignore = true;

      window.removeEventListener(
        "financial-summary-updated",
        handleFinancialUpdate,
      );
    };
  }, [selectedMonth]);

  const balance = summary?.remainingBalance ?? 0;
  const balanceColors = getBalanceColors(balance);

  const cards = [
    {
      title: "Total Deposits",
      value: summary?.totalDeposits,
      description: "Money received",
      Icon: Wallet,
      cardClass: "border-emerald-200 bg-emerald-50",
      iconClass: "bg-emerald-100 text-emerald-700",
      titleClass: "text-emerald-800",
      amountClass: "text-emerald-950",
      descriptionClass: "text-emerald-700",
    },
    {
      title: "Bazar Spending",
      value: summary?.bazarSpending,
      description: "Bazar purchases",
      Icon: ShoppingBasket,
      cardClass: "border-orange-200 bg-orange-50",
      iconClass: "bg-orange-100 text-orange-700",
      titleClass: "text-orange-800",
      amountClass: "text-orange-950",
      descriptionClass: "text-orange-700",
    },
    {
      title: "Other Expenses",
      value: summary?.otherExpenses,
      description: "Other costs",
      Icon: Receipt,
      cardClass: "border-blue-200 bg-blue-50",
      iconClass: "bg-blue-100 text-blue-700",
      titleClass: "text-blue-800",
      amountClass: "text-blue-950",
      descriptionClass: "text-blue-700",
    },
    {
      title: "Total Expenses",
      value: summary?.totalExpenses,
      description: "Bazar + other expenses",
      Icon: Calculator,
      cardClass: "border-amber-200 bg-amber-50",
      iconClass: "bg-amber-100 text-amber-800",
      titleClass: "text-amber-800",
      amountClass: "text-amber-950",
      descriptionClass: "text-amber-700",
    },
    {
      title: "Remaining Balance",
      value: summary?.remainingBalance,
      description:
        balance < 0
          ? "Spending exceeds deposits"
          : balance <= 100
            ? "Balance is running low"
            : balance <= 300
              ? "Balance is getting better"
              : "Healthy remaining balance",
      Icon: PiggyBank,
      cardClass: balanceColors.card,
      iconClass: balanceColors.icon,
      titleClass: balanceColors.title,
      amountClass: balanceColors.amount,
      descriptionClass: balanceColors.description,
    },
  ];

  return (
    <section className="w-full space-y-4" aria-busy={refreshing}>
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-slate-800 sm:text-xl">
            Financial Summary
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Monthly income and expenses
          </p>
        </div>

        {refreshing && !loading && (
          <RefreshCw
            className="size-4 shrink-0 animate-spin text-slate-400"
            aria-label="Updating financial summary"
          />
        )}
      </div>

      {loading && !summary ? (
        <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-36 animate-pulse rounded-xl border bg-slate-100"
            />
          ))}
        </div>
      ) : error && !summary ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <>
          {error && (
            <p className="text-sm text-red-600" role="status">
              {error} Showing the last available figures.
            </p>
          )}

          <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => {
              const Icon = card.Icon;

              return (
                <Card
                  key={card.title}
                  className={`min-w-0 overflow-hidden rounded-xl border shadow-sm transition-shadow duration-200 hover:shadow-md ${card.cardClass}`}
                >
                  <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 p-4 pb-2 sm:p-5 sm:pb-3">
                    <CardTitle
                      className={`min-w-0 text-xs font-semibold leading-5 sm:text-sm ${card.titleClass}`}
                    >
                      {card.title}
                    </CardTitle>

                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${card.iconClass}`}
                    >
                      <Icon className="size-[18px]" />
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
                    <p
                      className={`break-words text-lg font-bold leading-tight tracking-tight tabular-nums sm:text-xl xl:text-2xl ${card.amountClass}`}
                    >
                      {formatMoney(card.value ?? 0)}
                    </p>

                    <p
                      className={`mt-2 text-[11px] leading-4 sm:text-xs ${card.descriptionClass}`}
                    >
                      {card.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}