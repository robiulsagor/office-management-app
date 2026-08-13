import React from "react";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-w-[30%] max-w-[60%] mx-auto border border-[#D7E0DF] overflow-hidden bg-white rounded-xl shadow-md">
      <div className="p-4 flex-1">
        <h2 className="text-[24px] text-[#16232B] font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Adventure Clothing &amp; Sourcing
        </h2>
        <p className="mt-2 text-[14px] text-[#5C6B70]">
            Enter your workspace credentials to continue.
        </p>
      </div>
      <div className="p-4 flex-1">{children}</div>
    </div>
  );
};

export default AuthWrapper;
