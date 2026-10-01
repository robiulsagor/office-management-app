import { getDashboardData } from "@/actions/dashboard/get-dashboard-data";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardSummary from "@/components/dashboard/dashboard-summary";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentBazar from "@/components/dashboard/recent-bazar";
import RecentExpenses from "@/components/dashboard/recent-expenses";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Office Management App",
  };

const Dashboard = async () => {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <DashboardHeader />

      <DashboardSummary
        totalEmployees={data.summary.totalEmployees}
        activeEmployees={data.summary.activeEmployees}
        monthlyExpense={data.summary.monthlyExpense}
        monthlyBazar={data.summary.monthlyBazar}
      />

      <section className="grid gap-6 xl:grid-cols-2">
        <RecentExpenses expenses={data.recentExpenses} />
        <RecentBazar entries={data.recentBazar} />
      </section>
      
      <QuickActions />
    </div>
  );
};

export default Dashboard;
