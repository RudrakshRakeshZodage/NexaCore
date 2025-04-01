
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Activity, 
  Clock, 
  BarChart2, 
  PieChart, 
  Camera, 
  Upload, 
  RefreshCw, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import DashboardLayout from "@/components/DashboardLayout";
import AutomationAlert from "@/components/AutomationAlert";

// Mock function to simulate facial analysis using DeepFace + OpenCV
const analyzeFace = (imageFile: File | null): Promise<any> => {
  return new Promise((resolve) => {
    // Simulate processing delay
    setTimeout(() => {
      resolve({
        stress_level: Math.floor(Math.random() * 100),
        fatigue: Math.floor(Math.random() * 100),
        age: 25 + Math.floor(Math.random() * 15),
        gender: Math.random() > 0.5 ? "Male" : "Female",
        mood: ["Happy", "Neutral", "Tired", "Stressed"][Math.floor(Math.random() * 4)],
        skin_health: Math.floor(Math.random() * 100),
        eye_health: Math.floor(Math.random() * 100),
        hydration: Math.floor(Math.random() * 100),
        muscle_tone: Math.floor(Math.random() * 100),
        sleep_quality: Math.floor(Math.random() * 100),
      });
    }, 2000);
  });
};

const HealthMetricCard = ({ title, value, maxValue = 100, icon, colorClass }: any) => {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="flex flex-col bg-white/5 dark:bg-foreground/5 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white dark:text-foreground flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </h3>
        <span className={`text-lg font-bold ${colorClass}`}>{value}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-white/60 dark:text-foreground/60 mt-2">
        {percentage < 30 
          ? "Needs improvement" 
          : percentage < 70 
            ? "Average" 
            : "Excellent"}
      </p>
    </div>
  );
};

