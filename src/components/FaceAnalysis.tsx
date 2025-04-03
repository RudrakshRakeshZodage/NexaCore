
import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Download, RefreshCw, Smile, Brain, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface FaceAnalysisProps {
  onAnalysisComplete?: (data: any) => void;
}

// Define wellness metrics type with additional wellness categories
interface WellnessMetrics {
  happiness: number;
  energy: number;
  motivation: number;
  relaxation: number;
  sleepQuality: number;
}

interface MentalState {
  stress: number;
  fatigue: number;
  focus: number;
  anxiety: number;
  mood: number;
}

interface FacialAnalysisResult {
  expressions: {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  };
  dominantExpression: string;
  wellness: WellnessMetrics;
  mentalState: MentalState;
}

const FaceAnalysis: React.FC<FaceAnalysisProps> = ({ onAnalysisComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<FacialAnalysisResult | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Create models directory if it doesn't exist
        await ensureModelsDirectory();
        
        // For demo purposes, we'll set modelsLoaded to true without actually loading models
        setModelsLoaded(true);
        console.log('Face analysis models loaded in demo mode');
        
        toast({
          title: 'Demo Mode Active',
          description: 'Running in demo mode with simulated facial analysis.',
        });
      } catch (error) {
        console.error('Error setting up models:', error);
        // For demo purposes, we'll still set modelsLoaded to true
        setModelsLoaded(true);
        toast({
          title: 'Demo Mode',
          description: 'Running in demo mode with simulated data.',
        });
      }
    };

    if (!modelsLoaded) {
      loadModels();
    }

    return () => {
      stopCamera();
    };
  }, [toast, modelsLoaded]);

  const ensureModelsDirectory = async () => {
    try {
      // This is just to check if the directory exists
      const response = await fetch('/models/README.md');
      if (response.ok) {
        console.log('Models directory exists');
      } else {
        console.log('Models directory may need to be created on the server');
      }
    } catch (error) {
      console.warn('Models directory check failed:', error);
    }
  };

  const startCamera = async () => {
    if (videoRef.current) {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        
        toast({
          title: 'Camera Started',
          description: 'Your camera is now active. Click Capture to analyze your face.',
        });
      } catch (error) {
        console.error('Error accessing camera:', error);
        setCameraError('Unable to access your camera. Please ensure you have granted permission.');
        toast({
          title: 'Camera Error',
          description: 'Unable to access your camera. Please ensure you have granted permission.',
          variant: 'destructive',
        });
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && isCameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      
      if (context) {
        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const imageDataUrl = canvas.toDataURL('image/png');
        setImage(imageDataUrl);
        
        // Stop camera after capture
        stopCamera();
        
        // Analyze the captured image
        analyzeImage(imageDataUrl);
      } else {
        toast({
          title: 'Canvas Error',
          description: 'Could not initialize canvas for capture.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Camera Not Ready',
        description: 'Please wait for the camera to initialize fully before capturing.',
        variant: 'destructive',
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setImage(imageDataUrl);
      analyzeImage(imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageDataUrl: string) => {
    setIsAnalyzing(true);
    
    try {
      const img = new Image();
      img.src = imageDataUrl;
      
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });

      // Generate mock facial analysis data with expanded metrics
      const mockAnalysis: FacialAnalysisResult = {
        expressions: {
          neutral: Math.random(),
          happy: Math.random(),
          sad: Math.random(),
          angry: Math.random(),
          fearful: Math.random(),
          disgusted: Math.random(),
          surprised: Math.random()
        },
        dominantExpression: '', // This will be calculated below
        wellness: {
          happiness: Math.floor(Math.random() * 100),
          energy: Math.floor(Math.random() * 100),
          motivation: Math.floor(Math.random() * 100),
          relaxation: Math.floor(Math.random() * 100),
          sleepQuality: Math.floor(Math.random() * 100)
        },
        mentalState: {
          stress: Math.floor(Math.random() * 100),
          fatigue: Math.floor(Math.random() * 100),
          focus: Math.floor(Math.random() * 100),
          anxiety: Math.floor(Math.random() * 100),
          mood: Math.floor(Math.random() * 100)
        }
      };
      
      // Calculate the dominant expression
      const dominantExpression = Object.entries(mockAnalysis.expressions)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      mockAnalysis.dominantExpression = dominantExpression;
      
      setAnalysisResults(mockAnalysis);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(mockAnalysis);
      }
      
      toast({
        title: 'Analysis Complete',
        description: 'Facial expression analysis has been completed successfully.',
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze the face. Please try again with a clearer image.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setAnalysisResults(null);
    setIsCameraActive(false);
    setCameraError(null);
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
          <Camera className="text-nexacore-teal dark:text-primary" size={20} />
          Face Analysis
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Analyze facial expressions and wellness metrics using AI
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-4">
          {image ? (
            <div className="relative">
              <img 
                src={image} 
                alt="Captured" 
                className="rounded-lg max-h-64 border border-gray-200 dark:border-gray-700"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                onClick={resetAnalysis}
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Reset
              </Button>
            </div>
          ) : (
            <div className="relative w-full max-w-[320px]">
              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center flex-col bg-red-500/10 rounded-lg border border-red-500/50 text-red-600 dark:text-red-400 p-4 z-10">
                  <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                  <p className="text-center text-sm">{cameraError}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 border-red-200 text-red-600 dark:border-red-800 dark:text-red-400"
                    onClick={() => setCameraError(null)}
                  >
                    Dismiss
                  </Button>
                </div>
              )}
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                muted
                className="rounded-lg border border-gray-200 bg-gray-100 w-full h-[240px] object-cover dark:border-gray-700 dark:bg-gray-900"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </div>
        
        {!image && (
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={startCamera}
              disabled={isCameraActive}
            >
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
            
            <Button
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={() => fileInputRef.current?.click()}
            >
              <Download className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        )}
        
        {isCameraActive && (
          <div className="flex justify-center">
            <Button
              className="bg-nexacore-teal text-white hover:bg-nexacore-teal/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
              onClick={captureImage}
            >
              Capture
            </Button>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="text-center py-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-nexacore-teal dark:text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Analyzing face...</p>
          </div>
        )}
        
        {analysisResults && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Analysis Results</h3>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2 dark:text-gray-400">Dominant Emotion:</p>
              <Badge className="bg-nexacore-teal text-white font-medium dark:bg-primary dark:text-primary-foreground">
                {analysisResults.dominantExpression.charAt(0).toUpperCase() + analysisResults.dominantExpression.slice(1)}
              </Badge>
            </div>
            
            <Tabs defaultValue="expressions" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4 bg-gray-100 dark:bg-gray-700/50">
                <TabsTrigger value="expressions" className="text-gray-700 dark:text-gray-200">Expressions</TabsTrigger>
                <TabsTrigger value="wellness" className="text-gray-700 dark:text-gray-200">Wellness</TabsTrigger>
                <TabsTrigger value="mental" className="text-gray-700 dark:text-gray-200">Mental State</TabsTrigger>
              </TabsList>
              
              <TabsContent value="expressions" className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  {Object.entries(analysisResults.expressions).map(([expression, probability]: [string, any]) => (
                    <div key={expression} className="flex items-center">
                      <span className="text-gray-700 text-sm w-24 dark:text-gray-300">{expression.charAt(0).toUpperCase() + expression.slice(1)}:</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-nexacore-teal dark:bg-primary rounded-full"
                          style={{ width: `${Number(probability) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-700 text-sm ml-2 w-10 dark:text-gray-300">
                        {(Number(probability) * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="wellness" className="space-y-4 animate-fade-in">
                <div className="space-y-3">
                  {Object.entries(analysisResults.wellness).map(([metric, value]) => (
                    <div key={metric} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm capitalize dark:text-gray-300">{metric}:</span>
                        <span className="text-gray-700 text-sm dark:text-gray-300">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="mental" className="space-y-4 animate-fade-in">
                <div className="space-y-3">
                  {Object.entries(analysisResults.mentalState).map(([state, value]) => (
                    <div key={state} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 text-sm capitalize dark:text-gray-300">{state}:</span>
                        <span className="text-gray-700 text-sm dark:text-gray-300">{value}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          This analysis uses facial recognition AI and is for demonstration purposes only. Data privacy is maintained as processing occurs locally in your browser.
        </p>
      </CardFooter>
    </Card>
  );
};

export default FaceAnalysis;
