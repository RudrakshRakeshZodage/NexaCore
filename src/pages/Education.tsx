
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Certificate,
  ChevronRight
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const Education = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    educationLevel: "",
    major: "",
    careerPath: "",
    completedCourses: "",
    interests: ""
  });
  const [recommendations, setRecommendations] = useState<null | {
    courses: {title: string, description: string, fee: string}[],
    resources: {title: string, type: string, link: string}[],
    skills: string[]
  }>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate AI recommendation generation
    setTimeout(() => {
      // Mock data - in a real app this would come from an AI service
      const mockRecommendations = {
        courses: [
          {
            title: "Machine Learning Fundamentals",
            description: "Learn the basics of machine learning algorithms and applications",
            fee: "$49.99"
          },
          {
            title: "Full Stack Web Development",
            description: "Comprehensive course on modern web development technologies",
            fee: "$79.99"
          },
          {
            title: "Data Science with Python",
            description: "Master data analysis and visualization with Python",
            fee: "$59.99"
          }
        ],
        resources: [
          {
            title: "Coding Interview Prep",
            type: "Online Workshop",
            link: "#"
          },
          {
            title: "Algorithms & Data Structures",
            type: "E-Book",
            link: "#"
          },
          {
            title: "JavaScript: The Good Parts",
            type: "Book",
            link: "#"
          }
        ],
        skills: [
          "Problem Solving",
          "Data Analysis",
          "UI/UX Design",
          "Project Management",
          "Cloud Computing"
        ]
      };
      
      setRecommendations(mockRecommendations);
      setIsLoading(false);
      toast({
        title: "Recommendations Generated",
        description: "We've analyzed your information and created personalized recommendations.",
        variant: "success"
      });
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Education</h1>
          <p className="text-white/70 mt-1">
            Enter your educational background to receive personalized learning recommendations
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Form */}
          <Card className="glass-card overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <GraduationCap className="mr-2" /> 
                Educational Information
              </CardTitle>
              <CardDescription className="text-white/70">
                Tell us about your educational journey and goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="educationLevel" className="text-white">Current Education Level</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("educationLevel", value)}
                    required
                  >
                    <SelectTrigger className="bg-nexacore-blue-dark/50 border-white/20 text-white">
                      <SelectValue placeholder="Select your education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major" className="text-white">Field of Study / Major</Label>
                  <Input 
                    id="major"
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science, Medicine, Business"
                    className="bg-nexacore-blue-dark/50 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="careerPath" className="text-white">Desired Career Path</Label>
                  <Input 
                    id="careerPath"
                    name="careerPath"
                    value={formData.careerPath}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineer, Data Scientist"
                    className="bg-nexacore-blue-dark/50 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="completedCourses" className="text-white">Courses/Certifications Completed</Label>
                  <Textarea 
                    id="completedCourses"
                    name="completedCourses"
                    value={formData.completedCourses}
                    onChange={handleChange}
                    placeholder="List any relevant courses or certifications you've completed"
                    className="bg-nexacore-blue-dark/50 border-white/20 text-white min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests" className="text-white">Learning Interests</Label>
                  <Textarea 
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="What subjects or skills are you most interested in learning?"
                    className="bg-nexacore-blue-dark/50 border-white/20 text-white min-h-[80px]"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal-light"
                  disabled={isLoading}
                >
                  {isLoading ? "Analyzing..." : "Generate Recommendations"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="space-y-6">
            {recommendations ? (
              <>
                {/* Courses */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Certificate className="mr-2" /> 
                      Recommended Courses & Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recommendations.courses.map((course, index) => (
                      <div key={index} className="p-3 bg-nexacore-blue/30 rounded-lg border border-white/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-nexacore-teal">{course.title}</h4>
                            <p className="text-sm text-white/70 mt-1">{course.description}</p>
                          </div>
                          <span className="text-sm text-white/90 bg-nexacore-teal/20 px-2 py-1 rounded">
                            {course.fee}
                          </span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-nexacore-teal/50 text-nexacore-teal">
                      View All Course Options
                    </Button>
                  </CardFooter>
                </Card>

                {/* Learning Resources */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <BookOpen className="mr-2" /> 
                      Learning Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recommendations.resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-nexacore-blue/30 rounded-lg border border-white/10">
                          <div>
                            <h4 className="font-medium text-white">{resource.title}</h4>
                            <p className="text-xs text-white/70">{resource.type}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-nexacore-teal hover:text-nexacore-teal-light">
                            <ChevronRight size={18} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Briefcase className="mr-2" /> 
                      Skills to Develop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {recommendations.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 rounded-full bg-nexacore-teal/20 text-nexacore-teal text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="glass-card h-full flex flex-col justify-center items-center py-12">
                <CardContent className="text-center">
                  <div className="rounded-full bg-nexacore-blue/30 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <GraduationCap size={32} className="text-nexacore-teal" />
                  </div>
                  <h3 className="text-white text-xl font-medium mb-2">Educational Recommendations</h3>
                  <p className="text-white/70 mb-6">
                    Fill out the form to receive personalized recommendations for courses, resources, and skills to develop.
                  </p>
                  {isLoading && (
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

export default Education;
