
import DashboardLayout from "@/components/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="glass-card p-6">
          <p className="text-white/70">
            Welcome to your NexaCore dashboard. This page will display personalized insights across education, health, and finance.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
