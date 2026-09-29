import Link from "next/link";
import { ArrowRight, ShoppingBasket } from "lucide-react";
import { format } from "date-fns";

type RecentBazarItem = {
  name: string;
  nameEn: string;
  nameBn: string;
  quantity?: number;
  price: number;
};

type RecentBazarEntry = {
  id: string;
  date: string;
  items: RecentBazarItem[];
};

type RecentBazarProps = {
  entries: RecentBazarEntry[];
};

const RecentBazar = ({ entries }: RecentBazarProps) => {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="font-semibold">Recent Bazar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest bazar entries from this month
          </p>
        </div>

        <Link
          href="/bazar"
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="divide-y">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
            <ShoppingBasket className="mb-3 size-8 text-muted-foreground/60" />
            <p className="text-sm font-medium">No bazar entries yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              No bazar entries have been recorded this month.
            </p>
          </div>
        ) : (
          entries.map((entry) => {
            const total = entry.items.reduce(
              (sum, item) => sum + item.price,
              0,
            );

            const itemCount = entry.items.length;

            return (
              <div
                key={entry.id}
                className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <ShoppingBasket className="size-4 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {itemCount}{" "}
                    {itemCount === 1 ? "item" : "items"}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(
                      new Date(entry.date),
                      "dd MMM yyyy",
                    )}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold">
                  ৳{total.toLocaleString()}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentBazar;