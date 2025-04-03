
import jsPDF from 'jspdf';
import { filesize } from 'filesize';
import { saveAs } from 'file-saver';

// Types
interface PDFReportOptions {
  includeTimestamp?: boolean;
  includeUserPhoto?: boolean;
  includeBranding?: boolean;
  orientation?: 'portrait' | 'landscape';
  pageSize?: string;
}

interface FaceAnalysisResult {
  dominantExpression?: string;
  expressions?: {
    [key: string]: number;
  };
  metrics?: {
    [key: string]: number;
  };
  mentalState?: {
    [key: string]: number;
  };
}

/**
 * Generate a PDF report based on user data
 */
export const generatePDFReport = async (
  data: {
    education?: any;
    health?: any;
    finance?: any;
    faceAnalysis?: FaceAnalysisResult;
    user?: {
      name?: string;
      email?: string;
      profilePic?: string;
    };
    [key: string]: any;
  },
  reportType: "education" | "health" | "finance" | "comprehensive",
  userName: string = "User",
  options: PDFReportOptions = {}
): Promise<{ blob: Blob; url: string }> => {
  // Default options
  const mergedOptions = {
    includeTimestamp: true,
    includeUserPhoto: false,
    includeBranding: true,
    orientation: 'portrait' as const,
    pageSize: 'a4' as const,
    ...options
  };

  // Create a new PDF document
  const doc = new jsPDF({
    orientation: mergedOptions.orientation,
    unit: 'mm',
    format: mergedOptions.pageSize
  });

  // Set default styling
  doc.setFont("helvetica");
  doc.setFontSize(10);

  // Add header
  addHeaderToReport(doc, reportType, userName);
  
  // Add timestamp if requested
  if (mergedOptions.includeTimestamp) {
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    const currentDate = new Date().toLocaleString();
    doc.text(`Report generated on: ${currentDate}`, 20, 40);
  }

  // Main content Y position (after header)
  let yPos = 50;

  // Add report content based on type
  switch (reportType) {
    case "education":
      yPos = addEducationContent(doc, data.education, yPos);
      break;
    case "health":
      yPos = addHealthContent(doc, data.health, data.faceAnalysis, yPos);
      break;
    case "finance":
      yPos = addFinanceContent(doc, data.finance, yPos);
      break;
    case "comprehensive":
      yPos = addComprehensiveContent(doc, data, yPos);
      break;
  }

  // Add recommendations and next steps
  yPos = addRecommendationsToReport(doc, reportType, data, yPos);

  // Add appendix with additional information
  yPos = addAppendixToReport(doc, reportType, data, yPos);

  // Add footer
  addFooterToReport(doc);

  // Generate PDF blob
  const pdfBlob = doc.output('blob');
  
  // Create a URL for the blob
  const pdfUrl = URL.createObjectURL(pdfBlob);

  return { blob: pdfBlob, url: pdfUrl };
};

/**
 * Add header to the PDF report
 */
const addHeaderToReport = (doc: jsPDF, reportType: string, userName: string) => {
  doc.setFontSize(22);
  doc.setTextColor(0, 126, 127); // NexaCore teal color
  doc.text(`NexaCore ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 20, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated for ${userName}`, 20, 30);
};

/**
 * Add footer to all pages of the PDF report
 */
const addFooterToReport = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('NexaCore AI Insights - Confidential', 20, 285);
    doc.text(`Page ${i} of ${pageCount}`, 180, 285);
  }
};

/**
 * Add recommendations and next steps to the PDF report
 */
