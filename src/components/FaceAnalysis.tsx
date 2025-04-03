
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, Smile } from "lucide-react";
import * as faceapi from '@vladmandic/face-api';

interface FaceAnalysisProps {
  onAnalysisComplete?: (results: any) => void;
}

const FaceAnalysis = ({ onAnalysisComplete }: FaceAnalysisProps) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [expressionResults, setExpressionResults] = useState<{
    dominantExpression: string;
    expressions: Record<string, number>;
  } | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      try {
        // Adjust this path based on where your models are stored
        const modelPath = '/models';
        
        // Load required models
        await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
        await faceapi.nets.faceExpressionNet.loadFromUri(modelPath);
        
        setIsModelLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading models:', error);
        toast({
          title: "Model Loading Error",
          description: "Failed to load facial analysis models",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    loadModels();
  }, [toast]);

  // Handle camera start/stop
  const handleCameraToggle = () => {
    if (cameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Start camera
  const startCamera = async () => {
    if (!isModelLoaded) {
      toast({
        title: "Models Not Loaded",
        description: "Please wait for the facial analysis models to load",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      
      setCameraActive(false);
      
      // Clear canvas
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    }
  };

  // Analyze facial expressions
  const analyzeExpressions = async () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) {
      toast({
        title: "Camera Not Active",
        description: "Please start the camera before analyzing",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Detect faces and expressions
      const detections = await faceapi.detectAllFaces(
        video, 
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceExpressions();
      
      // Draw detections on canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Mirror the canvas to match selfie view
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        // Draw the video frame
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Restore transformation
        context.setTransform(1, 0, 0, 1, 0, 0);
        
        // Draw detections
        faceapi.draw.drawDetections(canvas, detections);
        faceapi.draw.drawFaceExpressions(canvas, detections);
      }
      
      // Process results
      if (detections.length > 0) {
        const { expressions } = detections[0];
        
        // Find the dominant expression
        let maxExpression = 'neutral';
        let maxValue = 0;
        
        Object.entries(expressions).forEach(([expression, value]) => {
          if (value > maxValue) {
            maxExpression = expression;
            maxValue = value;
          }
        });
        
        // Format the results
        const results = {
          dominantExpression: maxExpression,
          expressions: expressions,
        };
        
        setExpressionResults(results);
        
        // Call the callback if provided
        if (onAnalysisComplete) {
          onAnalysisComplete(results);
        }
        
        toast({
          title: "Analysis Complete",
          description: `Your dominant expression is ${maxExpression}`,
        });
      } else {
        toast({
          title: "No Face Detected",
          description: "Please ensure your face is clearly visible to the camera",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error analyzing face:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze facial expressions",
        variant: "destructive",
      });
    }
    
    setIsAnalyzing(false);
  };

  // Format expression percentage
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <Card className="bg-nexacore-blue-dark/50 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Emotion Analysis</CardTitle>
        <CardDescription className="text-white/70">
          Analyze your facial expressions to detect emotions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-nexacore-teal mb-4" />
            <p className="text-white/70">Loading facial analysis models...</p>
          </div>
        ) : (
          <>
            <div className="relative w-full aspect-video bg-black/30 rounded-lg overflow-hidden flex items-center justify-center">
              <video 
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" 
                autoPlay 
                muted 
                playsInline
              />
              <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full"
              />
              
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                  <Camera className="h-12 w-12 text-nexacore-teal mb-4" />
                  <p className="text-white">Start the camera to begin emotion analysis</p>
                </div>
              )}
              
              {isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <Loader2 className="h-12 w-12 animate-spin text-nexacore-teal" />
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant={cameraActive ? "destructive" : "default"}
                className={!cameraActive ? "bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90" : ""}
                onClick={handleCameraToggle}
                disabled={isAnalyzing}
              >
                <Camera className="mr-2 h-4 w-4" />
                {cameraActive ? "Stop Camera" : "Start Camera"}
              </Button>
              
              <Button
                className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                onClick={analyzeExpressions}
                disabled={!cameraActive || isAnalyzing}
              >
                {isAnalyzing ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                ) : (
                  <><Smile className="mr-2 h-4 w-4" /> Analyze Emotions</>
                )}
              </Button>
            </div>
            
            {expressionResults && (
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="text-white font-medium text-lg mb-2 flex items-center">
                  <Smile className="mr-2 h-5 w-5 text-nexacore-teal" />
                  Emotion Analysis Results
                </h3>
                <p className="text-white mb-3">
                  Dominant emotion: <span className="font-bold text-nexacore-teal">{expressionResults.dominantExpression}</span>
                </p>
                <div className="space-y-2">
                  {Object.entries(expressionResults.expressions).map(([expression, value]) => (
                    <div key={expression} className="flex items-center justify-between">
                      <span className="text-white/80 capitalize">{expression}</span>
                      <div className="flex items-center gap-2">
                        <div className="bg-white/10 h-2 w-24 rounded-full overflow-hidden">
                          <div 
                            className="bg-nexacore-teal h-full rounded-full" 
                            style={{ width: `${value * 100}%` }} 
                          />
                        </div>
                        <span className="text-white/80 text-sm">{formatPercentage(value)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-white/60 text-sm">
          Note: Your facial expression data is processed locally and not stored or sent to external servers.
        </p>
      </CardFooter>
    </Card>
  );
};

export default FaceAnalysis;
