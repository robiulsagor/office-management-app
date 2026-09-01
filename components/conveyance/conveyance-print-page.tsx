"use client";

import { useEffect, useState } from "react";

import { ConveyanceEntry } from "@/types/conveyance";

const CONVEYANCE_PRINT_KEY = "conveyance-print-data";

type ConveyancePrintData = {
  month: string;
  employee: {
    id: string;
    name: string;
    designation: string;
  };
  entries: ConveyanceEntry[];
};

const ConveyancePrintPage = () => {
  const [printData, setPrintData] =
    useState<ConveyancePrintData | null>(null);

  useEffect(() => {
    const storedData =
      sessionStorage.getItem(CONVEYANCE_PRINT_KEY);

    if (!storedData) return;

    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrintData(JSON.parse(storedData));
    } catch (error) {
      console.error("Failed to parse conveyance print data:", error);
    }
  }, []);

  if (!printData) {
    return (
      <div className="p-10 text-center">
        No conveyance data found.
      </div>
    );
  }

  const { employee, entries, month } = printData;

  const totalBill = entries.reduce(
    (sum, entry) => sum + entry.bill,
    0,
  );

  const selectedMonth = new Date(`${month}-01T00:00:00`);

  const monthName = selectedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto w-175 py-10 text-black">
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

      {/* Title */}
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold uppercase">
          Conveyance History
        </h2>
      </div>

      {/* Employee Information */}
      <table className="mt-8 w-full">
        <tbody>
          <tr>
            <td className="w-32 font-bold">
              Employee
            </td>
            <td className="w-5">
              :
            </td>
            <td>
              {employee.name}
            </td>
          </tr>

          <tr>
            <td className="font-bold">
              Designation
            </td>
            <td>
              :
            </td>
            <td>
              {employee.designation}
            </td>
          </tr>

          <tr>
            <td className="font-bold">
              Month
            </td>
            <td>
              :
            </td>
            <td>
              {monthName}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Conveyance Table */}
      <table className="mt-8 w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-black px-3 py-2">
              SL
            </th>

            <th className="border border-black px-3 py-2">
              Date
            </th>

            <th className="border border-black px-3 py-2 text-left">
              From
            </th>

            <th className="border border-black px-3 py-2 text-left">
              To
            </th>

            <th className="border border-black px-3 py-2 text-right">
              Bill
            </th>
          </tr>
        </thead>

        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="border border-black px-3 py-8 text-center"
              >
                No conveyance data found for this month.
              </td>
            </tr>
          ) : (
            entries.map((entry, index) => (
              <tr key={entry.id}>
                <td className="border border-black px-3 py-2 text-center">
                  {index + 1}
                </td>

                <td className="border border-black px-3 py-2 text-center">
                  {entry.date}
                </td>

                <td className="border border-black px-3 py-2">
                  {entry.from}
                </td>

                <td className="border border-black px-3 py-2">
                  {entry.to}
                </td>

                <td className="border border-black px-3 py-2 text-right">
                  ৳{entry.bill.toLocaleString("en-BD")}
                </td>
              </tr>
            ))
          )}

          {/* Total */}
          <tr>
            <td
              colSpan={4}
              className="border border-black px-3 py-2 text-right font-bold"
            >
              Total
            </td>

            <td className="border border-black px-3 py-2 text-right font-bold">
              ৳{totalBill.toLocaleString("en-BD")}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Signature */}
      <div className="mt-24 flex justify-between px-8">
        <div className="text-center">
          <div className="mb-2 w-40 border-b border-black" />
          <p className="text-sm">
            Employee Signature
          </p>
        </div>

        <div className="text-center">
          <div className="mb-2 w-40 border-b border-black" />
          <p className="text-sm">
            Authorized Signature
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConveyancePrintPage;