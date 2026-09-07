import { auth } from "@/auth";
import BazarPage from "@/components/bazar/bazar-page";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Bazar Data",
  description: "Show the bazar data",
};

type PageProps = {
  searchParams: Promise<{
    month?: string;
  }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const session = await auth();

  // If there is no month in the URL,
  // redirect to the current month.
  if (!params.month) {
    const currentDate = new Date();

    const currentMonth = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1,
    ).padStart(2, "0")}`;

    redirect(`/bazar?month=${currentMonth}`);
  }

  // If month already exists, don't redirect.
  return (
    <BazarPage
      month={params.month}
      currentUserId={session?.user?.id ?? ""}
      currentUserRole={session?.user?.role ?? ""}
    />
  );
};

export default Page;
