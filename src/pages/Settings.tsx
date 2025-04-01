
import DashboardLayout from "@/components/DashboardLayout";

const Settings = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="glass-card p-6">
          <p className="text-white/70">
            Customize your application settings here. You can adjust notification preferences, privacy settings, and more.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
