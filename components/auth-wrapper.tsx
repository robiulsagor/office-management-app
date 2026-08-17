import { Sekuya } from "next/font/google";
import React from "react";

const sekuya = Sekuya ({
  weight: "400",
});

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col md:flex-row w-full max-w-100  md:min-w-175 mx-auto border border-[#D7E0DF] overflow-hidden bg-white rounded-xl shadow-md min-h-[350px]">
      <div className="p-4 flex-1 bg-teal-700 text-slate-100 rounded-tr-[80px] rounded-br-[80px]
      text-center  items-center flex-col justify-center hidden md:flex">
        <h2 className={`text-[24px] font-bold ${sekuya.className}`}>
            Adventure Clothing &amp; Sourcing
        </h2>
        <p className={`mt-2 text-[14px] text-slate-300 ${sekuya.className}`}>
            Log In
        </p>
      </div>
      <div className="p-4 flex-1 flex items-center justify-center">{children}</div>
    </div>
  );
};

export default AuthWrapper;
