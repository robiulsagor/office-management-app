import { redirect } from "next/navigation";

import { getConveyanceData } from "@/actions/conveyance/get-conveyance-data";
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

  const data = await getConveyanceData(month);

  if (!data.success) {
    throw new Error(
      data.message || "Failed to load conveyance data.",
    );
  }

  return (
    <ConveyancePage
      month={month}
      employees={data.employees}
      initialEntries={data.entries}
    />
  );
};

export default Page;