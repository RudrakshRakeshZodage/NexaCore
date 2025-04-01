
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  Calendar, 
  Activity, 
  PieChart, 
  BookOpen, 
  Heart, 
  Zap, 
  Clock,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/DashboardLayout";

const Reports = () => {
  const { toast } = useToast();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [scheduleInterval, setScheduleInterval] = useState("weekly");
  
  const handleGenerateReport = (type: string) => {
    setIsGeneratingReport(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast({
        title: "Report Generated",
        description: `Your ${type} report has been successfully created`,
        variant: "default",
      });
    }, 2000);
  };
  
  const handleDownloadReport = (type: string) => {
    toast({
      title: "Downloading Report",
      description: `Your ${type} report is being downloaded`,
      variant: "default",
    });
  };

  const handleScheduleToggle = () => {
    setAutomationEnabled(!automationEnabled);
    
    toast({
      title: automationEnabled ? "Automation Disabled" : "Automation Enabled",
      description: automationEnabled 
        ? "Scheduled reports have been disabled" 
        : "Your reports will be automatically generated based on your schedule",
      variant: "default",
    });
  };
  
  const renderReportCard = (title: string, icon: React.ReactNode, description: string, type: string) => (
    <Card className="bg-nexacore-blue-dark/50 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-white/70">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center">
          <Activity size={48} className="text-white/30" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          className="border-white/20 text-white hover:bg-white/10"
          onClick={() => handleDownloadReport(type)}
        >
          <Download size={16} className="mr-2" />
          Download
        </Button>
        <Button 
          className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
          onClick={() => handleGenerateReport(type)}
          disabled={isGeneratingReport}
        >
          {isGeneratingReport ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-nexacore-blue-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <FileText size={16} className="mr-2" />
              Generate New
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-white/70">Generate and manage detailed reports</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 flex items-center justify-center">
            <FileText className="text-nexacore-teal" size={24} />
          </div>
        </div>

        <Card className="bg-nexacore-blue-dark/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="mr-2 text-nexacore-teal" size={20} />
              Automated Report Scheduling
            </CardTitle>
            <CardDescription className="text-white/70">
              Set up automated report generation via n8n
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-reports" className="text-white">Enable Report Automation</Label>
                <p className="text-sm text-white/60">Generate reports automatically on schedule</p>
              </div>
              <Switch 
                id="auto-reports" 
                checked={automationEnabled} 
                onCheckedChange={handleScheduleToggle} 
              />
            </div>

            {automationEnabled && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="schedule" className="text-white">Schedule Interval</Label>
                  <select 
                    id="schedule" 
                    className="w-full h-10 rounded-md border bg-white/10 border-white/20 text-white px-3 py-2" 
                    value={scheduleInterval}
                    onChange={(e) => setScheduleInterval(e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div className="bg-white/5 p-3 rounded-lg border-l-2 border-nexacore-teal">
                  <div className="flex items-center text-sm text-white/80">
                    <Clock size={16} className="mr-2 text-nexacore-teal" />
                    <span>Next scheduled report: {scheduleInterval === 'daily' ? 'Tomorrow' : 'Next ' + scheduleInterval.charAt(0).toUpperCase() + scheduleInterval.slice(1)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-2 rounded-md bg-white/5">
                    <Label htmlFor="ed-report" className="text-white text-sm">Education</Label>
                    <Switch id="ed-report" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md bg-white/5">
                    <Label htmlFor="health-report" className="text-white text-sm">Health</Label>
                    <Switch id="health-report" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-md bg-white/5">
                    <Label htmlFor="finance-report" className="text-white text-sm">Finance</Label>
                    <Switch id="finance-report" defaultChecked />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid grid-cols-4 bg-nexacore-blue-dark/50 p-1 border border-white/10 rounded-lg">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderReportCard(
                "Education Report",
                <BookOpen className="mr-2 text-nexacore-teal" size={20} />,
                "Academic progress and learning recommendations",
                "education"
              )}
              
              {renderReportCard(
                "Health Report",
                <Heart className="mr-2 text-nexacore-teal" size={20} />,
                "Wellness metrics and health recommendations",
                "health"
              )}
              
              {renderReportCard(
                "Finance Report",
                <PieChart className="mr-2 text-nexacore-teal" size={20} />,
                "Budget analysis and financial insights",
                "finance"
              )}
              
              {renderReportCard(
                "Comprehensive Report",
                <Activity className="mr-2 text-nexacore-teal" size={20} />,
                "Combined insights across all areas",
                "comprehensive"
              )}
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderReportCard(
                "Academic Progress",
                <BookOpen className="mr-2 text-nexacore-teal" size={20} />,
                "Track your learning achievements",
                "academic"
              )}
              
              {renderReportCard(
                "Study Analytics",
                <Activity className="mr-2 text-nexacore-teal" size={20} />,
                "Analysis of study patterns and efficiency",
                "study"
              )}
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderReportCard(
                "Emotion Analysis",
                <Heart className="mr-2 text-nexacore-teal" size={20} />,
                "Insights from facial analysis results",
                "emotion"
              )}
              
              {renderReportCard(
                "Wellness Trends",
                <Activity className="mr-2 text-nexacore-teal" size={20} />,
                "Patterns in your health and wellness data",
                "wellness"
              )}
            </div>
          </TabsContent>

          <TabsContent value="finance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderReportCard(
                "Budget Analysis",
                <PieChart className="mr-2 text-nexacore-teal" size={20} />,
                "Review of spending habits and budget adherence",
                "budget"
              )}
              
              {renderReportCard(
                "Savings Forecast",
                <Calendar className="mr-2 text-nexacore-teal" size={20} />,
                "Projections for your financial goals",
                "savings"
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
