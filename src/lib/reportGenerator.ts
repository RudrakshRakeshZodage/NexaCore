import { useToast } from "@/hooks/use-toast";
import { triggerN8nWebhook } from "./automationHelpers";
import { jsPDF } from "jspdf";

// OpenAI API key
const OPENAI_API_KEY = "AIzaSyDSbWxbhKo2iUw2woR0tomAl71Wq7XTqJw";

/**
 * Generate a report from user data using OpenAI API
 */
export const generateReport = async (
  data: {
    education?: any;
    health?: any;
    finance?: any;
    user?: {
      name?: string;
      email?: string;
      profilePic?: string;
    };
    [key: string]: any;
  },
  reportType: "education" | "health" | "finance" | "comprehensive"
): Promise<{
  success: boolean;
  reportText?: string;
  reportUrl?: string;
  pdfBlob?: Blob;
  message: string;
}> => {
  try {
    const prompt = generatePromptForReport(data, reportType);
    
    // Call OpenAI API - using the correct endpoint and authorization format
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant specializing in creating detailed personalized reports based on user data. Format your response with clear sections, bullet points, and actionable recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    const result = await response.json();
    
    if (!response.ok || !result.choices || result.choices.length === 0) {
      throw new Error(result.error?.message || "Failed to generate report");
    }
    
    const reportText = result.choices[0].message.content;
    
    // Generate PDF
    const pdfBlob = await generatePdfFromText(reportText, reportType, data.user?.name || "User");
    
    // Create object URL for download
    const reportUrl = URL.createObjectURL(pdfBlob);
    
    return {
      success: true,
      reportText,
      reportUrl,
      pdfBlob,
      message: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully`
    };
  } catch (error) {
    console.error("Report generation error:", error);
    return {
      success: false,
      message: `Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Generate a PDF from the report text
 */
const generatePdfFromText = async (
  text: string, 
  reportType: string,
  userName: string = "NexaCore User"
): Promise<Blob> => {
  const doc = new jsPDF();
  
  // Add logo (mock logo for now)
  doc.setFillColor(20, 30, 60);
  doc.rect(0, 0, 210, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("NexaCore", 105, 12, { align: "center" });
  
  // Add report title
  doc.setFontSize(20);
  doc.setTextColor(20, 30, 60);
  doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 105, 30, { align: "center" });
  
  // Add user name
  doc.setFontSize(12);
  doc.text(`Prepared for: ${userName}`, 105, 40, { align: "center" });
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 45, { align: "center" });
  
  // Add divider
  doc.setDrawColor(20, 30, 60);
  doc.line(20, 50, 190, 50);
  
  // Add report content
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  
  // Format the text with sections and add to PDF
  const lines = text.split('\n');
  let y = 60;
  let pageHeight = doc.internal.pageSize.height;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if we need a new page
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
    
    // Format headings
    if (line.startsWith('# ')) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(line.replace('# ', ''), 20, y);
      y += 8;
    } else if (line.startsWith('## ')) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(line.replace('## ', ''), 20, y);
      y += 6;
    } else if (line.startsWith('- ')) {
      // Format bullet points
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const formattedLine = doc.splitTextToSize(line, 160);
      doc.text('•', 20, y);
      doc.text(formattedLine, 25, y);
      y += 5 * formattedLine.length;
    } else {
      // Regular text
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const formattedLine = doc.splitTextToSize(line, 170);
      doc.text(formattedLine, 20, y);
      y += 5 * formattedLine.length;
    }
  }
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`NexaCore Report - Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
  }
  
  return doc.output('blob');
};

/**
 * Generate appropriate prompts based on report type and data
 */
const generatePromptForReport = (
  data: any,
  reportType: "education" | "health" | "finance" | "comprehensive"
): string => {
  const basePrompt = "Generate a detailed NexaCore report with actionable insights based on the following user data:\n\n";
  
  switch (reportType) {
    case "education":
      return `${basePrompt}
Education Data: ${JSON.stringify(data.education || {})}

Please create a comprehensive education report with the following sections:
1. Current Education Status Summary
2. Skills & Knowledge Analysis
3. Course & Learning Recommendations
4. Career Path Insights
5. Next Steps & Action Plan

Format the report with clear headings, bullet points, and a professional tone.`;

    case "health":
      return `${basePrompt}
Health Data: ${JSON.stringify(data.health || {})}
Emotion Analysis: ${JSON.stringify(data.emotionAnalysis || {})}

Please create a comprehensive health and wellness report with the following sections:
1. Health Status Overview
2. Emotional Wellbeing Assessment
3. Nutrition & Exercise Recommendations
4. Stress Management Strategies
5. Sleep Improvement Plan
6. Next Steps & Action Plan

Format the report with clear headings, bullet points, and a professional tone.`;

    case "finance":
      return `${basePrompt}
Finance Data: ${JSON.stringify(data.finance || {})}

Please create a comprehensive financial report with the following sections:
1. Financial Status Overview
2. Budget Analysis
3. Savings & Investment Recommendations
4. Expense Optimization Strategies
5. Income Enhancement Opportunities
6. Next Steps & Action Plan

Format the report with clear headings, bullet points, and a professional tone.`;

    case "comprehensive":
      return `${basePrompt}
Education Data: ${JSON.stringify(data.education || {})}
Health Data: ${JSON.stringify(data.health || {})}
Emotion Analysis: ${JSON.stringify(data.emotionAnalysis || {})}
Finance Data: ${JSON.stringify(data.finance || {})}

Please create a comprehensive NexaCore report covering education, health, and finances with the following sections:
1. Executive Summary
2. Education Status & Recommendations
3. Health & Wellness Assessment
4. Financial Status & Strategies
5. Integrated Life Planning
6. Next Steps & Action Plan

Format the report with clear headings, bullet points, and a professional tone.`;

    default:
      return basePrompt;
  }
};

/**
 * Custom hook for generating and managing reports
 */
export const useReportGenerator = () => {
  const { toast } = useToast();
  
  const generateUserReport = async (
    data: any,
    reportType: "education" | "health" | "finance" | "comprehensive",
    options?: {
      showToast?: boolean;
      onSuccess?: (report: { reportText: string; reportUrl: string }) => void;
      onError?: (error: string) => void;
      downloadPdf?: boolean;
      userName?: string;
    }
  ) => {
    if (options?.showToast !== false) {
      toast({
        title: "Generating Report",
        description: "Please wait while we analyze your data...",
      });
    }
    
    const result = await generateReport({
      ...data,
      user: {
        name: options?.userName || "NexaCore User"
      }
    }, reportType);
    
    if (result.success && result.reportText && result.reportUrl) {
      if (options?.showToast !== false) {
        toast({
          title: "Report Generated",
          description: result.message,
          variant: "default",
        });
      }
      
      // Download PDF if requested
      if (options?.downloadPdf && result.reportUrl) {
        const link = document.createElement('a');
        link.href = result.reportUrl;
        link.download = `nexacore_${reportType}_report_${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      if (options?.onSuccess) {
        options.onSuccess({
          reportText: result.reportText,
          reportUrl: result.reportUrl
        });
      }
      
      return {
        success: true,
        reportText: result.reportText,
        reportUrl: result.reportUrl
      };
    } else {
      if (options?.showToast !== false) {
        toast({
          title: "Report Generation Failed",
          description: result.message,
          variant: "destructive",
        });
      }
      
      if (options?.onError) {
        options.onError(result.message);
      }
      
      return {
        success: false,
        error: result.message
      };
    }
  };
  
  return { generateUserReport };
};
