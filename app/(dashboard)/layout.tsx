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
        <div className=" flex-1 w-full">
          <Navbar />
          <div className="w-full flex-1 bg-slate-50 shadow-xl rounded-bl-lg rounded-br-lg p-5 max-h-[calc(100vh-85px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </main>
  );
}
