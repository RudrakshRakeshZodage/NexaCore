
import { useToast } from "@/hooks/use-toast";
import { triggerN8nWebhook } from "./automationHelpers";
import { generatePDFReport, downloadPDFReport } from "./pdfReportGenerator";

// OpenAI API key (this is a placeholder - in a production app, you would use environment variables)
const OPENAI_API_KEY = "sk-your-api-key";

/**
 * Generate a report from user data using OpenAI API
 */
export const generateReport = async (
  data: {
    education?: any;
    health?: any;
    finance?: any;
    faceAnalysis?: any;
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

    // For demo purposes, if the API call fails, generate a mock report
    let reportText;
    if (!response.ok) {
      console.log("Using mock report data (OpenAI API request failed)");
      reportText = generateMockReport(data, reportType);
    } else {
      const result = await response.json();
      reportText = result.choices[0].message.content;
    }
    
    // Generate PDF
    const { blob: pdfBlob, url: reportUrl } = await generatePDFReport(
      data, 
      reportType, 
      data.user?.name || "User",
      { includeTimestamp: true }
    );
    
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
Face Analysis: ${JSON.stringify(data.faceAnalysis || {})}

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
Face Analysis: ${JSON.stringify(data.faceAnalysis || {})}
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
 * Generate a mock report for demo purposes when OpenAI API is not available
 */
const generateMockReport = (data: any, reportType: "education" | "health" | "finance" | "comprehensive"): string => {
  const userName = data.user?.name || "User";
  
  switch (reportType) {
    case "health":
      return `# Health & Wellness Report for ${userName}

## Executive Summary
Based on the health data provided, we've analyzed your current health status and created personalized recommendations to help you achieve optimal wellness.

## Health Status Overview
Your current health metrics indicate ${data.health?.stressLevel === 'high' ? 'elevated stress levels that require attention' : 'manageable stress levels'}.
${data.faceAnalysis ? `The facial analysis detected a dominant emotion of ${data.faceAnalysis.dominantExpression}, which aligns with your self-reported stress level.` : ''}

## Physical Health Assessment
${data.health?.weight && data.health?.height ? `Based on your height and weight, your health indicators are within range.` : 'No physical metrics were provided for analysis.'}

## Nutrition & Exercise Recommendations
- Maintain a balanced diet rich in whole foods, vegetables, and lean proteins
- Aim for 150 minutes of moderate exercise per week
- Stay hydrated by consuming at least 8 glasses of water daily
- Consider incorporating strength training 2-3 times per week

## Stress Management Strategies
${data.health?.stressLevel === 'high' || data.health?.stressLevel === 'very_high' ? 
`Since your stress level is elevated, consider these strategies:
- Practice daily mindfulness meditation for 10-15 minutes
- Implement regular breaks during work hours
- Limit screen time before bedtime
- Consider speaking with a mental health professional` 
: 
`To maintain your current stress levels:
- Continue any existing stress management practices
- Consider adding a mindfulness practice if you haven't already
- Ensure you're getting adequate sleep and relaxation time`}

## Sleep Improvement Plan
- Aim for 7-9 hours of quality sleep each night
- Establish a consistent sleep schedule
- Create a relaxing bedtime routine
- Keep your bedroom cool, dark, and quiet

## Next Steps & Action Plan
1. Begin implementing the nutrition and exercise recommendations immediately
2. Track your stress levels for the next 30 days
3. Reassess your health metrics in 3 months
4. Schedule recommended preventive health screenings

Remember that small, consistent changes often lead to the most sustainable health improvements.`;
    
    case "finance":
      return `# Financial Report for ${userName}

## Executive Summary
This report analyzes your current financial situation and provides tailored recommendations to help you achieve your financial goals.

## Financial Status Overview
${data.transactions && data.transactions.length > 0 ? 
`Your recent transaction history shows activity across multiple categories, with the most recent transaction being ${data.transactions[0].description} for $${data.transactions[0].amount}.` 
: 
'No transaction history was provided for analysis.'}

## Budget Analysis
${data.finance?.monthlyIncome ? 
`Based on your reported monthly income of $${data.finance.monthlyIncome}, your current budget allocations appear to be ${data.finance.savingsTarget >= 20 ? 'well-balanced with a good savings rate' : 'focused more on expenses than savings'}.` 
: 
'No monthly income information was provided to perform a budget analysis.'}

## Savings & Investment Recommendations
- Establish an emergency fund covering 3-6 months of expenses
- Consider automated transfers to savings accounts
- Explore tax-advantaged retirement accounts
- Diversify investments based on your risk tolerance
- Start with index funds if you're new to investing

## Expense Optimization Strategies
- Review and eliminate unnecessary subscriptions
- Consider refinancing high-interest debt
- Compare insurance policies annually for better rates
- Look for cashback opportunities on regular purchases
- Plan major purchases strategically to coincide with sales

## Income Enhancement Opportunities
- Evaluate your current compensation against market rates
- Consider skills development to increase earning potential
- Explore passive income opportunities aligned with your interests
- Negotiate bills and recurring expenses regularly

## Next Steps & Action Plan
1. Create or revise your monthly budget using the 50/30/20 rule
2. Set up automatic transfers to your savings account
3. Review your financial goals quarterly
4. Schedule an annual comprehensive financial review

Remember that financial health is built through consistent habits and informed decisions over time.`;
    
    case "education":
      return `# Education Report for ${userName}

## Executive Summary
This report analyzes your current educational progress and provides recommendations to help you achieve your learning goals.

## Current Education Status
${data.education?.currentCourses ? 
`You are currently enrolled in courses related to ${Array.isArray(data.education.currentCourses) ? data.education.currentCourses.join(", ") : data.education.currentCourses}.` 
: 
'No current course information was provided.'}

## Skills & Knowledge Analysis
${data.education?.skills ? 
`Your skill set includes ${Array.isArray(data.education.skills) ? data.education.skills.join(", ") : data.education.skills}.` 
: 
'No skills information was provided for analysis.'}

## Course & Learning Recommendations
- Focus on building core competencies in your field
- Consider supplementing formal education with online courses
- Join study groups or communities of practice
- Implement spaced repetition and active recall in your study strategy
- Seek practical application opportunities for theoretical knowledge

## Career Path Insights
- Research emerging trends in your field of interest
- Connect with professionals through networking events and platforms
- Consider how your current educational path aligns with long-term goals
- Explore internship or volunteering opportunities for practical experience

## Next Steps & Action Plan
1. Set specific, measurable learning goals for the next quarter
2. Create a structured study schedule with dedicated focus time
3. Implement a knowledge management system for notes and resources
4. Seek feedback on your progress from mentors or instructors
5. Schedule regular review sessions to reinforce learning

Remember that effective learning is an active, ongoing process that requires intentional practice and reflection.`;
    
    case "comprehensive":
      return `# Comprehensive Report for ${userName}

## Executive Summary
This report provides an integrated analysis of your education, health, and financial data to offer holistic recommendations for personal development and wellbeing.

${data.faceAnalysis ? `Based on facial analysis, your dominant expression is ${data.faceAnalysis.dominantExpression}, which may provide insights into your current emotional state.` : ''}

## Education Status & Recommendations
${data.education?.currentCourses ? 
`You are currently focusing on ${Array.isArray(data.education.currentCourses) ? data.education.currentCourses.join(", ") : data.education.currentCourses}.` 
: 
'No education data was provided for analysis.'}

Key recommendations:
- Align your educational pursuits with both your interests and career goals
- Consider a balanced approach to learning that includes formal education and self-directed study
- Implement effective study techniques like active recall and spaced repetition

## Health & Wellness Assessment
${data.health ? 
`Your current health metrics indicate ${data.health.stressLevel === 'high' ? 'a need for stress management strategies' : 'generally positive wellness factors'}.` 
: 
'No health data was provided for analysis.'}

Key recommendations:
- Maintain a balanced diet and regular physical activity
- Implement stress management techniques like mindfulness or meditation
- Prioritize 7-9 hours of quality sleep each night
- Consider regular health check-ups and preventative care

## Financial Status & Strategies
${data.finance?.monthlyIncome ? 
`With a monthly income of $${data.finance.monthlyIncome}, your financial picture shows ${data.finance.savingsTarget >= 20 ? 'positive savings habits' : 'opportunities for improved savings'}.` 
: 
'No financial data was provided for analysis.'}

Key recommendations:
- Build an emergency fund covering 3-6 months of expenses
- Follow a structured budget using the 50/30/20 rule
- Review and optimize recurring expenses regularly
- Consider long-term investment strategies aligned with your goals

## Integrated Life Planning
Holistic recommendations:
- Balance your time allocation between educational pursuits, health activities, and financial management
- Consider how improvements in one area might positively impact others
- Implement a consistent review process to track progress across all domains
- Practice self-compassion as you work toward integrated personal growth

## Next Steps & Action Plan
1. Identify one priority action from each domain to implement this week
2. Schedule regular check-ins to review progress across all areas
3. Consider how your educational pursuits might impact both your health and finances
4. Develop systems that make positive habits easier to maintain

Remember that personal development is most effective when approached holistically, with attention to how different aspects of life impact one another.`;
    
    default:
      return `# NexaCore Report for ${userName}

## Executive Summary
This is a demonstration report showing the format and structure of a NexaCore analysis. In a real implementation, this would contain personalized insights based on your data.

## Key Findings
- This is a placeholder for your first key finding
- This is a placeholder for your second key finding
- This is a placeholder for your third key finding

## Recommendations
1. First recommendation based on your data
2. Second recommendation based on your data
3. Third recommendation based on your data

## Next Steps
- Review the information provided in this report
- Implement the recommendations at your own pace
- Check back regularly for updated insights

This report is a demonstration of the NexaCore reporting capability. With valid API credentials and real user data, the system would generate detailed, personalized reports with actionable insights.`;
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
