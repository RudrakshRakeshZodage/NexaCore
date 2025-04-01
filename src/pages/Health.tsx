
import DashboardLayout from "@/components/DashboardLayout";

const Health = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Health</h1>
        <div className="glass-card p-6">
          <p className="text-white/70">
            Your health section will provide personalized health recommendations including nutrition, exercise routines, and wellness tips based on your profile.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Health;
