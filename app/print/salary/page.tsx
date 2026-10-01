import SalaryPrint from "@/components/salary/salary-print";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salary Print - Office Management App",
  };

const SalaryPrintPage = () => {
  return <SalaryPrint />;
};

export default SalaryPrintPage;