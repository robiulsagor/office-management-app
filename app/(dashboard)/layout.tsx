import { auth } from "@/auth";
import ActivityTracker from "@/components/auth/activity-tracker";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import SessionProviderWrapper from "@/components/providers/SessionProvider";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  // If the user is not authenticated, redirect them to the login page
  if(!session){
    redirect("/login")
  }

 return (
  <SessionProviderWrapper>
    <ActivityTracker />

    <main className="h-screen bg-slate-200 p-3 w-full md:flex md:gap-1.5 border">
      <Sidebar />

      <div className="flex-1 w-full h-full flex flex-col">
        <Navbar />

        <div className="w-full flex-1 bg-slate-50 shadow-xl rounded-bl-lg rounded-br-lg p-5 overflow-y-auto">
          {children}
        </div>
      </div>
    </main>
  </SessionProviderWrapper>
);
}
