import { Sekuya } from "next/font/google";
import React from "react";

const sekuya = Sekuya({
  weight: "400",
});

const AuthWrapper = ({
  children,
  subText,
  page,
}: {
  children: React.ReactNode;
  subText: string;
  page: string;
}) => {
  const isSetup = page === "setup";

  const containerClass = isSetup
    ? "flex flex-col w-full max-w-100 mx-auto"
    : "flex flex-col md:flex-row w-full max-w-100 md:min-w-175 mx-auto";

  const panelClass = isSetup
    ? "rounded-bl-[80px] rounded-br-[80px]"
    : "rounded-bl-[60px] rounded-br-[60px] md:rounded-bl-[0px] md:rounded-tr-[80px] md:rounded-br-[80px]";
  return (
    <div
      className={`w-full border border-[#D7E0DF] overflow-hidden bg-white rounded-xl shadow-md min-h-87.5 ${containerClass}`}
    >
      <div
        className={`p-4 flex-1 bg-teal-700 text-slate-100 text-center items-center flex-col justify-center md:flex ${panelClass}`}
      >
        <h2 className={`text-lg md:text-[24px] font-bold ${sekuya.className}`}>
          Adventure Clothing &amp; Sourcing
        </h2>

        <p
          className={`hidden md:block mt-2 text-[14px] text-slate-300 ${sekuya.className}`}
        >
          {subText}
        </p>
      </div>

      <div className="p-4 py-8 flex-1 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default AuthWrapper;
