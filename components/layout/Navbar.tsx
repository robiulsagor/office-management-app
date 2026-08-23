"use client";

import { BellIcon, SearchIcon } from "lucide-react";
import NotificationContainer from "./NotificationContainer";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

const Navbar = () => {

  return (
    <div className="bg-slate-50 p-3 rounded-lg shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="border border-slate-300 rounded-lg p-1 relative">
          <SearchIcon className="w-4 h-4 text-slate-400 absolute top-2 left-2 " />
          <input
            type="search"
            name=""
            id=""
            placeholder="Search..."
            className="pl-6 text-sm bg-transparent border-none focus:outline-none"
          />
        </div>
        <div className="flex space-x-6">
          <Popover>
            <PopoverTrigger>
              <div className="relative cursor-pointer p-1.5 rounded hover:bg-slate-200 transition duration-200">
                <BellIcon className="w-5 h-5 text-slate-600 hover:text-slate-800 transition duration-500 relative" />
                <span className="absolute top-0.5 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>Notifications</PopoverTitle>
                <NotificationContainer />
              </PopoverHeader>
            </PopoverContent>
          </Popover>
          {/* 
          <motion.div
            className="bg-red-500  absolute top-full right-0"
            animate={{
              opacity: showNotifications ? 1 : 0,
              translateY: showNotifications ? 0 : 50,
            }}
          >
            <NotificationContainer />
          </motion.div> */}

          <div className="flex items-center space-x-2">
            <img
              src="https://avatars.githubusercontent.com/u/12345678?v=4"
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-slate-700">John Doe</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
