"use client";

import { useEffect, useMemo, useState } from "react";
import { createDeposit, getMyDeposits } from "@/actions/deposit/create-deposit";
import FinancialSummary from "@/components/financial-summary";
import { useSearchParams } from "next/navigation";
import MonthSelector from "@/components/month-selector";

type Deposit = {
  id: string;
  date: Date;
  amount: number;
  purpose: "BAZAR" | "OTHER" | null;
  remarks: string | null;
  createdAt: Date;
  updatedAt: Date;
};

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function dateInputValue(value: Date | string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function getCurrentMonth() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  return `${parts.find((p) => p.type === "year")?.value}-${parts.find((p) => p.type === "month")?.value}`;
}

export default function DepositPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [date, setDate] = useState(getToday);
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState<"" | "BAZAR" | "OTHER">("");
  const [remarks, setRemarks] = useState("");

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();

  const month = searchParams.get("month") ?? getCurrentMonth();

  useEffect(() => {
    let ignore = false;

    async function fetchDeposits() {
      try {
        const result = await getMyDeposits();

        if (ignore) return;

        if (!result.success) {
          setError(result.message);
          return;
        }

        setDeposits(result.deposits as Deposit[]);
        setError("");
      } catch {
        if (!ignore) {
          setError("Failed to load deposits.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void fetchDeposits();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    const numericAmount = Number(amount);

    if (!date) {
      setError("Please select a deposit date.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await createDeposit({
        date,
        amount: numericAmount,
        purpose: purpose || undefined,
        remarks,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setMessage(result.message);
      setAmount("");
      setPurpose("");
      setRemarks("");
      setDate(getToday());

      const resultAfterSave = await getMyDeposits();

      if (resultAfterSave.success) {
        setDeposits(resultAfterSave.deposits as Deposit[]);
      }
    } catch {
      setError("Something went wrong while saving the deposit.");
    } finally {
      setSubmitting(false);
    }
  }

  const filteredDeposits = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return deposits.filter((deposit) => {
      const depositDate = dateInputValue(deposit.date);

      const matchesSearch =
        !keyword ||
        (deposit.remarks ?? "").toLowerCase().includes(keyword) ||
        (deposit.purpose ?? "").toLowerCase().includes(keyword) ||
        deposit.amount.toString().includes(keyword);

      const matchesFromDate = !fromDate || depositDate >= fromDate;

      const matchesToDate = !toDate || depositDate <= toDate;

      return matchesSearch && matchesFromDate && matchesToDate;
    });
  }, [deposits, search, fromDate, toDate]);

  const totalAmount = filteredDeposits.reduce(
    (total, deposit) => total + deposit.amount,
    0,
  );

  return (
    <main className="mx-auto  space-y-6 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Deposit Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Record and manage your deposits.
          </p>
        </div>

        <MonthSelector month={month} basePath="/deposit" />
      </div>

      <FinancialSummary month={month} />

      {/* Create deposit form */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-slate-800">
          Add New Deposit
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="deposit-date"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Deposit Date *
              </label>
              <input
                id="deposit-date"
                type="date"
                required
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="deposit-amount"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Amount (BDT) *
              </label>
              <input
                id="deposit-amount"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="Enter amount"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="deposit-purpose"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Purpose
              </label>
              <select
                id="deposit-purpose"
                value={purpose}
                onChange={(event) =>
                  setPurpose(event.target.value as "" | "BAZAR" | "OTHER")
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Not specified</option>
                <option value="BAZAR">Bazar</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="deposit-remarks"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Remarks
              </label>
              <input
                id="deposit-remarks"
                type="text"
                maxLength={500}
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Optional remarks"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700"
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Deposit"}
          </button>
        </form>
      </section>

      {/* Deposit summary */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Total Deposits
          {fromDate || toDate || search ? " (Filtered)" : ""}
        </p>
        <p className="mt-2 text-3xl font-bold text-slate-900">
          ৳{formatMoney(totalAmount)}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {filteredDeposits.length} record(s)
        </p>
      </section>

      {/* Search and filters */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">My Deposits</h2>
          <p className="mt-1 text-sm text-slate-500">
            Search and filter your deposit records.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search amount, purpose, remarks..."
            className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 md:col-span-2"
          />

          <input
            aria-label="From date"
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
          />

          <input
            aria-label="To date"
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(event) => setToDate(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-162.5 text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Purpose</th>
                <th className="px-4 py-3 font-semibold">Remarks</th>
                <th className="px-4 py-3 font-semibold">Created At</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    Loading deposits...
                  </td>
                </tr>
              ) : filteredDeposits.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    No deposit records found.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3">
                      {formatDate(deposit.date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                      ৳{formatMoney(deposit.amount)}
                    </td>
                    <td className="px-4 py-3">
                      {deposit.purpose === "BAZAR"
                        ? "Bazar"
                        : deposit.purpose === "OTHER"
                          ? "Other"
                          : "—"}
                    </td>
                    <td className="max-w-xs whitespace-pre-wrap wrap-break-words px-4 py-3 text-slate-600">
                      {deposit.remarks || "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {formatDate(deposit.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">
            Showing {filteredDeposits.length} of {deposits.length} records
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setFromDate("");
              setToDate("");
            }}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Clear Filters
          </button>
        </div>
      </section>
    </main>
  );
}
