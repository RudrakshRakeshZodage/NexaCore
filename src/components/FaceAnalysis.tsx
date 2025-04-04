
import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { loadFaceApiModels } from '@/lib/faceApiModelLoader';

// Define proper types for expressions
type Expression = "neutral" | "happy" | "sad" | "angry" | "fearful" | "disgusted" | "surprised";
type ExpressionResult = { expression: Expression; probability: number };

interface ExpressionState {
  dominantExpression: string;
  expressions: Record<string, number>;
}

interface FaceAnalysisProps {
  onAnalysisComplete?: (results: ExpressionState) => void;
}

const FaceAnalysis: React.FC<FaceAnalysisProps> = ({ onAnalysisComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVideoRunning, setIsVideoRunning] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [expressionResults, setExpressionResults] = useState<ExpressionState>({
    dominantExpression: '',
    expressions: {}
  });
  const { toast } = useToast();

  useEffect(() => {
    if (expressionResults.dominantExpression && onAnalysisComplete) {
      onAnalysisComplete(expressionResults);
    }
  }, [expressionResults, onAnalysisComplete]);

  useEffect(() => {
    const initializeModels = async () => {
      try {
        // Load the face-api models using our utility
        await loadFaceApiModels();
        setIsModelLoaded(true);
        console.log("Face API models loaded successfully");
      } catch (error) {
        console.error("Error loading face-api models:", error);
        toast({
          title: "Error loading models",
          description: "Could not load the face analysis models. Please try again later.",
          variant: "destructive",
        });
      }
    };

    initializeModels();

    // Clean up video on component unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [toast]);

  const startVideo = async () => {
    if (!isModelLoaded) {
      toast({
        title: "Models not loaded",
        description: "Please wait for the face analysis models to load.",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user" 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsVideoRunning(true);
        
        // Start face detection once video is playing
        videoRef.current.onplay = async () => {
          await detectFace();
        };

        // Explicitly call detectFace to ensure it starts
        await detectFace();
      }
    } catch (error: any) {
      console.error("Error accessing webcam:", error);
      toast({
        title: "Webcam access denied",
        description: "Please allow access to your camera to use the face analysis feature.",
        variant: "destructive",
      });
    }
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsVideoRunning(false);
    }
  };

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current || !isVideoRunning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    // Start continuous detection
    const interval = setInterval(async () => {
      if (!isVideoRunning) {
        clearInterval(interval);
        return;
      }

      try {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        // Clear the canvas and draw new detections
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Resize detections to match display size
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        // Draw boxes and landmarks
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        // Update expression results for the first face detected
        if (resizedDetections.length > 0) {
          const expressions = resizedDetections[0].expressions;
          
          // Extract and sort expression results
          const expressionArray: ExpressionResult[] = [
            { expression: 'neutral', probability: expressions.neutral },
            { expression: 'happy', probability: expressions.happy },
            { expression: 'sad', probability: expressions.sad },
            { expression: 'angry', probability: expressions.angry },
            { expression: 'fearful', probability: expressions.fearful },
            { expression: 'disgusted', probability: expressions.disgusted },
            { expression: 'surprised', probability: expressions.surprised }
          ];
          
          // Find dominant expression
          let maxProbability = 0;
          let dominantExpression = '';
          
          for (const item of expressionArray) {
            if (item.probability > maxProbability) {
              maxProbability = item.probability;
              dominantExpression = item.expression;
            }
          }
          
          // Update state with expression results
          setExpressionResults({
            dominantExpression,
            expressions: expressions as unknown as Record<string, number>
          });
        }
      } catch (error) {
        console.error("Error during face detection:", error);
      }
    }, 10); // Check every 100ms

    return () => {
      clearInterval(interval);
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    };

    return () => clearInterval(interval);
  };

  return (
    <Card className="w-full bg-nexacore-blue-dark/50 border-white/10">
      <CardHeader className="pb-4">
        <CardTitle className="text-white">Face Analysis</CardTitle>
        <CardDescription className="text-white/70">
          Analyze facial expressions in real-time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video bg-black/50 rounded-md overflow-hidden">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onLoadedMetadata={() => {
              if (videoRef.current) {
                videoRef.current.play();
              }
            }}
          />
          <canvas 
            ref={canvasRef}
            className="absolute inset-0 z-10"
          />
          
          {!isVideoRunning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white z-20">
              <p className="mb-4">Click Start to enable camera</p>
              {!isModelLoaded && (
                <p className="text-nexacore-teal animate-pulse">Loading models...</p>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {expressionResults.dominantExpression && (
            <div className="col-span-2 bg-nexacore-teal/20 p-3 rounded-md">
              <p className="text-white text-center">
                Dominant Expression: <span className="font-bold text-nexacore-teal">{expressionResults.dominantExpression}</span>
              </p>
            </div>
          )}
          
          {Object.entries(expressionResults.expressions).length > 0 && (
            <div className="col-span-2 bg-white/5 p-3 rounded-md mt-2">
              <p className="text-white text-sm mb-2">All Expressions:</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(expressionResults.expressions).map(([expression, value]) => (
                  <div key={expression} className="flex justify-between">
                    <span className="text-white/80 capitalize">{expression}:</span>
                    <span className="text-nexacore-teal">{(value * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4">
        {!isVideoRunning ? (
          <Button 
            onClick={startVideo}
            className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
            disabled={!isModelLoaded}
          >
            Start Analysis
          </Button>
        ) : (
          <Button 
            onClick={stopVideo}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Stop Analysis
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FaceAnalysis;
