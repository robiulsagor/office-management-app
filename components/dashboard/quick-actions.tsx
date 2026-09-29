import Link from "next/link";
import { ArrowRight, ShoppingBasket, Receipt, Users } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Add Expense",
      description: "Record a new expense",
      href: "/expenses",
      icon: Receipt,
    },
    {
      title: "Bazar",
      description: "View and manage bazar entries",
      href: "/bazar",
      icon: ShoppingBasket,
    },
    {
      title: "Employees",
      description: "Manage employees",
      href: "/employees",
      icon: Users,
    },
  ];

  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b p-5">
        <h2 className="font-semibold">Quick Actions</h2>
        <p className="text-sm text-muted-foreground">
          Quickly access frequently used sections
        </p>
      </div>

      <div className="grid gap-3 p-5 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <Icon className="size-5 text-muted-foreground" />

                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>

              <p className="mt-4 font-medium">
                {action.title}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;