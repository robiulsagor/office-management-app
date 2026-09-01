"use client";

import { useEffect, useState } from "react";

import { SalaryRecord } from "@/types/salary";

const SALARY_PRINT_KEY = "salary-print-data";

type SalaryPrintData = {
  month: string;
  records: SalaryRecord[];
};

const SalaryPrint = () => {
  const [data, setData] = useState<SalaryPrintData | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem(SALARY_PRINT_KEY);

    if (!storedData) return;

    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(JSON.parse(storedData));
    } catch (error) {
      console.error("Failed to parse salary print data:", error);
    }
  }, []);

  if (!data) {
    return (
      <div className="p-10 text-center">
        No salary data found.
      </div>
    );
  }

  const { month, records } = data;

  const [year, monthNumber] = month.split("-").map(Number);

  const selectedMonth = new Date(
    year,
    monthNumber - 1,
    1,
  );

  const monthName = selectedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const totalBasic = records.reduce(
    (sum, record) => sum + record.basicSalary,
    0,
  );

  const totalAllowances = records.reduce(
    (sum, record) => sum + record.allowances,
    0,
  );

  const totalDeductions = records.reduce(
    (sum, record) => sum + record.deductions,
    0,
  );

  const totalNetSalary = records.reduce(
    (sum, record) => sum + record.netSalary,
    0,
  );

  const totalPaid = records
    .filter((record) => record.status === "paid")
    .reduce((sum, record) => sum + record.netSalary, 0);

  const totalPending = records
    .filter((record) => record.status === "pending")
    .reduce((sum, record) => sum + record.netSalary, 0);

  return (
    <div className="mx-auto w-200 bg-white px-8 py-10 text-black print:w-full print:px-0 print:py-0">
      {/* Company Header */}

      <div className="text-center">
        <h1 className="text-2xl font-bold">
          ADVENTURE CLOTHING & SOURCING
        </h1>

        <p className="mt-1">
          House #37, Road #13, Sector 10, Uttara, Dhaka-1230
        </p>

        <p>
          Phone: 01914-222495, 01711286723
        </p>
      </div>

      {/* Report Title */}

      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold uppercase">
          Salary Statement
        </h2>

        <p className="mt-1 text-sm">
          {monthName}
        </p>
      </div>

      {/* Salary Table */}

      <table className="mt-8 w-full border-collapse border border-black text-sm">
        <thead>
          <tr>
            <th className="border border-black px-2 py-2">
              SL
            </th>

            <th className="border border-black px-2 py-2 text-left">
              Employee
            </th>

            <th className="border border-black px-2 py-2 text-left">
              Designation
            </th>

            <th className="border border-black px-2 py-2 text-right">
              Basic
            </th>

            <th className="border border-black px-2 py-2 text-right">
              Allowance
            </th>

            <th className="border border-black px-2 py-2 text-right">
              Deduction
            </th>

            <th className="border border-black px-2 py-2 text-right">
              Net Salary
            </th>

            <th className="border border-black px-2 py-2">
              Status
            </th>
          </tr>
        </thead>

        <tbody>
          {records.map((record, index) => (
            <tr key={record.id}>
              <td className="border border-black px-2 py-2 text-center">
                {index + 1}
              </td>

              <td className="border border-black px-2 py-2">
                {record.employeeName}
              </td>

              <td className="border border-black px-2 py-2">
                {record.designation}
              </td>

              <td className="border border-black px-2 py-2 text-right">
                {record.basicSalary.toLocaleString("en-BD")}
              </td>

              <td className="border border-black px-2 py-2 text-right">
                {record.allowances.toLocaleString("en-BD")}
              </td>

              <td className="border border-black px-2 py-2 text-right">
                {record.deductions.toLocaleString("en-BD")}
              </td>

              <td className="border border-black px-2 py-2 text-right font-medium">
                {record.netSalary.toLocaleString("en-BD")}
              </td>

              <td className="border border-black px-2 py-2 text-center capitalize">
                {record.status}
              </td>
            </tr>
          ))}

          {/* Total Row */}

          <tr className="font-bold">
            <td
              colSpan={3}
              className="border border-black px-2 py-2 text-right"
            >
              Total
            </td>

            <td className="border border-black px-2 py-2 text-right">
              {totalBasic.toLocaleString("en-BD")}
            </td>

            <td className="border border-black px-2 py-2 text-right">
              {totalAllowances.toLocaleString("en-BD")}
            </td>

            <td className="border border-black px-2 py-2 text-right">
              {totalDeductions.toLocaleString("en-BD")}
            </td>

            <td className="border border-black px-2 py-2 text-right">
              {totalNetSalary.toLocaleString("en-BD")}
            </td>

            <td className="border border-black" />
          </tr>
        </tbody>
      </table>

      {/* Payment Summary */}

      <table className="mt-6 ml-auto w-87.5 border-collapse border border-black text-sm">
        <tbody>
          <tr>
            <td className="border border-black px-3 py-2 font-semibold">
              Total Salary
            </td>

            <td className="border border-black px-3 py-2 text-right">
              ৳{totalNetSalary.toLocaleString("en-BD")}
            </td>
          </tr>

          <tr>
            <td className="border border-black px-3 py-2 font-semibold">
              Total Paid
            </td>

            <td className="border border-black px-3 py-2 text-right">
              ৳{totalPaid.toLocaleString("en-BD")}
            </td>
          </tr>

          <tr>
            <td className="border border-black px-3 py-2 font-semibold">
              Total Pending
            </td>

            <td className="border border-black px-3 py-2 text-right">
              ৳{totalPending.toLocaleString("en-BD")}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Signature */}

      <div className="mt-20 flex justify-between px-8">
        <div className="text-center">
          <div className="w-40 border-t border-black pt-2">
            Prepared By
          </div>
        </div>

        <div className="text-center">
          <div className="w-40 border-t border-black pt-2">
            Authorized By
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryPrint;