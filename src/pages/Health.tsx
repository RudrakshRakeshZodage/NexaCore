
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Utensils, 
  BedDouble,
  Upload, 
  Camera, 
  FileText,
  SmilePlus,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

const HealthRecommendation = ({ conditions, expenses, activity, sleep }: any) => {
  if (!conditions || !activity || !sleep) {
    return <p className="text-white/70">Please fill out all fields to get personalized recommendations.</p>;
  }

  const hasDiabetes = conditions.toLowerCase().includes('diabetes');
  const hasHypertension = conditions.toLowerCase().includes('hypertension') || conditions.toLowerCase().includes('blood pressure');
  const hasStress = conditions.toLowerCase().includes('stress') || conditions.toLowerCase().includes('anxiety');
  
  const sleepHours = parseInt(sleep);
  const poorSleep = sleepHours < 6;
  const goodSleep = sleepHours >= 7;
  
  const activityLevel = parseInt(activity);
  const lowActivity = activityLevel <= 2;
  const highActivity = activityLevel >= 4;

  return (
    <div className="space-y-4 bg-nexacore-blue-dark/50 p-4 rounded-xl border border-white/10">
      <h3 className="text-lg font-semibold flex items-center">
        <SmilePlus className="mr-2 text-nexacore-teal" size={20} />
        Your Health Analysis
      </h3>
      
      <div className="space-y-3">
        <div className="bg-white/5 p-3 rounded-lg border-l-2 border-nexacore-teal">
          <h4 className="font-medium text-nexacore-teal">Nutrition & Diet</h4>
          <p className="mt-2 text-sm text-white/80">
            {hasDiabetes ? (
              "Focus on low glycemic index foods. Include more leafy greens, whole grains, and limit processed sugars. Consider small, frequent meals to maintain blood sugar levels."
            ) : hasHypertension ? (
              "Adopt a low-sodium diet rich in potassium, magnesium, and calcium. Include foods like bananas, leafy greens, and reduce processed foods."
            ) : (
              "Maintain a balanced diet with plenty of fruits, vegetables, whole grains, and lean proteins. Stay hydrated with at least 8 glasses of water daily."
            )}
          </p>
        </div>
        
        <div className="bg-white/5 p-3 rounded-lg border-l-2 border-nexacore-teal">
          <h4 className="font-medium text-nexacore-teal">Exercise</h4>
          <p className="mt-2 text-sm text-white/80">
            {lowActivity ? (
              "Start with light activities like walking 15-20 minutes daily. Gradually increase to 30 minutes of moderate exercise 5 times a week."
            ) : highActivity ? (
              "You're doing great with your activity level. Consider adding variety with strength training, flexibility exercises, and recovery days to prevent burnout."
            ) : (
              "Aim for 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity each week, plus muscle-strengthening activities twice weekly."
            )}
          </p>
        </div>
        
        <div className="bg-white/5 p-3 rounded-lg border-l-2 border-nexacore-teal">
          <h4 className="font-medium text-nexacore-teal">{hasStress ? "Stress Management" : "Mental Wellbeing"}</h4>
          <p className="mt-2 text-sm text-white/80">
            {hasStress ? (
              "Practice daily mindfulness or meditation for 10-15 minutes. Consider breathing exercises during stressful moments. Limit caffeine intake and prioritize activities you enjoy."
            ) : (
              "Regular mental health check-ins are important. Set aside time for hobbies, social connections, and activities that bring you joy. Practice gratitude journaling."
            )}
          </p>
        </div>
        
        <div className="bg-white/5 p-3 rounded-lg border-l-2 border-nexacore-teal">
          <h4 className="font-medium text-nexacore-teal">Sleep Improvement</h4>
          <p className="mt-2 text-sm text-white/80">
            {poorSleep ? (
              "You're getting less sleep than recommended. Establish a regular sleep schedule, create a restful environment, avoid screens 1 hour before bed, and consider relaxation techniques."
            ) : goodSleep ? (
              "You're getting adequate sleep. Maintain your good sleep hygiene and consider sleep quality improvements like room temperature optimization and reducing ambient light."
            ) : (
              "Aim for 7-9 hours of quality sleep. Create a consistent sleep schedule and a relaxing bedtime routine. Limit caffeine and screen time before bed."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const HealthPage = () => {
  const [conditions, setConditions] = useState("");
  const [expenses, setExpenses] = useState("");
  const [activity, setActivity] = useState("3");
  const [sleep, setSleep] = useState("7");
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecommendationGenerated, setIsRecommendationGenerated] = useState(false);
  const [facialAnalysisResult, setFacialAnalysisResult] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelfieFile(e.target.files[0]);
      toast({
        title: "Image uploaded",
        description: "Your selfie has been uploaded successfully",
        variant: "default"
      });
    }
  };
  
  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleAnalyze = () => {
    if (!conditions || !sleep) {
      toast({
        title: "Missing information",
        description: "Please fill in your health details",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setFacialAnalysisResult({
        stressLevel: "Medium",
        fatigue: "Low",
        mood: "Neutral",
        skinHealth: "Good",
        eyeHealth: "Tired",
        hydration: "Moderate",
      });
      
      setIsRecommendationGenerated(true);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: "Your health recommendations are ready!",
        variant: "default"
      });
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Health</h1>
            <p className="text-white/70">Monitor your health metrics and get personalized recommendations</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 flex items-center justify-center">
            <Heart className="text-nexacore-teal" size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Thermometer className="mr-2 text-nexacore-teal" size={20} />
                  Health Information
                </CardTitle>
                <CardDescription className="text-white/70">
                  Enter your health details for personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="conditions" className="text-white">Medical Conditions</Label>
                  <Input 
                    id="conditions" 
                    placeholder="e.g., Diabetes, Hypertension, Stress" 
                    className="bg-white/10 border-white/20 text-white" 
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                  />
                  <p className="text-xs text-white/50 mt-1">Separate multiple conditions with commas</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expenses" className="text-white">Health Expenses (₹/week)</Label>
                  <Input 
                    id="expenses" 
                    type="number" 
                    placeholder="e.g., 500" 
                    className="bg-white/10 border-white/20 text-white" 
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="activity" className="text-white">Daily Activity Level</Label>
                    <span className="text-white/70 text-sm">{activity}/5</span>
                  </div>
                  <input
                    id="activity"
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Sedentary</span>
                    <span>Moderate</span>
                    <span>Very Active</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="sleep" className="text-white">Sleep (hours/night)</Label>
                    <span className="text-white/70 text-sm">{sleep} hours</span>
                  </div>
                  <input
                    id="sleep"
                    type="range"
                    min="4"
                    max="12"
                    step="1"
                    value={sleep}
                    onChange={(e) => setSleep(e.target.value)}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-white/50">
                    <span>4h</span>
                    <span>8h</span>
                    <span>12h</span>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label className="text-white">Facial Analysis (Optional)</Label>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-full h-40 bg-white/5 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={handleCameraCapture}
                    >
                      {selfieFile ? (
                        <div className="text-center">
                          <div className="text-nexacore-teal mb-2">
                            <CheckCircle size={32} />
                          </div>
                          <p className="text-sm text-white">{selfieFile.name}</p>
                          <p className="text-xs text-white/70">Click to change</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-white/50 mb-2" />
                          <p className="text-sm text-white">Upload a selfie for analysis</p>
                          <p className="text-xs text-white/50">Click to browse</p>
                        </>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleFileChange} 
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleCameraCapture}
                      variant="outline" 
                      className="h-40 border-white/20 text-white hover:bg-white/10"
                    >
                      <Camera size={24} />
                    </Button>
                  </div>
                  <p className="text-xs text-white/50">Your facial image will be analyzed for stress, fatigue, and other health indicators</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleAnalyze} 
                  className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze & Generate Recommendations"}
                </Button>
              </CardFooter>
            </Card>

            {isRecommendationGenerated && (
              <Card className="bg-nexacore-blue-dark/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="mr-2 text-nexacore-teal" size={20} />
                    Health Recommendations
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Personalized health advice based on your inputs and analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HealthRecommendation 
                    conditions={conditions} 
                    expenses={expenses} 
                    activity={activity}
                    sleep={sleep}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {isRecommendationGenerated && facialAnalysisResult && (
              <Card className="bg-nexacore-blue-dark/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Camera className="mr-2 text-nexacore-teal" size={20} />
                    Facial Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(facialAnalysisResult).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-white/80 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className={`font-medium ${
                        value === 'Good' || value === 'Low' ? 'text-green-400' : 
                        value === 'Medium' || value === 'Moderate' ? 'text-yellow-400' : 
                        value === 'High' ? 'text-red-400' : 'text-white'
                      }`}>{value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Utensils className="mr-2 text-nexacore-teal" size={20} />
                  Nutrition
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-white/5 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-white/80">Daily Water Intake</span>
                    <span className="text-sm font-medium text-nexacore-teal">2/8 glasses</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-nexacore-teal h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                
                <p className="text-white/70 text-sm">
                  Track your water intake and nutrition to get more detailed recommendations.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  disabled={!isRecommendationGenerated}
                >
                  <FileText size={16} className="mr-2" />
                  View Diet Plan
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BedDouble className="mr-2 text-nexacore-teal" size={20} />
                  Sleep Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="text-xs text-white/70 mb-1">{day}</div>
                      <div className="h-20 w-full bg-white/10 rounded-md relative">
                        <div 
                          className="absolute bottom-0 w-full bg-nexacore-teal rounded-b-md"
                          style={{ height: `${Math.random() * 80 + 10}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/50 mt-2 text-center">Past 7 days sleep quality</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HealthPage;