const HealthPage = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("input");
  const [showAutomationAlert, setShowAutomationAlert] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
  // Health form state
  const [medicalConditions, setMedicalConditions] = useState("");
  const [healthExpenses, setHealthExpenses] = useState("");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [sleepHours, setSleepHours] = useState([7]);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCameraCapture = () => {
    // In a real app, this would open a webcam capture
    toast({
      title: "Camera Capture",
      description: "Webcam capture would open here in a production app",
      variant: "default",
    });
  };
  
  const handleAnalyzeImage = async () => {
    if (!selectedFile) {
      toast({
        title: "No Image Selected",
        description: "Please upload a selfie or capture with camera first",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const results = await analyzeFace(selectedFile);
      setAnalysisResults(results);
      setAnalysisCompleted(true);
      setActiveTab("results");
      
      toast({
        title: "Analysis Complete",
        description: "Facial analysis has been completed successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const calculateBMI = () => {
    const heightInM = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (isNaN(heightInM) || isNaN(weightInKg) || heightInM <= 0 || weightInKg <= 0) {
      return "Please enter valid height and weight";
    }
    
    const bmi = weightInKg / (heightInM * heightInM);
    const bmiRounded = Math.round(bmi * 10) / 10;
    
    let bmiCategory = "";
    if (bmi < 18.5) bmiCategory = "Underweight";
    else if (bmi < 25) bmiCategory = "Normal weight";
    else if (bmi < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obesity";
    
    return `${bmiRounded} (${bmiCategory})`;
  };
  
  const getHealthRecommendations = () => {
    if (!analysisResults) return [];
    
    const recommendations = [
      {
        title: "Diet & Nutrition",
        items: [
          "Increase water intake to improve hydration (at least 8 glasses daily)",
          "Add more fruits and vegetables to your diet for improved skin health",
          "Consider supplements with omega-3 fatty acids for overall health"
        ]
      },
      {
        title: "Exercise Routine",
        items: [
          activityLevel === "sedentary" 
            ? "Start with light cardio exercises like walking for 20 minutes daily" 
            : "Continue with moderate exercise 3-4 times per week",
          "Add strength training to improve muscle tone",
          "Consider yoga or stretching for stress reduction"
        ]
      },
      {
        title: "Stress Management",
        items: [
          analysisResults.stress_level > 50 
            ? "Practice meditation daily for 10-15 minutes" 
            : "Continue with your current stress management techniques",
          "Try breathing exercises when feeling overwhelmed",
          "Consider limiting screen time before bed"
        ]
      },
      {
        title: "Sleep Improvement",
        items: [
          sleepHours[0] < 7 
            ? "Aim to increase sleep duration to 7-8 hours per night" 
            : "Maintain your current sleep schedule",
          "Establish a regular bedtime routine",
          "Reduce blue light exposure before sleep"
        ]
      }
    ];
    
    return recommendations;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Health Analysis</h1>
            <p className="text-white/70 dark:text-foreground/70">Monitor your health and get personalized recommendations</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 dark:bg-primary/20 flex items-center justify-center">
            <Heart className="text-nexacore-teal dark:text-primary" size={24} />
          </div>
        </div>

        {showAutomationAlert && (
          <AutomationAlert 
            isVisible={showAutomationAlert}
            onClose={() => setShowAutomationAlert(false)}
            onConfigure={() => {
              toast({
                title: "Automation Configuration",
                description: "This would connect to your n8n workflow in a production app",
                variant: "default",
              });
            }}
          />
        )}

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/10 dark:bg-foreground/10 p-1">
            <TabsTrigger value="input" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
              Health Information
            </TabsTrigger>
            <TabsTrigger value="analyze" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
              Facial Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="results" 
              className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background"
              disabled={!analysisCompleted}
            >
              Results & Recommendations
            </TabsTrigger>
          </TabsList>
          
          {/* Health Information Tab */}
          <TabsContent value="input" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground flex items-center">
                  <Activity className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                  Health Information
                </CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Enter your current health information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-white dark:text-card-foreground">
                      Height (cm)
                    </Label>
                    <Input 
                      id="height" 
                      placeholder="e.g., 175" 
                      className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-white dark:text-card-foreground">
                      Weight (kg)
                    </Label>
                    <Input 
                      id="weight" 
                      placeholder="e.g., 70" 
                      className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                </div>
                
                {height && weight && (
                  <div className="p-3 bg-white/5 dark:bg-foreground/5 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/80 dark:text-card-foreground/80">BMI:</span>
                      <span className="font-semibold text-nexacore-teal dark:text-primary">{calculateBMI()}</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="medical-conditions" className="text-white dark:text-card-foreground">
                    Medical Conditions
                  </Label>
                  <Textarea 
                    id="medical-conditions" 
                    placeholder="e.g., Diabetes, Hypertension, etc." 
                    className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground min-h-[80px]" 
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="health-expenses" className="text-white dark:text-card-foreground">
                    Health-related Expenses (monthly)
                  </Label>
                  <Input 
                    id="health-expenses" 
                    placeholder="e.g., 5000" 
                    className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                    value={healthExpenses}
                    onChange={(e) => setHealthExpenses(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="activity-level" className="text-white dark:text-card-foreground">
                    Activity Level
                  </Label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger id="activity-level" className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground">
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                      <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="very_active">Very Active (very hard exercise & physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="sleep-hours" className="text-white dark:text-card-foreground">Sleep Hours (per night)</Label>
                    <span className="text-sm text-white/70 dark:text-card-foreground/70">{sleepHours[0]} hours</span>
                  </div>
                  <Slider
                    id="sleep-hours"
                    defaultValue={sleepHours}
                    max={12}
                    min={3}
                    step={0.5}
                    onValueChange={setSleepHours}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/60 dark:text-card-foreground/60">
                    <span>3h</span>
                    <span>12h</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                  onClick={() => setActiveTab("analyze")}
                >
                  Continue to Facial Analysis
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Facial Analysis Tab */}
          <TabsContent value="analyze" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
              <CardHeader>
                <CardTitle className="text-white dark:text-card-foreground flex items-center">
                  <Camera className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                  Facial Analysis
                </CardTitle>
                <CardDescription className="text-white/70 dark:text-card-foreground/70">
                  Upload or capture a selfie for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center gap-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-64 h-64 object-cover rounded-lg border-2 border-nexacore-teal dark:border-primary" 
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2 bg-nexacore-blue-dark/80 dark:bg-background/80 border-white/20 hover:bg-nexacore-blue hover:dark:bg-card"
                        onClick={() => {
                          setSelectedFile(null);
                          setImagePreview(null);
                        }}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-64 h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/20 dark:border-foreground/20 rounded-lg bg-white/5 dark:bg-foreground/5">
                      <Upload className="h-10 w-10 text-white/40 dark:text-foreground/40 mb-2" />
                      <p className="text-sm text-white/60 dark:text-foreground/60">
                        Upload a selfie or use camera
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="border-nexacore-teal dark:border-primary text-white dark:text-card-foreground hover:bg-nexacore-teal/20 dark:hover:bg-primary/20"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    
                    <Button
                      variant="outline"
                      className="border-nexacore-teal dark:border-primary text-white dark:text-card-foreground hover:bg-nexacore-teal/20 dark:hover:bg-primary/20"
                      onClick={handleCameraCapture}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Use Camera
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-white dark:text-card-foreground mb-2 flex items-center">
                    <AlertCircle className="mr-2 h-4 w-4 text-nexacore-orange dark:text-accent" />
                    What We Analyze
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <li className="flex items-center text-white/70 dark:text-card-foreground/70">
                      <div className="h-1.5 w-1.5 rounded-full bg-nexacore-teal dark:bg-primary mr-2"></div>
                      Stress Level
                    </li>
                    <li className="flex items-center text-white/70 dark:text-card-foreground/70">
                      <div className="h-1.5 w-1.5 rounded-full bg-nexacore-teal dark:bg-primary mr-2"></div>
                      Fatigue Detection
                    </li>
                    <li className="flex items-center text-white/70 dark:text-card-foreground/70">
                      <div className="h-1.5 w-1.5 rounded-full bg-nexacore-teal dark:bg-primary mr-2"></div>
                      Age Estimation
                    </li>
                    <li className="flex items-center text-white/70 dark:text-card-foreground/70">
                      <div className="h-1.5 w-1.5 rounded-full bg-nexacore-teal dark:bg-primary mr-2"></div>
                      Gender Detection
                    </li>
                    <li className="flex items-center text-white/70 dark:text-card-foreground/70">
                      <div className="h-1.5 w-1.5 rounded-full bg-nexacore-teal dark:bg-primary mr-2"></div>
                      Mood Analysis
                    </li>
                    <li className="flex items-center text-white/70 dark:text-card-foreground/70">
                      <div className="h-1.5 w-1.5 rounded-full bg-nexacore-teal dark:bg-primary mr-2"></div>
                      Skin Health
                    </li>
                    <li className="flex items-center text-white/70 dark:text-card-foreground/70">
                      <div className="h-1.5 w-1.5 rounded-full bg-nexacore-teal dark:bg-primary mr-2"></div>
                      Eye Health
                    </li>
                    <li className="flex items-center text-white/70 dark:text-card-foreground/70">
                      <div className="h-1.5 w-1.5 rounded-full bg-nexacore-teal dark:bg-primary mr-2"></div>
                      Hydration Level
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                  onClick={() => setActiveTab("input")}
                >
                  Back
                </Button>
                <Button
                  className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                  onClick={handleAnalyzeImage}
                  disabled={!selectedFile || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Image
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4">
            {analysisResults && (
              <>
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <Activity className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      Analysis Results
                    </CardTitle>
                    <CardDescription className="text-white/70 dark:text-card-foreground/70">
                      Your facial analysis results and health metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 bg-white/5 dark:bg-foreground/5 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-white dark:text-card-foreground">Overview</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-white/70 dark:text-card-foreground/70">Age:</span>
                            <span className="text-sm font-medium text-white dark:text-card-foreground">{analysisResults.age} years</span>
                            <span className="mx-2 text-white/30 dark:text-card-foreground/30">|</span>
                            <span className="text-sm text-white/70 dark:text-card-foreground/70">Gender:</span>
                            <span className="text-sm font-medium text-white dark:text-card-foreground">{analysisResults.gender}</span>
                            <span className="mx-2 text-white/30 dark:text-card-foreground/30">|</span>
                            <span className="text-sm text-white/70 dark:text-card-foreground/70">Mood:</span>
                            <span className="text-sm font-medium text-white dark:text-card-foreground">{analysisResults.mood}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-white dark:text-card-foreground mb-1">BMI</h4>
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-nexacore-teal dark:text-primary">{calculateBMI()}</span>
                              {height && weight ? (
                                <Button 
                                  variant="link" 
                                  className="text-xs text-nexacore-teal dark:text-primary h-auto p-0"
                                  onClick={() => setActiveTab("input")}
                                >
                                  View Details
                                </Button>
                              ) : (
                                <Button 
                                  variant="link" 
                                  className="text-xs text-nexacore-orange dark:text-accent h-auto p-0"
                                  onClick={() => setActiveTab("input")}
                                >
                                  Complete Profile
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-white dark:text-card-foreground mb-1">Sleep Quality</h4>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2" />
                                <span className="text-lg font-bold text-nexacore-teal dark:text-primary">{analysisResults.sleep_quality}%</span>
                              </div>
                              <span className="text-xs text-white/70 dark:text-card-foreground/70">{sleepHours[0]} hours/night</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <HealthMetricCard 
                        title="Stress Level" 
                        value={analysisResults.stress_level}
                        icon={<BarChart2 className="h-4 w-4 text-nexacore-orange dark:text-accent" />}
                        colorClass={analysisResults.stress_level > 70 ? "text-red-500" : analysisResults.stress_level > 40 ? "text-nexacore-orange dark:text-accent" : "text-green-500"}
                      />
                      
                      <HealthMetricCard 
                        title="Fatigue" 
                        value={analysisResults.fatigue}
                        icon={<Activity className="h-4 w-4 text-nexacore-orange dark:text-accent" />}
                        colorClass={analysisResults.fatigue > 70 ? "text-red-500" : analysisResults.fatigue > 40 ? "text-nexacore-orange dark:text-accent" : "text-green-500"}
                      />
                      
                      <HealthMetricCard 
                        title="Skin Health" 
                        value={analysisResults.skin_health}
                        icon={<PieChart className="h-4 w-4 text-nexacore-teal dark:text-primary" />}
                        colorClass={analysisResults.skin_health < 30 ? "text-red-500" : analysisResults.skin_health < 60 ? "text-nexacore-orange dark:text-accent" : "text-green-500"}
                      />
                      
                      <HealthMetricCard 
                        title="Eye Health" 
                        value={analysisResults.eye_health}
                        icon={<PieChart className="h-4 w-4 text-nexacore-teal dark:text-primary" />}
                        colorClass={analysisResults.eye_health < 30 ? "text-red-500" : analysisResults.eye_health < 60 ? "text-nexacore-orange dark:text-accent" : "text-green-500"}
                      />
                      
                      <HealthMetricCard 
                        title="Hydration" 
                        value={analysisResults.hydration}
                        icon={<PieChart className="h-4 w-4 text-nexacore-teal dark:text-primary" />}
                        colorClass={analysisResults.hydration < 30 ? "text-red-500" : analysisResults.hydration < 60 ? "text-nexacore-orange dark:text-accent" : "text-green-500"}
                      />
                      
                      <HealthMetricCard 
                        title="Muscle Tone" 
                        value={analysisResults.muscle_tone}
                        icon={<PieChart className="h-4 w-4 text-nexacore-teal dark:text-primary" />}
                        colorClass={analysisResults.muscle_tone < 30 ? "text-red-500" : analysisResults.muscle_tone < 60 ? "text-nexacore-orange dark:text-accent" : "text-green-500"}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <Sparkle className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription className="text-white/70 dark:text-card-foreground/70">
                      Personalized health recommendations based on your analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {getHealthRecommendations().map((section, index) => (
                      <div key={index} className="space-y-3">
                        <h3 className="text-lg font-medium text-white dark:text-card-foreground">{section.title}</h3>
                        <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg border-l-2 border-nexacore-teal dark:border-primary">
                          <ul className="space-y-2">
                            {section.items.map((item, i) => (
                              <li key={i} className="flex items-start">
                                <ArrowRight className="h-4 w-4 text-nexacore-teal dark:text-primary mr-2 mt-0.5" />
                                <span className="text-white/90 dark:text-card-foreground/90">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                      onClick={() => {
                        navigate("/reports");
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Health Report
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default HealthPage;

// Import the Sparkle icon needed above
import { Sparkle } from "lucide-react";
// Import the navigate function
import { useNavigate } from "react-router-dom";
