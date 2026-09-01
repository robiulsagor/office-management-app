"use client";

import { useEffect, useState } from "react";

import { BazarEntry } from "@/types/bazar";

const PRINT_KEY = "bazar-print-data";

type PrintData = {
  month: string;
  entries: BazarEntry[];
};

const formatCurrency = (amount: number) =>
  `৳${amount.toLocaleString("en-BD")}`;

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-BD",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

const BazarPrintPage = () => {
  const [printData, setPrintData] =
    useState<PrintData | null>(null);

  useEffect(() => {
    const storedData =
      sessionStorage.getItem(PRINT_KEY);

    if (!storedData) return;

    try {
      const parsedData =
        JSON.parse(storedData);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrintData(parsedData);
    } catch {
      setPrintData(null);
    }
  }, []);


  // -----------------------------------------------
  // Prevent hydration problem
  // -----------------------------------------------

  if (!printData) {
    return null;
  }


  const month = new Date(
    printData.month,
  );

  const monthName =
    month.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      },
    );


  const entries = printData.entries;


  const totalDeposit = entries.reduce(
    (sum, entry) =>
      sum + entry.deposit,
    0,
  );


  const totalExpense = entries.reduce(
    (sum, entry) =>
      sum +
      entry.items.reduce(
        (itemSum, item) =>
          itemSum + item.price,
        0,
      ),
    0,
  );


  const balance =
    totalDeposit - totalExpense;


  return (
    <>
      <div className="mx-auto w-175 py-8">

        {/* ====================================== */}
        {/* Company Header */}
        {/* ====================================== */}

        <div className="text-center">

          <h1 className="text-2xl font-bold">
            ADVENTURE CLOTHING & SOURCING
          </h1>

          <p className="mt-1">
            House #37, Road #13, Sector 10,
            Uttara, Dhaka-1230
          </p>

          <p>
            Phone: 01914-222495, 01711286723
          </p>

        </div>


        {/* ====================================== */}
        {/* Report Title */}
        {/* ====================================== */}

        <div className="mt-10 text-center">

          <h2 className="text-xl font-bold">
            Bazar History - {monthName}
          </h2>

        </div>


        {/* ====================================== */}
        {/* Main Table */}
        {/* ====================================== */}

        <table className="mt-8 w-full border-collapse border border-black">

          <thead>

            <tr>

              <th className="border border-black px-4 py-3">
                SL
              </th>

              <th className="border border-black px-4 py-3 text-left">
                Date
              </th>

              <th className="border border-black px-4 py-3 text-right">
                Expense
              </th>

              <th className="border border-black px-4 py-3 text-right">
                Deposit
              </th>

            </tr>

          </thead>


          <tbody>

            {entries.map(
              (entry, index) => {
                const expense =
                  entry.items.reduce(
                    (sum, item) =>
                      sum + item.price,
                    0,
                  );

                return (
                  <tr key={entry.id}>

                    <td className="border border-black px-4 py-3 text-center">
                      {index + 1}
                    </td>

                    <td className="border border-black px-4 py-3">
                      {formatDate(entry.date)}
                    </td>

                    <td className="border border-black px-4 py-3 text-right">
                      {formatCurrency(
                        expense,
                      )}
                    </td>

                    <td className="border border-black px-4 py-3 text-right">
                      {formatCurrency(
                        entry.deposit,
                      )}
                    </td>

                  </tr>
                );
              },
            )}

          </tbody>

        </table>


        {/* ====================================== */}
        {/* Monthly Summary */}
        {/* ====================================== */}

        <table className="mt-8 w-full border-collapse border border-black">

          <tbody>

            <tr>

              <td className="border border-black px-4 py-3 font-bold">
                Total Deposit
              </td>

              <td className="border border-black px-4 py-3 text-right">
                {formatCurrency(
                  totalDeposit,
                )}
              </td>

            </tr>


            <tr>

              <td className="border border-black px-4 py-3 font-bold">
                Total Expense
              </td>

              <td className="border border-black px-4 py-3 text-right">
                {formatCurrency(
                  totalExpense,
                )}
              </td>

            </tr>


            <tr>

              <td className="border border-black px-4 py-3 font-bold">
                Balance
              </td>

              <td className="border border-black px-4 py-3 text-right font-bold">
                {formatCurrency(
                  balance,
                )}
              </td>

            </tr>

          </tbody>

        </table>

      </div>


      {/* ====================================== */}
      {/* Print styles */}
      {/* ====================================== */}

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }

          body {
            margin: 0;
            padding: 0;
          }

          .no-print {
            display: none !important;
          }
        }

        @media screen {
          body {
            background: white;
          }
        }
      `}</style>

    </>
  );
};

export default BazarPrintPage;