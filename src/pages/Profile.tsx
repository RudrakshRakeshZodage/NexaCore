
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useFirebase } from "@/context/FirebaseContext";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Edit, 
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";
import ChatbotScript from "@/components/ChatbotScript";
import { motion } from "framer-motion";
import EmailProfile from "@/components/EmailProfile";

const Profile = () => {
  const { user } = useAuth();
  const { user: firebaseUser } = useFirebase();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || firebaseUser?.displayName || "User",
    email: user?.email || firebaseUser?.email || "user@example.com",
    phone: "+91 9876543210",
    birthdate: "1998-06-15",
    address: "Pune, Maharashtra, India",
    occupation: "Student",
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved",
      variant: "default",
    });
  };

  const handlePhotoChange = (photoUrl: string) => {
    setProfilePhoto(photoUrl);
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
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
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
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
                          readOnly
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
            </motion.div>

            {/* Email Profile Component */}
            <EmailProfile email={profileData.email} />
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-nexacore-blue-dark/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-center">Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <ProfilePhotoUpload 
                    onPhotoChange={handlePhotoChange}
                    initialPhoto={profilePhoto || undefined}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
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
                      <span className="text-white/70">Email Status</span>
                      <span className="text-white font-medium text-green-400">Verified</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Add Chatbot */}
      <ChatbotScript />
    </DashboardLayout>
  );
};

export default Profile;
