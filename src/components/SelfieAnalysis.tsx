
import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Upload, RefreshCw, X, Info, 
  Brain, Activity, ArrowRight, HelpCircle,
  AlertCircle, CheckCircle, Clock 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { detectFaces, loadFaceApiModels, processExpressionsToWellnessMetrics, ExpressionMap } from '@/lib/faceApiModelLoader';
import { WellnessMetric, wellnessMetricsInsights, getMetricCategory, formatMetricName, getMetricColor, getProgressColor } from '@/lib/wellnessInsightsGenerator';

interface SelfieAnalysisProps {
  onAnalysisComplete?: (results: any) => void;
}

const SelfieAnalysis: React.FC<SelfieAnalysisProps> = ({ onAnalysisComplete }) => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [captureMode, setCaptureMode] = useState<'camera' | 'upload' | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<Record<string, number> | null>(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<WellnessMetric | null>(null);
  const [hasLoadedModels, setHasLoadedModels] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Preparing face analysis models...");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stream = useRef<MediaStream | null>(null);

  // Initialize face-api models
  useEffect(() => {
    const initModels = async () => {
      try {
        setLoadingMessage("Loading face analysis models...");
        await loadFaceApiModels();
        setIsModelsLoaded(true);
        setHasLoadedModels(true);
        console.log("Face API models loaded successfully");
      } catch (error) {
        console.error("Error loading face-api models:", error);
        toast({
          title: "Model Loading Error",
          description: "Could not load facial analysis models. Please try again later.",
          variant: "destructive",
        });
      }
    };

    if (!hasLoadedModels) {
      initModels();
    }

    return () => {
      stopCamera();
    };
  }, [toast, hasLoadedModels]);

  // Start camera when capture mode is set to camera
  useEffect(() => {
    if (captureMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  }, [captureMode]);

  // Notify parent component when analysis is complete
  useEffect(() => {
    if (analysisResults && onAnalysisComplete) {
      onAnalysisComplete(analysisResults);
    }
  }, [analysisResults, onAnalysisComplete]);

  const startCamera = async () => {
    try {
      if (videoRef.current) {
        stream.current = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user" 
          } 
        });
        
        videoRef.current.srcObject = stream.current;
      }
    } catch (error: any) {
      console.error("Error accessing webcam:", error);
      toast({
        title: "Camera Access Error",
        description: error.message || "Could not access your camera. Please check permissions.",
        variant: "destructive",
      });
      setCaptureMode(null);
    }
  };

  const stopCamera = () => {
    if (stream.current) {
      stream.current.getTracks().forEach(track => track.stop());
      stream.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleCaptureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setCaptureMode(null);
    setAnalysisResults(null);
  };

  const analyzeImage = async () => {
    if (!capturedImage || !isModelsLoaded) return;
    
    setIsAnalyzing(true);
    setLoadingMessage("Analyzing your facial expressions...");
    
    try {
      // Create an image element from the captured image
      const img = new Image();
      img.src = capturedImage;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      // Detect faces in the image
      const detections = await detectFaces(img);
      
      if (detections.length === 0) {
        toast({
          title: "No face detected",
          description: "Please try again with a clearer image of your face.",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }
      
      // Process the first face detected
      setLoadingMessage("Processing wellness metrics...");
      const faceExpressions = detections[0].expressions as ExpressionMap;
      const wellnessMetrics = processExpressionsToWellnessMetrics(faceExpressions);
      
      // Add a slight delay to make the analysis feel more substantial
      setTimeout(() => {
        setAnalysisResults(wellnessMetrics);
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis Complete",
          description: "Your selfie has been analyzed successfully!",
        });
      }, 1500);
      
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis Error",
        description: "An error occurred while analyzing your selfie. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  const renderMetricDetails = (metric: WellnessMetric) => {
    if (!analysisResults) return null;
    
    const score = analysisResults[metric];
    const insights = wellnessMetricsInsights[metric];
    
    return (
      <div className="space-y-4">
        <p className="text-white/80">{insights.description}</p>
        
        <div className="bg-white/10 p-4 rounded-md">
          <h4 className="font-semibold text-white mb-2">Your Result</h4>
          <div className="flex items-center mb-4">
            <div className="w-full bg-white/20 rounded-full h-4 mr-3">
              <div 
                className={`h-4 rounded-full ${getProgressColor(metric, score)}`} 
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <span className={`text-lg font-semibold ${getMetricColor(score)}`}>{Math.round(score)}%</span>
          </div>
          <p className="text-white/90">{insights.interpretation(score)}</p>
        </div>
        
        <div className="bg-white/10 p-4 rounded-md">
          <h4 className="font-semibold text-white mb-2">Recommendations</h4>
          <ul className="list-disc list-inside space-y-2 text-white/90">
            {insights.recommendations(score).map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="bg-gradient-to-r from-purple-600 to-cyan-500 border-0 shadow-lg overflow-hidden">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Wellness Selfie Analysis</CardTitle>
          <CardDescription className="text-white/80">
            Analyze your facial expressions to gain insights about your wellbeing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analysisResults ? (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <div className="relative aspect-square rounded-md overflow-hidden mb-4">
                      <img 
                        src={capturedImage!} 
                        alt="Your selfie" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full text-white border-white/20 hover:bg-white/10 hover:text-white"
                      onClick={resetCapture}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Take Another Selfie
                    </Button>
                  </div>
                </div>
                
                <div className="lg:w-2/3">
                  <Tabs defaultValue="wellness" className="w-full">
                    <TabsList className="grid grid-cols-2 bg-white/10 mb-6">
                      <TabsTrigger 
                        value="wellness" 
                        className="data-[state=active]:bg-white/20 text-white"
                      >
                        <Activity className="mr-2 h-4 w-4" />
                        Wellness Metrics
                      </TabsTrigger>
                      <TabsTrigger 
                        value="mental" 
                        className="data-[state=active]:bg-white/20 text-white"
                      >
                        <Brain className="mr-2 h-4 w-4" />
                        Mental State
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="wellness" className="mt-0">
                      <div className="space-y-4">
                        {Object.keys(analysisResults)
                          .filter(metric => getMetricCategory(metric as WellnessMetric) === 'wellness')
                          .map(metric => (
                            <div key={metric} className="bg-white/10 p-3 rounded-md">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <span className="text-white font-medium">{formatMetricName(metric)}</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm" className="p-0 h-auto ml-1">
                                          <HelpCircle className="h-4 w-4 text-white/70" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{wellnessMetricsInsights[metric as WellnessMetric].description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-white/70 hover:text-white p-0 h-auto"
                                  onClick={() => setSelectedMetric(metric as WellnessMetric)}
                                >
                                  <Info className="h-4 w-4 mr-1" />
                                  Details
                                </Button>
                              </div>
                              <div className="flex items-center">
                                <div className="w-full bg-white/20 rounded-full h-2.5 mr-3">
                                  <div 
                                    className={`h-2.5 rounded-full ${getProgressColor(metric, analysisResults[metric])}`} 
                                    style={{ width: `${analysisResults[metric]}%` }}
                                  ></div>
                                </div>
                                <span className={`text-sm font-semibold ${getMetricColor(analysisResults[metric])}`}>
                                  {Math.round(analysisResults[metric])}%
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="mental" className="mt-0">
                      <div className="space-y-4">
                        {Object.keys(analysisResults)
                          .filter(metric => getMetricCategory(metric as WellnessMetric) === 'mental')
                          .map(metric => (
                            <div key={metric} className="bg-white/10 p-3 rounded-md">
                              <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                  <span className="text-white font-medium">{formatMetricName(metric)}</span>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="sm" className="p-0 h-auto ml-1">
                                          <HelpCircle className="h-4 w-4 text-white/70" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{wellnessMetricsInsights[metric as WellnessMetric].description}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-white/70 hover:text-white p-0 h-auto"
                                  onClick={() => setSelectedMetric(metric as WellnessMetric)}
                                >
                                  <Info className="h-4 w-4 mr-1" />
                                  Details
                                </Button>
                              </div>
                              <div className="flex items-center">
                                <div className="w-full bg-white/20 rounded-full h-2.5 mr-3">
                                  <div 
                                    className={`h-2.5 rounded-full ${getProgressColor(metric, analysisResults[metric])}`} 
                                    style={{ width: `${analysisResults[metric]}%` }}
                                  ></div>
                                </div>
                                <span className={`text-sm font-semibold ${getMetricColor(analysisResults[metric])}`}>
                                  {Math.round(analysisResults[metric])}%
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          ) : (
            <motion.div 
              className="bg-white/10 rounded-lg p-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                  <p className="text-white text-lg font-medium">{loadingMessage}</p>
                  <p className="text-white/70 mt-2">Please wait while we process your image</p>
                </div>
              ) : capturedImage ? (
                <div className="space-y-4">
                  <div className="relative w-48 h-48 mx-auto">
                    <img 
                      src={capturedImage} 
                      alt="Captured selfie" 
                      className="w-full h-full object-cover rounded-md" 
                    />
                    <button 
                      className="absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/70"
                      onClick={resetCapture}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <Button 
                    onClick={analyzeImage}
                    className="bg-white text-purple-600 hover:bg-white/90"
                    disabled={!isModelsLoaded}
                  >
                    <Brain className="mr-2 h-5 w-5" />
                    Analyze Selfie
                  </Button>
                  <p className="text-white/70 text-sm">
                    Click to analyze your facial expressions and get wellness insights
                  </p>
                </div>
              ) : (
                <div className="space-y-6 py-4">
                  <h3 className="text-white text-xl font-semibold">
                    Take or upload a selfie to begin analysis
                  </h3>
                  <p className="text-white/70">
                    Our AI will analyze your facial expressions to provide wellness insights
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
                    <Button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-white text-purple-600 hover:bg-white/90"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Take Selfie
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleUploadClick}
                      className="border-white text-white hover:bg-white/10"
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      Upload Photo
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="border-t border-white/10 bg-white/5">
          <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center text-white/70 text-sm">
            <div className="flex items-center mb-2 md:mb-0">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>Analysis is for informational purposes only and not a medical diagnosis</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Your privacy is protected - images are processed locally</span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Selfie capture modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Take a Selfie</DialogTitle>
            <DialogDescription>
              Position your face clearly in the frame and ensure good lighting
            </DialogDescription>
          </DialogHeader>
          
          <div className="relative aspect-video bg-black rounded-md overflow-hidden">
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              className="w-full h-full object-cover mirror-mode"
              style={{ transform: 'scaleX(-1)' }} 
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {!captureMode && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-4">
                <Button onClick={() => setCaptureMode('camera')} className="bg-white text-purple-600 hover:bg-white/90">
                  <Camera className="mr-2 h-5 w-5" />
                  Start Camera
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-row justify-between gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleCaptureImage} 
              disabled={captureMode !== 'camera'}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Capture
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Metric details dialog */}
      <Dialog open={selectedMetric !== null} onOpenChange={(open) => !open && setSelectedMetric(null)}>
        {selectedMetric && (
          <DialogContent className="sm:max-w-md bg-gradient-to-r from-purple-800 to-blue-800 text-white border-0">
            <DialogHeader>
              <DialogTitle>{formatMetricName(selectedMetric)}</DialogTitle>
            </DialogHeader>
            
            {renderMetricDetails(selectedMetric)}
            
            <DialogFooter>
              <Button 
                onClick={() => setSelectedMetric(null)}
                className="bg-white text-purple-700 hover:bg-white/90"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default SelfieAnalysis;
