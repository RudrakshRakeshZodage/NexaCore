
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

// Logo for the PDF (base64 encoded image)
const NEXACORE_LOGO = 'data:image/png;base64,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';

interface ReportOptions {
  userName: string;
  userEmail?: string;
  includeTimestamp?: boolean;
  includeLogo?: boolean;
  includePageNumbers?: boolean;
  logoUrl?: string;
}

interface ReportSection {
  title: string;
  content: string | {
    type: 'paragraph' | 'bullet' | 'heading2' | 'table';
    value: string | string[] | any;
  }[];
}

export class PDFReportGenerator {
  private doc: jsPDF;
  private options: ReportOptions;
  private currentY: number = 0;
  private pageWidth: number = 210;
  private leftMargin: number = 20;
  private rightMargin: number = 20;
  private topMargin: number = 20;
  private bottomMargin: number = 20;
  private pageHeight: number = 297;
  private contentWidth: number = 0;

  constructor(options: ReportOptions) {
    this.options = {
      includeTimestamp: true,
      includeLogo: true,
      includePageNumbers: true,
      ...options
    };
    
    this.doc = new jsPDF();
    this.contentWidth = this.pageWidth - this.leftMargin - this.rightMargin;
    this.currentY = this.topMargin;
  }

  private checkPageBreak(heightNeeded: number): void {
    if (this.currentY + heightNeeded > this.pageHeight - this.bottomMargin) {
      this.doc.addPage();
      this.currentY = this.topMargin;
      this.addPageNumber();
    }
  }

  private addPageNumber(): void {
    if (this.options.includePageNumbers) {
      const pageCount = this.doc.getNumberOfPages();
      this.doc.setFontSize(8);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(`Page ${pageCount}`, this.pageWidth / 2, this.pageHeight - 10, { align: 'center' });
    }
  }

  addHeader(): void {
    // Add logo
    if (this.options.includeLogo) {
      try {
        const logoUrl = this.options.logoUrl || NEXACORE_LOGO;
        this.doc.addImage(logoUrl, 'PNG', this.leftMargin, this.currentY, 15, 15);
      } catch (e) {
        console.error('Error adding logo:', e);
      }
    }

    // Add report title
    this.doc.setFontSize(22);
    this.doc.setTextColor(20, 30, 60);
    this.doc.text('NexaCore Report', this.pageWidth / 2, this.currentY + 10, { align: 'center' });
    
    // Add user name
    this.doc.setFontSize(12);
    this.doc.setTextColor(60, 60, 60);
    this.doc.text(`Prepared for: ${this.options.userName}`, this.pageWidth / 2, this.currentY + 18, { align: 'center' });
    
    // Add timestamp
    if (this.options.includeTimestamp) {
      const timestamp = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
      this.doc.setFontSize(10);
      this.doc.text(`Generated on: ${timestamp}`, this.pageWidth / 2, this.currentY + 25, { align: 'center' });
    }
    
    // Add divider
    this.currentY += 30;
    this.doc.setDrawColor(20, 30, 60);
    this.doc.line(this.leftMargin, this.currentY, this.pageWidth - this.rightMargin, this.currentY);
    this.currentY += 10;
  }

  addSection(section: ReportSection): void {
    this.checkPageBreak(10);
    
    // Add section title
    this.doc.setFontSize(16);
    this.doc.setTextColor(20, 90, 100);
    this.doc.text(section.title, this.leftMargin, this.currentY);
    this.currentY += 8;
    
    // Add section content
    if (typeof section.content === 'string') {
      this.addText(section.content);
    } else if (Array.isArray(section.content)) {
      section.content.forEach(item => {
        if (typeof item === 'string') {
          this.addText(item);
        } else {
          switch (item.type) {
            case 'paragraph':
              this.addText(item.value as string);
              break;
            case 'bullet':
              this.addBulletPoint(item.value as string);
              break;
            case 'heading2':
              this.addSubheading(item.value as string);
              break;
            case 'table':
              // Table handling would require more complex logic
              break;
          }
        }
      });
    }
    
    this.currentY += 5;
  }

