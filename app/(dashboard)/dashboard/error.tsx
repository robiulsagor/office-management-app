"use client";

const DashboardError = ({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div className="flex min-h-100 items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold">
          Something went wrong
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&apos;t load the dashboard.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="mt-4 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

export default DashboardError;