"use client";

import { useEffect, useState } from "react";
import ChallanSignature from "./challan-signature";
import { ChallanData } from "@/types/challan";

const CHALLAN_PRINT_KEY = "challan-print-data";
const MAX_ROWS = 12;

const PrintableChallan = () => {
  const [challan, setChallan] = useState<ChallanData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem(CHALLAN_PRINT_KEY);

    if (storedData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChallan(JSON.parse(storedData));
    }

    setIsLoaded(true);
  }, []);

  // Don't render anything until sessionStorage has been checked
  if (!isLoaded) {
    return null;
  }

  if (!challan) {
    return (
      <div className="p-10 text-center">
        No challan data found.
      </div>
    );
  }

  const totalPackages = challan.items.reduce(
    (total, item) => total + item.packageCount,
    0,
  );

  const emptyRows = Math.max(
    0,
    MAX_ROWS - challan.items.length,
  );

  const quantityTotals = challan.items.reduce<Record<string, number>>(
    (totals, item) => {
      totals[item.quantityType] =
        (totals[item.quantityType] || 0) + item.quantity;

      return totals;
    },
    {},
  );

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-bold">
          ADVENTURE CLOTHING & SOURCING
        </h1>

        <p>
          House #37, Road #13, Sector 10, Uttara, Dhaka-1230
        </p>

        <p>
          Phone: 01914-222495, 01711286723
        </p>
      </div>

      {/* Challan Details */}
      <table width={700} className="mx-auto mt-9">
        <tbody>
          <tr>
            <td>
              Challan No.: {challan.challanNumber}
            </td>

            <td className="text-center text-lg font-bold">
              <span className="rounded-xl border-2 border-black px-4 py-1">
                DELIVERY CHALLAN
              </span>
            </td>

            <td className="text-right">
              Date: {challan.date}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Factory Information */}
      <table width={700} className="mx-auto mt-9">
        <tbody>
          <tr>
            <td className="w-22.5 font-bold">
              Factory
            </td>

            <td>:</td>

            <td className="pl-3">
              {challan.factoryName}
            </td>
          </tr>

          <tr>
            <td className="font-bold">
              Address
            </td>

            <td>:</td>

            <td className="pl-3">
              {challan.factoryAddress}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Challan Items */}
      <table width={700} className="mx-auto mt-9">
        <thead>
          <tr>
            <th className="border border-black px-4">
              SL
            </th>

            <th className="border border-black px-4">
              Description
            </th>

            <th className="border border-black px-4">
              Rolls/Ctns
            </th>

            <th className="border border-black px-4">
              Quantity
            </th>

            <th className="border border-black px-4">
              Remarks
            </th>
          </tr>
        </thead>

        <tbody className="border border-black text-center">
          {challan.items.map((item, index) => (
            <tr key={item.id}>
              <td className="border border-black px-4 py-2">
                {index + 1}.
              </td>

              <td className="border border-black px-4 py-2 text-left">
                {item.description}
              </td>

              <td className="border border-black px-4 py-2">
                {item.packageType} - {item.packageCount}
              </td>

              <td className="border border-black px-4 py-2">
                {item.quantity}
              </td>

              <td className="border border-black px-4 py-2">
                {item.remarks}
              </td>
            </tr>
          ))}

          {Array.from({ length: emptyRows }).map((_, index) => (
            <tr key={`empty-${index}`}>
              <td className="border-r border-black px-4 py-2">
                &nbsp;
              </td>

              <td className="border-r border-black px-4 py-2">
                &nbsp;
              </td>

              <td className="border-r border-black px-4 py-2">
                &nbsp;
              </td>

              <td className="border-r border-black px-4 py-2">
                &nbsp;
              </td>

              <td className="px-4 py-2">
                &nbsp;
              </td>
            </tr>
          ))}

          <tr>
            <td className="border border-black px-4 py-2" />

            <td className="border border-black px-4 py-2">
              Total =
            </td>

            <td className="border border-black px-4 py-2">
              {totalPackages} Ctns
            </td>

            <td className="border border-black px-4 py-2">
              {Object.entries(quantityTotals).map(
                ([type, total]) => (
                  <div key={type}>
                    {total} {type}
                  </div>
                ),
              )}
            </td>

            <td className="border border-black px-4 py-2" />
          </tr>
        </tbody>
      </table>

      {/* Signature Section */}
      <ChallanSignature />
    </div>
  );
};

export default PrintableChallan;