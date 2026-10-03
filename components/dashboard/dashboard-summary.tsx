import { Users, UserCheck, ShoppingBasket, Wallet } from "lucide-react";
import Link from "next/link";
import StaggerItem from "../animations/stagger-item";
import StaggerContainer from "../animations/stagger-container";

type DashboardSummaryProps = {
  totalEmployees: number;
  activeEmployees: number;
  monthlyExpense: number;
  monthlyBazar: number;
};

const DashboardSummary = ({
  totalEmployees,
  activeEmployees,
  monthlyExpense,
  monthlyBazar,
}: DashboardSummaryProps) => {
  const monthName = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const cards = [
    {
      title: "Total Employees",
      value: totalEmployees.toLocaleString("en-BD"),
      description: "All registered employees",
      icon: Users,
      href: "/employees",
    },
    {
      title: "Active Employees",
      value: activeEmployees,
      description: "Currently active employees",
      icon: UserCheck,
      href: "/employees",
    },
    {
      title: "This Month Expense",
      value: `৳${monthlyExpense.toLocaleString()}`,
      description: monthName,
      icon: Wallet,
      href: "/expenses",
    },
    {
      title: "This Month Bazar",
      value: `৳${monthlyBazar.toLocaleString()}`,
      description: monthName,
      icon: ShoppingBasket,
      href: "/bazar",
    },
  ];

  return (
    <StaggerContainer  className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <StaggerItem key={card.title} className="w-full group rounded-xl border bg-card p-5 transition-colors hover:bg-muted/40">
            <Link
              key={card.title}
              href={card.href}
              className=""
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
          </StaggerItem>
        );
      })}
    </StaggerContainer >
  );
};

export default DashboardSummary;
