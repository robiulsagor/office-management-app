import { auth } from "@/auth";

const DashboardHeader = async () => {
  const session = await auth();
  const now = new Date();
  const name = session?.user?.name || "User";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {" "}
          {name}
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
  );
};

export default DashboardHeader;
