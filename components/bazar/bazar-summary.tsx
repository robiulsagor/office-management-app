import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type BazarSummaryProps = {
  deposits: number;
  expense: number;
  balance: number;
};

const formatCurrency = (amount: number) =>
  `৳${amount.toLocaleString("en-BD")}`;

const BazarSummary = ({
  deposits,
  expense,
  balance,
}: BazarSummaryProps) => {
  const balanceIsLow = balance <= 50;

  return (
    <div className="grid gap-4 sm:grid-cols-3">

      {/* Deposits */}
      <Card className="border-0 bg-emerald-50">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-100">
            <ArrowDownToLine className="size-5 text-emerald-700" />
          </div>

          <div>
            <p className="text-sm text-emerald-700/80">
              Total Deposits
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-800">
              {formatCurrency(deposits)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Expense */}
      <Card className="border-0 bg-orange-50">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-orange-100">
            <ArrowUpFromLine className="size-5 text-orange-700" />
          </div>

          <div>
            <p className="text-sm text-orange-700/80">
              Total Expense
            </p>

            <p className="mt-1 text-2xl font-bold text-orange-800">
              {formatCurrency(expense)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Balance */}
      <Card
        className={
          balanceIsLow
            ? "border-0 bg-red-50"
            : "border-0 bg-sky-50"
        }
      >
        <CardContent className="flex items-center gap-4 p-5">
          <div
            className={
              balanceIsLow
                ? "flex size-11 items-center justify-center rounded-xl bg-red-100"
                : "flex size-11 items-center justify-center rounded-xl bg-sky-100"
            }
          >
            <Wallet
              className={
                balanceIsLow
                  ? "size-5 text-red-700"
                  : "size-5 text-sky-700"
              }
            />
          </div>

          <div>
            <p
              className={
                balanceIsLow
                  ? "text-sm text-red-700/80"
                  : "text-sm text-sky-700/80"
              }
            >
              Balance
            </p>

            <p
              className={
                balanceIsLow
                  ? "mt-1 text-2xl font-bold text-red-800"
                  : "mt-1 text-2xl font-bold text-sky-800"
              }
            >
              {formatCurrency(balance)}
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default BazarSummary;