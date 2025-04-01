
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Edit, 
  Save, 
  Zap,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { useN8nAutomation } from "@/lib/automationHelpers";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { triggerAutomation } = useN8nAutomation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "User",
    email: user?.email || "user@example.com",
    phone: "+91 9876543210",
    birthdate: "1998-06-15",
    address: "Pune, Maharashtra, India",
    occupation: "Student",
    webhookUrl: ""
  });
  
  const [automationPreferences, setAutomationPreferences] = useState({
    profileSync: true,
    reportSubscription: true,
    dataBackup: false,
    calendarSync: true
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved",
      variant: "default",
    });
    
    // If webhook URL is provided, trigger profile update automation
    if (profileData.webhookUrl) {
      triggerAutomation(
        profileData.webhookUrl, 
        { action: "profile_update", user: profileData },
        { successMessage: "Profile sync automation triggered" }
      );
    }
  };

  const handleToggleAutomation = (key: keyof typeof automationPreferences) => {
    setAutomationPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    // If webhook URL is provided, trigger preference update automation
    if (profileData.webhookUrl) {
      triggerAutomation(
        profileData.webhookUrl, 
        { 
          action: "preference_update", 
          preference: key, 
          value: !automationPreferences[key],
          user: user?.email
        },
        { successMessage: `${key} preference updated in automation workflow` }
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-white/70">Manage your personal information</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 flex items-center justify-center">
            <User className="text-nexacore-teal" size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <User className="mr-2 text-nexacore-teal" size={20} />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Update your personal details
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <><Save size={16} className="mr-2" /> Save</>
                  ) : (
                    <><Edit size={16} className="mr-2" /> Edit</>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white flex items-center">
                      <User size={16} className="mr-2 text-white/70" />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="bg-white/10 border-white/20 text-white" 
                      />
                    ) : (
                      <p className="text-white/90 p-2 bg-white/5 rounded-md">{profileData.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white flex items-center">
                      <Mail size={16} className="mr-2 text-white/70" />
                      Email Address
                    </Label>
                    {isEditing ? (
                      <Input 
                        value={profileData.email} 
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="bg-white/10 border-white/20 text-white" 
                      />
                    ) : (
                      <p className="text-white/90 p-2 bg-white/5 rounded-md">{profileData.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white flex items-center">
                      <Phone size={16} className="mr-2 text-white/70" />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input 
                        value={profileData.phone} 
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="bg-white/10 border-white/20 text-white" 
                      />
                    ) : (
                      <p className="text-white/90 p-2 bg-white/5 rounded-md">{profileData.phone}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white flex items-center">
                      <Calendar size={16} className="mr-2 text-white/70" />
                      Date of Birth
                    </Label>
                    {isEditing ? (
                      <Input 
                        type="date"
                        value={profileData.birthdate} 
                        onChange={(e) => setProfileData({...profileData, birthdate: e.target.value})}
                        className="bg-white/10 border-white/20 text-white" 
                      />
                    ) : (
                      <p className="text-white/90 p-2 bg-white/5 rounded-md">{profileData.birthdate}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white flex items-center">
                      <MapPin size={16} className="mr-2 text-white/70" />
                      Address
                    </Label>
                    {isEditing ? (
                      <Input 
                        value={profileData.address} 
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        className="bg-white/10 border-white/20 text-white" 
                      />
                    ) : (
                      <p className="text-white/90 p-2 bg-white/5 rounded-md">{profileData.address}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white flex items-center">
                      <Briefcase size={16} className="mr-2 text-white/70" />
                      Occupation
                    </Label>
                    {isEditing ? (
                      <Input 
                        value={profileData.occupation} 
                        onChange={(e) => setProfileData({...profileData, occupation: e.target.value})}
                        className="bg-white/10 border-white/20 text-white" 
                      />
                    ) : (
                      <p className="text-white/90 p-2 bg-white/5 rounded-md">{profileData.occupation}</p>
                    )}
                  </div>
                </div>
                
                {isEditing && (
                  <div className="pt-3 border-t border-white/10">
                    <Button 
                      onClick={handleSaveProfile} 
                      className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="mr-2 text-nexacore-teal" size={20} />
                  Automation Integration
                </CardTitle>
                <CardDescription className="text-white/70">
                  Connect your profile to n8n workflows
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url" className="text-white">n8n Profile Webhook URL</Label>
                  <Input 
                    id="webhook-url"
                    placeholder="https://your-n8n-instance.com/webhook/profile-update" 
                    value={profileData.webhookUrl}
                    onChange={(e) => setProfileData({...profileData, webhookUrl: e.target.value})}
                    className="bg-white/10 border-white/20 text-white" 
                  />
                  <p className="text-xs text-white/60">
                    This webhook will be triggered whenever your profile information changes
                  </p>
                </div>

                <div className="space-y-3 pt-3">
                  <h3 className="text-sm font-medium text-white">Automation Preferences</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-2 rounded-md bg-white/5">
                      <Label htmlFor="profile-sync" className="text-white text-sm cursor-pointer">
                        Profile Data Sync
                      </Label>
                      <Switch 
                        id="profile-sync"
                        checked={automationPreferences.profileSync}
                        onCheckedChange={() => handleToggleAutomation('profileSync')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-md bg-white/5">
                      <Label htmlFor="report-subscription" className="text-white text-sm cursor-pointer">
                        Report Subscription
                      </Label>
                      <Switch 
                        id="report-subscription"
                        checked={automationPreferences.reportSubscription}
                        onCheckedChange={() => handleToggleAutomation('reportSubscription')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-md bg-white/5">
                      <Label htmlFor="data-backup" className="text-white text-sm cursor-pointer">
                        Data Backup
                      </Label>
                      <Switch 
                        id="data-backup"
                        checked={automationPreferences.dataBackup}
                        onCheckedChange={() => handleToggleAutomation('dataBackup')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-md bg-white/5">
                      <Label htmlFor="calendar-sync" className="text-white text-sm cursor-pointer">
                        Calendar Sync
                      </Label>
                      <Switch 
                        id="calendar-sync"
                        checked={automationPreferences.calendarSync}
                        onCheckedChange={() => handleToggleAutomation('calendarSync')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                  onClick={() => {
                    if (profileData.webhookUrl) {
                      triggerAutomation(
                        profileData.webhookUrl,
                        {
                          action: "sync_all",
                          preferences: automationPreferences,
                          user: profileData
                        },
                        { successMessage: "Profile data sync initiated" }
                      );
                    } else {
                      toast({
                        title: "Missing webhook URL",
                        description: "Please enter your n8n webhook URL to enable automation",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <Zap size={16} className="mr-2" />
                  Sync Profile Data Now
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-center">Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-32 w-32 rounded-full bg-nexacore-teal/20 flex items-center justify-center mb-4">
                  <User className="h-16 w-16 text-nexacore-teal" />
                </div>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Upload size={16} className="mr-2" />
                  Change Photo
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Account Type</span>
                    <span className="text-white font-medium">Standard</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Member Since</span>
                    <span className="text-white font-medium">June 2023</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Reports Generated</span>
                    <span className="text-white font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Automations</span>
                    <span className="text-white font-medium">4 Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-nexacore-teal/20 border border-nexacore-teal/30 rounded-lg p-4">
              <h3 className="text-nexacore-teal font-medium flex items-center">
                <Zap size={18} className="mr-2" />
                Automation Benefits
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-white/80">
                <li>• Automatic report generation</li>
                <li>• Calendar and task syncing</li>
                <li>• Data backup and protection</li>
                <li>• Smart notifications and alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
