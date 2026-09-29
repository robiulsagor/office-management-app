import Link from "next/link";
import { ShoppingBasket, Users, Plus, UserCheck } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Manage Expenses",
      description: "View and add expenses",
      href: "/expenses",
      icon: Plus,
    },
    {
      title: " Manage Bazar",
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
    {
      title: "Employee Overview",
      description: "View employee details and performance",
      href: "/employees",
      icon: UserCheck,
    },
  ];

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
          >
            <div className="rounded-lg border p-2">
              <action.icon className="size-4" />
            </div>

            <div>
              <p className="text-sm font-medium">{action.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
