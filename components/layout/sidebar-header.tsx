import Image from "next/image";

const SidebarHeader = () => {
  return (
    <div className="flex items-center gap-2.5 p-1">
      <Image src="/logo.svg" width={45} height={45} alt="c_logo" />
      <h2 className="text-green-600 font-extrabold text-2xl whitespace-nowrap overflow-hidden">
        ACS ERP
      </h2>
    </div>
  );
};

export default SidebarHeader;
