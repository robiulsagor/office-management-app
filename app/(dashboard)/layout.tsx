import { auth } from "@/auth";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
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
      <main className="h-screen bg-slate-200 p-3 w-full md:flex md:gap-3 border ">
        <Sidebar />
        <div className="space-y-3 flex-1 w-full">
          <Navbar />
          <div className="w-full flex-1 bg-slate-50 shadow-xl rounded-xl p-5 max-h-[calc(100vh-120px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </main>
  );
}
