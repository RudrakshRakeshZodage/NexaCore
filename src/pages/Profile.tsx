
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Calendar, MapPin, Phone, Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    birthdate: "",
    address: "",
    phone: "",
    bio: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = () => {
    // In a real app, you would update the user profile on the backend
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully",
      variant: "default",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <p className="text-white/70">Manage your personal information</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 flex items-center justify-center">
            <User className="text-nexacore-teal" size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Personal Information</CardTitle>
                <CardDescription className="text-white/70">
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
                      <Input 
                        id="name" 
                        name="name"
                        placeholder="Your full name" 
                        className="pl-10 bg-white/10 border-white/20 text-white" 
                        value={profileData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="your@email.com" 
                        className="pl-10 bg-white/10 border-white/20 text-white" 
                        value={profileData.email}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthdate" className="text-white">Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
                      <Input 
                        id="birthdate" 
                        name="birthdate"
                        type="date" 
                        className="pl-10 bg-white/10 border-white/20 text-white" 
                        value={profileData.birthdate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
                      <Input 
                        id="phone" 
                        name="phone"
                        placeholder="+91 98765 43210" 
                        className="pl-10 bg-white/10 border-white/20 text-white" 
                        value={profileData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-white">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-white/50" size={16} />
                    <textarea 
                      id="address" 
                      name="address"
                      rows={2}
                      placeholder="Your address" 
                      className="w-full pl-10 bg-white/10 border-white/20 text-white rounded-md px-3 py-2" 
                      value={profileData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">Bio</Label>
                  <textarea 
                    id="bio" 
                    name="bio"
                    rows={4}
                    placeholder="Tell us about yourself" 
                    className="w-full bg-white/10 border-white/20 text-white rounded-md px-3 py-2" 
                    value={profileData.bio}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveProfile}
                  className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Your Account</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-nexacore-teal/20 flex items-center justify-center mb-4">
                  <User className="text-nexacore-teal" size={40} />
                </div>
                <h3 className="text-lg font-medium">{user?.name || "User"}</h3>
                <p className="text-white/70">{user?.email || "user@example.com"}</p>
                
                <div className="w-full mt-6 pt-6 border-t border-white/10">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Previous Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "Monthly Progress - June", date: "01/06/2023" },
                    { title: "Monthly Progress - May", date: "01/05/2023" },
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 group">
                      <div>
                        <p className="text-sm font-medium">{report.title}</p>
                        <p className="text-xs text-white/60">{report.date}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Download size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
