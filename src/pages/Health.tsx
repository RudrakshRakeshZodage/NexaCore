import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, 
  Upload, 
  FileTextIcon, 
  Heart, 
  Activity, 
  Brain, 
  Zap, 
  Droplet, 
  Moon, 
  XIcon, 
  Coffee,
  Dumbbell,
  Apple,
  CheckCircle,
  Smile,
  Frown,
  Eye,
  Sun,
  Wind,
  Thermometer,
  Clock,
  AlertCircle,
  CloudSun
} from "lucide-react";

const Health = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // State for health inputs
  const [ageYears, setAgeYears] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [foodExpenses, setFoodExpenses] = useState("");
  const [medicationExpenses, setMedicationExpenses] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [sleepHours, setSleepHours] = useState<number[]>([7]);
  
  // State for facial analysis
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [analyzeDialogOpen, setAnalyzeDialogOpen] = useState(false);
  const [analyzingStatus, setAnalyzingStatus] = useState<'idle' | 'analyzing' | 'complete' | 'failed'>('idle');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  
  // Face analysis results
  const [faceAnalysis, setFaceAnalysis] = useState({
    stress: 35, // percentage
    fatigue: 42, // percentage
    bmi: 23.7, // value
    biologicalAge: 28, // years
    gender: "Male", // predicted gender
    mood: "Neutral", // emotional state
    skinHealth: 75, // percentage
    eyeHealth: 62, // percentage
    hydration: 68, // percentage
    muscleTone: 55, // percentage
    sleepQuality: 60, // percentage
    happiness: 65, // percentage
    sadness: 25, // percentage
    anxiety: 40, // percentage
    concentration: 70, // percentage
    energyLevel: 65, // percentage
    immuneHealth: 72, // percentage
    circulation: 80, // percentage
    nutrientDeficiency: 30, // percentage
    metabolicRate: 75, // percentage
    vitality: 68, // percentage
  });
  
  // AI recommendations
  const [recommendations, setRecommendations] = useState({
    nutrition: [
      "Increase protein intake by adding eggs, chicken, or tofu to meals",
      "Add more leafy greens and colorful vegetables to your diet",
      "Reduce processed sugar and refined carbohydrates",
      "Stay hydrated by drinking at least 8 glasses of water daily"
    ],
    exercise: [
      "Add 20-30 minutes of moderate cardio 3-4 times a week",
      "Include strength training exercises twice a week",
      "Consider yoga or stretching to reduce stress and improve flexibility",
      "Take short walking breaks during work hours"
    ],
    stressRelief: [
      "Practice mindfulness meditation for 10 minutes daily",
      "Try deep breathing exercises when feeling stressed",
      "Consider a digital detox in the evenings",
      "Spend time in nature when possible"
    ],
    sleep: [
      "Maintain a consistent sleep schedule",
      "Avoid screens at least 1 hour before bedtime",
      "Keep your bedroom cool and dark",
      "Limit caffeine intake after noon"
    ],
    lifestyle: [
      "Take short breaks every hour during work",
      "Practice good posture while sitting",
      "Consider using blue light filters on digital devices",
      "Schedule regular health check-ups"
    ]
  });
  
  // Clean up camera resources when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  // Start camera for taking photo
  const startCamera = async () => {
    try {
      setCameraActive(true);
      setCameraPermissionDenied(false);
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraPermissionDenied(true);
      setCameraActive(false);
      
      toast({
        title: "Camera Access Error",
        description: "Could not access your camera. Please check permissions and try again.",
        variant: "destructive",
      });
    }
  };
  
  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setCameraActive(false);
  };
  
  // Take photo from camera
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to image data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setSelfieImage(imageDataUrl);
        setSelfieUploaded(true);
        
        // Stop camera after taking photo
        stopCamera();
        
        toast({
          title: "Photo Captured",
          description: "Your selfie has been captured and is ready for analysis.",
        });
      }
    }
  };
  
  // Handle face analysis
  const handleFaceAnalysis = () => {
    if (!selfieImage) {
      toast({
        title: "No Image",
        description: "Please take or upload a photo first.",
        variant: "destructive",
      });
      return;
    }
    
    setAnalyzingStatus('analyzing');
    setAnalyzeDialogOpen(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5 + 1;
      
      if (progress >= 100) {
        clearInterval(interval);
        setAnalysisProgress(100);
        setAnalyzingStatus('complete');
        
        // Generate randomized facial analysis results based on image
        // In a real app, this would use face-api.js or a similar library
        setFaceAnalysis({
          stress: Math.floor(30 + Math.random() * 30),
          fatigue: Math.floor(35 + Math.random() * 35),
          bmi: +(22 + Math.random() * 3).toFixed(1),
          biologicalAge: Math.floor(25 + Math.random() * 8),
          gender: Math.random() > 0.5 ? "Male" : "Female",
          mood: ['Happy', 'Neutral', 'Focused', 'Tired', 'Calm'][Math.floor(Math.random() * 5)],
          skinHealth: Math.floor(60 + Math.random() * 30),
          eyeHealth: Math.floor(55 + Math.random() * 35),
          hydration: Math.floor(60 + Math.random() * 30),
          muscleTone: Math.floor(50 + Math.random() * 40),
          sleepQuality: Math.floor(40 + Math.random() * 45),
          happiness: Math.floor(50 + Math.random() * 40),
          sadness: Math.floor(10 + Math.random() * 40),
          anxiety: Math.floor(20 + Math.random() * 40),
          concentration: Math.floor(60 + Math.random() * 30),
          energyLevel: Math.floor(55 + Math.random() * 35),
          immuneHealth: Math.floor(65 + Math.random() * 25),
          circulation: Math.floor(70 + Math.random() * 20),
          nutrientDeficiency: Math.floor(20 + Math.random() * 40),
          metabolicRate: Math.floor(65 + Math.random() * 25),
          vitality: Math.floor(60 + Math.random() * 30),
        });
      } else {
        setAnalysisProgress(Math.min(progress, 99));
      }
    }, 200);
  };
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setSelfieImage(imageDataUrl);
        setSelfieUploaded(true);
        
        toast({
          title: "Image Uploaded",
          description: "Your selfie has been uploaded and is ready for analysis.",
        });
      };
      
      reader.onerror = () => {
        toast({
          title: "Upload Failed",
          description: "Failed to read the image file. Please try again.",
          variant: "destructive",
        });
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Generate AI recommendations based on health data and face analysis
  const generateRecommendations = () => {
    // In a real app, this would call an API with health data to generate recommendations
    toast({
      title: "Recommendations Updated",
      description: "AI has analyzed your health data and updated your recommendations.",
    });
    
    // Mock updated recommendations based on analysis
    setRecommendations({
      nutrition: [
        "Increase protein intake by adding eggs, chicken, or tofu to meals",
        "Add more leafy greens and colorful vegetables to your diet",
        "Reduce processed sugar and refined carbohydrates",
        `Stay hydrated by drinking at least 8 glasses of water daily (${faceAnalysis.hydration}% hydration detected)`
      ],
      exercise: [
        `Add ${faceAnalysis.energyLevel > 60 ? "30-45" : "20-30"} minutes of moderate cardio 3-4 times a week`,
        "Include strength training exercises twice a week",
        `Consider yoga or stretching to ${faceAnalysis.stress > 50 ? "reduce stress and" : ""} improve flexibility`,
        "Take short walking breaks during work hours"
      ],
      stressRelief: [
        `Practice mindfulness meditation for ${faceAnalysis.stress > 60 ? "15-20" : "10"} minutes daily`,
        "Try deep breathing exercises when feeling stressed",
        "Consider a digital detox in the evenings",
        "Spend time in nature when possible"
      ],
      sleep: [
        "Maintain a consistent sleep schedule",
        "Avoid screens at least 1 hour before bedtime",
        "Keep your bedroom cool and dark",
        `Limit caffeine intake ${faceAnalysis.sleepQuality < 50 ? "after noon" : "in the afternoon"}`
      ],
      lifestyle: [
        "Take short breaks every hour during work",
        "Practice good posture while sitting",
        "Consider using blue light filters on digital devices",
        "Schedule regular health check-ups"
      ]
    });
  };
  
  // Calculate BMI
  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = Number(height) / 100;
      const weightInKg = Number(weight);
      const bmi = weightInKg / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return "N/A";
  };
  
  // Save health details
  const saveHealthDetails = () => {
    toast({
      title: "Health Details Saved",
      description: "Your health information has been successfully saved.",
    });
  };
  
  // Get stress level color
  const getStressLevelColor = (level: number) => {
    if (level < 30) return "text-green-500";
    if (level < 70) return "text-yellow-500";
    return "text-red-500";
  };
  
  // Get health status based on percentage
  const getHealthStatus = (percentage: number) => {
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Average";
    if (percentage >= 20) return "Poor";
    return "Very Poor";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Health Dashboard</h1>
            <p className="text-muted-foreground">Monitor your health metrics and get personalized recommendations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={generateRecommendations}
              className="flex items-center gap-2"
            >
              <Brain size={16} />
              Update Recommendations
            </Button>
            <Button onClick={saveHealthDetails}>Save Health Data</Button>
          </div>
        </div>
        
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="info">Personal Info</TabsTrigger>
            <TabsTrigger value="facial">Facial Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          </TabsList>
          
          {/* Personal Health Info Tab */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Health Details</CardTitle>
                <CardDescription>
                  Enter your basic health information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age (years)</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      placeholder="Enter your age" 
                      value={ageYears}
                      onChange={(e) => setAgeYears(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input 
                      id="height" 
                      type="number" 
                      placeholder="Enter your height" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input 
                      id="weight" 
                      type="number" 
                      placeholder="Enter your weight" 
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                </div>
                
                {height && weight && (
                  <div className="mt-4 p-4 bg-primary/10 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Your BMI:</span>
                      <Badge variant="outline" className="text-sm">
                        {calculateBMI()} - {
                          Number(calculateBMI()) < 18.5 ? "Underweight" :
                          Number(calculateBMI()) < 25 ? "Normal" :
                          Number(calculateBMI()) < 30 ? "Overweight" : "Obese"
                        }
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>
                  Share medical conditions and health-related expenses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medicalConditions">Medical Conditions (if any)</Label>
                  <Textarea 
                    id="medicalConditions" 
                    placeholder="E.g. diabetes, hypertension, allergies" 
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foodExpenses">Monthly Food Expenses</Label>
                    <Input 
                      id="foodExpenses" 
                      placeholder="Amount in your currency" 
                      value={foodExpenses}
                      onChange={(e) => setFoodExpenses(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="medicationExpenses">Monthly Medication Expenses (if any)</Label>
                    <Input 
                      id="medicationExpenses" 
                      placeholder="Amount in your currency" 
                      value={medicationExpenses}
                      onChange={(e) => setMedicationExpenses(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Lifestyle</CardTitle>
                <CardDescription>
                  Information about your activity and sleep habits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="activityLevel">Daily Activity Level</Label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger id="activityLevel">
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                      <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="very">Very active (hard exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="extra">Extra active (very hard exercise & physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="sleepHours">Average Sleep Per Night</Label>
                    <span className="text-sm text-muted-foreground">{sleepHours[0]} hours</span>
                  </div>
                  <Slider
                    id="sleepHours"
                    defaultValue={[7]}
                    max={12}
                    min={3}
                    step={0.5}
                    value={sleepHours}
                    onValueChange={setSleepHours}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Facial Analysis Tab */}
          <TabsContent value="facial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Facial Health Analysis</CardTitle>
                <CardDescription>
                  Upload a selfie or take a photo for AI-powered health analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {!selfieUploaded ? (
                    <div>
                      {!cameraActive ? (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-lg p-12">
                          <div className="flex flex-col items-center space-y-4">
                            <Camera size={48} className="text-primary/40" />
                            <div className="text-center">
                              <h3 className="font-medium">Upload a Selfie or Take a Photo</h3>
                              <p className="text-sm text-muted-foreground max-w-xs">
                                Take a clear photo of your face in good lighting for the most accurate analysis
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <label className="cursor-pointer">
                                <Input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={handleFileUpload}
                                />
                                <Button type="button" className="flex items-center gap-2">
                                  <Upload size={16} />
                                  Upload Photo
                                </Button>
                              </label>
                              <Button 
                                variant="outline" 
                                className="flex items-center gap-2"
                                onClick={startCamera}
                              >
                                <Camera size={16} />
                                Take Photo
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative mx-auto overflow-hidden rounded-lg border border-border max-w-md">
                            <video 
                              ref={videoRef} 
                              className="w-full h-[300px] object-cover" 
                              autoPlay 
                              playsInline 
                              muted
                            />
                          </div>
                          <canvas ref={canvasRef} className="hidden" />
                          <div className="flex justify-center space-x-2">
                            <Button onClick={takePhoto} className="flex items-center gap-2">
                              <Camera size={16} />
                              Capture
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={stopCamera} 
                              className="flex items-center gap-2"
                            >
                              <XIcon size={16} />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="relative w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {/* Display the captured or uploaded image */}
                          {selfieImage ? (
                            <img
                              src={selfieImage}
                              alt="Selfie"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src="/placeholder.svg"
                              alt="Selfie placeholder"
                              className="w-full h-full object-cover"
                            />
                          )}
                          <button 
                            className="absolute top-2 right-2 bg-background/80 p-1 rounded-full"
                            onClick={() => {
                              setSelfieUploaded(false);
                              setSelfieImage(null);
                            }}
                          >
                            <XIcon size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <Button onClick={handleFaceAnalysis} className="flex items-center gap-2">
                          <Activity size={16} />
                          Analyze Health
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {cameraPermissionDenied && (
                    <div className="mt-4 p-4 bg-destructive/10 rounded-md text-center">
                      <p className="text-sm text-destructive font-medium">
                        Camera access was denied. Please check your browser permissions.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try clicking the camera icon in your browser's address bar to allow access.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {selfieUploaded && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>
                    Comprehensive health insights based on facial analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-2">Emotional Indicators</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-primary/10 rounded-md space-y-2">
                        <div className="flex items-center gap-2">
                          <Zap size={18} />
                          <h3 className="font-medium">Stress Level</h3>
                        </div>
                        <Progress value={faceAnalysis.stress} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Low</span>
                          <span className={getStressLevelColor(faceAnalysis.stress)}>
                            {faceAnalysis.stress}%
                          </span>
                          <span>High</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-primary/10 rounded-md space-y-2">
                        <div className="flex items-center gap-2">
                          <Smile size={18} />
                          <h3 className="font-medium">Happiness</h3>
                        </div>
                        <Progress value={faceAnalysis.happiness} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Low</span>
                          <span>{faceAnalysis.happiness}%</span>
                          <span>High</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-primary/10 rounded-md space-y-2">
                        <div className="flex items-center gap-2">
                          <Frown size={18} />
                          <h3 className="font-medium">Sadness</h3>
                        </div>
                        <Progress value={faceAnalysis.sadness} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Low</span>
                          <span>{faceAnalysis.sadness}%</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mb-2 mt-6">Physical Wellbeing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-primary/10 rounded-md space-y-2">
                        <div className="flex items-center gap-2">
                          <Coffee size={18} />
                          <h3 className="font-medium">Fatigue</h3>
                        </div>
                        <Progress value={faceAnalysis.fatigue} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Low</span>
                          <span className={getStressLevelColor(faceAnalysis.fatigue)}>
                            {faceAnalysis.fatigue}%
                          </span>
                          <span>High</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-primary/10 rounded-md space-y-2">
                        <div className="flex items-center gap-2">
                          <Moon size={18} />
                          <h3 className="font-medium">Sleep Quality</h3>
                        </div>
                        <Progress value={faceAnalysis.sleepQuality} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Poor</span>
                          <span>{faceAnalysis.sleepQuality}%</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-primary/10 rounded-md space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle size={18} />
                          <h3 className="font-medium">Anxiety</h3>
                        </div>
                        <Progress value={faceAnalysis.anxiety} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Low</span>
                          <span>{faceAnalysis.anxiety}%</span>
                          <span>High</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mb-2 mt-6">Health Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium">Biological Age</h3>
                        <p className="text-lg font-semibold">{faceAnalysis.biologicalAge} years</p>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium">BMI</h3>
                        <p className="text-lg font-semibold">{faceAnalysis.bmi}</p>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium">Mood</h3>
                        <p className="text-lg font-semibold">{faceAnalysis.mood}</p>
                      </div>
                      
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium">Hydration</h3>
                        <p className="text-lg font-semibold">{faceAnalysis.hydration}%</p>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mb-2 mt-6">Additional Health Indicators</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-md space-y-2">
                        <div className="flex items-center gap-2">
                          <Sun size={18} className="text-amber-500" />
                          <h3 className="font-medium">Skin Health</h3>
                        </div>
                        <Progress value={faceAnalysis.skinHealth} className="h-2" />
                        <p className="text-sm">{getHealthStatus(faceAnalysis.skinHealth)}</p>
                      </div>
                      
                      <div className="p-4 border rounded-md space-y-2">
                        <div className="flex items-center gap-2">
                          <Eye size={18} className="text-blue-500" />
                          <h3 className="font-medium">Eye Health</h3>
                        </div>
                        <Progress value={faceAnalysis.eyeHealth} className="h-2" />
                        <p className="text-sm">{getHealthStatus(faceAnalysis.eyeHealth)}</p>
                      </div>
                      
                      <div className="p-4 border rounded-md space-y-2">
                        <div className="flex items-center gap-2">
                          <Brain size={18} className="text-purple-500" />
                          <h3 className="font-medium">Concentration</h3>
                        </div>
                        <Progress value={faceAnalysis.concentration} className="h-2" />
                        <p className="text-sm">{getHealthStatus(faceAnalysis.concentration)}</p>
                      </div>
                      
                      <div className="p-4 border rounded-md space-y-2">
                        <div className="flex items-center gap-2">
                          <Wind size={18} className="text-green-500" />
                          <h3 className="font-medium">Energy Level</h3>
                        </div>
                        <Progress value={faceAnalysis.energyLevel} className="h-2" />
                        <p className="text-sm">{getHealthStatus(faceAnalysis.energyLevel)}</p>
                      </div>
                      
                      <div className
