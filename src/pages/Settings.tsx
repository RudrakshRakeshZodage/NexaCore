
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Bell, Shield, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@radix-ui/react-switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import DashboardLayout from "@/components/DashboardLayout";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
    marketing: false
  });
  
  const [appearance, setAppearance] = useState({
    darkMode: true,
    animations: true,
    compactMode: false
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    activityTracking: true,
    dataSharingAnalytics: false
  });
  
  const { toast } = useToast();
  
  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Settings updated",
      description: `Notification preference updated`,
      variant: "default"
    });
  };
  
  const handleToggleAppearance = (key: keyof typeof appearance) => {
    setAppearance(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Settings updated",
      description: `Appearance setting updated`,
      variant: "default"
    });
  };
  
  const handleTogglePrivacy = (key: keyof typeof privacy) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    toast({
      title: "Settings updated",
      description: `Privacy setting updated`,
      variant: "default"
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-white/70">Manage your account preferences</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 flex items-center justify-center">
            <SettingsIcon className="text-nexacore-teal" size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="mr-2 text-nexacore-teal" size={20} />
                  Notifications
                </CardTitle>
                <CardDescription className="text-white/70">
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-white/70">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email} 
                    onCheckedChange={() => handleToggleNotification("email")} 
                    className={`${
                      notifications.email ? 'bg-nexacore-teal' : 'bg-white/20'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                  >
                    <span 
                      className={`${
                        notifications.email ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-white/70">Get push notifications in the browser</p>
                  </div>
                  <Switch 
                    checked={notifications.push} 
                    onCheckedChange={() => handleToggleNotification("push")} 
                    className={`${
                      notifications.push ? 'bg-nexacore-teal' : 'bg-white/20'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                  >
                    <span 
                      className={`${
                        notifications.push ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Product Updates</h3>
                    <p className="text-sm text-white/70">Receive updates about new features</p>
                  </div>
                  <Switch 
                    checked={notifications.updates} 
                    onCheckedChange={() => handleToggleNotification("updates")} 
                    className={`${
                      notifications.updates ? 'bg-nexacore-teal' : 'bg-white/20'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                  >
                    <span 
                      className={`${
                        notifications.updates ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Marketing Emails</h3>
                    <p className="text-sm text-white/70">Receive marketing communications</p>
                  </div>
                  <Switch 
                    checked={notifications.marketing} 
                    onCheckedChange={() => handleToggleNotification("marketing")} 
                    className={`${
                      notifications.marketing ? 'bg-nexacore-teal' : 'bg-white/20'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                  >
                    <span 
                      className={`${
                        notifications.marketing ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="mr-2 text-nexacore-teal" size={20} />
                  Privacy & Security
                </CardTitle>
                <CardDescription className="text-white/70">
                  Manage your privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Profile Visibility</h3>
                    <p className="text-sm text-white/70">Make your profile visible to others</p>
                  </div>
                  <Switch 
                    checked={privacy.profileVisibility} 
                    onCheckedChange={() => handleTogglePrivacy("profileVisibility")} 
                    className={`${
                      privacy.profileVisibility ? 'bg-nexacore-teal' : 'bg-white/20'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                  >
                    <span 
                      className={`${
                        privacy.profileVisibility ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Activity Tracking</h3>
                    <p className="text-sm text-white/70">Allow system to track your activities to improve recommendations</p>
                  </div>
                  <Switch 
                    checked={privacy.activityTracking} 
                    onCheckedChange={() => handleTogglePrivacy("activityTracking")} 
                    className={`${
                      privacy.activityTracking ? 'bg-nexacore-teal' : 'bg-white/20'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                  >
                    <span 
                      className={`${
                        privacy.activityTracking ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Data Sharing for Analytics</h3>
                    <p className="text-sm text-white/70">Share anonymous data to help improve our services</p>
                  </div>
                  <Switch 
                    checked={privacy.dataSharingAnalytics} 
                    onCheckedChange={() => handleTogglePrivacy("dataSharingAnalytics")} 
                    className={`${
                      privacy.dataSharingAnalytics ? 'bg-nexacore-teal' : 'bg-white/20'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                  >
                    <span 
                      className={`${
                        privacy.dataSharingAnalytics ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  {appearance.darkMode ? <Moon className="mr-2 text-nexacore-teal" size={20} /> : <Sun className="mr-2 text-nexacore-teal" size={20} />}
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-white/70">Toggle between dark and light theme</p>
                  </div>
                  <Switch 
                    checked={appearance.darkMode} 
                    onCheckedChange={() => handleToggleAppearance("darkMode")} 
                    className={`${
                      appearance.darkMode ? 'bg-nexacore-teal' : 'bg-white/20'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                  >
                    <span 
                      className={`${
                        appearance.darkMode ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Animations</h3>
                    <p className="text-sm text-white/70">Enable UI animations</p>
                  </div>
                  <Switch 
                    checked={appearance.animations} 
                    onCheckedChange={() => handleToggleAppearance("animations")} 
                    className={`${
                      appearance.animations ? 'bg-nexacore-teal' : 'bg-white/20'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                  >
                    <span 
                      className={`${
                        appearance.animations ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium">Compact Mode</h3>
                    <p className="text-sm text-white/70">Reduce spacing in the UI</p>
                  </div>
                  <Switch 
                    checked={appearance.compactMode} 
                    onCheckedChange={() => handleToggleAppearance("compactMode")} 
                    className={`${
                      appearance.compactMode ? 'bg-nexacore-teal' : 'bg-white/20'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                  >
                    <span 
                      className={`${
                        appearance.compactMode ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </Switch>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Help & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:bg-white/5 rounded-md px-2">
                    <span>FAQ</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-2 py-2 text-sm text-white/70">
                    Find answers to frequently asked questions about using NexaCore.
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:bg-white/5 rounded-md px-2">
                    <span>Contact Support</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-2 py-2 text-sm text-white/70">
                    Need help? Contact our support team at support@nexacore.com
                  </CollapsibleContent>
                </Collapsible>
                
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between py-2 hover:bg-white/5 rounded-md px-2">
                    <span>About</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-2 py-2 text-sm text-white/70">
                    NexaCore v1.0.0 - A comprehensive personal development platform.
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