  addText(text: string): void {
    this.checkPageBreak(10);
    this.doc.setFontSize(11);
    this.doc.setTextColor(60, 60, 60);
    
    const textLines = this.doc.splitTextToSize(text, this.contentWidth);
    this.doc.text(textLines, this.leftMargin, this.currentY);
    this.currentY += textLines.length * 6;
  }

  addBulletPoint(text: string): void {
    this.checkPageBreak(6);
    this.doc.setFontSize(11);
    this.doc.setTextColor(60, 60, 60);
    
    const bullet = '•';
    const textLines = this.doc.splitTextToSize(text, this.contentWidth - 8);
    this.doc.text(bullet, this.leftMargin, this.currentY);
    this.doc.text(textLines, this.leftMargin + 5, this.currentY);
    this.currentY += textLines.length * 6;
  }

  addSubheading(text: string): void {
    this.checkPageBreak(8);
    this.doc.setFontSize(14);
    this.doc.setTextColor(40, 40, 40);
    this.doc.text(text, this.leftMargin, this.currentY);
    this.currentY += 8;
  }

  addImage(imageUrl: string, width: number, height: number): void {
    this.checkPageBreak(height + 5);
    try {
      this.doc.addImage(
        imageUrl, 
        'JPEG', 
        this.leftMargin, 
        this.currentY, 
        width, 
        height
      );
      this.currentY += height + 5;
    } catch (e) {
      console.error('Error adding image:', e);
      this.addText('[Error: Could not add image]');
    }
  }

