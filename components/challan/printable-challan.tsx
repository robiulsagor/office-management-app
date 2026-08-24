import React from "react";
import ChallanSignature from "./challan-signature";

const items = [
  {
    id: 1,
    description: "Hangtag for - Style: Q3 WEB FRESH T-SHIRTS, Buyer: TK MAXX",
    rollsOrCtns: "1 Ctn",
    quantity: "1000 pcs",
    remarks: "",
  },
  {
    id: 2,
    description: "Hangtag for - Style: Q3 WEB FRESH T-SHIRTS, Buyer: TK MAXX",
    rollsOrCtns: "3Ctn",
    quantity: "2560 pcs",
    remarks: "",
  },
  {
    id: 3,
    description: "Hangtag for - Style: Q3 WEB FRESH T-SHIRTS, Buyer: TK MAXX",
    rollsOrCtns: "3Ctn",
    quantity: "2560 pcs",
    remarks: "",
  },
  {
    id: 4,
    description: "Hangtag for - Style: Q3 WEB FRESH T-SHIRTS, Buyer: TK MAXX",
    rollsOrCtns: "3Ctn",
    quantity: "2560 pcs",
    remarks: "",
  },
 
];

const MAX_ROWS = 10;

const PrintableChallanPage = () => {
  const emptyRows = Math.max(0, MAX_ROWS - items.length);
  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-bold">ADVENTURE CLOTHING & SOURCING</h1>
        <p>House #37, Road #13, Sector 10, Uttara, Dhaka-1230</p>
        <p>Phone: 01914-222495, 01711286723 </p>
      </div>

      {/* Challan Details */}
      <table width={700} className="mt-9 mx-auto">
        <tbody>
          <tr>
            <td>Challan No.: 02</td>
            <td className="text-lg  font-bold text-center">
              <span className="border-2 border-black px-4 py-1 rounded-xl">
                DELEVERY CHALLAN
              </span>
            </td>
            <td className="text-right">Date: 24/08/2026</td>
          </tr>
        </tbody>
      </table>

      {/* Factory Information */}
      <table width={700} className="mt-9 mx-auto">
        <tbody>
          <tr>
            <td className="font-bold">Factory</td>
            <td>:</td>
            <td className="pl-3">ASL APPARELS LTD</td>
          </tr>
          <tr>
            <td className="font-bold">Address</td>
            <td>:</td>
            <td className="pl-3">
              Plot 06, Holding No 302, Dewan Idris Road, Zirbo, Ashulia, Savar,
              Dhaka-1230
            </td>
          </tr>
        </tbody>
      </table>

      {/* Challan Items */}
      <table width={700} className="mt-9 mx-auto">
        <thead>
          <tr>
            <th className="border border-black px-4 ">SL</th>
            <th className="border border-black px-4 ">Description</th>
            <th className="border border-black px-4 ">Rolls/Ctns</th>
            <th className="border border-black px-4 ">Quantity</th>
            <th className="border border-black px-4 ">Remarks</th>
          </tr>
        </thead>
        <tbody className="text-center border border-black">
          {/* Add challan item rows here */}
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border border-black px-4 py-2">{item.id}.</td>
              <td className="text-left border border-black px-4 py-2">
                {item.description}
              </td>
              <td className="border border-black px-4 py-2">
                {item.rollsOrCtns}
              </td>
              <td className="border border-black px-4 py-2">{item.quantity}</td>
              <td className="border border-black px-4 py-2">{item.remarks}</td>
            </tr>
          ))}

          {Array.from({ length: emptyRows }).map((_, index) => (
            <tr key={`empty-${index}`}>
              <td className="border-r border-black px-4 py-2">&nbsp;</td>
              <td className="border-r border-black px-4 py-2">&nbsp;</td>
              <td className="border-r border-black px-4 py-2">&nbsp;</td>
              <td className="border-r border-black px-4 py-2">&nbsp;</td>
              <td className="px-4 py-2">&nbsp;</td>
            </tr>
          ))}
          <tr>
           <td className="border border-black px-4 py-2"></td>
              <td className="border border-black px-4 py-2">
                Total = 
              </td>
              <td className="border border-black px-4 py-2">
               3 Ctns
              </td>
              <td className="border border-black px-4 py-2">150</td>
              <td className="border border-black px-4 py-2">-</td> 
          </tr>
        </tbody>
      </table>

        {/* Signature Section */}
        <ChallanSignature />
    </div>
  );
};

export default PrintableChallanPage;
