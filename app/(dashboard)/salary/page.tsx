import SalaryPage from "@/components/salary/salary-page";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{
    month?: string;
  }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  if (!params.month) {
    const now = new Date();

    const currentMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}`;

    redirect(`/salary?month=${currentMonth}`);
  }

  return <SalaryPage month={params.month} />;
};

export default Page;