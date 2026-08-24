import { MenuTypes } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useMobileNav } from "@/store";

const SidebarItem = ({
  menu,
  showSidebar,
}: {
  menu: MenuTypes;
  showSidebar: boolean;
}) => {
  const path = usePathname();
  const Icon = menu.icon;
  const closeMobileNav = useMobileNav((state) => state.close);
  return (
    <Link
      href={menu.path}
      onClick={closeMobileNav}
      className={`flex items-end p-3 rounded-lg hover:bg-teal-600/10 ${path === menu.path && "bg-teal-600/20 hover:bg-teal-600/20"}`}
    >
      <Icon />
      <motion.span
        animate={{
          opacity: showSidebar ? 1 : 0,
          width: showSidebar ? "auto" : 0,
        }}
        transition={{ duration: 0.2 }}
        className="pl-2"
      >
        {menu.label}
      </motion.span>
    </Link>
  );
};

export default SidebarItem;
