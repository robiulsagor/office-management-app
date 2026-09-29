import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

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
  const monthName = format(new Date(), "MMMM yyyy");
  return (
    <div className="rounded-xl border bg-card">
      <div className="flex items-center justify-between gap-3 border-b p-5">
        <div>
          <h2 className="font-semibold">Recent Bazar</h2>

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

      <div className="divide-y">
        {entries.length === 0 ? (
          <div className="p-5 text-sm text-muted-foreground">
            No bazar entries found for this month.
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
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="min-w-0">
                  <p className="font-medium">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {format(new Date(entry.date), "dd MMM yyyy")}
                  </p>
                </div>

                <p className="shrink-0 font-semibold">
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
