const DashboardLoading = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-64 rounded-md bg-muted" />
        <div className="h-4 w-80 rounded-md bg-muted" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-xl border bg-card"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="h-80 rounded-xl border bg-card" />
        <div className="h-80 rounded-xl border bg-card" />
      </div>

      <div className="h-72 rounded-xl border bg-card" />
    </div>
  );
};

export default DashboardLoading;