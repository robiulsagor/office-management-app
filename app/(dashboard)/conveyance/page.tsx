import { redirect } from "next/navigation";

import ConveyancePage from "@/components/conveyance/conveyance-page";

type PageProps = {
  searchParams: Promise<{
    month?: string;
  }>;
};

const getCurrentMonth = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, "0")}`;
};

const Page = async ({
  searchParams,
}: PageProps) => {
  const params = await searchParams;

  const month = params.month;

  if (!month) {
    redirect(
      `/conveyance?month=${getCurrentMonth()}`,
    );
  }

  return <ConveyancePage month={month} />;
};

export default Page;
