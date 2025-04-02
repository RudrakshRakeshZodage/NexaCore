import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { downloadPDFReport, generatePDFReport } from "@/lib/pdfReportGenerator";
import { useAuth } from "@/context/AuthContext";
import { FileText, Download, PlusCircle, Check, Eye } from "lucide-react";
import ReportViewer from "@/components/ReportViewer";

interface ReportItem {
  id: string;
  type: "education" | "health" | "finance" | "comprehensive";
  title: string;
  createdAt: string;
  url?: string;
  text?: string;
}

const Reports = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: "rep1",
      type: "education",
      title: "Educational Progress Report",
      createdAt: "2023-10-10T10:30:00Z"
    },
    {
      id: "rep2",
      type: "health",
      title: "Health & Wellness Assessment",
      createdAt: "2023-10-12T14:45:00Z"
    },
    {
      id: "rep3",
      type: "finance",
      title: "Q3 Financial Summary",
      createdAt: "2023-10-05T09:15:00Z"
    }
  ]);
  
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isViewingReport, setIsViewingReport] = useState(false);
  
  const sampleData = {
    education: {
      educationLevel: "Bachelor's Degree",
      institution: "University of Technology",
      fieldOfStudy: "Computer Science",
      graduationYear: "2022",
      careerPath: "Software Development",
      careerGoals: "Become a senior software engineer within 5 years",
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL"]
    },
    health: {
      physical: {
        height: "175",
        weight: "70",
        bloodPressure: "120/80",
        heartRate: "72"
      },
      lifestyle: {
        sleepHours: "7",
        exerciseFrequency: "3-5_times",
        dietType: "omnivore",
        stressLevel: "moderate"
      },
      faceAnalysis: {
        age: 28,
        gender: "male",
        dominantExpression: "happy",
        expressions: {
          happy: 0.8,
          sad: 0.05,
          angry: 0.02,
          surprised: 0.08,
          neutral: 0.05
        }
      }
    },
    finance: {
      budget: {
        monthlyIncome: "4500",
        savingsTarget: 20,
        categories: {
          housing: 30,
          food: 15,
          transport: 10,
          utilities: 10,
          entertainment: 10,
          other: 5
        }
      },
      transactions: [
        {
          id: "tx1",
          date: "2023-10-15",
          amount: 1500,
          description: "Monthly Salary",
          category: "Income",
          type: "income"
        },
        {
          id: "tx2",
          date: "2023-10-16",
          amount: 800,
          description: "Rent Payment",
          category: "Housing",
          type: "expense"
        }
      ]
    }
  };

  const handleGenerateReport = async (type: "education" | "health" | "finance" | "comprehensive") => {
    try {
      setIsGenerating(true);
      
      toast({
        title: "Generating Report",
        description: `Please wait while we create your ${type} report...`,
      });
      
      const reportData = type === 'comprehensive' 
        ? { education: sampleData.education, health: sampleData.health, finance: sampleData.finance }
        : sampleData[type];
      
      const { url, blob } = await generatePDFReport(
        reportData,
        type,
        user?.name || "NexaCore User",
        { includeTimestamp: true }
      );
      
      const reportText = generateReportPreviewText(type);
      
      const newReport: ReportItem = {
        id: `rep${Date.now()}`,
        type,
        title: getReportTitle(type),
        createdAt: new Date().toISOString(),
        url,
        text: reportText
      };
      
      setReports([newReport, ...reports]);
      
      toast({
        title: "Report Generated",
        description: "Your report has been generated successfully.",
      });
      
      setSelectedReport(newReport);
      setIsViewingReport(true);
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Report Generation Failed",
        description: "An error occurred while generating the report.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async (report: ReportItem) => {
    try {
      if (report.url) {
        const link = document.createElement('a');
        link.href = report.url;
        link.download = `nexacore_${report.type}_report.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast({
          title: "Downloading Report",
          description: "Preparing your report for download...",
        });
        
        const reportData = report.type === 'comprehensive' 
          ? { education: sampleData.education, health: sampleData.health, finance: sampleData.finance }
          : sampleData[report.type];
        
        await downloadPDFReport(
          reportData,
          report.type,
          user?.name || "NexaCore User",
          { includeTimestamp: true }
        );
      }
      
      toast({
        title: "Report Downloaded",
        description: "Your report has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Download Failed",
        description: "An error occurred while downloading the report.",
        variant: "destructive",
      });
    }
  };

  const handleViewReport = (report: ReportItem) => {
    if (!report.text) {
      report.text = generateReportPreviewText(report.type);
    }
    
    setSelectedReport(report);
    setIsViewingReport(true);
  };

  const getReportTitle = (type: string): string => {
    switch (type) {
      case 'education':
        return 'Education Progress Report';
      case 'health':
        return 'Health & Wellness Assessment';
      case 'finance':
        return 'Financial Status Report';
      case 'comprehensive':
        return 'Comprehensive Life Status Report';
      default:
        return 'NexaCore Report';
    }
  };

  const generateReportPreviewText = (type: string): string => {
    switch (type) {
      case 'education':
        return `# Education Report

## Current Education Status
- Education Level: Bachelor's Degree
- Institution: University of Technology
- Field of Study: Computer Science

## Skills Assessment
Your current skill set includes JavaScript, React, Node.js, Python, and SQL. Based on your career goals, we recommend expanding your knowledge in the following areas:

- Cloud computing platforms (AWS, Azure)
- DevOps practices and CI/CD pipelines
- Advanced data structures and algorithms

## Recommended Learning Path
To reach your goal of becoming a senior software engineer within 5 years, consider the following learning path:

1. Complete an advanced JavaScript patterns course
2. Pursue a cloud certification (AWS Solution Architect)
3. Develop a portfolio of full-stack applications
4. Contribute to open-source projects in your field

## Next Steps
Schedule regular learning sessions, join developer communities, and actively seek mentorship from senior engineers in your field.`;

      case 'health':
        return `# Health & Wellness Report

## Physical Health Overview
- Height: 175 cm
- Weight: 70 kg
- Blood Pressure: 120/80 mmHg (Normal)
- Resting Heart Rate: 72 bpm (Healthy range)

## Lifestyle Analysis
Your current lifestyle shows a moderate level of physical activity with 3-5 exercise sessions per week. Your sleep pattern averages 7 hours per night, which meets the recommended guidelines for adults.

## Emotional Well-being
Based on facial analysis, your dominant emotion is happiness (80%), with minimal indicators of stress or anxiety. This suggests a positive emotional state.

## Recommendations
- Maintain your current exercise routine with a focus on both cardiovascular and strength training
- Consider incorporating mindfulness practices to manage moderate stress levels
- Optimize nutrition with more plant-based whole foods
- Schedule regular health check-ups to monitor key health metrics

## Action Plan
Implement a consistent sleep schedule and track your mood patterns over the next month to identify any triggers for stress or anxiety.`;

      case 'finance':
        return `# Financial Report

## Budget Overview
- Monthly Income: $4,500
- Savings Rate: 20% (Target: 15-20%)
- Expense Allocation: Housing (30%), Food (15%), Transport (10%), Utilities (10%), Entertainment (10%), Other (5%)

## Financial Health Assessment
Your current savings rate of 20% is excellent and aligns with recommended guidelines. Your budget allocation shows a balanced approach to expenses with an appropriate amount dedicated to housing costs.

## Transaction Analysis
Recent transaction patterns show consistent income streams and controlled spending primarily in essential categories. No unusual spending patterns were detected.

## Recommendations
- Consider establishing an emergency fund of 3-6 months of expenses if not already in place
- Explore retirement contribution options to maximize tax advantages
- Review insurance coverage to ensure adequate protection
- Evaluate investment opportunities aligned with your risk tolerance

## Action Plan
Set up automatic transfers to your savings account and review your investment portfolio quarterly to ensure alignment with your financial goals.`;

      case 'comprehensive':
        return `# Comprehensive Life Status Report

## Executive Summary
This report provides a holistic view of your education, health, and financial status, highlighting areas of strength and opportunities for improvement across all dimensions of your life.

## Education Summary
- Current Status: Bachelor's Degree in Computer Science
- Skills Profile: Strong in programming (JavaScript, React, Node.js, Python)
- Career Path: Software Development with senior engineer goal

## Health Summary
- Physical Health: Good overall condition with normal vitals
- Lifestyle: Moderate physical activity and adequate sleep
- Emotional Well-being: Predominantly positive emotional state

## Financial Summary
- Budget Management: Well-structured with 20% savings rate
- Expense Allocation: Balanced across essential categories
- Transaction Patterns: Consistent and controlled spending

## Integrated Recommendations
1. Time Management: Allocate dedicated time for professional development while maintaining exercise routine
2. Stress Management: Implement mindfulness practices to support both career advancement and health
3. Resource Allocation: Balance financial investments between education (courses, certifications) and health (quality nutrition, fitness)

## Life Balance Score: 78/100
Your current life balance shows strong financial discipline and positive emotional health, with opportunities to enhance professional development and physical fitness routines.

## Action Plan
Create a weekly schedule that integrates career development, health maintenance, and financial management to ensure balanced progress across all life dimensions.`;

      default:
        return 'Report content will be displayed here after generation.';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Generate and manage comprehensive reports for education, health, and finance.</p>
          </div>
        </div>

        <Card className="bg-nexacore-blue-dark/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Generate New Report</CardTitle>
            <CardDescription className="text-white/70">
              Create reports based on your data in different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                onClick={() => handleGenerateReport("education")}
                className="bg-nexacore-teal/20 text-nexacore-teal hover:bg-nexacore-teal/30 h-auto py-4 flex flex-col items-center justify-center gap-2"
                disabled={isGenerating}
              >
                <FileText size={24} />
                <span>Education Report</span>
              </Button>
              
              <Button 
                onClick={() => handleGenerateReport("health")}
                className="bg-nexacore-orange/20 text-nexacore-orange hover:bg-nexacore-orange/30 h-auto py-4 flex flex-col items-center justify-center gap-2"
                disabled={isGenerating}
              >
                <FileText size={24} />
                <span>Health Report</span>
              </Button>
              
              <Button 
                onClick={() => handleGenerateReport("finance")}
                className="bg-nexacore-pink/20 text-nexacore-pink hover:bg-nexacore-pink/30 h-auto py-4 flex flex-col items-center justify-center gap-2"
                disabled={isGenerating}
              >
                <FileText size={24} />
                <span>Finance Report</span>
              </Button>
              
              <Button 
                onClick={() => handleGenerateReport("comprehensive")}
                className="bg-white/20 text-white hover:bg-white/30 h-auto py-4 flex flex-col items-center justify-center gap-2"
                disabled={isGenerating}
              >
                <FileText size={24} />
                <span>Comprehensive Report</span>
              </Button>
            </div>
            
            {isGenerating && (
              <div className="mt-4 p-4 bg-white/10 rounded-lg flex items-center justify-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-nexacore-teal motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                </div>
                <span className="ml-3 text-white">Generating your report...</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-nexacore-blue-dark/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Your Reports</CardTitle>
            <CardDescription className="text-white/70">
              Access and download your previously generated reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div 
                    key={report.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                        report.type === 'education' ? 'bg-nexacore-teal/20' : 
                        report.type === 'health' ? 'bg-nexacore-orange/20' : 
                        report.type === 'finance' ? 'bg-nexacore-pink/20' : 
                        'bg-white/20'
                      }`}>
                        <FileText className={`h-5 w-5 ${
                          report.type === 'education' ? 'text-nexacore-teal' : 
                          report.type === 'health' ? 'text-nexacore-orange' : 
                          report.type === 'finance' ? 'text-nexacore-pink' : 
                          'text-white'
                        }`} />
                      </div>
                      <div>
                        <p className="text-white font-medium">{report.title}</p>
                        <p className="text-white/60 text-sm">
                          {new Date(report.createdAt).toLocaleDateString()} • {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => handleViewReport(report)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => handleDownloadReport(report)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-white/60">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No reports found</p>
                <p className="text-sm">Generate a report to see it here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isViewingReport && selectedReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[80vh] overflow-auto">
            <ReportViewer
              reportText={selectedReport.text || "Report content not available."}
              reportUrl={selectedReport.url || ""}
              reportType={selectedReport.type}
              timestamp={new Date(selectedReport.createdAt).toLocaleString()}
              onClose={() => setIsViewingReport(false)}
              className="max-h-[80vh] overflow-y-auto"
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reports;
