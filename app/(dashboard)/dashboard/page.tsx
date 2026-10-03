import { getDashboardData } from "@/actions/dashboard/get-dashboard-data";
import StaggerContainer from "@/components/animations/stagger-container";
import StaggerItem from "@/components/animations/stagger-item";
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

      <StaggerContainer className="grid gap-6 xl:grid-cols-2">
        <StaggerItem key="recent-expenses" className="w-full">
          <RecentExpenses expenses={data.recentExpenses} />
        </StaggerItem>
        <StaggerItem key="recent-bazar" className="w-full">
          <RecentBazar entries={data.recentBazar} />
        </StaggerItem>
      </StaggerContainer>

      <QuickActions />
    </div>
  );
};

export default Dashboard;
