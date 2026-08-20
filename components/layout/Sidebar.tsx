"use client";

import { Grid2X2, ListOrdered, PanelRightOpen, Users2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";

const menuItems = [
  {
    id: 1,
    path: "/dashboard",
    label: "Dashboard",
    icon: <Grid2X2 />,
  },
  {
    id: 2,
    path: "/orders",
    label: "Orders",
    icon: <ListOrdered />,
  },
  {
    id: 3,
    path: "/employees",
    label: "Employees",
    icon: <Users2 />,
  },
];

const Sidebar = () => {
  const path = usePathname();
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div
      className={`w-full bg-slate-50 shadow-xl rounded-xl p-5 relative  transition-all duration-300 ease-in-out ${showSidebar ? "max-w-75" : "max-w-24"}`}
    >
      <PanelRightOpen
        size={39}
        className={`absolute -right-4 top-6 cursor-pointer border border-slate-500 rounded-full p-1.5 opacity-50 hover:opacity-100 ${!showSidebar && "rotate-180"}`}
        onClick={() => setShowSidebar((state) => !state)}
      />

<div>

      <div className="flex items-center gap-0">
</div>
        <Image
          src="/logo.svg"
          className="border"
          width={50}
          height={50}
          alt="c_logo"
        />
        <motion.h2
          animate={{
            opacity: showSidebar ? 1 : 0,
            width: showSidebar ? "auto" : 0,
          }}
          transition={{ duration: 0.2 }}
          className="text-green-600 font-extrabold text-2xl whitespace-nowrap overflow-hidden"
        >
          ACS ERP
        </motion.h2>
      </div>

      <ul className="mt-14 space-y-1">
        {menuItems.map((item) => (
          <li key={item.id}>
            <Link
              href={item.path}
              className={`flex  items-end gap-2 p-3 rounded-lg hover:bg-teal-600/10 ${path === item.path && "bg-teal-600/20 hover:bg-teal-600/20"}`}
            >
              {item.icon}
              <motion.span
                animate={{
                  opacity: showSidebar ? 1 : 0,
                  width: showSidebar ? "auto" : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {item.label}{" "}
              </motion.span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto bg-amber-500">
        hello
      </div>
    </div>
  );
};

export default Sidebar;
