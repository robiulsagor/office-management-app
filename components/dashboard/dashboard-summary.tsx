import {
  Users,
  UserCheck,
  Receipt,
  ShoppingBasket,
} from "lucide-react";

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
  monthlyBazar
}: DashboardSummaryProps) => {
  const cards = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
    },
    {
      title: "Active Employees",
      value: activeEmployees,
      icon: UserCheck,
    },
    {
      title: "This Month Expense",
      value: `৳${monthlyExpense.toLocaleString()}`,
      icon: Receipt,
    },
    {
  title: "This Month Bazar",
  value: `৳${monthlyBazar.toLocaleString()}`,
  icon: ShoppingBasket,
},
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>

              <Icon className="size-5 text-muted-foreground" />
            </div>

            <p className="mt-3 text-2xl font-semibold">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardSummary;