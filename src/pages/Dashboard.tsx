
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  BookOpen, 
  Heart, 
  PieChart, 
  FileText, 
  Zap, 
  Activity,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

type AutomationStatus = {
  name: string;
  status: "active" | "inactive" | "pending";
  lastRun: string;
  nextRun: string;
};

const Dashboard = () => {
  const { toast } = useToast();
  const [automations, setAutomations] = useState<AutomationStatus[]>([
    { name: "Daily Health Reminders", status: "active", lastRun: "Today, 8:00 AM", nextRun: "Tomorrow, 8:00 AM" },
    { name: "Weekly Finance Report", status: "active", lastRun: "Monday, 9:00 AM", nextRun: "Next Monday, 9:00 AM" },
    { name: "Study Schedule Sync", status: "inactive", lastRun: "N/A", nextRun: "N/A" },
    { name: "Monthly Progress Report", status: "pending", lastRun: "Last month", nextRun: "1st of next month" }
  ]);

  useEffect(() => {
    toast({
      title: "Dashboard Loaded",
      description: "Welcome to your NexaCore dashboard",
      variant: "default",
    });
  }, [toast]);

  const handleActivateAutomation = (index: number) => {
    const updatedAutomations = [...automations];
    const automation = updatedAutomations[index];
    
    if (automation.status === "inactive") {
      automation.status = "active";
      automation.nextRun = "Tomorrow, 8:00 AM";
      
      toast({
        title: "Automation Activated",
        description: `${automation.name} has been activated successfully`,
        variant: "default",
      });
    } else if (automation.status === "active") {
      automation.status = "inactive";
      automation.nextRun = "N/A";
      
      toast({
        title: "Automation Deactivated",
        description: `${automation.name} has been deactivated`,
        variant: "default",
      });
    }
    
    setAutomations(updatedAutomations);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-white/70">Welcome to your NexaCore dashboard</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 flex items-center justify-center">
            <LayoutDashboard className="text-nexacore-teal" size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/education" className="block">
            <Card className="bg-nexacore-blue-dark/50 border-white/10 hover:bg-nexacore-blue-dark/70 transition-colors h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookOpen className="mr-2 text-nexacore-teal" size={20} />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Track your learning progress and get personalized course recommendations.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Explore <ArrowRight size={16} className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </Link>

          <Link to="/health" className="block">
            <Card className="bg-nexacore-blue-dark/50 border-white/10 hover:bg-nexacore-blue-dark/70 transition-colors h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Heart className="mr-2 text-nexacore-teal" size={20} />
                  Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Monitor your wellness metrics and receive personalized health recommendations.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Explore <ArrowRight size={16} className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </Link>

          <Link to="/finance" className="block">
            <Card className="bg-nexacore-blue-dark/50 border-white/10 hover:bg-nexacore-blue-dark/70 transition-colors h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <PieChart className="mr-2 text-nexacore-teal" size={20} />
                  Finance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">
                  Manage your expenses, track your budget, and get financial insights.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Explore <ArrowRight size={16} className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="mr-2 text-nexacore-teal" size={20} />
                  Active Automations
                </CardTitle>
                <CardDescription className="text-white/70">
                  n8n workflow automation status and schedules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {automations.map((automation, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      automation.status === "active" 
                        ? "bg-green-500/10 border border-green-500/30" 
                        : automation.status === "pending" 
                          ? "bg-yellow-500/10 border border-yellow-500/30"
                          : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                        automation.status === "active" 
                          ? "bg-green-500/20 text-green-400" 
                          : automation.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-white/10 text-white/60"
                      }`}>
                        {automation.status === "active" ? (
                          <CheckCircle size={18} />
                        ) : automation.status === "pending" ? (
                          <Clock size={18} />
                        ) : (
                          <AlertCircle size={18} />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{automation.name}</p>
                        <div className="flex text-xs text-white/60 space-x-4">
                          <span>Last run: {automation.lastRun}</span>
                          {automation.status !== "inactive" && (
                            <span>Next run: {automation.nextRun}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className={`h-8 ${
                        automation.status === "active" 
                          ? "hover:bg-green-500/20 text-green-400" 
                          : automation.status === "pending"
                            ? "hover:bg-yellow-500/20 text-yellow-400"
                            : "hover:bg-white/10 text-white/60"
                      }`}
                      onClick={() => handleActivateAutomation(index)}
                    >
                      {automation.status === "inactive" ? "Activate" : (
                        automation.status === "pending" ? "Pending" : "Active"
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Link to="/settings?tab=automation">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Manage Automations
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="mr-2 text-nexacore-teal" size={20} />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { text: "Health report generated", time: "2 hours ago" },
                    { text: "Budget automation ran", time: "Yesterday" },
                    { text: "Study schedule updated", time: "2 days ago" },
                    { text: "Finance report downloaded", time: "1 week ago" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="h-2 w-2 rounded-full bg-nexacore-teal mt-2"></div>
                      <div>
                        <p className="text-sm text-white">{activity.text}</p>
                        <p className="text-xs text-white/60">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/reports">
                  <Button 
                    className="w-full bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                  >
                    <FileText size={16} className="mr-2" />
                    Generate Reports
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