const addRecommendationsToReport = (doc: jsPDF, reportType: string, data: any, startY: number) => {
  // Add a new page for recommendations
  doc.addPage();
  let yPos = 20;
  
  // Add section title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Recommendations & Next Steps', 20, yPos);
  yPos += 10;
  
  // Add recommendations based on report type
  doc.setFontSize(12);
  doc.setTextColor(0, 126, 127);
  doc.text('Personalized Recommendations', 20, yPos);
  yPos += 7;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  switch (reportType) {
    case "education":
      doc.text('Based on your educational data, we recommend:', 20, yPos);
      yPos += 7;
      
      const eduRecommendations = [
        "Create a structured study schedule with dedicated focus time",
        "Join study groups or communities of practice for collaborative learning",
        "Implement spaced repetition and active recall techniques in your study routine",
        "Supplement formal education with online courses in your areas of interest",
        "Seek practical applications for theoretical knowledge through projects",
        "Consider taking breaks using the Pomodoro technique (25 min work, 5 min break)",
        "Review and consolidate learning materials at the end of each week"
      ];
      
      eduRecommendations.forEach(rec => {
        doc.text(`• ${rec}`, 25, yPos);
        yPos += 6;
      });
      break;
      
    case "health":
      doc.text('Based on your health data, we recommend:', 20, yPos);
      yPos += 7;
      
      const healthRecommendations = [
        "Aim for 7-9 hours of quality sleep each night",
        "Maintain a balanced diet rich in vegetables, lean proteins, and whole grains",
        "Stay hydrated by drinking at least 8 glasses of water daily",
        "Practice daily mindfulness or meditation for 10-15 minutes",
        "Take regular breaks during work to reduce eye strain and mental fatigue",
        "Consider integrating strength training 2-3 times per week",
        "Schedule regular health check-ups and preventive screenings"
      ];
      
      healthRecommendations.forEach(rec => {
        doc.text(`• ${rec}`, 25, yPos);
        yPos += 6;
      });
      break;
      
    case "finance":
      doc.text('Based on your financial data, we recommend:', 20, yPos);
      yPos += 7;
      
      const financeRecommendations = [
        "Create a budget using the 50/30/20 rule (needs/wants/savings)",
        "Build an emergency fund covering 3-6 months of expenses",
        "Review and optimize recurring expenses quarterly",
        "Consider automated transfers to savings accounts on payday",
        "Diversify investments based on your risk tolerance and time horizon",
        "Negotiate bills and evaluate subscriptions annually",
        "Set specific, measurable financial goals with deadlines"
      ];
      
      financeRecommendations.forEach(rec => {
        doc.text(`• ${rec}`, 25, yPos);
        yPos += 6;
      });
      break;
      
    case "comprehensive":
      doc.text('Based on your comprehensive data, we recommend:', 20, yPos);
      yPos += 7;
      
      const comprehensiveRecommendations = [
        "Establish a holistic daily routine that balances work, rest, and personal development",
        "Integrate your educational goals with career planning",
        "Consider how improvements in health might positively impact productivity",
        "Create a financial plan that supports your educational and health goals",
        "Practice self-compassion as you work toward integrated personal growth",
        "Schedule regular reviews to track progress across all domains",
        "Find synergies between different areas of your life for maximum impact"
      ];
      
      comprehensiveRecommendations.forEach(rec => {
        doc.text(`• ${rec}`, 25, yPos);
        yPos += 6;
      });
      break;
  }
  
  yPos += 5;
  
  // Add next steps section
  doc.setFontSize(12);
  doc.setTextColor(0, 126, 127);
  doc.text('Next Steps', 20, yPos);
  yPos += 7;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  const nextSteps = [
    "Review the detailed analysis in this report",
    "Identify 2-3 key recommendations to implement immediately",
    "Set reminders to check in on your progress weekly",
    "Schedule a follow-up analysis in 30 days to track improvements",
    "Share relevant insights with your support network"
  ];
  
  nextSteps.forEach(step => {
    doc.text(`• ${step}`, 25, yPos);
    yPos += 6;
  });
  
  return yPos;
};

/**
 * Add appendix with additional information to the PDF report
 */
