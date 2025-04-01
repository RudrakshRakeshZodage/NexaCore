
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  Lock, 
  Database, 
  Zap, 
  Trash2, 
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import DashboardLayout from "@/components/DashboardLayout";
import { useTheme } from "@/context/ThemeContext";

const Settings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [automationsEnabled, setAutomationsEnabled] = useState(true);
  const [dataSync, setDataSync] = useState(true);
  const [apiEndpoint, setApiEndpoint] = useState("https://api.nexacore.example.com");
  const [fontSize, setFontSize] = useState([16]);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully",
      variant: "default",
    });
  };
  
  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion Requested",
      description: "Please check your email to confirm account deletion",
      variant: "destructive",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-white/70 dark:text-foreground/70">Manage your preferences and account settings</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 dark:bg-primary/20 flex items-center justify-center">
            <SettingsIcon className="text-nexacore-teal dark:text-primary" size={24} />
          </div>
        </div>

        <Tabs defaultValue="appearance" className="space-y-4">
          <TabsList className="bg-white/10 dark:bg-foreground/10 p-1">
            <TabsTrigger value="appearance" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
              Security
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
              Advanced
            </TabsTrigger>
          </TabsList>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground flex items-center">
                  <Sun className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                  Theme Settings
                </CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Customize how NexaCore looks on your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white dark:text-card-foreground">Theme Mode</h3>
                  <RadioGroup 
                    defaultValue={theme} 
                    onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
                    className="grid grid-cols-3 gap-4"
                  >
                    <div>
                      <RadioGroupItem 
                        value="light" 
                        id="theme-light" 
                        className="peer sr-only" 
                      />
                      <Label 
                        htmlFor="theme-light" 
                        className="flex flex-col items-center justify-between rounded-md border-2 border-white/20 dark:border-foreground/20 bg-white/5 dark:bg-foreground/5 p-4 hover:bg-white/10 dark:hover:bg-foreground/10 hover:text-accent-foreground peer-data-[state=checked]:border-nexacore-teal dark:peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-nexacore-teal dark:[&:has([data-state=checked])]:border-primary"
                      >
                        <Sun className="mb-3 h-6 w-6" />
                        <div className="text-sm">Light</div>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem 
                        value="dark" 
                        id="theme-dark" 
                        className="peer sr-only" 
                      />
                      <Label 
                        htmlFor="theme-dark" 
                        className="flex flex-col items-center justify-between rounded-md border-2 border-white/20 dark:border-foreground/20 bg-white/5 dark:bg-foreground/5 p-4 hover:bg-white/10 dark:hover:bg-foreground/10 hover:text-accent-foreground peer-data-[state=checked]:border-nexacore-teal dark:peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-nexacore-teal dark:[&:has([data-state=checked])]:border-primary"
                      >
                        <Moon className="mb-3 h-6 w-6" />
                        <div className="text-sm">Dark</div>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem 
                        value="system" 
                        id="theme-system" 
                        className="peer sr-only" 
                      />
                      <Label 
                        htmlFor="theme-system" 
                        className="flex flex-col items-center justify-between rounded-md border-2 border-white/20 dark:border-foreground/20 bg-white/5 dark:bg-foreground/5 p-4 hover:bg-white/10 dark:hover:bg-foreground/10 hover:text-accent-foreground peer-data-[state=checked]:border-nexacore-teal dark:peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-nexacore-teal dark:[&:has([data-state=checked])]:border-primary"
                      >
                        <Monitor className="mb-3 h-6 w-6" />
                        <div className="text-sm">System</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="font-size" className="text-sm font-medium text-white dark:text-card-foreground">Font Size</Label>
                    <span className="text-sm text-white/70 dark:text-card-foreground/70">{fontSize[0]}px</span>
                  </div>
                  <Slider
                    id="font-size"
                    defaultValue={fontSize}
                    max={24}
                    min={12}
                    step={1}
                    onValueChange={setFontSize}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/60 dark:text-card-foreground/60">
                    <span>Small</span>
                    <span>Large</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground flex items-center">
                  <Bell className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Manage how and when we notify you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-white dark:text-card-foreground">
                      Enable All Notifications
                    </Label>
                    <p className="text-sm text-white/70 dark:text-card-foreground/70">
                      Receive all app notifications
                    </p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notif" className="text-white dark:text-card-foreground">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-white/70 dark:text-card-foreground/70">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="email-notif" 
                    checked={emailNotifications && notificationsEnabled}
                    onCheckedChange={setEmailNotifications}
                    disabled={!notificationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notif" className="text-white dark:text-card-foreground">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-white/70 dark:text-card-foreground/70">
                      Receive notifications on your device
                    </p>
                  </div>
                  <Switch 
                    id="push-notif" 
                    checked={pushNotifications && notificationsEnabled}
                    onCheckedChange={setPushNotifications}
                    disabled={!notificationsEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground flex items-center">
                  <Lock className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-white dark:text-card-foreground">
                    Current Password
                  </Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    placeholder="Enter your current password" 
                    className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-white dark:text-card-foreground">
                    New Password
                  </Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="Enter new password" 
                    className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white dark:text-card-foreground">
                    Confirm New Password
                  </Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirm new password" 
                    className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                  />
                </div>
                
                <Button 
                  className="w-full bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                >
                  Change Password
                </Button>
                
                <div className="pt-4 border-t border-white/10 dark:border-foreground/10">
                  <h3 className="text-lg font-medium text-white dark:text-card-foreground mb-4">Danger Zone</h3>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground flex items-center">
                  <Database className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                  Advanced Settings
                </CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Manage data and automation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sync" className="text-white dark:text-card-foreground">
                      Data Synchronization
                    </Label>
                    <p className="text-sm text-white/70 dark:text-card-foreground/70">
                      Keep your data in sync across devices
                    </p>
                  </div>
                  <Switch 
                    id="data-sync" 
                    checked={dataSync}
                    onCheckedChange={setDataSync}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="automations" className="text-white dark:text-card-foreground">
                      Enable Automations
                    </Label>
                    <p className="text-sm text-white/70 dark:text-card-foreground/70">
                      Allow n8n workflows to automate tasks
                    </p>
                  </div>
                  <Switch 
                    id="automations" 
                    checked={automationsEnabled}
                    onCheckedChange={setAutomationsEnabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="api-endpoint" className="text-white dark:text-card-foreground">
                    API Endpoint
                  </Label>
                  <Input 
                    id="api-endpoint" 
                    placeholder="https://api.nexacore.example.com" 
                    className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                  />
                  <p className="text-xs text-white/60 dark:text-card-foreground/60">
                    Used for external API connections and n8n automation workflows
                  </p>
                </div>
                
                <div className="pt-4 border-t border-white/10 dark:border-foreground/10">
                  <Button 
                    className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                    onClick={() => {
                      toast({
                        title: "Cache Cleared",
                        description: "Application cache has been cleared successfully",
                        variant: "default",
                      });
                    }}
                  >
                    Clear Application Cache
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button 
            className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
            onClick={handleSaveSettings}
          >
            <Save className="mr-2 h-4 w-4" />
            Save All Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
