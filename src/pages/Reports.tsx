
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  BookOpen, 
  Heart, 
  PieChart,
  CheckCircle,
  X,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

const ReportsPage = () => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const { toast } = useToast();
  
  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    
    // Mock report generation with timeout
    setTimeout(() => {
      setIsGeneratingReport(false);
      setReportGenerated(true);
      
      toast({
        title: "Report generated",
        description: "Your comprehensive report is now ready to download",
        variant: "default",
      });
    }, 3000);
  };
  
  const handleDownloadReport = () => {
    toast({
      title: "Report downloading",
      description: "Your report will be downloaded shortly",
      variant: "default",
    });
    
    // In a real app, this would trigger a file download
  };
  
  // Mock data to simulate user's completed sections
  const sectionStatus = {
    education: true, // completed
    health: true, // completed
    finance: false, // not completed
  };
  
  const allSectionsCompleted = Object.values(sectionStatus).every(status => status);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-white/70">Generate comprehensive reports based on your data</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 flex items-center justify-center">
            <FileText className="text-nexacore-teal" size={24} />
          </div>
        </div>

        <Card className="bg-nexacore-blue-dark/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Report Generation</CardTitle>
            <CardDescription className="text-white/70">
              Create a comprehensive report based on your education, health, and finance data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3">Section Completion Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen size={18} className="text-nexacore-teal mr-3" />
                    <span>Education</span>
                  </div>
                  {sectionStatus.education ? (
                    <div className="flex items-center text-green-400">
                      <CheckCircle size={16} className="mr-1" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-400">
                      <X size={16} className="mr-1" />
                      <span>Incomplete</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center">
                    <Heart size={18} className="text-nexacore-teal mr-3" />
                    <span>Health</span>
                  </div>
                  {sectionStatus.health ? (
                    <div className="flex items-center text-green-400">
                      <CheckCircle size={16} className="mr-1" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-400">
                      <X size={16} className="mr-1" />
                      <span>Incomplete</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center">
                    <PieChart size={18} className="text-nexacore-teal mr-3" />
                    <span>Finance</span>
                  </div>
                  {sectionStatus.finance ? (
                    <div className="flex items-center text-green-400">
                      <CheckCircle size={16} className="mr-1" />
                      <span>Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-400">
                      <X size={16} className="mr-1" />
                      <span>Incomplete</span>
                    </div>
                  )}
                </div>
              </div>
              
              {!allSectionsCompleted && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 text-sm">
                  <p>⚠️ Some sections are incomplete. For the most accurate report, we recommend completing all sections.</p>
                </div>
              )}
            </div>
            
            {reportGenerated && (
              <div className="bg-nexacore-teal/20 border border-nexacore-teal/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center">
                  <FileText size={20} className="text-nexacore-teal mr-2" />
                  <h3 className="text-lg font-medium text-white">Your NexaCore Report is ready!</h3>
                </div>
                
                <p className="text-white/80 text-sm">
                  This comprehensive report includes personalized recommendations for your education path,
                  health improvements, and financial planning based on the data you've provided.
                </p>
                
                <div className="bg-white/5 p-3 rounded-lg space-y-2 text-sm">
                  <p className="flex items-center">
                    <ChevronRight size={16} className="text-nexacore-teal mr-1" />
                    <span>Education Recommendations: 5 courses, 3 skill development plans</span>
                  </p>
                  <p className="flex items-center">
                    <ChevronRight size={16} className="text-nexacore-teal mr-1" />
                    <span>Health Insights: Personalized meal plan, exercise routine, wellness tips</span>
                  </p>
                  <p className="flex items-center">
                    <ChevronRight size={16} className="text-nexacore-teal mr-1" />
                    <span>Financial Planning: Budgeting strategy, savings plan, investment options</span>
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            {!reportGenerated ? (
              <Button 
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="w-full sm:w-auto bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
              >
                {isGeneratingReport ? "Generating..." : "Generate Report"}
              </Button>
            ) : (
              <Button 
                onClick={handleDownloadReport}
                className="w-full sm:w-auto bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
              >
                <Download size={16} className="mr-2" />
                Download PDF Report
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-nexacore-blue-dark/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BookOpen size={20} className="mr-2 text-nexacore-teal" />
                Education Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-3">
                Based on your education data, we've identified key areas for growth and learning opportunities.
              </p>
              <div className="space-y-2">
                <div className="p-2 bg-white/5 rounded-lg">
                  <p className="text-sm">Current Focus: <span className="text-nexacore-teal">Computer Science</span></p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <p className="text-sm">Recommended Skills: <span className="text-nexacore-teal">Machine Learning, Web Development</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-nexacore-blue-dark/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Heart size={20} className="mr-2 text-nexacore-teal" />
                Health Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-3">
                Your health analysis indicates these key areas that can be improved for better wellbeing.
              </p>
              <div className="space-y-2">
                <div className="p-2 bg-white/5 rounded-lg">
                  <p className="text-sm">Sleep Quality: <span className="text-yellow-400">Medium</span></p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <p className="text-sm">Stress Level: <span className="text-red-400">High</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-nexacore-blue-dark/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <PieChart size={20} className="mr-2 text-nexacore-teal" />
                Finance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-3">
                Financial analysis shows your current status and opportunities for improvement.
              </p>
              <div className="space-y-2">
                <div className="p-2 bg-white/5 rounded-lg">
                  <p className="text-sm">Monthly Savings: <span className="text-green-400">₹3,500</span></p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg">
                  <p className="text-sm">Budget Status: <span className="text-green-400">On Track</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
