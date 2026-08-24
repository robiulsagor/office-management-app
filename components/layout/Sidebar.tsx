"use client";

import {
  DoorClosed,
  Grid2X2,
  ListOrdered,
  PanelRightOpen,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMobileNav } from "@/store";
import SidebarHeader from "./sidebar-header";
import { MenuTypes } from "@/types";
import SidebarMenuItems from "./sidebar-items";

const menuItems:MenuTypes[] = [
  {
    id: 1,
    path: "/dashboard",
    label: "Dashboard",
    icon: Grid2X2,
    roles: ["super_admin", "admin", "accounts", "employee"],
  },
  {
    id: 2,
    path: "/orders",
    label: "Orders",
    icon: ListOrdered,
    roles: ["super_admin", "admin", "accounts", "employee"],
  },
  {
    id: 3,
    path: "/employees",
    label: "Employees",
    icon: Users2 ,
    roles: ["super_admin", "admin"],
  },
];

const Sidebar = () => {
  const path = usePathname();
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobileNavOpen = useMobileNav((state) => state.isOpen);
  const closeMobileNav = useMobileNav((state) => state.close);

//   const visibleItems = menuItems.filter((item) =>
//   item.roles.includes(user.role)
// ); 
// will implement role based access control later

  return (
    <div>
      <Sheet open={isMobileNavOpen} onOpenChange={closeMobileNav}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <SidebarHeader />
            </SheetTitle>
          </SheetHeader>
          <SidebarMenuItems visibleMenu={menuItems} showSidebar={showSidebar} />
          <SheetFooter>
            <Link
              href={path}
              className="flex gap-2 p-3 hover:underline hover:bg-teal-600/10 rounded-xl"
            >
              <DoorClosed />
              <motion.span
                animate={{
                  opacity: showSidebar ? 1 : 0,
                  width: showSidebar ? "auto" : 0,
                  display: showSidebar ? "block" : "none",
                }}
                transition={{ duration: 0.2 }}
              >
                Logout
              </motion.span>
            </Link>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <motion.div
      animate={{
        width: showSidebar ? "16rem" : "5rem",
      }}
      transition={{ duration: 0.3 }}
        className={`h-full hidden p-3 md:block w-full bg-slate-50 shadow-xl rounded-xl relative`}
      >
        <PanelRightOpen
          size={39}
          className={`absolute -right-4 top-6 cursor-pointer border border-slate-500 rounded-full p-1.5 opacity-50 hover:opacity-100 ${!showSidebar && "rotate-180"}`}
          onClick={() => setShowSidebar((state) => !state)}
        />

        <div className="h-[90%] hidden md:flex flex-col  justify-between">
         <SidebarHeader />

          <SidebarMenuItems visibleMenu={menuItems} showSidebar={showSidebar} />

          <div className="mt-auto">
            <Link
              href={path}
              className="flex gap-2 p-3 hover:underline hover:bg-teal-600/10 rounded-xl"
            >
              <DoorClosed />
              <motion.span
                animate={{
                  opacity: showSidebar ? 1 : 0,
                  width: showSidebar ? "auto" : 0,
                  display: showSidebar ? "block" : "none",
                }}
                transition={{ duration: 0.2 }}
              >
                Logout
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
