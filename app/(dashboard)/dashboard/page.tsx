import { getDashboardData } from "@/actions/dashboard/get-dashboard-data";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardSummary from "@/components/dashboard/dashboard-summary";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentExpenses from "@/components/dashboard/recent-expenses";

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

      <RecentExpenses expenses={data.recentExpenses} />
      <QuickActions />
    </div>
  );
};

export default Dashboard;