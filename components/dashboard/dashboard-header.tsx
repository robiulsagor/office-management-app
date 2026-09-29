import { auth } from "@/auth";

const DashboardHeader = async () => {
  const session = await auth();

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Dashboard
      </h1>

      <p className="text-muted-foreground">
        Welcome back, {session?.user?.name || "User"}.
      </p>
    </div>
  );
};

export default DashboardHeader;