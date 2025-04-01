
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, ChevronRight, ArrowRight, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useReportGenerator } from "@/lib/reportGenerator";
import DashboardLayout from "@/components/DashboardLayout";
import ReportViewer from "@/components/ReportViewer";

const Reports = () => {
  const { toast } = useToast();
  const { generateUserReport } = useReportGenerator();
  
  const [activeTab, setActiveTab] = useState("generate");
  const [reportType, setReportType] = useState<"education" | "health" | "finance" | "comprehensive">("comprehensive");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState<{ reportText: string; reportUrl: string } | null>(null);
  
  // Mock user data for reports
  const mockUserData = {
    user: {
      name: "Alex Johnson",
      email: "alex@example.com"
    },
    education: {
      currentEducation: "Bachelor of Computer Science",
      university: "Tech University",
      year: 3,
      skills: ["Programming", "Data Structures", "Algorithms"],
      interests: ["Machine Learning", "Web Development", "Mobile App Development"]
    },
    health: {
      age: 22,
      height: 175, // in cm
      weight: 70, // in kg
      activityLevel: "Moderate",
      medicalConditions: ["None"],
      sleepHours: 7,
      stressLevel: "Medium",
      emotionAnalysis: {
        stress: 65,
        fatigue: 40,
        mood: "neutral"
      }
    },
    finance: {
      income: 3500,
      expenses: 2800,
      savings: 700,
      investments: {
        stocks: 5000,
        crypto: 2000,
        savings: 10000
      },
      financialGoals: ["Buy a car", "Build emergency fund"]
    }
  };
  
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Customized data based on report type
    const reportData = {
      ...mockUserData,
      reportType
    };
    
    try {
      const result = await generateUserReport(reportData, reportType, {
        showToast: true,
        onSuccess: (report) => {
          setCurrentReport(report);
          setActiveTab("view");
        },
        userName: mockUserData.user.name
      });
      
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-white/70 dark:text-foreground/70">Generate personalized reports based on your data</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 dark:bg-primary/20 flex items-center justify-center">
            <FileText className="text-nexacore-teal dark:text-primary" size={24} />
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/10 dark:bg-foreground/10 p-1">
            <TabsTrigger 
              value="generate" 
              className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background"
            >
              Generate Report
            </TabsTrigger>
            <TabsTrigger 
              value="view" 
              className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background"
              disabled={!currentReport}
            >
              View Report
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate">
            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground">Generate a New Report</CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Create a personalized report based on your data
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90 dark:text-card-foreground/90">Report Type</label>
                  <Select value={reportType} onValueChange={(value) => setReportType(value as any)}>
                    <SelectTrigger className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                      <SelectItem value="education">Education Report</SelectItem>
                      <SelectItem value="health">Health Report</SelectItem>
                      <SelectItem value="finance">Finance Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white dark:text-card-foreground">Report Will Include:</h3>
                  
                  {reportType === "comprehensive" || reportType === "education" ? (
                    <div className="flex items-start space-x-2">
                      <Check className="h-5 w-5 text-nexacore-teal dark:text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white dark:text-card-foreground font-medium">Education Analysis</p>
                        <p className="text-white/70 dark:text-card-foreground/70 text-sm">Course recommendations, career insights, and skill development plans</p>
                      </div>
                    </div>
                  ) : null}
                  
                  {reportType === "comprehensive" || reportType === "health" ? (
                    <div className="flex items-start space-x-2">
                      <Check className="h-5 w-5 text-nexacore-teal dark:text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white dark:text-card-foreground font-medium">Health Assessment</p>
                        <p className="text-white/70 dark:text-card-foreground/70 text-sm">Wellness recommendations, exercise plans, and lifestyle suggestions</p>
                      </div>
                    </div>
                  ) : null}
                  
                  {reportType === "comprehensive" || reportType === "finance" ? (
                    <div className="flex items-start space-x-2">
                      <Check className="h-5 w-5 text-nexacore-teal dark:text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-white dark:text-card-foreground font-medium">Financial Insights</p>
                        <p className="text-white/70 dark:text-card-foreground/70 text-sm">Budget analysis, savings strategies, and investment recommendations</p>
                      </div>
                    </div>
                  ) : null}
                </div>
                
                <div className="bg-nexacore-teal/10 dark:bg-primary/10 p-4 rounded-lg border border-nexacore-teal/20 dark:border-primary/20 flex items-start space-x-3">
                  <Info className="h-5 w-5 text-nexacore-teal dark:text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-white/90 dark:text-card-foreground/90 text-sm">
                    Your report will be generated based on the data you've provided in the {reportType === "comprehensive" ? "Education, Health, and Finance" : reportType} section{reportType === "comprehensive" ? "s" : ""}.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={handleGenerateReport} 
                  disabled={isGenerating}
                  className="w-full bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                >
                  {isGenerating ? (
                    <>Generating Report...</>
                  ) : (
                    <>
                      Generate {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="view">
            {currentReport ? (
              <ReportViewer 
                reportText={currentReport.reportText}
                reportUrl={currentReport.reportUrl}
                reportType={reportType}
                timestamp={new Date().toLocaleString()}
                onClose={() => setActiveTab("generate")}
              />
            ) : (
              <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <FileText className="h-16 w-16 text-white/20 dark:text-card-foreground/20 mb-4" />
                  <h3 className="text-xl font-medium text-white dark:text-card-foreground mb-2">No Report Generated</h3>
                  <p className="text-white/70 dark:text-card-foreground/70 text-center max-w-md mb-6">
                    You haven't generated any reports yet. Go to the Generate Report tab to create your first report.
                  </p>
                  <Button 
                    onClick={() => setActiveTab("generate")}
                    className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                  >
                    Generate a Report
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border mt-6">
          <CardHeader>
            <CardTitle className="text-white dark:text-card-foreground">Recent Reports</CardTitle>
            <CardDescription className="text-white/70 dark:text-card-foreground/70">
              View your previously generated reports
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!currentReport ? (
              <div className="text-center py-8">
                <p className="text-white/50 dark:text-card-foreground/50">You haven't generated any reports yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white/5 dark:bg-foreground/5 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-10 w-10 text-nexacore-teal dark:text-primary p-2 bg-nexacore-teal/10 dark:bg-primary/10 rounded" />
                    <div>
                      <h4 className="font-medium text-white dark:text-card-foreground">{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h4>
                      <p className="text-sm text-white/70 dark:text-card-foreground/70">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                      onClick={() => setActiveTab("view")}
                    >
                      View
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                      onClick={() => {
                        if (currentReport?.reportUrl) {
                          const link = document.createElement('a');
                          link.href = currentReport.reportUrl;
                          link.download = `nexacore_${reportType}_report_${Date.now()}.pdf`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }
                      }}
                    >
                      <Download className="mr-1 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
