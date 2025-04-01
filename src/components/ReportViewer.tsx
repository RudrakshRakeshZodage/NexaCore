
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportViewerProps {
  reportText: string;
  reportUrl: string;
  reportType: string;
  timestamp?: string;
  onClose?: () => void;
  className?: string;
}

const ReportViewer: React.FC<ReportViewerProps> = ({
  reportText,
  reportUrl,
  reportType,
  timestamp = new Date().toLocaleString(),
  onClose,
  className = ''
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = () => {
    setIsDownloading(true);
    
    // Simulate download delay
    setTimeout(() => {
      window.open(reportUrl, '_blank');
      setIsDownloading(false);
    }, 1000);
  };
  
  const formatReportText = (text: string) => {
    // Simple formatting - split by line breaks and render
    return text.split('\n').map((line, index) => {
      // Check if line is a heading (starts with #)
      if (line.startsWith('# ')) {
        return <h2 key={index} className="text-xl font-bold mt-4 text-nexacore-teal">{line.replace('# ', '')}</h2>;
      }
      
      // Check if line is a subheading (starts with ##)
      if (line.startsWith('## ')) {
        return <h3 key={index} className="text-lg font-semibold mt-3 text-white">{line.replace('## ', '')}</h3>;
      }
      
      // Check if line is a list item
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-4">{line.replace('- ', '')}</li>;
      }
      
      // Empty line as spacer
      if (line.trim() === '') {
        return <div key={index} className="h-2"></div>;
      }
      
      // Regular paragraph
      return <p key={index} className="my-1">{line}</p>;
    });
  };

  return (
    <Card className={`bg-nexacore-blue-dark/90 border-nexacore-teal/20 text-white ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 text-nexacore-teal" size={20} />
          {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
        </CardTitle>
        <CardDescription className="text-white/70">
          Generated on {timestamp}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="max-h-[60vh] overflow-y-auto">
        <div className="bg-white/5 p-4 rounded-lg">
          {formatReportText(reportText)}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {onClose && (
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
            onClick={onClose}
          >
            Close
          </Button>
        )}
        
        <Button 
          className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportViewer;
