
import { useState } from "react";
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
  CheckCircle
} from "lucide-react";

const Health = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  const [analyzeDialogOpen, setAnalyzeDialogOpen] = useState(false);
  const [analyzingStatus, setAnalyzingStatus] = useState<'idle' | 'analyzing' | 'complete' | 'failed'>('idle');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Face analysis results (mock data)
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
  
  // Handle face analysis
  const handleFaceAnalysis = () => {
    setAnalyzingStatus('analyzing');
    setAnalyzeDialogOpen(true);
    setAnalysisProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalyzingStatus('complete');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };
  
  // Handle file upload
  const handleFileUpload = () => {
    // This would normally handle the file upload process
    setSelfieUploaded(true);
    toast({
      title: "Image Uploaded",
      description: "Your selfie has been uploaded and is ready for analysis.",
    });
  };
  
  // Generate AI recommendations based on health data and face analysis
  const generateRecommendations = () => {
    // In a real app, this would call an API with health data to generate recommendations
    toast({
      title: "Recommendations Updated",
      description: "AI has analyzed your health data and updated your recommendations.",
    });
    // The mock recommendations would be updated here based on the analysis
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
                  Upload a selfie for AI-powered health analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {!selfieUploaded ? (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-lg p-12">
                      <div className="flex flex-col items-center space-y-4">
                        <Camera size={48} className="text-primary/40" />
                        <div className="text-center">
                          <h3 className="font-medium">Upload a Selfie</h3>
                          <p className="text-sm text-muted-foreground max-w-xs">
                            Take a clear photo of your face in good lighting for the most accurate analysis
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleFileUpload} className="flex items-center gap-2">
                            <Upload size={16} />
                            Upload Photo
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Camera size={16} />
                            Take Photo
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="relative w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {/* This would be a real image in a production app */}
                          <img
                            src="/placeholder.svg"
                            alt="Selfie placeholder"
                            className="w-full h-full object-cover"
                          />
                          <button 
                            className="absolute top-2 right-2 bg-background/80 p-1 rounded-full"
                            onClick={() => setSelfieUploaded(false)}
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
                </div>
              </CardContent>
            </Card>
            
            {selfieUploaded && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>
                    Health insights based on facial analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
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
                    </div>
                    
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-md space-y-2">
                        <h3 className="font-medium">Skin Health</h3>
                        <Progress value={faceAnalysis.skinHealth} className="h-2" />
                        <p className="text-sm">{getHealthStatus(faceAnalysis.skinHealth)}</p>
                      </div>
                      
                      <div className="p-4 border rounded-md space-y-2">
                        <h3 className="font-medium">Eye Health</h3>
                        <Progress value={faceAnalysis.eyeHealth} className="h-2" />
                        <p className="text-sm">{getHealthStatus(faceAnalysis.eyeHealth)}</p>
                      </div>
                    </div>
                    
                    <Button variant="outline" onClick={() => navigate('/reports')} className="flex items-center gap-2">
                      <FileTextIcon size={16} />
                      Generate Health Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nutrition & Diet</CardTitle>
                <CardDescription>
                  Personalized dietary recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.nutrition.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Apple className="text-green-500 mt-1 flex-shrink-0" size={18} />
                      <p>{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Exercise & Activity</CardTitle>
                <CardDescription>
                  Physical activity recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.exercise.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Dumbbell className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                      <p>{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Stress Management</CardTitle>
                <CardDescription>
                  Tips for reducing stress and improving mental wellbeing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.stressRelief.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Brain className="text-purple-500 mt-1 flex-shrink-0" size={18} />
                      <p>{recommendation}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sleep Improvement</CardTitle>
                  <CardDescription>
                    Recommendations for better sleep
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.sleep.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Moon className="text-indigo-500 mt-1 flex-shrink-0" size={18} />
                        <p>{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lifestyle Changes</CardTitle>
                  <CardDescription>
                    General wellness recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.lifestyle.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="text-teal-500 mt-1 flex-shrink-0" size={18} />
                        <p>{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Facial Analysis Dialog */}
      <Dialog open={analyzeDialogOpen} onOpenChange={setAnalyzeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Analyzing Your Health</DialogTitle>
            <DialogDescription>
              Our AI is examining your facial features to provide health insights
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {analyzingStatus === 'analyzing' && (
              <div className="space-y-4">
                <Progress value={analysisProgress} className="h-2 w-full" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Analyzing facial features...</span>
                  <span>{analysisProgress}%</span>
                </div>
              </div>
            )}
            
            {analyzingStatus === 'complete' && (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h3 className="font-medium text-lg">Analysis Complete!</h3>
                <p className="text-muted-foreground">
                  Your health insights are ready to view
                </p>
                <Button 
                  onClick={() => setAnalyzeDialogOpen(false)}
                  className="w-full"
                >
                  View Results
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Health;
