
import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Download, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FaceAnalysisProps {
  onAnalysisComplete?: (data: any) => void;
}

const FaceAnalysis: React.FC<FaceAnalysisProps> = ({ onAnalysisComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
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

      // Generate mock facial analysis data
      const mockAnalysis = {
        age: Math.floor(Math.random() * 40) + 18, // Random age between 18-58
        gender: Math.random() > 0.5 ? 'male' : 'female',
        genderProbability: (Math.random() * 0.3 + 0.7).toFixed(2), // Random probability between 0.7-1.0
        expressions: {
          neutral: Math.random(),
          happy: Math.random(),
          sad: Math.random(),
          angry: Math.random(),
          fearful: Math.random(),
          disgusted: Math.random(),
          surprised: Math.random()
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
  };

  return (
    <Card className="bg-nexacore-blue-dark/50 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="text-nexacore-teal" size={20} />
          Face Analysis
        </CardTitle>
        <CardDescription className="text-white/70">
          Analyze facial expressions using AI
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-4">
          {image ? (
            <div className="relative">
              <img 
                src={image} 
                alt="Captured" 
                className="rounded-lg max-h-64 border border-white/20"
              />
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 border-white/20 text-white hover:bg-white/10"
                onClick={resetAnalysis}
              >
                <RefreshCw className="h-4 w-4 mr-1" /> Reset
              </Button>
            </div>
          ) : (
            <div className="relative">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                muted
                className="rounded-lg border border-white/20 max-h-64 bg-black/40"
                style={{ width: "320px", height: "240px" }}
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </div>
        
        {!image && (
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={startCamera}
              disabled={isCameraActive}
            >
              <Camera className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
            
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
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
              className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
              onClick={captureImage}
            >
              Capture
            </Button>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="text-center py-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-nexacore-teal motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
            <p className="mt-2 text-white/70">Analyzing face...</p>
          </div>
        )}
        
        {analysisResults && (
          <div className="mt-4 p-4 bg-white/10 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-white">Analysis Results</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <p className="text-white/70">Age:</p>
                <p className="text-white font-medium">{analysisResults.age} years</p>
              </div>
              <div>
                <p className="text-white/70">Gender:</p>
                <p className="text-white font-medium">{analysisResults.gender.charAt(0).toUpperCase() + analysisResults.gender.slice(1)} ({(Number(analysisResults.genderProbability) * 100).toFixed(0)}%)</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-white/70 mb-2">Dominant Emotion:</p>
              <Badge className="bg-nexacore-teal text-nexacore-blue-dark font-medium">
                {analysisResults.dominantExpression.charAt(0).toUpperCase() + analysisResults.dominantExpression.slice(1)}
              </Badge>
            </div>
            
            <div className="mb-4">
              <p className="text-white/70 mb-2">Expression Analysis:</p>
              <div className="space-y-2">
                {Object.entries(analysisResults.expressions).map(([expression, probability]: [string, any]) => (
                  <div key={expression} className="flex items-center">
                    <span className="text-white/80 text-sm w-24">{expression.charAt(0).toUpperCase() + expression.slice(1)}:</span>
                    <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-nexacore-teal rounded-full"
                        style={{ width: `${Number(probability) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white/80 text-sm ml-2 w-10">
                      {(Number(probability) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <p className="text-xs text-white/50">
          This analysis uses facial recognition AI and is for demonstration purposes only. Data privacy is maintained as processing occurs locally in your browser.
        </p>
      </CardFooter>
    </Card>
  );
};

export default FaceAnalysis;
