import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-24 animate-pulse rounded-lg border bg-muted/30" />
<Spinner className="mx-auto" />
      <div className="h-64 animate-pulse rounded-lg border bg-muted/30" />
    </div>
  );
}