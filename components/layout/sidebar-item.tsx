"use client";

import { MenuTypes } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useMobileNav } from "@/store";

type SidebarItemProps = {
  menu: MenuTypes;
  showSidebar: boolean;
};

const SidebarItem = ({ menu, showSidebar }: SidebarItemProps) => {
  const pathname = usePathname();

  const closeMobileNav = useMobileNav((state) => state.close);

  const Icon = menu.icon;

  const isActive =
    pathname === menu.path || pathname.startsWith(`${menu.path}/`);

  return (
    <Link
      href={menu.path}
      onClick={closeMobileNav}
      aria-current={isActive ? "page" : undefined}
      title={!showSidebar ? menu.label : undefined}
      className={`
        flex h-11 w-full items-center rounded-lg
        p-3 transition-colors duration-200
        ${showSidebar ? "justify-start gap-3" : "justify-center"}
        ${
          isActive
            ? "bg-teal-600/20 hover:bg-teal-600/20"
            : "hover:bg-teal-600/10"
        }
      `}
    >
      <Icon className="size-5 shrink-0" />

      <motion.span
        initial={false}
        animate={{
          opacity: showSidebar ? 1 : 0,
          width: showSidebar ? "auto" : 0,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className="overflow-hidden whitespace-nowrap text-sm font-medium"
      >
        {menu.label}
      </motion.span>
    </Link>
  );
};

export default SidebarItem;
