import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  Users,
  UserCheck,
  Wallet,
  ShoppingBasket,
  ArrowRight,
  ReceiptText,
  Plus,
} from "lucide-react";

const formatAmount = (amount: number) =>
  `৳${amount.toLocaleString("en-BD")}`;

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const Dashboard = async () => {
  const session = await auth();

  const now = new Date();

  const startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  );

  const endDate = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1,
  );

  const monthName = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const [
    totalEmployees,
    activeEmployees,
    monthlyExpense,
    recentExpenses,
    monthlyBazarEntries,
    recentBazarEntries,
  ] = await Promise.all([
    prisma.employee.count(),

    prisma.employee.count({
      where: {
        employmentStatus: "ACTIVE",
      },
    }),

    prisma.expense.aggregate({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    }),

    prisma.bazarEntry.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        items: {
          select: {
            price: true,
          },
        },
      },
    }),

    prisma.bazarEntry.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 5,
      select: {
        id: true,
        date: true,
        type: true,
        items: {
          select: {
            price: true,
            bazarItem: {
              select: {
                nameEn: true,
                nameBn: true,
              },
            },
          },
        },
      },
    }),
  ]);

  const totalExpense = Number(
    monthlyExpense._sum.amount ?? 0,
  );

  const totalBazar = monthlyBazarEntries.reduce(
    (total, entry) =>
      total +
      entry.items.reduce(
        (itemTotal, item) =>
          itemTotal + Number(item.price),
        0,
      ),
    0,
  );

  const summaryCards = [
    {
      title: "Total Employees",
      value: totalEmployees.toLocaleString("en-BD"),
      description: "All registered employees",
      icon: Users,
      href: "/employees",
    },
    {
      title: "Active Employees",
      value: activeEmployees.toLocaleString("en-BD"),
      description: "Currently active employees",
      icon: UserCheck,
      href: "/employees",
    },
    {
      title: "Monthly Expense",
      value: formatAmount(totalExpense),
      description: monthName,
      icon: Wallet,
      href: "/expenses",
    },
    {
      title: "Monthly Bazar",
      value: formatAmount(totalBazar),
      description: monthName,
      icon: ShoppingBasket,
      href: "/bazar",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back
            {session?.user?.name
              ? `, ${session.user.name}`
              : ""}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s an overview of your office.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          {now.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Summary Cards */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-xl border bg-card p-5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>

                  <div className="rounded-lg border p-2">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                </div>

                <p className="mt-4 text-2xl font-bold tracking-tight">
                  {card.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {card.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent Records */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Recent Expenses */}
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center justify-between gap-3 border-b p-5">
            <div>
              <h2 className="font-semibold">
                Recent Expenses
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Latest expenses for {monthName}
              </p>
            </div>

            <Link
              href="/expenses"
              className="flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
            >
              View all
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {recentExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
              <ReceiptText className="size-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                No expenses this month
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                New expenses will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {expense.category.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {expense.description || "No description"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(expense.date)}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold">
                    {formatAmount(Number(expense.amount))}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="border-t px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                Monthly total
              </span>

              <span className="font-semibold">
                {formatAmount(totalExpense)}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Bazar */}
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center justify-between gap-3 border-b p-5">
            <div>
              <h2 className="font-semibold">
                Recent Bazar
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Latest bazar entries for {monthName}
              </p>
            </div>

            <Link
              href="/bazar"
              className="flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
            >
              View all
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {recentBazarEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
              <ShoppingBasket className="size-8 text-muted-foreground" />

              <p className="mt-3 text-sm font-medium">
                No bazar entries this month
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                New entries will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {recentBazarEntries.map((entry) => {
                const entryTotal = entry.items.reduce(
                  (total, item) =>
                    total + Number(item.price),
                  0,
                );

                const itemNames = entry.items
                  .map(
                    (item) =>
                      item.bazarItem.nameEn ||
                      item.bazarItem.nameBn,
                  )
                  .filter(Boolean);

                const uniqueItemNames = [
                  ...new Set(itemNames),
                ];

                const preview = uniqueItemNames
                  .slice(0, 2)
                  .join(", ");

                const remainingItems =
                  uniqueItemNames.length - 2;

                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {entry.type === "GUEST"
                          ? "Guest Bazar"
                          : "Regular Bazar"}
                      </p>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {preview || "No items"}
                        {remainingItems > 0
                          ? ` +${remainingItems} more`
                          : ""}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(entry.date)}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-semibold">
                      {formatAmount(entryTotal)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                Monthly total
              </span>

              <span className="font-semibold">
                {formatAmount(totalBazar)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">
          Quick Actions
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/expenses"
            className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
          >
            <div className="rounded-lg border p-2">
              <Plus className="size-4" />
            </div>

            <div>
              <p className="text-sm font-medium">
                Manage Expenses
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                View and add expenses
              </p>
            </div>
          </Link>

          <Link
            href="/bazar"
            className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
          >
            <div className="rounded-lg border p-2">
              <Plus className="size-4" />
            </div>

            <div>
              <p className="text-sm font-medium">
                Manage Bazar
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                View and add bazar entries
              </p>
            </div>
          </Link>

          <Link
            href="/employees"
            className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
          >
            <div className="rounded-lg border p-2">
              <Users className="size-4" />
            </div>

            <div>
              <p className="text-sm font-medium">
                Employees
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                View employee records
              </p>
            </div>
          </Link>

          <Link
            href="/employees"
            className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
          >
            <div className="rounded-lg border p-2">
              <UserCheck className="size-4" />
            </div>

            <div>
              <p className="text-sm font-medium">
                Employee Overview
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Check employee status
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;