
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Heart,
  Activity,
  BarChart,
  Calendar,
  Clock,
  Moon,
  Utensils,
  Zap,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import AutomationAlert from "@/components/AutomationAlert";
import { useN8nAutomation } from "@/lib/automationHelpers";

const Health = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { triggerAutomation } = useN8nAutomation();
  const [showAutomationAlert, setShowAutomationAlert] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("");
  
  // Fetch webhook URL from localStorage if available
  useEffect(() => {
    const savedWebhookUrl = localStorage.getItem("health_webhook_url");
    if (savedWebhookUrl) {
      setWebhookUrl(savedWebhookUrl);
    }
  }, []);

  const handleAutomationSetup = () => {
    navigate("/settings?tab=automation");
  };

  const healthMetrics = [
    { 
      title: "Sleep Analysis", 
      icon: <Moon className="mr-2 text-nexacore-teal" size={20} />,
      value: "6.8 hrs", 
      status: "Below target",
      automation: "sleep_tracking"
    },
    { 
      title: "Activity Level", 
      icon: <Activity className="mr-2 text-nexacore-teal" size={20} />,
      value: "Medium", 
      status: "9,500 steps",
      automation: "activity_tracking"
    },
    { 
      title: "Stress Level", 
      icon: <BarChart className="mr-2 text-nexacore-teal" size={20} />,
      value: "Moderate", 
      status: "Based on facial analysis",
      automation: "stress_monitoring"
    },
    { 
      title: "Nutrition", 
      icon: <Utensils className="mr-2 text-nexacore-teal" size={20} />,
      value: "Good", 
      status: "Balanced intake",
      automation: "nutrition_tracking"
    }
  ];

  const handleTriggerHealthAutomation = (automation: string) => {
    if (!webhookUrl) {
      toast({
        title: "Webhook URL Required",
        description: "Please configure your n8n webhook URL in the Settings page",
        variant: "destructive",
      });
      return;
    }
    
    triggerAutomation(
      webhookUrl,
      {
        action: automation,
        timestamp: new Date().toISOString(),
        source: "NexaCore Health Module"
      },
      {
        successMessage: `Health ${automation} automation triggered successfully`,
        errorMessage: "Failed to trigger health automation"
      }
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Health</h1>
            <p className="text-white/70">Monitor your health metrics and get personalized recommendations</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 flex items-center justify-center">
            <Heart className="text-nexacore-teal" size={24} />
          </div>
        </div>

        <AutomationAlert 
          isVisible={showAutomationAlert}
          onClose={() => setShowAutomationAlert(false)}
          onConfigure={handleAutomationSetup}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthMetrics.map((metric, index) => (
            <Card key={index} className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center text-lg">
                  {metric.icon}
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-1">
                  <p className="text-2xl font-semibold text-white">{metric.value}</p>
                  <p className="text-sm text-white/60">{metric.status}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-nexacore-teal hover:bg-nexacore-teal/10 p-0 h-auto"
                  onClick={() => handleTriggerHealthAutomation(metric.automation)}
                >
                  <Zap size={14} className="mr-1" />
                  Automate
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="mr-2 text-nexacore-teal" size={20} />
                  Weekly Health Schedule
                </CardTitle>
                <CardDescription className="text-white/70">
                  Recommended health activities based on your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { day: "Monday", activity: "30 min Cardio", time: "6:30 AM", intensity: "Medium" },
                  { day: "Tuesday", activity: "Meditation", time: "7:00 AM", intensity: "Low" },
                  { day: "Wednesday", activity: "Strength Training", time: "6:00 PM", intensity: "High" },
                  { day: "Thursday", activity: "Rest Day", time: "All day", intensity: "Low" },
                  { day: "Friday", activity: "Yoga", time: "7:30 AM", intensity: "Medium" },
                  { day: "Saturday", activity: "Outdoor Walk", time: "10:00 AM", intensity: "Medium" },
                  { day: "Sunday", activity: "Recovery Stretching", time: "6:00 PM", intensity: "Low" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-nexacore-teal/20 rounded-full flex items-center justify-center mr-3">
                        <Clock size={18} className="text-nexacore-teal" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.day}</p>
                        <p className="text-sm text-white/60">{item.activity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white">{item.time}</p>
                      <div className={`text-xs px-2 py-0.5 rounded ${
                        item.intensity === "High" 
                          ? "bg-red-500/20 text-red-400" 
                          : item.intensity === "Medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-green-500/20 text-green-400"
                      }`}>
                        {item.intensity}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <div className="w-full flex justify-between">
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => handleTriggerHealthAutomation("sync_health_calendar")}
                  >
                    <Calendar size={16} className="mr-2" />
                    Sync to Calendar
                  </Button>
                  <Button 
                    className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                    onClick={() => navigate("/reports?tab=health")}
                  >
                    Generate Health Report
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="mr-2 text-nexacore-teal" size={20} />
                  n8n Health Automation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-white/80">Health Module Webhook URL</label>
                  <input 
                    type="text" 
                    placeholder="https://your-n8n-instance.com/webhook/..." 
                    className="w-full px-3 py-2 rounded-md bg-white/10 border border-white/20 text-white text-sm"
                    value={webhookUrl}
                    onChange={(e) => {
                      setWebhookUrl(e.target.value);
                      localStorage.setItem("health_webhook_url", e.target.value);
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-white">Available Automations</h3>
                  
                  {[
                    { name: "Sleep Tracking", description: "Analyze sleep patterns" },
                    { name: "Stress Monitoring", description: "Track stress levels" },
                    { name: "Exercise Reminders", description: "Get activity alerts" },
                    { name: "Water Intake", description: "Track hydration" }
                  ].map((automation, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-white/5">
                      <div>
                        <p className="text-sm text-white">{automation.name}</p>
                        <p className="text-xs text-white/60">{automation.description}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-nexacore-teal hover:bg-nexacore-teal/10"
                        onClick={() => handleTriggerHealthAutomation(automation.name.toLowerCase().replace(' ', '_'))}
                      >
                        <Zap size={14} className="mr-1" />
                        Run
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                  onClick={() => navigate("/settings?tab=automation")}
                >
                  Configure Health Automations
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Health;
