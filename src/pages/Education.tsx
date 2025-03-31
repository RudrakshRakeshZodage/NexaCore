
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Award,
  BookMarked,
  FileText, 
  Brain,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";

const EducationRecommendation = ({ degree, career, courses }: any) => {
  if (!degree || !career) {
    return <p className="text-white/70">Please fill out all fields to get personalized recommendations.</p>;
  }

  // Mock AI recommendations based on user input
  const recommendations = {
    computerScience: {
      courses: ["Machine Learning Fundamentals", "Full Stack Web Development", "Data Structures & Algorithms"],
      skills: ["Python Programming", "Database Management", "Cloud Computing"],
      resources: ["Coursera", "Udemy", "GitHub Learning Lab"]
    },
    business: {
      courses: ["Business Analytics", "Digital Marketing", "Financial Management"],
      skills: ["Data Analysis", "Strategic Planning", "Market Research"],
      resources: ["Harvard Business Review", "LinkedIn Learning", "edX"]
    },
    engineering: {
      courses: ["Advanced Engineering Mathematics", "AutoCAD Mastery", "Project Management"],
      skills: ["3D Modeling", "Circuit Design", "Material Science"],
      resources: ["MIT OpenCourseWare", "Khan Academy", "Engineering Forums"]
    },
    default: {
      courses: ["Professional Communication", "Digital Skills Fundamentals", "Project Management"],
      skills: ["Critical Thinking", "Problem Solving", "Time Management"],
      resources: ["Khan Academy", "Coursera", "YouTube Educational Channels"]
    }
  };
  
  // Determine which recommendation set to use
  const degreeInput = degree.toLowerCase();
  let recommendationSet = recommendations.default;
  
  if (degreeInput.includes("computer") || degreeInput.includes("it") || degreeInput.includes("software")) {
    recommendationSet = recommendations.computerScience;
  } else if (degreeInput.includes("business") || degreeInput.includes("management") || degreeInput.includes("commerce")) {
    recommendationSet = recommendations.business;
  } else if (degreeInput.includes("engineering") || degreeInput.includes("mechanical") || degreeInput.includes("electrical")) {
    recommendationSet = recommendations.engineering;
  }
  
  return (
    <div className="space-y-4 bg-nexacore-blue-dark/50 p-4 rounded-xl border border-white/10">
      <h3 className="text-lg font-semibold flex items-center">
        <GraduationCap className="mr-2 text-nexacore-teal" size={20} />
        Your Educational Path
      </h3>
      
      <div className="space-y-3">
        <div className="bg-white/5 p-3 rounded-lg border-l-2 border-nexacore-teal">
          <h4 className="font-medium text-nexacore-teal">Recommended Courses</h4>
          <ul className="mt-2 space-y-1 text-sm text-white/80">
            {recommendationSet.courses.map((course, index) => (
              <li key={index} className="flex items-center">
                <ArrowRight size={12} className="mr-2 text-nexacore-teal" />
                {course} {index === 0 && <span className="ml-2 px-2 py-0.5 text-xs bg-nexacore-teal/20 text-nexacore-teal rounded-full">Best Match</span>}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white/5 p-3 rounded-lg border-l-2 border-nexacore-teal">
          <h4 className="font-medium text-nexacore-teal">Skills to Develop</h4>
          <ul className="mt-2 space-y-1 text-sm text-white/80">
            {recommendationSet.skills.map((skill, index) => (
              <li key={index} className="flex items-center">
                <ArrowRight size={12} className="mr-2 text-nexacore-teal" />
                {skill}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white/5 p-3 rounded-lg border-l-2 border-nexacore-teal">
          <h4 className="font-medium text-nexacore-teal">Learning Resources</h4>
          <ul className="mt-2 space-y-1 text-sm text-white/80">
            {recommendationSet.resources.map((resource, index) => (
              <li key={index} className="flex items-center">
                <ArrowRight size={12} className="mr-2 text-nexacore-teal" />
                {resource}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white/5 p-3 rounded-lg">
          <p className="text-sm text-white/80">
            <span className="font-medium text-nexacore-teal">AI Analysis:</span> Based on your {degree} background and interest in {career}, 
            we recommend focusing on technical skills that bridge theory with practical applications. 
            Consider pursuing certifications in your field to enhance your employability.
          </p>
        </div>
      </div>
    </div>
  );
};

const EducationPage = () => {
  const [degree, setDegree] = useState("");
  const [career, setCareer] = useState("");
  const [courses, setCourses] = useState("");
  const [isRecommendationGenerated, setIsRecommendationGenerated] = useState(false);
  
  const { toast } = useToast();
  
  const handleGenerateRecommendation = () => {
    if (!degree || !career) {
      toast({
        title: "Missing information",
        description: "Please fill in your education details and career path",
        variant: "destructive"
      });
      return;
    }
    
    setIsRecommendationGenerated(true);
    toast({
      title: "Recommendations generated",
      description: "Your personalized education plan is ready!",
      variant: "default"
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Education</h1>
            <p className="text-white/70">Manage your educational journey and get AI-powered recommendations</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 flex items-center justify-center">
            <BookOpen className="text-nexacore-teal" size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <GraduationCap className="mr-2 text-nexacore-teal" size={20} />
                  Educational Information
                </CardTitle>
                <CardDescription className="text-white/70">
                  Enter your educational background and career aspirations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="degree" className="text-white">Current Education / Degree</Label>
                  <Input 
                    id="degree" 
                    placeholder="e.g., Diploma in Computer Science, Bachelor's in Business" 
                    className="bg-white/10 border-white/20 text-white" 
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="career" className="text-white">Career Path / Goals</Label>
                  <Input 
                    id="career" 
                    placeholder="e.g., Software Developer, Data Scientist, Marketing Manager" 
                    className="bg-white/10 border-white/20 text-white" 
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="courses" className="text-white">Completed Courses / Certifications</Label>
                  <Input 
                    id="courses" 
                    placeholder="e.g., Python Basics, Digital Marketing Fundamentals" 
                    className="bg-white/10 border-white/20 text-white" 
                    value={courses}
                    onChange={(e) => setCourses(e.target.value)}
                  />
                  <p className="text-xs text-white/50 mt-1">Separate multiple entries with commas</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGenerateRecommendation} 
                  className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                >
                  Generate Recommendations
                </Button>
              </CardFooter>
            </Card>

            {isRecommendationGenerated && (
              <Card className="bg-nexacore-blue-dark/50 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="mr-2 text-nexacore-teal" size={20} />
                    AI Recommendations
                  </CardTitle>
                  <CardDescription className="text-white/70">
                    Personalized education and career guidance based on your inputs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EducationRecommendation degree={degree} career={career} courses={courses} />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BookMarked className="mr-2 text-nexacore-teal" size={20} />
                  Learning Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-lg">
                  <div className="text-3xl font-bold text-nexacore-teal">0</div>
                  <p className="text-sm text-white/70">Courses Completed</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-lg">
                    <div className="text-xl font-bold text-white">0</div>
                    <p className="text-xs text-white/70">In Progress</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-lg">
                    <div className="text-xl font-bold text-white">0</div>
                    <p className="text-xs text-white/70">Hours Spent</p>
                  </div>
                </div>
                
                <div className="p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-white/70 text-center">
                    Complete your profile to track your educational progress
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Briefcase className="mr-2 text-nexacore-teal" size={20} />
                  Career Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-white/70">
                  Enter your educational information to get insights on:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Award size={16} className="mr-2 mt-0.5 text-nexacore-teal" />
                    <span>Career paths aligned with your education</span>
                  </li>
                  <li className="flex items-start">
                    <Award size={16} className="mr-2 mt-0.5 text-nexacore-teal" />
                    <span>In-demand skills in your field</span>
                  </li>
                  <li className="flex items-start">
                    <Award size={16} className="mr-2 mt-0.5 text-nexacore-teal" />
                    <span>Salary expectations for your chosen path</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  disabled={!isRecommendationGenerated}
                >
                  <FileText size={16} className="mr-2" />
                  View Detailed Analysis
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EducationPage;
