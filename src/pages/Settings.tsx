
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Zap, Bell, Lock, Globe, Clock, Database, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

const Settings = () => {
  const { toast } = useToast();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState("english");
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState("");
  const [n8nApiKey, setN8nApiKey] = useState("");
  const [selectedWorkflows, setSelectedWorkflows] = useState({
    dailyReminders: true,
    expenseTracking: true,
    studySchedule: false,
    emotionAnalysis: true,
    reportGeneration: false
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully",
      variant: "default",
    });
  };

  const handleAutomationToggle = (workflow: keyof typeof selectedWorkflows) => {
    setSelectedWorkflows(prev => ({
      ...prev,
      [workflow]: !prev[workflow]
    }));
  };

  const handleTestWebhook = async () => {
    if (!n8nWebhookUrl) {
      toast({
        title: "Missing webhook URL",
        description: "Please enter your n8n webhook URL",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Testing webhook",
        description: "Sending test data to your n8n workflow...",
        variant: "default",
      });

      // This is a mock implementation for demonstration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Webhook test successful",
        description: "Your n8n workflow received the test data",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Webhook test failed",
        description: "Failed to connect to your n8n workflow",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-white/70">Customize your application settings</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 flex items-center justify-center">
            <SettingsIcon className="text-nexacore-teal" size={24} />
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-nexacore-blue-dark/50 p-1 border border-white/10 rounded-lg">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
          </TabsList>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="mr-2 text-nexacore-teal" size={20} />
                  General Settings
                </CardTitle>
                <CardDescription className="text-white/70">
                  Update your app preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode" className="text-white">Dark Mode</Label>
                    <p className="text-sm text-white/60">Toggle dark/light theme</p>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="text-white">Language</Label>
                  <select 
                    id="language" 
                    className="w-full h-10 rounded-md border bg-white/10 border-white/20 text-white px-3 py-2" 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="hindi">Hindi</option>
                  </select>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveSettings} 
                  className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                >
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notifications Settings Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Bell className="mr-2 text-nexacore-teal" size={20} />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-white/70">
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-white">Enable Notifications</Label>
                    <p className="text-sm text-white/60">Receive push notifications</p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={notificationsEnabled} 
                    onCheckedChange={setNotificationsEnabled} 
                  />
                </div>

                {notificationsEnabled && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications" className="text-white">Email Notifications</Label>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications" className="text-white">Push Notifications</Label>
                      <Switch id="push-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="report-notifications" className="text-white">Report Summaries</Label>
                      <Switch id="report-notifications" />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveSettings} 
                  className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                >
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Security Settings Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lock className="mr-2 text-nexacore-teal" size={20} />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-white/70">
                  Manage your security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-white">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    placeholder="Enter your current password" 
                    className="bg-white/10 border-white/20 text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-white">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="Enter your new password" 
                    className="bg-white/10 border-white/20 text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirm your new password" 
                    className="bg-white/10 border-white/20 text-white" 
                  />
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor" className="text-white">Two-Factor Authentication</Label>
                      <p className="text-sm text-white/60">Enable 2FA for extra security</p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveSettings} 
                  className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                >
                  Update Password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* n8n Automation Settings Tab */}
          <TabsContent value="automation" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="mr-2 text-nexacore-teal" size={20} />
                  n8n Workflow Automation
                </CardTitle>
                <CardDescription className="text-white/70">
                  Connect your n8n workflows to automate tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="n8n-webhook" className="text-white">n8n Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="n8n-webhook" 
                      type="text" 
                      placeholder="https://your-n8n-instance.com/webhook/..." 
                      className="bg-white/10 border-white/20 text-white flex-grow" 
                      value={n8nWebhookUrl}
                      onChange={(e) => setN8nWebhookUrl(e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={handleTestWebhook}
                    >
                      Test
                    </Button>
                  </div>
                  <p className="text-xs text-white/60">Enter the webhook URL from your n8n workflow</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="n8n-api-key" className="text-white">n8n API Key (Optional)</Label>
                  <Input 
                    id="n8n-api-key" 
                    type="password" 
                    placeholder="Your n8n API key" 
                    className="bg-white/10 border-white/20 text-white" 
                    value={n8nApiKey}
                    onChange={(e) => setN8nApiKey(e.target.value)}
                  />
                  <p className="text-xs text-white/60">For secured n8n instances</p>
                </div>

                <div className="pt-4">
                  <h3 className="text-white font-medium mb-3">Enable Automated Workflows</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-md bg-white/5">
                      <div className="flex items-center">
                        <Bell size={16} className="mr-2 text-nexacore-teal" />
                        <Label htmlFor="workflow-reminders" className="text-white">Daily Reminders</Label>
                      </div>
                      <Switch 
                        id="workflow-reminders" 
                        checked={selectedWorkflows.dailyReminders}
                        onCheckedChange={() => handleAutomationToggle('dailyReminders')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-md bg-white/5">
                      <div className="flex items-center">
                        <Database size={16} className="mr-2 text-nexacore-teal" />
                        <Label htmlFor="workflow-expenses" className="text-white">Expense Tracking</Label>
                      </div>
                      <Switch 
                        id="workflow-expenses" 
                        checked={selectedWorkflows.expenseTracking}
                        onCheckedChange={() => handleAutomationToggle('expenseTracking')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-md bg-white/5">
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-nexacore-teal" />
                        <Label htmlFor="workflow-schedule" className="text-white">Study Schedule</Label>
                      </div>
                      <Switch 
                        id="workflow-schedule" 
                        checked={selectedWorkflows.studySchedule}
                        onCheckedChange={() => handleAutomationToggle('studySchedule')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-md bg-white/5">
                      <div className="flex items-center">
                        <Link size={16} className="mr-2 text-nexacore-teal" />
                        <Label htmlFor="workflow-emotion" className="text-white">Emotion Analysis</Label>
                      </div>
                      <Switch 
                        id="workflow-emotion" 
                        checked={selectedWorkflows.emotionAnalysis}
                        onCheckedChange={() => handleAutomationToggle('emotionAnalysis')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-md bg-white/5">
                      <div className="flex items-center">
                        <Link size={16} className="mr-2 text-nexacore-teal" />
                        <Label htmlFor="workflow-reports" className="text-white">Report Generation</Label>
                      </div>
                      <Switch 
                        id="workflow-reports" 
                        checked={selectedWorkflows.reportGeneration}
                        onCheckedChange={() => handleAutomationToggle('reportGeneration')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleSaveSettings} 
                  className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                >
                  Save Automation Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
