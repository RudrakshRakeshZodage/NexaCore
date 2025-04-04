
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
import { Sparkles, FileText } from "lucide-react";
import { downloadPDFReport } from "@/lib/pdfReportGenerator";
import FaceAnalysis from "@/components/FaceAnalysis";
import SelfieAnalysis from "@/components/SelfieAnalysis";
import ChatbotScript from "@/components/ChatbotScript";
import { motion } from "framer-motion";

const Health = () => {
  const { toast } = useToast();
  const [faceAnalysisResults, setFaceAnalysisResults] = useState<any>(null);
  const [selfieAnalysisResults, setSelfieAnalysisResults] = useState<any>(null);
  
  // Physical metrics
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  
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

  const handleSelfieAnalysisComplete = (results: any) => {
    setSelfieAnalysisResults(results);
    
    toast({
      title: "Wellness Analysis Complete",
      description: "Your facial analysis has been processed successfully",
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
        selfieAnalysis: selfieAnalysisResults,
      };
      
      const pdfResult = await downloadPDFReport(
        healthData, 
        'health', 
        'NexaCore User'
      );
      
      toast({
        title: "Report Downloaded",
        description: "Your health report has been generated and downloaded",
      });
      
      // Extract URL string from pdfResult
      const pdfUrl = typeof pdfResult === 'string' 
        ? pdfResult 
        : (pdfResult as any).fileName || '';
      
      // Open the PDF in a new window if URL is available
      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
      }
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
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>

        <Tabs defaultValue="wellness" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="wellness">Wellness Analysis</TabsTrigger>
            <TabsTrigger value="metrics">Physical Metrics</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="analysis">Face Analysis</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
          </TabsList>

          {/* Wellness Analysis Tab */}
          <TabsContent value="wellness" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SelfieAnalysis onAnalysisComplete={handleSelfieAnalysisComplete} />
            </motion.div>
          </TabsContent>

          {/* Physical Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
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
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Lifestyle Tab */}
          <TabsContent value="lifestyle" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
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
            </motion.div>
          </TabsContent>

          {/* Face Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FaceAnalysis onAnalysisComplete={handleFaceAnalysisComplete} />
              
              {faceAnalysisResults && (
                <Card className="mt-4 bg-nexacore-blue-dark/50 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Analysis Results</CardTitle>
                    <CardDescription className="text-white/70">
                      Your current emotional state based on facial analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-white/5 p-4 rounded-md">
                      <h3 className="text-xl font-semibold text-nexacore-teal mb-4">
                        Dominant Emotion: {faceAnalysisResults.dominantExpression}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(faceAnalysisResults.expressions).map(([expression, value]: [string, any]) => (
                          <div key={expression} className="flex justify-between items-center">
                            <span className="text-white/80 capitalize">{expression}:</span>
                            <div className="w-2/3 bg-white/10 rounded-full h-2.5">
                              <div 
                                className="bg-nexacore-teal h-2.5 rounded-full" 
                                style={{ width: `${value * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-nexacore-teal ml-2 w-16 text-right">
                              {(value * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          {/* Medical Tab */}
          <TabsContent value="medical" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
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
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Chatbot */}
      <ChatbotScript />
    </DashboardLayout>
  );
};

export default Health;
