import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, FileText } from "lucide-react";
import { downloadPDFReport } from "@/lib/pdfReportGenerator";
import AutomationAlert from "@/components/AutomationAlert";
import FaceAnalysis from "@/components/FaceAnalysis";

const Health = () => {
  const { toast } = useToast();
  const [showAutomationAlert, setShowAutomationAlert] = useState(true);
  const [faceAnalysisResults, setFaceAnalysisResults] = useState<any>(null);
  
  // Physical metrics
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [heartRate, setHeartRate] = useState("");
  
  // Lifestyle
  const [sleepHours, setSleepHours] = useState("");
  const [exerciseFrequency, setExerciseFrequency] = useState("");
  const [dietType, setDietType] = useState("");
  const [stressLevel, setStressLevel] = useState("");
  
  // Medical
  const [medicalConditions, setMedicalConditions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  
  // Goals
  const [healthGoals, setHealthGoals] = useState("");
  
  const handleFaceAnalysisComplete = (results: any) => {
    setFaceAnalysisResults(results);
    
    toast({
      title: "Emotion Analysis Complete",
      description: `Your dominant emotion is detected as ${results.dominantExpression}`,
    });
  };

  const handleSaveHealthDetails = () => {
    toast({
      title: "Health Details Saved",
      description: "Your health information has been saved successfully",
    });
  };

  const handleGenerateReport = async () => {
    try {
      toast({
        title: "Generating Report",
        description: "Please wait while we create your health report...",
      });
      
      const healthData = {
        physical: {
          height,
          weight,
          bloodPressure,
          heartRate,
        },
        lifestyle: {
          sleepHours,
          exerciseFrequency,
          dietType,
          stressLevel,
        },
        medical: {
          medicalConditions,
          allergies,
          medications,
        },
        goals: healthGoals,
        faceAnalysis: faceAnalysisResults,
      };
      
      await downloadPDFReport(
        healthData, 
        'health', 
        'NexaCore User'
      );
      
      toast({
        title: "Report Downloaded",
        description: "Your health report has been generated and downloaded",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Report Error",
        description: "Failed to generate health report",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Health</h1>
            <p className="text-muted-foreground">Manage your health data and get personalized wellness recommendations.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleSaveHealthDetails}
            >
              <Sparkles size={16} />
              Save Details
            </Button>
            <Button 
              className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90 flex items-center gap-2"
              onClick={handleGenerateReport}
            >
              <FileText size={16} />
              Generate Report
            </Button>
          </div>
        </div>

        <AutomationAlert 
          isVisible={showAutomationAlert}
          onClose={() => setShowAutomationAlert(false)}
          onConfigure={() => {
            toast({
              title: "Automation Configuration",
              description: "This would open the automation configuration dialog in a real application."
            });
          }}
        />

        <Tabs defaultValue="metrics" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="metrics">Physical Metrics</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="analysis">Face Analysis</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
          </TabsList>

          {/* Physical Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Physical Metrics</CardTitle>
                <CardDescription className="text-white/70">
                  Enter your key physical health measurements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height" className="text-white">Height (cm)</Label>
                    <Input 
                      id="height" 
                      placeholder="Enter your height" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-white">Weight (kg)</Label>
                    <Input 
                      id="weight" 
                      placeholder="Enter your weight" 
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure" className="text-white">Blood Pressure (mmHg)</Label>
                    <Input 
                      id="bloodPressure" 
                      placeholder="e.g., 120/80" 
                      value={bloodPressure}
                      onChange={(e) => setBloodPressure(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="heartRate" className="text-white">Resting Heart Rate (bpm)</Label>
                    <Input 
                      id="heartRate" 
                      placeholder="Enter your heart rate" 
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lifestyle Tab */}
          <TabsContent value="lifestyle" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Lifestyle Factors</CardTitle>
                <CardDescription className="text-white/70">
                  Information about your daily habits and lifestyle
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sleepHours" className="text-white">Average Sleep (hours)</Label>
                    <Input 
                      id="sleepHours" 
                      placeholder="Hours per night" 
                      value={sleepHours}
                      onChange={(e) => setSleepHours(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="exerciseFrequency" className="text-white">Exercise Frequency</Label>
                    <Select value={exerciseFrequency} onValueChange={setExerciseFrequency}>
                      <SelectTrigger id="exerciseFrequency" className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="3-5_times">3-5 times per week</SelectItem>
                        <SelectItem value="1-2_times">1-2 times per week</SelectItem>
                        <SelectItem value="rarely">Rarely</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dietType" className="text-white">Diet Type</Label>
                    <Select value={dietType} onValueChange={setDietType}>
                      <SelectTrigger id="dietType" className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="omnivore">Omnivore</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="paleo">Paleo</SelectItem>
                        <SelectItem value="keto">Keto</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stressLevel" className="text-white">Stress Level</Label>
                    <Select value={stressLevel} onValueChange={setStressLevel}>
                      <SelectTrigger id="stressLevel" className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select stress level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="very_low">Very Low</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="very_high">Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="healthGoals" className="text-white">Health & Wellness Goals</Label>
                  <Textarea 
                    id="healthGoals" 
                    placeholder="Describe your health goals..." 
                    value={healthGoals}
                    onChange={(e) => setHealthGoals(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Face Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            <FaceAnalysis onAnalysisComplete={handleFaceAnalysisComplete} />
          </TabsContent>

          {/* Medical Tab */}
          <TabsContent value="medical" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Medical Information</CardTitle>
                <CardDescription className="text-white/70">
                  Provide information about your medical history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medicalConditions" className="text-white">Medical Conditions</Label>
                  <Textarea 
                    id="medicalConditions" 
                    placeholder="List any medical conditions..." 
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies" className="text-white">Allergies</Label>
                  <Textarea 
                    id="allergies" 
                    placeholder="List any allergies..." 
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medications" className="text-white">Current Medications</Label>
                  <Textarea 
                    id="medications" 
                    placeholder="List medications you are currently taking..." 
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Health;
