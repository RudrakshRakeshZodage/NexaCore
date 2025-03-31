
import { useState, useRef } from "react";
import { 
  Heart, 
  Upload, 
  Camera, 
  Activity, 
  Moon, 
  Flame,
  ChevronRight, 
  RefreshCw
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";

const Health = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<null | {
    stressLevel: number;
    fatigue: number;
    mood: string;
    age: number;
    hydration: number;
    recommendations: {
      nutrition: string[];
      exercise: string[];
      sleep: string[];
      lifestyle: string[];
    };
  }>(null);
  
  const [formData, setFormData] = useState({
    medicalConditions: "",
    healthExpenses: "",
    activityLevel: "moderate",
    sleepHours: 7,
    height: "",
    weight: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast({
        title: "Image Uploaded",
        description: "Your image has been uploaded successfully.",
      });
    }
  };

  const handleCameraToggle = () => {
    setIsCameraActive(!isCameraActive);
    // In a real implementation, we would initialize webcam here
  };

  const handleCameraCapture = () => {
    // Simulate taking a photo
    setIsCameraActive(false);
    setImage("/lovable-uploads/36c062c8-cc2a-4a2e-87ec-4834f6e75483.png"); // Placeholder image
    toast({
      title: "Photo Captured",
      description: "Your photo has been captured successfully.",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };

  const handleAnalyze = () => {
    if (!image) {
      toast({
        title: "Image Required",
        description: "Please upload or capture a photo for analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      // Mock analysis results
      const mockResults = {
        stressLevel: Math.floor(Math.random() * 100),
        fatigue: Math.floor(Math.random() * 100),
        mood: ["Happy", "Neutral", "Tired", "Stressed"][Math.floor(Math.random() * 4)],
        age: 20 + Math.floor(Math.random() * 20),
        hydration: Math.floor(Math.random() * 100),
        recommendations: {
          nutrition: [
            "Increase protein intake to support muscle growth",
            "Add more leafy greens for essential vitamins",
            "Consider Omega-3 supplements for cognitive health"
          ],
          exercise: [
            "30 minutes of cardio 3-4 times per week",
            "Incorporate strength training for muscle tone",
            "Try yoga for flexibility and stress reduction"
          ],
          sleep: [
            "Maintain a consistent sleep schedule",
            "Avoid screens 1 hour before bedtime",
            "Keep your bedroom cool and dark for optimal sleep"
          ],
          lifestyle: [
            "Take regular breaks during long work sessions",
            "Practice mindfulness meditation for 10 minutes daily",
            "Stay hydrated throughout the day"
          ]
        }
      };
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "We've analyzed your health data and photo to generate recommendations.",
        variant: "success"
      });
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Health Analysis</h1>
          <p className="text-white/70 mt-1">
            Get personalized health insights through facial analysis and health data
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Health Information Form */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Heart className="mr-2" /> 
                  Health Information
                </CardTitle>
                <CardDescription className="text-white/70">
                  Tell us about your current health status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medicalConditions" className="text-white">Medical Conditions</Label>
                  <Textarea 
                    id="medicalConditions"
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleChange}
                    placeholder="e.g., diabetes, hypertension, allergies, etc."
                    className="bg-nexacore-blue-dark/50 border-white/20 text-white min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-white">Height (cm)</Label>
                    <Input 
                      id="height"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      type="number"
                      placeholder="e.g., 175"
                      className="bg-nexacore-blue-dark/50 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-white">Weight (kg)</Label>
                    <Input 
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      type="number"
                      placeholder="e.g., 70"
                      className="bg-nexacore-blue-dark/50 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthExpenses" className="text-white">Weekly Health Expenses (₹)</Label>
                  <Input 
                    id="healthExpenses"
                    name="healthExpenses"
                    value={formData.healthExpenses}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                    type="number"
                    className="bg-nexacore-blue-dark/50 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activityLevel" className="text-white">Daily Activity Level</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("activityLevel", value)}
                    defaultValue={formData.activityLevel}
                  >
                    <SelectTrigger className="bg-nexacore-blue-dark/50 border-white/20 text-white">
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                      <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                      <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                      <SelectItem value="very_active">Very Active (twice daily)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label htmlFor="sleepHours" className="text-white">Sleep Hours: {formData.sleepHours}/day</Label>
                  </div>
                  <Slider 
                    defaultValue={[formData.sleepHours]} 
                    max={12} 
                    min={1}
                    step={0.5}
                    onValueChange={(value) => handleSliderChange("sleepHours", value)}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-white/60">
                    <span>1 hour</span>
                    <span>12 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facial Analysis Section */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Camera className="mr-2" /> 
                  Facial Analysis
                </CardTitle>
                <CardDescription className="text-white/70">
                  Upload or capture a photo for advanced health analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  {image ? (
                    <div className="relative w-full h-64 mb-4">
                      <img 
                        src={image} 
                        alt="Uploaded" 
                        className="w-full h-full object-cover rounded-lg" 
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-nexacore-blue-dark/70 text-white border-white/20"
                        onClick={() => setImage(null)}
                      >
                        Change
                      </Button>
                    </div>
                  ) : isCameraActive ? (
                    <div className="w-full h-64 bg-black rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <p className="text-white mb-2">Camera Preview (Simulated)</p>
                        <div className="flex justify-center gap-3">
                          <Button 
                            onClick={handleCameraCapture}
                            className="bg-nexacore-teal text-nexacore-blue-dark"
                          >
                            Take Photo
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsCameraActive(false)}
                            className="border-white/20 text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64 border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center mb-4">
                      <Upload size={48} className="text-white/50 mb-4" />
                      <p className="text-white/70 text-center mb-6">
                        Upload a clear photo of your face for analysis
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-nexacore-teal text-nexacore-blue-dark"
                        >
                          Upload Photo
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleCameraToggle}
                          className="border-nexacore-teal/50 text-nexacore-teal"
                        >
                          Use Camera
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <Button
                  className="w-full bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal-light"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !image}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : "Analyze Health Data"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {analysisResults ? (
              <>
                {/* Analysis Results Card */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Activity className="mr-2" />
                      Health Analysis Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Stress Level */}
                      <div className="bg-nexacore-blue/30 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white">Stress Level</h4>
                          <span className={`text-sm px-2 py-1 rounded ${
                            analysisResults.stressLevel < 30 ? "bg-green-500/20 text-green-400" :
                            analysisResults.stressLevel < 70 ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-red-500/20 text-red-400"
                          }`}>
                            {analysisResults.stressLevel < 30 ? "Low" :
                             analysisResults.stressLevel < 70 ? "Moderate" : "High"}
                          </span>
                        </div>
                        <div className="w-full bg-nexacore-blue-dark/50 rounded-full h-2">
                          <div 
                            className="bg-nexacore-teal h-2 rounded-full" 
                            style={{width: `${analysisResults.stressLevel}%`}}
                          ></div>
                        </div>
                        <p className="text-white/60 text-sm mt-1">{analysisResults.stressLevel}% detected</p>
                      </div>
                      
                      {/* Fatigue */}
                      <div className="bg-nexacore-blue/30 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white">Fatigue</h4>
                          <span className={`text-sm px-2 py-1 rounded ${
                            analysisResults.fatigue < 30 ? "bg-green-500/20 text-green-400" :
                            analysisResults.fatigue < 70 ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-red-500/20 text-red-400"
                          }`}>
                            {analysisResults.fatigue < 30 ? "Low" :
                             analysisResults.fatigue < 70 ? "Moderate" : "High"}
                          </span>
                        </div>
                        <div className="w-full bg-nexacore-blue-dark/50 rounded-full h-2">
                          <div 
                            className="bg-nexacore-teal h-2 rounded-full" 
                            style={{width: `${analysisResults.fatigue}%`}}
                          ></div>
                        </div>
                        <p className="text-white/60 text-sm mt-1">{analysisResults.fatigue}% detected</p>
                      </div>
                      
                      {/* Mood */}
                      <div className="bg-nexacore-blue/30 p-4 rounded-lg">
                        <h4 className="text-white mb-1">Detected Mood</h4>
                        <p className="text-nexacore-teal text-lg font-medium">{analysisResults.mood}</p>
                      </div>
                      
                      {/* Estimated Age */}
                      <div className="bg-nexacore-blue/30 p-4 rounded-lg">
                        <h4 className="text-white mb-1">Estimated Age</h4>
                        <p className="text-nexacore-teal text-lg font-medium">{analysisResults.age} years</p>
                      </div>
                      
                      {/* Hydration */}
                      <div className="bg-nexacore-blue/30 p-4 rounded-lg col-span-2">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-white">Hydration Level</h4>
                          <span className={`text-sm px-2 py-1 rounded ${
                            analysisResults.hydration > 70 ? "bg-green-500/20 text-green-400" :
                            analysisResults.hydration > 40 ? "bg-yellow-500/20 text-yellow-400" :
                            "bg-red-500/20 text-red-400"
                          }`}>
                            {analysisResults.hydration > 70 ? "Optimal" :
                             analysisResults.hydration > 40 ? "Adequate" : "Low"}
                          </span>
                        </div>
                        <div className="w-full bg-nexacore-blue-dark/50 rounded-full h-2">
                          <div 
                            className="bg-nexacore-teal h-2 rounded-full" 
                            style={{width: `${analysisResults.hydration}%`}}
                          ></div>
                        </div>
                        <p className="text-white/60 text-sm mt-1">{analysisResults.hydration}% hydrated</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Heart className="mr-2" />
                      Health Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Nutrition */}
                    <div>
                      <h4 className="text-nexacore-teal font-medium mb-2 flex items-center">
                        <Flame className="mr-1" size={16} /> Nutrition & Diet
                      </h4>
                      <ul className="space-y-1">
                        {analysisResults.recommendations.nutrition.map((item, i) => (
                          <li key={i} className="text-white/80 text-sm flex items-start">
                            <span className="mr-2">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Exercise */}
                    <div>
                      <h4 className="text-nexacore-teal font-medium mb-2 flex items-center">
                        <Activity className="mr-1" size={16} /> Exercise
                      </h4>
                      <ul className="space-y-1">
                        {analysisResults.recommendations.exercise.map((item, i) => (
                          <li key={i} className="text-white/80 text-sm flex items-start">
                            <span className="mr-2">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Sleep */}
                    <div>
                      <h4 className="text-nexacore-teal font-medium mb-2 flex items-center">
                        <Moon className="mr-1" size={16} /> Sleep
                      </h4>
                      <ul className="space-y-1">
                        {analysisResults.recommendations.sleep.map((item, i) => (
                          <li key={i} className="text-white/80 text-sm flex items-start">
                            <span className="mr-2">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Lifestyle */}
                    <div>
                      <h4 className="text-nexacore-teal font-medium mb-2 flex items-center">
                        <Heart className="mr-1" size={16} /> Lifestyle
                      </h4>
                      <ul className="space-y-1">
                        {analysisResults.recommendations.lifestyle.map((item, i) => (
                          <li key={i} className="text-white/80 text-sm flex items-start">
                            <span className="mr-2">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal-light">
                      Get Detailed Health Plan
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <Card className="glass-card h-full flex flex-col justify-center items-center py-12">
                <CardContent className="text-center">
                  <div className="rounded-full bg-nexacore-blue/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Heart size={32} className="text-nexacore-teal" />
                  </div>
                  <h3 className="text-white text-xl font-medium mb-2">Health Analysis</h3>
                  <p className="text-white/70 mb-6">
                    Complete your health information and upload a photo for personalized health insights.
                  </p>
                  {isAnalyzing && (
                    <div className="flex justify-center">
                      <div className="w-8 h-8 rounded-full border-2 border-nexacore-teal border-t-transparent animate-spin"></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Health;