  addFooter(): void {
    this.doc.setFontSize(9);
    this.doc.setTextColor(100, 100, 100);
    
    const footerText = 'NexaCore - Your AI-Powered Life Management Platform';
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.text(footerText, this.pageWidth / 2, this.pageHeight - 15, { align: 'center' });
    }
  }

  async generateReport(data: any, reportType: 'education' | 'health' | 'finance' | 'comprehensive'): Promise<Blob> {
    // Add report header
    this.addHeader();
    
    // Add report summary
    this.addSection({
      title: 'Executive Summary',
      content: [
        {
          type: 'paragraph',
          value: `This ${reportType} report provides a comprehensive analysis of your data, along with personalized recommendations to help you achieve your goals.`
        }
      ]
    });
    
    // Add specific sections based on report type
    if (reportType === 'education' || reportType === 'comprehensive') {
      this.addSection({
        title: 'Education Analysis',
        content: [
          {
            type: 'paragraph',
            value: 'Based on your education profile and career goals, we have analyzed your current skills and identified opportunities for growth.'
          },
          {
            type: 'heading2',
            value: 'Current Education Status'
          },
          {
            type: 'bullet',
            value: data.education?.educationLevel || 'Education level not specified'
          },
          {
            type: 'bullet',
            value: data.education?.institution ? `Institution: ${data.education.institution}` : 'Institution not specified'
          },
          {
            type: 'bullet',
            value: data.education?.fieldOfStudy ? `Field of Study: ${data.education.fieldOfStudy}` : 'Field of study not specified'
          },
          {
            type: 'heading2',
            value: 'Recommendations'
          },
          {
            type: 'bullet',
            value: 'Consider pursuing additional certifications in your field to enhance your marketability.'
          },
          {
            type: 'bullet',
            value: 'Develop technical skills that align with your career goals.'
          },
          {
            type: 'bullet',
            value: 'Engage in continuous learning through online courses and workshops.'
          }
        ]
      });
    }
    
    if (reportType === 'health' || reportType === 'comprehensive') {
      this.addSection({
        title: 'Health Analysis',
        content: [
          {
            type: 'paragraph',
            value: 'Your health data has been analyzed to provide personalized recommendations for improving your overall well-being.'
          },
          {
            type: 'heading2',
            value: 'Current Health Status'
          }
        ]
      });
      
      // Add face analysis results if available
      if (data.faceAnalysis) {
        this.addSubheading('Facial Analysis Results');
        this.addBulletPoint(`Age estimate: ${data.faceAnalysis.age} years`);
        this.addBulletPoint(`Gender estimate: ${data.faceAnalysis.gender}`);
        this.addBulletPoint(`Dominant emotion: ${data.faceAnalysis.dominantExpression}`);
        this.addText('Your facial expression analysis suggests trends in your emotional state that can be indicators of overall well-being. Regular monitoring of emotional patterns can help identify stress triggers and manage mental health.');
      } else {
        this.addText('No facial analysis data available. Consider using our facial analysis tool to get insights into your emotional well-being.');
      }
      
      this.addSubheading('Recommendations');
      this.addBulletPoint('Maintain a balanced diet rich in fruits, vegetables, and whole grains.');
      this.addBulletPoint('Engage in regular physical activity for at least 30 minutes per day.');
      this.addBulletPoint('Ensure adequate sleep of 7-8 hours per night.');
      this.addBulletPoint('Practice stress management techniques such as meditation.');
    }
    
    if (reportType === 'finance' || reportType === 'comprehensive') {
      this.addSection({
        title: 'Financial Analysis',
        content: [
          {
            type: 'paragraph',
            value: 'Based on your financial data, we have analyzed your current financial status and identified opportunities for improvement.'
          },
          {
            type: 'heading2',
            value: 'Recent Transactions'
          }
        ]
      });
      
      // Add payment transactions if available
      if (data.transactions && data.transactions.length > 0) {
        data.transactions.forEach((transaction: any) => {
          this.addBulletPoint(`${new Date(transaction.timestamp).toLocaleDateString()}: $${transaction.amount} - ${transaction.purpose} (${transaction.method})`);
        });
      } else {
        this.addText('No recent transaction data available.');
      }
      
      this.addSubheading('Recommendations');
      this.addBulletPoint('Create a budget and track your expenses regularly.');
      this.addBulletPoint('Build an emergency fund covering 3-6 months of expenses.');
      this.addBulletPoint('Pay off high-interest debt as quickly as possible.');
      this.addBulletPoint('Invest in a diversified portfolio aligned with your risk tolerance.');
    }
    
    // Add conclusion
    this.addSection({
      title: 'Conclusion',
      content: 'This report provides a snapshot of your current status and recommendations for improvement. Remember that progress takes time and consistent effort. Regularly review your goals and adjust your strategies as needed.'
    });
    
    // Add footer
    this.addFooter();
    
    // Return the generated PDF as a blob
    return this.doc.output('blob');
  }

  saveAs(filename: string): void {
    this.doc.save(filename);
  }

  blobOutput(): Blob {
    return this.doc.output('blob');
  }
}

export const generatePDFReport = async (
  data: any,
  reportType: 'education' | 'health' | 'finance' | 'comprehensive',
  userName: string,
  options: Partial<ReportOptions> = {}
): Promise<{ url: string, blob: Blob }> => {
  const reportGenerator = new PDFReportGenerator({
    userName,
    includeTimestamp: true,
    includeLogo: true,
    includePageNumbers: true,
    ...options
  });
  
  const pdfBlob = await reportGenerator.generateReport(data, reportType);
  const url = URL.createObjectURL(pdfBlob);
  
  return { url, blob: pdfBlob };
};

export const downloadPDFReport = async (
  data: any,
  reportType: 'education' | 'health' | 'finance' | 'comprehensive',
  userName: string,
  options: Partial<ReportOptions> = {}
): Promise<void> => {
  const { blob } = await generatePDFReport(data, reportType, userName, options);
  const filename = `nexacore_${reportType}_report_${Date.now()}.pdf`;
  saveAs(blob, filename);
};
