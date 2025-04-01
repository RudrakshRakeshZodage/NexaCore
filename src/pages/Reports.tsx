
import DashboardLayout from "@/components/DashboardLayout";

const Reports = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Reports</h1>
        <div className="glass-card p-6">
          <p className="text-white/70">
            Generate detailed PDF reports summarizing your progress and insights across all areas - education, health, and finance.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
