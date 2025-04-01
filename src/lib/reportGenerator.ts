
import { useToast } from "@/hooks/use-toast";
import { triggerN8nWebhook } from "./automationHelpers";

// Google API key for AI services
const GOOGLE_API_KEY = "AIzaSyDSbWxbhKo2iUw2woR0tomAl71Wq7XTqJw";

/**
 * Generate a report from user data using Google AI services
 */
export const generateReport = async (
  data: {
    education?: any;
    health?: any;
    finance?: any;
    [key: string]: any;
  },
  reportType: "education" | "health" | "finance" | "comprehensive"
): Promise<{
  success: boolean;
  reportText?: string;
  reportUrl?: string;
  message: string;
}> => {
  try {
    const prompt = generatePromptForReport(data, reportType);
    
    // Call Google AI API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      })
    });

    const result = await response.json();
    
    if (!response.ok || !result.candidates || result.candidates.length === 0) {
      throw new Error(result.error?.message || "Failed to generate report");
    }
    
    const reportText = result.candidates[0].content.parts[0].text;
    
    // Generate PDF URL (mock for now)
    const reportUrl = await generatePdfFromText(reportText, reportType);
    
    return {
      success: true,
      reportText,
      reportUrl,
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
  reportType: string
): Promise<string> => {
  // For now, we'll mock this by returning a dynamic URL
  // In a real implementation, you would use a PDF generation service
  // or trigger an n8n workflow to handle PDF creation
  
  // Trigger n8n webhook to generate PDF if configured
  try {
    // This can be enhanced later to use actual n8n webhooks from settings
    await triggerN8nWebhook(
      "https://your-n8n-instance/webhook/pdf-generator", 
      {
        reportType,
        reportText: text,
        timestamp: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error("Error triggering n8n webhook for PDF generation:", error);
  }
  
  // Return a mock URL for now
  return `https://nexacore.app/reports/${reportType}_${Date.now()}.pdf`;
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
    }
  ) => {
    if (options?.showToast !== false) {
      toast({
        title: "Generating Report",
        description: "Please wait while we analyze your data...",
      });
    }
    
    const result = await generateReport(data, reportType);
    
    if (result.success && result.reportText && result.reportUrl) {
      if (options?.showToast !== false) {
        toast({
          title: "Report Generated",
          description: result.message,
          variant: "default",
        });
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
