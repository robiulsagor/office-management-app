import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conveyance - Office Management App",
  };
import ConveyancePrintPage from "@/components/conveyance/conveyance-print-page";

const Page = () => {
  return <ConveyancePrintPage />;
};

export default Page;