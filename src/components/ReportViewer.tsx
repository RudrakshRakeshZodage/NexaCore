
import React, { useState, useEffect } from 'react';
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
  autoDownload?: boolean;
  faceAnalysis?: any;
}

const ReportViewer: React.FC<ReportViewerProps> = ({
  reportText,
  reportUrl,
  reportType,
  timestamp = new Date().toLocaleString(),
  onClose,
  className = '',
  autoDownload = false,
  faceAnalysis
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    if (autoDownload && reportUrl) {
      handleDownload();
    }
  }, [autoDownload, reportUrl]);
  
  const handleDownload = () => {
    setIsDownloading(true);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = reportUrl;
    link.download = `nexacore_${reportType}_report_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Simulate download delay for UI feedback
    setTimeout(() => {
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
    <Card className={`bg-nexacore-blue-dark/50 border-nexacore-teal/20 text-white ${className}`}>
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
          
          {/* Render Face Analysis Results if available */}
          {faceAnalysis && faceAnalysis.dominantExpression && (
            <div className="mt-6 mb-4">
              <h3 className="text-lg font-semibold mt-3 text-white">Face Analysis Results</h3>
              <div className="mt-2 p-3 bg-nexacore-teal/10 rounded-md">
                <p className="font-medium">Dominant Emotion: <span className="text-nexacore-teal">{faceAnalysis.dominantExpression}</span></p>
                
                {faceAnalysis.expressions && Object.keys(faceAnalysis.expressions).length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {Object.entries(faceAnalysis.expressions).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize text-white/80">{key}: </span>
                        <span className="text-nexacore-teal">{(value * 100).toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
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
