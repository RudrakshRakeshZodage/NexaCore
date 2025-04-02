
import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Download } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FaceAnalysisProps {
  onAnalysisComplete?: (data: any) => void;
}

const FaceAnalysis: React.FC<FaceAnalysisProps> = ({ onAnalysisComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        await faceapi.nets.faceExpressionNet.loadFromUri('/models');
        await faceapi.nets.ageGenderNet.loadFromUri('/models');
        setModelsLoaded(true);
        console.log('Face analysis models loaded');
        toast({
          title: 'Models Loaded',
          description: 'Face analysis models are ready to use.',
        });
      } catch (error) {
        console.error('Error loading models:', error);
        toast({
          title: 'Error',
          description: 'Failed to load face analysis models.',
          variant: 'destructive',
        });
      }
    };

    if (!modelsLoaded) {
      loadModels();
    }

    // Create models directory and download models if needed (this will happen on first load)
    const createModelsDirectory = async () => {
      try {
        // This is just a sample - in a real app, you would pre-bundle these models
        const response = await fetch('/models/tiny_face_detector_model-weights_manifest.json');
        if (response.status === 404) {
          toast({
            title: 'Downloading Models',
            description: 'First-time setup: downloading face analysis models.',
          });
        }
      } catch (error) {
        console.warn('Models directory may need to be created');
      }
    };

    createModelsDirectory();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [toast]);

  const startCamera = async () => {
    if (!modelsLoaded) {
      toast({
        title: 'Models Loading',
        description: 'Please wait for the face analysis models to load.',
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera Error',
        description: 'Unable to access your camera. Please ensure you have granted permission.',
        variant: 'destructive',
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageDataUrl = canvas.toDataURL('image/png');
        setImage(imageDataUrl);
        stopCamera();
        analyzeImage(imageDataUrl);
      }
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
    if (!modelsLoaded) {
      toast({
        title: 'Models Loading',
        description: 'Please wait for the face analysis models to load.',
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const img = new Image();
      img.src = imageDataUrl;
      
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }

      const detections = await faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

      if (detections.length === 0) {
        toast({
          title: 'No Face Detected',
          description: 'Please upload an image with a visible face.',
          variant: 'destructive',
        });
        setIsAnalyzing(false);
        return;
      }

      const analysis = {
        age: Math.round(detections[0].age),
        gender: detections[0].gender,
        genderProbability: detections[0].genderProbability.toFixed(2),
        expressions: detections[0].expressions,
        dominantExpression: Object.entries(detections[0].expressions)
          .reduce((a, b) => a[1] > b[1] ? a : b)[0]
      };

      setAnalysisResults(analysis);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(analysis);
      }
      
      toast({
        title: 'Analysis Complete',
        description: 'Your face has been successfully analyzed.',
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze the face. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="bg-nexacore-blue-dark/50 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="text-nexacore-teal" size={20} />
          Face Analysis
        </CardTitle>
        <CardDescription className="text-white/70">
          Analyze facial expressions, age, and emotions using AI
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
                onClick={() => {
                  setImage(null);
                  setAnalysisResults(null);
                }}
              >
                Reset
              </Button>
            </div>
          ) : (
            <div className="relative">
              <video 
                ref={videoRef}
                autoPlay 
                muted
                className="rounded-lg border border-white/20 max-h-64 bg-black/40"
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
        
        {videoRef.current?.srcObject && (
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
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-white/70">Age:</p>
                <p className="text-white font-medium">{analysisResults.age} years</p>
              </div>
              <div>
                <p className="text-white/70">Gender:</p>
                <p className="text-white font-medium">{analysisResults.gender} ({(Number(analysisResults.genderProbability) * 100).toFixed(0)}%)</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-white/70 mb-2">Emotional State:</p>
              <Badge className="bg-nexacore-teal text-nexacore-blue-dark font-medium">
                {analysisResults.dominantExpression.charAt(0).toUpperCase() + analysisResults.dominantExpression.slice(1)}
              </Badge>
            </div>
            
            <div className="mt-4">
              <p className="text-white/70 mb-2">Expression Analysis:</p>
              <div className="space-y-2">
                {Object.entries(analysisResults.expressions).map(([expression, probability]: [string, any]) => (
                  <div key={expression} className="flex items-center">
                    <span className="text-white/80 text-sm w-24">{expression.charAt(0).toUpperCase() + expression.slice(1)}:</span>
                    <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-nexacore-teal rounded-full"
                        style={{ width: `${probability * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-white/80 text-sm ml-2 w-10">
                      {(probability * 100).toFixed(0)}%
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
