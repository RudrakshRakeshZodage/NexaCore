
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Download,
  ChevronRight,
  BookOpen,
  Heart,
  PieChart,
  Clock,
  BarChart2,
  FileCheck,
  Sparkle,
  RefreshCw,
  CalendarDays,
  Filter,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/DashboardLayout";
import ReportViewer from "@/components/ReportViewer";
import { useReportGenerator } from "@/lib/reportGenerator";

// Sample report text for preview
const healthReportPreview = `# Health Report: July 2023

## Overall Health Status
Your health metrics indicate moderate stress levels and good physical health. Recent facial analysis shows hydration levels could be improved, and stress management techniques are recommended.

## Nutrition Recommendations
- Increase water intake to 8-10 glasses daily
- Include more leafy greens and fruits in your diet
- Consider reducing caffeine intake to improve sleep quality

## Exercise Plan
- Moderate cardio: 30 minutes, 3-4 times weekly
- Strength training: 2 sessions per week, focusing on major muscle groups
- Daily stretching routine: 10-15 minutes

## Stress Management
- Practice deep breathing exercises twice daily
- Consider a 10-minute meditation each morning
- Take short 5-minute breaks during intense work periods

## Sleep Improvement
Your sleep analysis indicates an average of 6.5 hours per night, which is below the recommended 7-8 hours.

- Establish a consistent sleep schedule
- Reduce screen time 1 hour before bed
- Create a calming bedtime routine`;

const educationReportPreview = `# Education Progress Report: July 2023

## Current Education Status
Based on your profile as a Computer Science student, you're currently making steady progress through your core curriculum.

## Skills Analysis
- Strong proficiency: Programming fundamentals, basic algorithms
- Areas for growth: Advanced data structures, cloud computing
- Recommended focus: Database management, web development

## Course Recommendations
- Full Stack Web Development with React & Node.js
- Data Structures & Algorithms Masterclass
- Introduction to Cloud Computing

## Career Path Insights
Your current trajectory aligns well with Software Developer and Web Developer roles. Consider exploring Data Science as an additional path based on your interest in mathematics.

## Action Plan
- Complete the recommended courses within the next 3 months
- Work on 2 practical projects to build portfolio
- Join online coding communities for networking
- Prepare for technical interviews by practicing problem-solving`;

const financeReportPreview = `# Financial Status Report: July 2023

## Financial Overview
Current monthly income: ₹25,000
Monthly expenses: ₹18,000
Savings rate: 28%

## Budget Analysis
Your spending is generally well-controlled with room for optimization in the following areas:
- Entertainment: Currently 12% of budget, aim for 8%
- Food & Dining: Currently 25%, consider meal planning to reduce to 20%
- Transportation: Currently 15%, explore carpooling options

## Savings Recommendations
- Establish an emergency fund of ₹75,000 (3 months of expenses)
- Set up automatic transfers of ₹3,000 monthly to savings
- Consider a recurring deposit for short-term goals

## Investment Opportunities
Based on your risk profile and financial goals:
- Consider a balanced mutual fund allocation
- Start a small SIP of ₹2,000 monthly in index funds
- Explore tax-saving ELSS funds for long-term growth

## Next Steps
- Open a high-yield savings account this month
- Review and optimize subscription services
- Set up budget tracking app to monitor progress`;

const comprehensiveReportPreview = `# NexaCore Comprehensive Report: July 2023

## Executive Summary
This report provides an integrated analysis of your education, health, and financial status, with personalized recommendations for improvement in each area.

## Education Status
You're making good progress in your Computer Science studies with strengths in programming fundamentals. Focus areas include advanced data structures and cloud computing skills.

## Health Assessment
Your health metrics show moderate stress levels that may be affecting sleep quality. Nutrition is generally balanced but hydration could be improved. Current exercise routine is inconsistent.

## Financial Status
With a 28% savings rate, you're on track to meet short-term goals. Budget optimization opportunities exist in entertainment and food expenses. Investment strategy needs diversification.

## Integrated Life Planning
The correlation between your stress levels and irregular sleep pattern may be affecting your study effectiveness. We recommend:

- Establish a structured daily routine balancing study, exercise, and relaxation
- Allocate funds for stress-reduction activities and educational resources
- Invest in ergonomic home study setup to improve productivity and comfort

## Action Plan
1. Education: Complete recommended courses, build portfolio projects
2. Health: Implement sleep hygiene practices, increase water intake, establish exercise routine
3. Finance: Set up automated savings, review budget categories, start small investments
4. Integration: Use calendar blocking for balanced daily routine`;