const addAppendixToReport = (doc: jsPDF, reportType: string, data: any, startY: number) => {
  // Add a new page for the appendix
  doc.addPage();
  let yPos = 20;
  
  // Add section title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Appendix: Additional Resources', 20, yPos);
  yPos += 10;
  
  // Add resources based on report type
  doc.setFontSize(12);
  doc.setTextColor(0, 126, 127);
  doc.text('Suggested Resources', 20, yPos);
  yPos += 7;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  switch (reportType) {
    case "education":
      const eduResources = [
        { title: "Learning How to Learn", author: "Barbara Oakley", description: "A course on effective learning techniques" },
        { title: "Deep Work", author: "Cal Newport", description: "Strategies for focused productivity" },
        { title: "Khan Academy", author: "", description: "Free online courses on various subjects" },
        { title: "Anki", author: "", description: "Spaced repetition flashcard software" },
        { title: "Coursera", author: "", description: "Platform for online courses from top universities" }
      ];
      
      eduResources.forEach(resource => {
        doc.text(`• ${resource.title}${resource.author ? ` by ${resource.author}` : ""}`, 25, yPos);
        yPos += 5;
        doc.text(`  ${resource.description}`, 25, yPos);
        yPos += 7;
      });
      break;
      
    case "health":
      const healthResources = [
        { title: "Headspace", author: "", description: "Guided meditation and mindfulness app" },
        { title: "MyFitnessPal", author: "", description: "Nutrition tracking and meal planning" },
        { title: "Sleep Foundation", author: "", description: "Research-based sleep improvement resources" },
        { title: "Why We Sleep", author: "Matthew Walker", description: "Book on sleep science and improvement" },
        { title: "Fitness Blender", author: "", description: "Free workout videos for all fitness levels" }
      ];
      
      healthResources.forEach(resource => {
        doc.text(`• ${resource.title}${resource.author ? ` by ${resource.author}` : ""}`, 25, yPos);
        yPos += 5;
        doc.text(`  ${resource.description}`, 25, yPos);
        yPos += 7;
      });
      break;
      
    case "finance":
      const financeResources = [
        { title: "YNAB (You Need A Budget)", author: "", description: "Budgeting software and methodology" },
        { title: "The Simple Path to Wealth", author: "J.L. Collins", description: "Book on straightforward investing" },
        { title: "Mint", author: "", description: "Free financial tracking and budgeting tool" },
        { title: "NerdWallet", author: "", description: "Financial product comparisons and advice" },
        { title: "Bogleheads' Guide to Investing", author: "Taylor Larimore", description: "Book on index fund investing" }
      ];
      
      financeResources.forEach(resource => {
        doc.text(`• ${resource.title}${resource.author ? ` by ${resource.author}` : ""}`, 25, yPos);
        yPos += 5;
        doc.text(`  ${resource.description}`, 25, yPos);
        yPos += 7;
      });
      break;
      
    case "comprehensive":
      const comprehensiveResources = [
        { title: "Atomic Habits", author: "James Clear", description: "Book on building effective habits" },
        { title: "Notion", author: "", description: "All-in-one workspace for notes, tasks, and planning" },
        { title: "The NexaCore Blog", author: "", description: "Articles on integrated personal development" },
        { title: "Todoist", author: "", description: "Task management app for productivity" },
        { title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", description: "Classic book on personal effectiveness" }
      ];
      
      comprehensiveResources.forEach(resource => {
        doc.text(`• ${resource.title}${resource.author ? ` by ${resource.author}` : ""}`, 25, yPos);
        yPos += 5;
        doc.text(`  ${resource.description}`, 25, yPos);
        yPos += 7;
      });
      break;
  }
  
  // Add methodology section
  yPos += 5;
  doc.setFontSize(12);
  doc.setTextColor(0, 126, 127);
  doc.text('Methodology', 20, yPos);
  yPos += 7;
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('This report was generated using NexaCore\'s proprietary AI analysis algorithms, which process user', 20, yPos);
  yPos += 5;
  doc.text('data to provide personalized insights and recommendations. The analysis is based on established', 20, yPos);
  yPos += 5;
  doc.text('research in cognitive science, behavioral psychology, and data analytics.', 20, yPos);
  yPos += 10;
  
  doc.text('Note: This report is provided for informational purposes only and should not be considered as', 20, yPos);
  yPos += 5;
  doc.text('professional advice. Please consult with qualified professionals for specific guidance related to', 20, yPos);
  yPos += 5;
  doc.text('your education, health, or financial situations.', 20, yPos);
  
  return yPos;
};

/**
 * Add education content to the PDF
 */
const addEducationContent = (doc: jsPDF, educationData: any, startY: number) => {
  let yPos = startY;

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Education Assessment', 20, yPos);
  yPos += 10;

  if (!educationData || Object.keys(educationData).length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('No education data available for analysis.', 20, yPos);
    return yPos + 10;
  }

  // Education metrics
  if (educationData.currentCourses) {
    doc.setFontSize(12);
    doc.setTextColor(0, 126, 127);
    doc.text('Current Courses', 20, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    if (Array.isArray(educationData.currentCourses)) {
      educationData.currentCourses.forEach((course: string, index: number) => {
        doc.text(`• ${course}`, 25, yPos);
        yPos += 5;
      });
    } else {
      doc.text(`• ${educationData.currentCourses}`, 25, yPos);
      yPos += 5;
    }
    
    yPos += 5;
  }

  // Study hours and goals
  if (educationData.studyHoursPerWeek || educationData.goals) {
    doc.setFontSize(12);
    doc.setTextColor(0, 126, 127);
    doc.text('Study Statistics', 20, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    if (educationData.studyHoursPerWeek) {
      doc.text(`Study Hours Per Week: ${educationData.studyHoursPerWeek}`, 25, yPos);
      yPos += 5;
    }
    
    if (educationData.goals) {
      doc.text('Educational Goals:', 25, yPos);
      yPos += 5;
      
      if (Array.isArray(educationData.goals)) {
        educationData.goals.forEach((goal: string, index: number) => {
          doc.text(`• ${goal}`, 30, yPos);
          yPos += 5;
        });
      } else {
        doc.text(`• ${educationData.goals}`, 30, yPos);
        yPos += 5;
      }
    }
    
    yPos += 5;
  }

  // Learning style if available
  if (educationData.learningStyle) {
    doc.setFontSize(12);
    doc.setTextColor(0, 126, 127);
    doc.text('Learning Style Analysis', 20, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Your primary learning style: ${educationData.learningStyle}`, 25, yPos);
    yPos += 5;
    
    // Add learning style explanations
    const learningStyleInfo = {
      visual: "You learn best through visual aids like charts, graphs, and images.",
      auditory: "You learn best by listening to information and verbal instructions.",
      reading: "You learn best by reading and writing information.",
      kinesthetic: "You learn best through hands-on experiences and physical activities."
    };
    
    if (educationData.learningStyle && learningStyleInfo[educationData.learningStyle.toLowerCase()]) {
      doc.text(learningStyleInfo[educationData.learningStyle.toLowerCase()], 25, yPos);
      yPos += 5;
    }
    
    yPos += 5;
  }

  // Skills assessment if available
  if (educationData.skills && (Array.isArray(educationData.skills) || typeof educationData.skills === 'object')) {
    doc.setFontSize(12);
    doc.setTextColor(0, 126, 127);
    doc.text('Skills Assessment', 20, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    if (Array.isArray(educationData.skills)) {
      doc.text('Your current skills:', 25, yPos);
      yPos += 5;
      
      educationData.skills.forEach((skill: string, index: number) => {
        doc.text(`• ${skill}`, 30, yPos);
        yPos += 5;
      });
    } else if (typeof educationData.skills === 'object') {
      doc.text('Your skills proficiency:', 25, yPos);
      yPos += 5;
      
      Object.entries(educationData.skills).forEach(([skill, level]: [string, any]) => {
        doc.text(`• ${skill}: ${level}`, 30, yPos);
        yPos += 5;
      });
    }
    
    yPos += 5;
  }

  return yPos;
};

/**
 * Add health content to the PDF
 */
const addHealthContent = (doc: jsPDF, healthData: any, faceAnalysis: FaceAnalysisResult | undefined, startY: number) => {
  let yPos = startY;

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Health Assessment', 20, yPos);
  yPos += 10;

  if (!healthData || Object.keys(healthData).length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('No health data available for analysis.', 20, yPos);
    return yPos + 10;
  }

  // Physical metrics
  doc.setFontSize(12);
  doc.setTextColor(0, 126, 127);
  doc.text('Physical Health Metrics', 20, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  if (healthData.height) {
    doc.text(`Height: ${healthData.height} cm`, 25, yPos);
    yPos += 5;
  }
  
  if (healthData.weight) {
    doc.text(`Weight: ${healthData.weight} kg`, 25, yPos);
    yPos += 5;
  }
  
  if (healthData.sleepHours) {
    doc.text(`Average Sleep: ${healthData.sleepHours} hours per night`, 25, yPos);
    yPos += 5;
  }
  
  if (healthData.exerciseFrequency) {
    doc.text(`Exercise Frequency: ${healthData.exerciseFrequency} times per week`, 25, yPos);
    yPos += 5;
  }
  
  if (healthData.stressLevel) {
    doc.text(`Self-reported Stress Level: ${healthData.stressLevel.replace('_', ' ')}`, 25, yPos);
    yPos += 5;
  }
  
  yPos += 5;

  // Add face analysis results if available
  if (faceAnalysis && Object.keys(faceAnalysis).length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(0, 126, 127);
    doc.text('Facial Analysis Results', 20, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    // Dominant expression
    if (faceAnalysis.dominantExpression) {
      doc.text(`Dominant Expression: ${faceAnalysis.dominantExpression}`, 25, yPos);
      yPos += 5;
    }
    
    // Expressions
    if (faceAnalysis.expressions && Object.keys(faceAnalysis.expressions).length > 0) {
      doc.text('Expression Analysis:', 25, yPos);
      yPos += 5;
      
      Object.entries(faceAnalysis.expressions).forEach(([expression, value]) => {
        const percentage = typeof value === 'number' ? (value * 100).toFixed(1) : value;
        doc.text(`• ${expression.charAt(0).toUpperCase() + expression.slice(1)}: ${percentage}%`, 30, yPos);
        yPos += 5;
      });
      
      yPos += 5;
    }
    
    // Wellness metrics
    if (faceAnalysis.metrics && Object.keys(faceAnalysis.metrics).length > 0) {
      doc.text('Wellness Metrics:', 25, yPos);
      yPos += 5;
      
      Object.entries(faceAnalysis.metrics).forEach(([metric, value]) => {
        const percentage = typeof value === 'number' ? (value * 100).toFixed(1) : value;
        doc.text(`• ${metric.charAt(0).toUpperCase() + metric.slice(1)}: ${percentage}%`, 30, yPos);
        yPos += 5;
      });
      
      yPos += 5;
    }
    
    // Mental state
    if (faceAnalysis.mentalState && Object.keys(faceAnalysis.mentalState).length > 0) {
      doc.text('Mental State Assessment:', 25, yPos);
      yPos += 5;
      
      Object.entries(faceAnalysis.mentalState).forEach(([state, value]) => {
        const percentage = typeof value === 'number' ? (value * 100).toFixed(1) : value;
        doc.text(`• ${state.charAt(0).toUpperCase() + state.slice(1)}: ${percentage}%`, 30, yPos);
        yPos += 5;
      });
      
      yPos += 5;
    }
  }

  return yPos;
};

/**
 * Add finance content to the PDF
 */
const addFinanceContent = (doc: jsPDF, financeData: any, startY: number) => {
  let yPos = startY;

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Financial Assessment', 20, yPos);
  yPos += 10;

  if (!financeData || Object.keys(financeData).length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('No financial data available for analysis.', 20, yPos);
    return yPos + 10;
  }

  // Financial metrics
  doc.setFontSize(12);
  doc.setTextColor(0, 126, 127);
  doc.text('Financial Overview', 20, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  if (financeData.monthlyIncome) {
    doc.text(`Monthly Income: $${financeData.monthlyIncome}`, 25, yPos);
    yPos += 5;
  }
  
  if (financeData.monthlyExpenses) {
    doc.text(`Monthly Expenses: $${financeData.monthlyExpenses}`, 25, yPos);
    yPos += 5;
  }
  
  if (financeData.savingsTarget) {
    doc.text(`Savings Target: ${financeData.savingsTarget}%`, 25, yPos);
    yPos += 5;
  }
  
  if (financeData.investmentAllocation) {
    doc.text(`Investment Allocation: ${financeData.investmentAllocation}%`, 25, yPos);
    yPos += 5;
  }
  
  yPos += 5;

  // Transaction analysis if available
  if (financeData.transactions && financeData.transactions.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(0, 126, 127);
    doc.text('Recent Transactions', 20, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    financeData.transactions.slice(0, 5).forEach((transaction: any, index: number) => {
      doc.text(`• ${transaction.date || 'N/A'}: ${transaction.description || 'Unknown'} - $${transaction.amount || '0'}`, 25, yPos);
      yPos += 5;
    });
    
    yPos += 5;
  }

  // Financial health score if available
  if (financeData.healthScore) {
    doc.setFontSize(12);
    doc.setTextColor(0, 126, 127);
    doc.text('Financial Health Score', 20, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    
    const score = typeof financeData.healthScore === 'number' 
      ? financeData.healthScore 
      : parseFloat(financeData.healthScore);
    
    const scoreText = isNaN(score) ? financeData.healthScore : `${score}/100`;
    doc.text(`Your Financial Health Score: ${scoreText}`, 25, yPos);
    yPos += 5;
    
    // Add interpretation based on score
    if (!isNaN(score)) {
      let interpretation = '';
      if (score >= 80) {
        interpretation = 'Excellent financial health. Continue maintaining your good habits.';
      } else if (score >= 60) {
        interpretation = 'Good financial health. Small improvements could further strengthen your position.';
      } else if (score >= 40) {
        interpretation = 'Moderate financial health. Focus on building emergency savings and reducing debt.';
      } else {
        interpretation = 'Financial health needs attention. Consider developing a strict budget and debt reduction plan.';
      }
      
      doc.text(`Interpretation: ${interpretation}`, 25, yPos);
      yPos += 5;
    }
    
    yPos += 5;
  }

  return yPos;
};

/**
 * Add comprehensive content to the PDF
 */
const addComprehensiveContent = (doc: jsPDF, allData: any, startY: number) => {
  let yPos = startY;

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Comprehensive Assessment', 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setTextColor(0, 126, 127);
  doc.text('Executive Summary', 20, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('This comprehensive report provides an integrated view of your education, health, and financial data.', 25, yPos);
  yPos += 5;
  doc.text('The following pages contain detailed analyses for each domain along with personalized recommendations.', 25, yPos);
  yPos += 10;

  // Integration insights
  doc.setFontSize(12);
  doc.setTextColor(0, 126, 127);
  doc.text('Holistic Insights', 20, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  
  const insights = [
    "Your educational goals can be supported by maintaining good health habits",
    "Financial planning should align with your educational investments and health needs",
    "Stress management is important across all domains for optimal performance",
    "Building consistent habits can create positive momentum across all areas of life",
    "Regular review and adjustment of your strategies leads to continuous improvement"
  ];
  
  insights.forEach(insight => {
    doc.text(`• ${insight}`, 25, yPos);
    yPos += 6;
  });
  
  yPos += 5;

  // Add sections from each domain on separate pages
  if (allData.education && Object.keys(allData.education).length > 0) {
    doc.addPage();
    yPos = 20;
    yPos = addEducationContent(doc, allData.education, yPos);
  }

  if (allData.health && Object.keys(allData.health).length > 0) {
    doc.addPage();
    yPos = 20;
    yPos = addHealthContent(doc, allData.health, allData.faceAnalysis, yPos);
  }

  if (allData.finance && Object.keys(allData.finance).length > 0) {
    doc.addPage();
    yPos = 20;
    yPos = addFinanceContent(doc, allData.finance, yPos);
  }

  return yPos;
};

/**
 * Download a generated PDF report
 */
export const downloadPDFReport = async (
  data: any,
  reportType: "education" | "health" | "finance" | "comprehensive",
  userName: string = "User",
  options: PDFReportOptions = {}
) => {
  try {
    const { blob, url } = await generatePDFReport(data, reportType, userName, options);
    const fileName = `nexacore_${reportType}_report.pdf`;
    saveAs(blob, fileName);
    return { success: true, fileName };
  } catch (error) {
    console.error("Error downloading PDF report:", error);
    throw error;
  }
};
