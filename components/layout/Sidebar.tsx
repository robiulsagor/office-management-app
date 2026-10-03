"use client";
import { signOut } from "next-auth/react";

import {
  Banknote,
  BanknoteArrowDown,
  Bus,
  Grid2X2,
  ListOrdered,
  LogOut,
  NotebookPenIcon,
  ShoppingBasket,
  UserCheck,
  Users2,
} from "lucide-react";
import { motion } from "motion/react";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDesktopNav, useMobileNav } from "@/store";
import SidebarHeader from "./sidebar-header";
import { MenuTypes } from "@/types";
import SidebarMenuItems from "./sidebar-items";

const menuItems: MenuTypes[] = [
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
    icon: Users2,
    roles: ["super_admin", "admin"],
  },
  {
    id: 4,
    path: "/generate-documents",
    label: "Documents",
    icon: NotebookPenIcon,
    roles: ["super_admin", "admin"],
  },
  {
    id: 5,
    path: "/deposit",
    label: "Deposit",
    icon: BanknoteArrowDown,
    roles: ["super_admin", "admin"],
  },
  {
    id: 6,
    path: "/bazar",
    label: "Bazar",
    icon: ShoppingBasket,
    roles: ["super_admin", "admin"],
  },
  {
    id: 7,
    path: "/expenses",
    label: "Expenses",
    icon: Banknote,
    roles: ["super_admin", "admin"],
  },
  {
    id: 8,
    path: "/conveyance",
    label: "Conveyance",
    icon: Bus,
    roles: ["super_admin", "admin", "accounts", "employee"],
  },
  // {
  //   id: 8,
  //   path: "/salary",
  //   label: "Salary",
  //   icon: DollarSign,
  //   roles: ["super_admin", "admin", "accounts"],
  // },
  {
    id: 9,
    path: "/user-management",
    label: "User Management",
    icon: UserCheck,
    roles: ["super_admin", "admin", "accounts"],
  },
];

const Sidebar = () => {
  // const [showSidebar, setShowSidebar] = useState(true);
  const isMobileNavOpen = useMobileNav((state) => state.isOpen);
  const closeMobileNav = useMobileNav((state) => state.close);

  const showSidebar = useDesktopNav((state) => state.isOpen);

  //   const visibleItems = menuItems.filter((item) =>
  //   item.roles.includes(user.role)
  // );
  // will implement role based access control later

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <div>
      <Sheet open={isMobileNavOpen} onOpenChange={closeMobileNav}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              <SidebarHeader />
            </SheetTitle>
          </SheetHeader>
          <SidebarMenuItems visibleMenu={menuItems} showSidebar={true} />
          <SheetFooter>
            <button 
              onClick={handleLogout}
              className="flex gap-2 p-3 hover:underline hover:bg-teal-600/10 rounded-xl"
            >
              <LogOut />
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
            </button>
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
        {/* show sidebar here */}

        <div className="h-[90%] hidden md:flex flex-col  justify-between">
          <SidebarHeader />

          <SidebarMenuItems visibleMenu={menuItems} showSidebar={showSidebar} />

          <div className="mt-auto">
            <button
              className="flex gap-2 p-3 hover:underline hover:bg-teal-600/10 rounded-xl"
              onClick={handleLogout}
            >
              <LogOut />  {/* Logout icon */}
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
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Sidebar;
