
import DashboardLayout from "@/components/DashboardLayout";

const Profile = () => {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="glass-card p-6">
          <p className="text-white/70">
            Manage your profile information here. You can update your personal details, change your password, and manage your account settings.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
