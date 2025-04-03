
import jsPDF from 'jspdf';
import FileSize from 'filesize';
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
  doc.setFontSize(22);
  doc.setTextColor(0, 126, 127); // NexaCore teal color
  doc.text(`NexaCore ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 20, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated for ${userName}`, 20, 30);

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

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('NexaCore AI Insights - Confidential', 20, 285);
    doc.text(`Page ${i} of ${pageCount}`, 180, 285);
  }

  // Generate PDF blob
  const pdfBlob = doc.output('blob');
  
  // Create a URL for the blob
  const pdfUrl = URL.createObjectURL(pdfBlob);

  return { blob: pdfBlob, url: pdfUrl };
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
  
  if (healthData.age) {
    doc.text(`Age: ${healthData.age} years`, 25, yPos);
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
  yPos += 10;

  // Add sections from each domain
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
export const downloadPDFReport = (pdfUrl: string, fileName: string = "nexacore_report.pdf") => {
  saveAs(pdfUrl, fileName);
};
