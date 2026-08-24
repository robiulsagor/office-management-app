import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
