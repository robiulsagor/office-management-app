import UserManagementPage from "@/components/user-management/user-management-page";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management - Office Management App",
  };

const Page = () => {
  return <UserManagementPage />;
};

export default Page;