const Reports = () => {
  const { toast } = useToast();
  const { generateUserReport } = useReportGenerator();
  const [activeTab, setActiveTab] = useState("saved");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentReportType, setCurrentReportType] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [showReportViewer, setShowReportViewer] = useState(false);
  const [currentReport, setCurrentReport] = useState({
    type: "",
    text: "",
    url: "",
    timestamp: ""
  });
  
  // Sample saved reports
  const [savedReports, setSavedReports] = useState([
    { 
      id: 1, 
      type: "comprehensive", 
      title: "Comprehensive Life Report", 
      date: "15 Jul 2023", 
      text: comprehensiveReportPreview,
      url: "#"
    },
    { 
      id: 2, 
      type: "health", 
      title: "Health Analysis Report", 
      date: "10 Jul 2023", 
      text: healthReportPreview,
      url: "#"
    },
    { 
      id: 3, 
      type: "education", 
      title: "Education Progress Report", 
      date: "5 Jul 2023", 
      text: educationReportPreview,
      url: "#"
    },
    { 
      id: 4, 
      type: "finance", 
      title: "Financial Status Report", 
      date: "1 Jul 2023", 
      text: financeReportPreview,
      url: "#"
    }
  ]);
  
  const handleGenerateReport = async (reportType: string) => {
    setIsGenerating(true);
    setCurrentReportType(reportType);
    
    // Mock data for the report generator
    const mockData = {
      education: {
        degree: "Computer Science",
        career: "Software Developer",
        skills: ["Programming", "Web Development", "Data Structures"]
      },
      health: {
        weight: 70,
        height: 175,
        medicalConditions: "None",
        activityLevel: "Moderate"
      },
      emotionAnalysis: {
        stress: 45,
        mood: "Neutral"
      },
      finance: {
        income: 25000,
        expenses: 18000,
        goals: "Saving for education, travel"
      }
    };
    
    try {
      // Simulate report generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let reportText = "";
      let reportTitle = "";
      
      switch(reportType) {
        case "education":
          reportText = educationReportPreview;
          reportTitle = "Education Progress Report";
          break;
        case "health":
          reportText = healthReportPreview;
          reportTitle = "Health Analysis Report";
          break;
        case "finance":
          reportText = financeReportPreview;
          reportTitle = "Financial Status Report";
          break;
        case "comprehensive":
          reportText = comprehensiveReportPreview;
          reportTitle = "Comprehensive Life Report";
          break;
      }
      
      // Generate a random URL for the PDF
      const reportUrl = `https://nexacore.app/reports/${reportType}_${Date.now()}.pdf`;
      
      // Add to saved reports
      const newReport = {
        id: savedReports.length + 1,
        type: reportType,
        title: reportTitle,
        date: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
        text: reportText,
        url: reportUrl
      };
      
      setSavedReports([newReport, ...savedReports]);
      
      // Show the report viewer
      setCurrentReport({
        type: reportType,
        text: reportText,
        url: reportUrl,
        timestamp: new Date().toLocaleString()
      });
      setShowReportViewer(true);
      
      toast({
        title: "Report Generated",
        description: `Your ${reportType} report has been generated successfully`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setCurrentReportType(null);
    }
  };
  
  const handleViewReport = (report: any) => {
    setCurrentReport({
      type: report.type,
      text: report.text,
      url: report.url,
      timestamp: report.date
    });
    setShowReportViewer(true);
  };
  
  const handleDeleteReport = (reportId: number) => {
    setSavedReports(savedReports.filter(report => report.id !== reportId));
    toast({
      title: "Report Deleted",
      description: "The report has been removed from your library",
      variant: "default",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-white/70 dark:text-foreground/70">Generate and manage detailed reports across all areas</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 dark:bg-primary/20 flex items-center justify-center">
            <FileText className="text-nexacore-teal dark:text-primary" size={24} />
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/10 dark:bg-foreground/10 p-1">
            <TabsTrigger value="generate" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
              Generate Reports
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
              Saved Reports
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
              Report Settings
            </TabsTrigger>
          </TabsList>
          
          {/* Generate Reports Tab */}
          <TabsContent value="generate" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white dark:text-card-foreground flex items-center">
                    <BookOpen className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                    Education Report
                  </CardTitle>
                  <CardDescription className="text-white/70 dark:text-card-foreground/70">
                    Educational progress and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg">
                    <p className="text-sm text-white/80 dark:text-card-foreground/80">
                      Get a comprehensive analysis of your educational journey, course recommendations, skill assessment, and career path insights.
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Current education status</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Skills & knowledge analysis</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Course recommendations</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Career path insights</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                    onClick={() => handleGenerateReport("education")}
                    disabled={isGenerating}
                  >
                    {isGenerating && currentReportType === "education" ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white dark:text-card-foreground flex items-center">
                    <Heart className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                    Health Report
                  </CardTitle>
                  <CardDescription className="text-white/70 dark:text-card-foreground/70">
                    Health analysis and wellness plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg">
                    <p className="text-sm text-white/80 dark:text-card-foreground/80">
                      Analyze your health metrics including facial analysis results, BMI, and activity data to get personalized wellness recommendations.
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Health status summary</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Nutrition & diet plan</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Exercise recommendations</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Stress management techniques</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                    onClick={() => handleGenerateReport("health")}
                    disabled={isGenerating}
                  >
                    {isGenerating && currentReportType === "health" ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white dark:text-card-foreground flex items-center">
                    <PieChart className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                    Finance Report
                  </CardTitle>
                  <CardDescription className="text-white/70 dark:text-card-foreground/70">
                    Financial analysis and planning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg">
                    <p className="text-sm text-white/80 dark:text-card-foreground/80">
                      Get a detailed overview of your financial status, budgeting analysis, savings recommendations, and investment opportunities.
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Financial status overview</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Budget analysis & optimization</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Savings recommendations</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Investment opportunities</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                    onClick={() => handleGenerateReport("finance")}
                    disabled={isGenerating}
                  >
                    {isGenerating && currentReportType === "finance" ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground flex items-center">
                  <Sparkle className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                  Comprehensive Life Report
                </CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Integrating education, health, and finances for a holistic life plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-white dark:text-card-foreground mb-2 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-nexacore-teal dark:text-primary" />
                      Education
                    </h3>
                    <p className="text-sm text-white/80 dark:text-card-foreground/80">
                      Analysis of educational progress and career trajectory with personalized learning path.
                    </p>
                  </div>
                  
                  <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-white dark:text-card-foreground mb-2 flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-nexacore-teal dark:text-primary" />
                      Health
                    </h3>
                    <p className="text-sm text-white/80 dark:text-card-foreground/80">
                      Complete health assessment with personalized wellness plan tailored to your needs.
                    </p>
                  </div>
                  
                  <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-white dark:text-card-foreground mb-2 flex items-center">
                      <PieChart className="h-5 w-5 mr-2 text-nexacore-teal dark:text-primary" />
                      Finance
                    </h3>
                    <p className="text-sm text-white/80 dark:text-card-foreground/80">
                      Financial analysis with budget optimization and investment recommendations.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white dark:text-card-foreground mb-2">Integrated Life Planning</h3>
                  <p className="text-sm text-white/80 dark:text-card-foreground/80">
                    The comprehensive report analyzes the interconnections between your education, health, and finances to provide holistic recommendations. This integration helps identify how improvements in one area can positively impact others.
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Cross-domain analysis and insights</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Holistic life balance recommendations</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Prioritized action plan across all areas</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                      <span className="text-white/80 dark:text-card-foreground/80">Long-term goal alignment and strategy</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                  onClick={() => handleGenerateReport("comprehensive")}
                  disabled={isGenerating}
                >
                  {isGenerating && currentReportType === "comprehensive" ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating Comprehensive Report...
                    </>
                  ) : (
                    <>
                      <Sparkle className="mr-2 h-4 w-4" />
                      Generate Comprehensive Report
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                <CardHeader>
                  <CardTitle className="text-white dark:text-card-foreground flex items-center">
                    <FileCheck className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                    Report Format
                  </CardTitle>
                  <CardDescription className="text-white/70 dark:text-card-foreground/70">
                    Choose your preferred report format
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="format-pdf" 
                        checked={selectedFormat === "pdf"}
                        onCheckedChange={() => setSelectedFormat("pdf")}
                      />
                      <Label 
                        htmlFor="format-pdf" 
                        className="text-white dark:text-card-foreground cursor-pointer"
                      >
                        PDF Format
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="format-html" 
                        checked={selectedFormat === "html"}
                        onCheckedChange={() => setSelectedFormat("html")}
                      />
                      <Label 
                        htmlFor="format-html" 
                        className="text-white dark:text-card-foreground cursor-pointer"
                      >
                        HTML Format
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="format-text" 
                        checked={selectedFormat === "text"}
                        onCheckedChange={() => setSelectedFormat("text")}
                      />
                      <Label 
                        htmlFor="format-text" 
                        className="text-white dark:text-card-foreground cursor-pointer"
                      >
                        Plain Text
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                <CardHeader>
                  <CardTitle className="text-white dark:text-card-foreground flex items-center">
                    <CalendarDays className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                    Schedule Reports
                  </CardTitle>
                  <CardDescription className="text-white/70 dark:text-card-foreground/70">
                    Set up automated report generation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="schedule-weekly" />
                      <Label 
                        htmlFor="schedule-weekly" 
                        className="text-white dark:text-card-foreground cursor-pointer"
                      >
                        Weekly Reports
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="schedule-monthly" />
                      <Label 
                        htmlFor="schedule-monthly" 
                        className="text-white dark:text-card-foreground cursor-pointer"
                      >
                        Monthly Reports
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="schedule-quarterly" />
                      <Label 
                        htmlFor="schedule-quarterly" 
                        className="text-white dark:text-card-foreground cursor-pointer"
                      >
                        Quarterly Reports
                      </Label>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                    onClick={() => {
                      toast({
                        title: "Coming Soon",
                        description: "Scheduled reports will be available in a future update",
                        variant: "default",
                      });
                    }}
                  >
                    Setup Scheduling
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Saved Reports Tab */}
          <TabsContent value="saved" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Input 
                  placeholder="Search reports..." 
                  className="w-64 bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground"
                />
                <Button 
                  variant="outline" 
                  className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Select defaultValue="newest">
                <SelectTrigger className="w-40 bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="az">A-Z</SelectItem>
                  <SelectItem value="za">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {savedReports.length === 0 ? (
              <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <FileText className="h-16 w-16 text-white/20 dark:text-card-foreground/20 mb-4" />
                  <h3 className="text-xl font-medium text-white dark:text-card-foreground mb-2">No Reports Yet</h3>
                  <p className="text-white/70 dark:text-card-foreground/70 text-center max-w-md mb-6">
                    You haven't generated any reports yet. Go to the Generate Reports tab to create your first report.
                  </p>
                  <Button 
                    className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                    onClick={() => setActiveTab("generate")}
                  >
                    Generate Your First Report
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedReports.map((report) => (
                  <Card key={report.id} className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border hover:bg-nexacore-blue-dark/70 dark:hover:bg-card/70 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-white dark:text-card-foreground flex items-center">
                            {report.type === "education" && <BookOpen className="mr-2 text-nexacore-teal dark:text-primary" size={18} />}
                            {report.type === "health" && <Heart className="mr-2 text-nexacore-teal dark:text-primary" size={18} />}
                            {report.type === "finance" && <PieChart className="mr-2 text-nexacore-teal dark:text-primary" size={18} />}
                            {report.type === "comprehensive" && <Sparkle className="mr-2 text-nexacore-teal dark:text-primary" size={18} />}
                            {report.title}
                          </CardTitle>
                          <CardDescription className="text-white/70 dark:text-card-foreground/70 flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {report.date}
                          </CardDescription>
                        </div>
                        <Badge className={`
                          ${report.type === "education" ? "bg-blue-500/20 text-blue-400" : ""}
                          ${report.type === "health" ? "bg-green-500/20 text-green-400" : ""}
                          ${report.type === "finance" ? "bg-yellow-500/20 text-yellow-400" : ""}
                          ${report.type === "comprehensive" ? "bg-purple-500/20 text-purple-400" : ""}
                        `}>
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0">
                      <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-md h-24 overflow-hidden text-ellipsis line-clamp-3">
                        <p className="text-sm text-white/80 dark:text-card-foreground/80 line-clamp-3">
                          {report.text.split('\n').slice(0, 3).join(' ').substring(0, 150)}...
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button 
                        variant="outline" 
                        className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                        onClick={() => handleDeleteReport(report.id)}
                        size="sm"
                      >
                        Delete
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                          onClick={() => {
                            toast({
                              title: "Download Started",
                              description: "Your report is being downloaded",
                              variant: "default",
                            });
                          }}
                          size="sm"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-nexacore-teal dark:border-primary text-nexacore-teal dark:text-primary hover:bg-nexacore-teal/10 dark:hover:bg-primary/10"
                          onClick={() => handleViewReport(report)}
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Report Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground">Report Settings & Preferences</CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Customize your report generation preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-white dark:text-card-foreground">Report Content</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="detail-level" className="text-white dark:text-card-foreground">Detail Level</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger id="detail-level" className="w-32 bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="detailed">Detailed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Label htmlFor="language" className="text-white dark:text-card-foreground">Language</Label>
                      <Select defaultValue="english">
                        <SelectTrigger id="language" className="w-32 bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="japanese">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-white dark:text-card-foreground">Format & Layout</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="font-size" className="text-white dark:text-card-foreground">Font Size</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="font-size" className="w-32 bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Label htmlFor="page-size" className="text-white dark:text-card-foreground">Page Size</Label>
                      <Select defaultValue="a4">
                        <SelectTrigger id="page-size" className="w-32 bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a4">A4</SelectItem>
                          <SelectItem value="letter">Letter</SelectItem>
                          <SelectItem value="legal">Legal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-white dark:text-card-foreground">Data & Privacy</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="include-personal-data" defaultChecked />
                      <Label 
                        htmlFor="include-personal-data" 
                        className="text-white dark:text-card-foreground cursor-pointer"
                      >
                        Include personal identification data
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="store-reports" defaultChecked />
                      <Label 
                        htmlFor="store-reports" 
                        className="text-white dark:text-card-foreground cursor-pointer"
                      >
                        Store generated reports in your library
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="usage-analytics" defaultChecked />
                      <Label 
                        htmlFor="usage-analytics" 
                        className="text-white dark:text-card-foreground cursor-pointer"
                      >
                        Allow anonymous analytics to improve recommendations
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                  onClick={() => {
                    toast({
                      title: "Settings Reset",
                      description: "Report settings have been reset to defaults",
                      variant: "default",
                    });
                  }}
                >
                  Reset to Defaults
                </Button>
                <Button 
                  className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                  onClick={() => {
                    toast({
                      title: "Settings Saved",
                      description: "Your report preferences have been updated",
                      variant: "default",
                    });
                  }}
                >
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Report Viewer Dialog */}
      {showReportViewer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full">
            <ReportViewer
              reportText={currentReport.text}
              reportUrl={currentReport.url}
              reportType={currentReport.type}
              timestamp={currentReport.timestamp}
              onClose={() => setShowReportViewer(false)}
              className="max-h-[90vh]"
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// Import necessary types
import { CheckCircle } from "lucide-react";

export default Reports;
