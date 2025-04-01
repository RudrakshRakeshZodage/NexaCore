
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Award,
  BookMarked,
  FileText, 
  Brain,
  ArrowRight,
  BarChart2,
  School,
  CheckCircle,
  ExternalLink,
  Calendar,
  Clock,
  Sparkle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";

const EducationRecommendation = ({ degree, career, courses }: any) => {
  if (!degree || !career) {
    return <p className="text-white/70 dark:text-foreground/70">Please fill out all fields to get personalized recommendations.</p>;
  }

  // Mock AI recommendations based on user input
  const recommendations = {
    computerScience: {
      courses: [
        {
          title: "Machine Learning Fundamentals",
          provider: "Coursera",
          link: "https://www.coursera.org",
          duration: "10 weeks",
          fee: "₹2,500",
          skillLevel: "Intermediate"
        },
        {
          title: "Full Stack Web Development",
          provider: "Udemy",
          link: "https://www.udemy.com",
          duration: "12 weeks",
          fee: "₹1,800",
          skillLevel: "Beginner to Intermediate"
        },
        {
          title: "Data Structures & Algorithms",
          provider: "edX",
          link: "https://www.edx.org",
          duration: "8 weeks",
          fee: "₹3,200",
          skillLevel: "Intermediate"
        }
      ],
      skills: ["Python Programming", "Database Management", "Cloud Computing", "AI/ML", "Data Structures"],
      resources: [
        {
          name: "Coursera",
          type: "Platform",
          link: "https://www.coursera.org"
        },
        {
          name: "Udemy",
          type: "Platform",
          link: "https://www.udemy.com"
        },
        {
          name: "GitHub Learning Lab",
          type: "Interactive",
          link: "https://lab.github.com"
        }
      ],
      career: {
        paths: ["Software Developer", "Data Scientist", "Machine Learning Engineer", "Full Stack Developer"],
        avgSalary: "₹6-12 LPA for freshers",
        growthRate: "22% annual growth rate",
        demandSkills: ["Cloud Computing", "AI/ML", "React", "Node.js"]
      }
    },
    business: {
      courses: [
        {
          title: "Business Analytics",
          provider: "IIM Calcutta",
          link: "https://iimcalcutta.ac.in",
          duration: "12 weeks",
          fee: "₹55,000",
          skillLevel: "Intermediate"
        },
        {
          title: "Digital Marketing",
          provider: "Simplilearn",
          link: "https://www.simplilearn.com",
          duration: "8 weeks",
          fee: "₹25,000",
          skillLevel: "Beginner to Intermediate"
        },
        {
          title: "Financial Management",
          provider: "UpGrad",
          link: "https://www.upgrad.com",
          duration: "16 weeks",
          fee: "₹35,000",
          skillLevel: "Intermediate"
        }
      ],
      skills: ["Data Analysis", "Strategic Planning", "Market Research", "Financial Modeling", "Project Management"],
      resources: [
        {
          name: "Harvard Business Review",
          type: "Publication",
          link: "https://hbr.org"
        },
        {
          name: "LinkedIn Learning",
          type: "Platform",
          link: "https://www.linkedin.com/learning"
        },
        {
          name: "edX",
          type: "Platform",
          link: "https://www.edx.org"
        }
      ],
      career: {
        paths: ["Business Analyst", "Marketing Manager", "Finance Consultant", "Entrepreneur"],
        avgSalary: "₹5-9 LPA for freshers",
        growthRate: "15% annual growth rate",
        demandSkills: ["Data Analytics", "Digital Marketing", "Financial Modeling"]
      }
    },
    engineering: {
      courses: [
        {
          title: "Advanced Engineering Mathematics",
          provider: "NPTEL",
          link: "https://nptel.ac.in",
          duration: "12 weeks",
          fee: "Free (Certificate: ₹1,500)",
          skillLevel: "Advanced"
        },
        {
          title: "AutoCAD Mastery",
          provider: "Udemy",
          link: "https://www.udemy.com",
          duration: "6 weeks",
          fee: "₹1,200",
          skillLevel: "Beginner to Intermediate"
        },
        {
          title: "Project Management for Engineers",
          provider: "Coursera",
          link: "https://www.coursera.org",
          duration: "8 weeks",
          fee: "₹2,000",
          skillLevel: "Intermediate"
        }
      ],
      skills: ["3D Modeling", "Circuit Design", "Material Science", "Project Planning", "Technical Documentation"],
      resources: [
        {
          name: "MIT OpenCourseWare",
          type: "Platform",
          link: "https://ocw.mit.edu"
        },
        {
          name: "Khan Academy",
          type: "Platform",
          link: "https://www.khanacademy.org"
        },
        {
          name: "Engineering Forums",
          type: "Community",
          link: "https://www.eng-tips.com"
        }
      ],
      career: {
        paths: ["Mechanical Engineer", "Electrical Engineer", "Project Manager", "Design Engineer"],
        avgSalary: "₹4-8 LPA for freshers",
        growthRate: "12% annual growth rate",
        demandSkills: ["AutoCAD", "PLM", "IoT", "Renewable Energy"]
      }
    },
    default: {
      courses: [
        {
          title: "Professional Communication",
          provider: "Coursera",
          link: "https://www.coursera.org",
          duration: "4 weeks",
          fee: "₹1,500",
          skillLevel: "Beginner"
        },
        {
          title: "Digital Skills Fundamentals",
          provider: "Google Digital Garage",
          link: "https://learndigital.withgoogle.com",
          duration: "6 weeks",
          fee: "Free",
          skillLevel: "Beginner"
        },
        {
          title: "Project Management",
          provider: "edX",
          link: "https://www.edx.org",
          duration: "8 weeks",
          fee: "₹2,500",
          skillLevel: "Beginner to Intermediate"
        }
      ],
      skills: ["Critical Thinking", "Problem Solving", "Time Management", "Digital Literacy", "Communication"],
      resources: [
        {
          name: "Khan Academy",
          type: "Platform",
          link: "https://www.khanacademy.org"
        },
        {
          name: "Coursera",
          type: "Platform",
          link: "https://www.coursera.org"
        },
        {
          name: "YouTube Educational Channels",
          type: "Videos",
          link: "https://www.youtube.com"
        }
      ],
      career: {
        paths: ["Various entry-level positions", "Administrative roles", "Customer Service", "Sales"],
        avgSalary: "₹3-5 LPA for freshers",
        growthRate: "Varies by industry",
        demandSkills: ["Communication", "MS Office", "Basic Digital Skills"]
      }
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
    <div className="space-y-6">
      <div className="bg-nexacore-blue-dark/50 dark:bg-card/50 p-4 rounded-xl border border-white/10 dark:border-border">
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <GraduationCap className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
          Your Educational Path
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-white dark:text-foreground mb-2">Recommended Courses</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendationSet.courses.map((course, index) => (
                <div key={index} className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg border-l-2 border-nexacore-teal dark:border-primary">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-nexacore-teal dark:text-primary">{course.title}</h5>
                    {index === 0 && <Badge className="bg-nexacore-orange dark:bg-accent text-white dark:text-background">Best Match</Badge>}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 dark:text-foreground/70">Provider:</span>
                      <span className="text-white dark:text-foreground">{course.provider}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 dark:text-foreground/70">Duration:</span>
                      <span className="text-white dark:text-foreground">{course.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 dark:text-foreground/70">Fee:</span>
                      <span className="text-white dark:text-foreground">{course.fee}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 dark:text-foreground/70">Level:</span>
                      <span className="text-white dark:text-foreground">{course.skillLevel}</span>
                    </div>
                  </div>
                  <Button 
                    variant="link" 
                    className="text-nexacore-teal dark:text-primary p-0 h-auto mt-2"
                    onClick={() => window.open(course.link, '_blank')}
                  >
                    Visit Course <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-white dark:text-foreground mb-2">Skills to Develop</h4>
            <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {recommendationSet.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="border-nexacore-teal dark:border-primary text-white dark:text-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-white dark:text-foreground mb-2">Learning Resources</h4>
            <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendationSet.resources.map((resource, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="justify-start border-white/20 dark:border-foreground/20 text-white dark:text-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                    onClick={() => window.open(resource.link, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">{resource.name}</div>
                      <div className="text-xs text-white/60 dark:text-foreground/60">{resource.type}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-nexacore-blue-dark/50 dark:bg-card/50 p-4 rounded-xl border border-white/10 dark:border-border">
        <h3 className="text-lg font-semibold flex items-center mb-4">
          <Briefcase className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
          Career Insights
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-white dark:text-foreground mb-2">Potential Career Paths</h4>
              <ul className="space-y-1">
                {recommendationSet.career.paths.map((path, index) => (
                  <li key={index} className="flex items-center">
                    <ArrowRight className="h-3 w-3 text-nexacore-teal dark:text-primary mr-2" />
                    <span className="text-white/90 dark:text-foreground/90">{path}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-white dark:text-foreground mb-2">Salary & Growth</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between">
                    <span className="text-white/70 dark:text-foreground/70">Average Salary:</span>
                    <span className="text-white dark:text-foreground font-medium">{recommendationSet.career.avgSalary}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-white/70 dark:text-foreground/70">Industry Growth:</span>
                    <span className="text-white dark:text-foreground font-medium">{recommendationSet.career.growthRate}</span>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col">
                    <span className="text-white/70 dark:text-foreground/70 mb-2">In-Demand Skills:</span>
                    <div className="flex flex-wrap gap-2">
                      {recommendationSet.career.demandSkills.map((skill, index) => (
                        <Badge 
                          key={index} 
                          className="bg-nexacore-teal/20 dark:bg-primary/20 text-nexacore-teal dark:text-primary hover:bg-nexacore-teal/30 dark:hover:bg-primary/30"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-white dark:text-foreground mb-2">AI Analysis</h4>
            <p className="text-white/80 dark:text-foreground/80">
              Based on your {degree} background and interest in {career}, 
              we recommend focusing on technical skills that bridge theory with practical applications. 
              Consider pursuing certifications in your field to enhance your employability and staying updated 
              with the latest industry trends through online courses and workshops.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EducationPage = () => {
  const [activeTab, setActiveTab] = useState("input");
  const [degree, setDegree] = useState("");
  const [career, setCareer] = useState("");
  const [courses, setCourses] = useState("");
  const [isRecommendationGenerated, setIsRecommendationGenerated] = useState(false);
  const [upcomingCourses, setUpcomingCourses] = useState([
    { id: 1, title: "Introduction to Python", date: "10 Jul 2023", time: "10:00 AM - 12:00 PM", completed: false },
    { id: 2, title: "Web Development Basics", date: "15 Jul 2023", time: "2:00 PM - 4:00 PM", completed: false },
    { id: 3, title: "Database Management", date: "20 Jul 2023", time: "11:00 AM - 1:00 PM", completed: false }
  ]);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
    setActiveTab("recommendations");
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
            <p className="text-white/70 dark:text-foreground/70">Manage your educational journey and get AI-powered recommendations</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 dark:bg-primary/20 flex items-center justify-center">
            <BookOpen className="text-nexacore-teal dark:text-primary" size={24} />
          </div>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/10 dark:bg-foreground/10 p-1">
            <TabsTrigger value="input" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
              Education Information
            </TabsTrigger>
            <TabsTrigger 
              value="recommendations"
              className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background"
              disabled={!isRecommendationGenerated}
            >
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-nexacore-teal data-[state=active]:dark:bg-primary data-[state=active]:text-nexacore-blue-dark data-[state=active]:dark:text-background">
              Learning Schedule
            </TabsTrigger>
          </TabsList>
      
          <TabsContent value="input">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <GraduationCap className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      Educational Information
                    </CardTitle>
                    <CardDescription className="text-white/70 dark:text-card-foreground/70">
                      Enter your educational background and career aspirations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="degree" className="text-white dark:text-card-foreground">Current Education / Degree</Label>
                      <Input 
                        id="degree" 
                        placeholder="e.g., Diploma in Computer Science, Bachelor's in Business" 
                        className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="career" className="text-white dark:text-card-foreground">Career Path / Goals</Label>
                      <Input 
                        id="career" 
                        placeholder="e.g., Software Developer, Data Scientist, Marketing Manager" 
                        className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground" 
                        value={career}
                        onChange={(e) => setCareer(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="courses" className="text-white dark:text-card-foreground">Completed Courses / Certifications</Label>
                      <Textarea 
                        id="courses" 
                        placeholder="e.g., Python Basics, Digital Marketing Fundamentals" 
                        className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground min-h-[100px]" 
                        value={courses}
                        onChange={(e) => setCourses(e.target.value)}
                      />
                      <p className="text-xs text-white/50 dark:text-card-foreground/50 mt-1">Separate multiple entries with commas</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="interests" className="text-white dark:text-card-foreground">Areas of Interest</Label>
                      <Select>
                        <SelectTrigger id="interests" className="bg-white/10 dark:bg-foreground/10 border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground">
                          <SelectValue placeholder="Select areas of interest" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology & Computing</SelectItem>
                          <SelectItem value="business">Business & Management</SelectItem>
                          <SelectItem value="arts">Creative Arts & Design</SelectItem>
                          <SelectItem value="science">Science & Research</SelectItem>
                          <SelectItem value="healthcare">Healthcare & Medicine</SelectItem>
                          <SelectItem value="education">Education & Training</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-white/50 dark:text-card-foreground/50 mt-1">This helps us tailor recommendations to your interests</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleGenerateRecommendation} 
                      className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                    >
                      <Sparkle className="mr-2 h-4 w-4" />
                      Generate Recommendations
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <BarChart2 className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      Educational Progress
                    </CardTitle>
                    <CardDescription className="text-white/70 dark:text-card-foreground/70">
                      Track your learning journey and achievements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label className="text-white dark:text-card-foreground">Current Study Plan Completion</Label>
                        <span className="text-sm text-white/70 dark:text-card-foreground/70">25%</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg flex flex-col items-center justify-center">
                        <div className="text-xl font-bold text-white dark:text-card-foreground">0</div>
                        <div className="text-sm text-white/70 dark:text-card-foreground/70">Courses Completed</div>
                      </div>
                      <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg flex flex-col items-center justify-center">
                        <div className="text-xl font-bold text-white dark:text-card-foreground">3</div>
                        <div className="text-sm text-white/70 dark:text-card-foreground/70">Courses In Progress</div>
                      </div>
                      <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg flex flex-col items-center justify-center">
                        <div className="text-xl font-bold text-white dark:text-card-foreground">0</div>
                        <div className="text-sm text-white/70 dark:text-card-foreground/70">Certifications</div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg border-l-2 border-nexacore-orange dark:border-accent">
                      <h4 className="text-sm font-medium text-white dark:text-card-foreground flex items-center">
                        <School className="mr-2 h-4 w-4 text-nexacore-orange dark:text-accent" />
                        Educational Journey
                      </h4>
                      <p className="text-sm text-white/80 dark:text-card-foreground/80 mt-2">
                        Complete your profile and add your past courses to better track your progress and get more accurate recommendations.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <BookMarked className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      Learning Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-white/5 dark:bg-foreground/5 rounded-lg">
                      <div className="text-3xl font-bold text-nexacore-teal dark:text-primary">0</div>
                      <p className="text-sm text-white/70 dark:text-card-foreground/70">Study Hours This Week</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white dark:text-card-foreground">Weekly Goal</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <Progress value={0} className="h-2" />
                        </div>
                        <div className="text-sm text-white/70 dark:text-card-foreground/70">0/10 hrs</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white/5 dark:bg-foreground/5 rounded-lg">
                      <p className="text-sm text-white/70 dark:text-card-foreground/70 text-center">
                        Start tracking your learning hours to view detailed statistics
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <Calendar className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      Upcoming Classes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingCourses.length === 0 ? (
                      <p className="text-white/70 dark:text-card-foreground/70">
                        No upcoming classes scheduled
                      </p>
                    ) : (
                      upcomingCourses.map((course) => (
                        <div 
                          key={course.id} 
                          className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg space-y-1"
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-white dark:text-card-foreground">{course.title}</h4>
                            {course.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : null}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-white/70 dark:text-card-foreground/70">
                            <Calendar className="h-3 w-3" />
                            <span>{course.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-white/70 dark:text-card-foreground/70">
                            <Clock className="h-3 w-3" />
                            <span>{course.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                      onClick={() => setActiveTab("schedule")}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      View Study Schedule
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <Award className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      Top Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-white/70 dark:text-card-foreground/70">
                      Complete assessments to reveal your top skills
                    </p>
                    <Button 
                      className="w-full bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                    >
                      Start Skill Assessment
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="recommendations">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <Brain className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription className="text-white/70 dark:text-card-foreground/70">
                      Personalized education and career guidance based on your inputs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EducationRecommendation degree={degree} career={career} courses={courses} />
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                      onClick={() => {
                        navigate("/reports");
                        toast({
                          title: "Redirecting to Reports",
                          description: "Generate a complete education report from the Reports page",
                          variant: "default",
                        });
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Education Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <BarChart2 className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      Education Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70 dark:text-card-foreground/70">Course Completion Rate</span>
                        <span className="text-sm font-medium text-white dark:text-card-foreground">0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70 dark:text-card-foreground/70">Learning Goal Progress</span>
                        <span className="text-sm font-medium text-white dark:text-card-foreground">0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70 dark:text-card-foreground/70">Skill Development</span>
                        <span className="text-sm font-medium text-white dark:text-card-foreground">0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <Briefcase className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      Job Market Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg">
                      <h4 className="text-white dark:text-card-foreground font-medium mb-1">Top Hiring Industries</h4>
                      <ul className="space-y-1">
                        <li className="flex items-start">
                          <ArrowRight className="h-3 w-3 text-nexacore-teal dark:text-primary mr-2 mt-1" />
                          <span className="text-white/80 dark:text-card-foreground/80">Technology & IT</span>
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-3 w-3 text-nexacore-teal dark:text-primary mr-2 mt-1" />
                          <span className="text-white/80 dark:text-card-foreground/80">Healthcare & Pharma</span>
                        </li>
                        <li className="flex items-start">
                          <ArrowRight className="h-3 w-3 text-nexacore-teal dark:text-primary mr-2 mt-1" />
                          <span className="text-white/80 dark:text-card-foreground/80">E-commerce & Retail</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/5 dark:bg-foreground/5 p-3 rounded-lg">
                      <h4 className="text-white dark:text-card-foreground font-medium mb-1">Emerging Skills</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="border-nexacore-orange dark:border-accent text-white dark:text-card-foreground">AI/ML</Badge>
                        <Badge variant="outline" className="border-nexacore-orange dark:border-accent text-white dark:text-card-foreground">Cloud Computing</Badge>
                        <Badge variant="outline" className="border-nexacore-orange dark:border-accent text-white dark:text-card-foreground">Data Analysis</Badge>
                        <Badge variant="outline" className="border-nexacore-orange dark:border-accent text-white dark:text-card-foreground">UX/UI Design</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Explore Job Market
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <Calendar className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      Learning Schedule
                    </CardTitle>
                    <CardDescription className="text-white/70 dark:text-card-foreground/70">
                      Manage your courses and study sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="py-1 font-medium text-white/70 dark:text-card-foreground/70">{day}</div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {Array.from({ length: 35 }, (_, i) => {
                        const day = i - 2; // Offset to start with last days of previous month
                        const isCurrentMonth = day >= 1 && day <= 31;
                        const isToday = day === 10; // Example: 10th is today
                        const hasEvent = [5, 10, 15, 20].includes(day);
                        
                        return (
                          <div 
                            key={i} 
                            className={`
                              py-2 rounded-md text-sm relative
                              ${isCurrentMonth ? "text-white dark:text-card-foreground" : "text-white/30 dark:text-card-foreground/30"} 
                              ${isToday ? "bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background font-bold" : ""}
                              ${hasEvent && !isToday ? "bg-white/5 dark:bg-foreground/5" : ""}
                            `}
                          >
                            {isCurrentMonth ? day : day <= 0 ? 30 + day : day - 31}
                            {hasEvent && (
                              <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${isToday ? "bg-nexacore-blue-dark dark:bg-background" : "bg-nexacore-teal dark:bg-primary"}`}></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-white dark:text-card-foreground mb-4">Upcoming Sessions</h3>
                      <div className="space-y-3">
                        {upcomingCourses.map((course) => (
                          <div 
                            key={course.id} 
                            className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg flex justify-between items-center"
                          >
                            <div className="space-y-1">
                              <h4 className="font-medium text-white dark:text-card-foreground">{course.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-white/70 dark:text-card-foreground/70">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{course.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{course.time}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                                onClick={() => {
                                  // Logic to mark as completed would go here
                                  const updatedCourses = upcomingCourses.map(c => 
                                    c.id === course.id ? {...c, completed: true} : c
                                  );
                                  setUpcomingCourses(updatedCourses);
                                  toast({
                                    title: "Course Completed",
                                    description: `${course.title} marked as completed`,
                                    variant: "default",
                                  });
                                }}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                                onClick={() => {
                                  toast({
                                    title: "Session Joined",
                                    description: "You would join the online session here",
                                    variant: "default",
                                  });
                                }}
                              >
                                Join
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="bg-nexacore-teal dark:bg-primary text-nexacore-blue-dark dark:text-background hover:bg-nexacore-teal-light dark:hover:bg-primary/90"
                      onClick={() => {
                        toast({
                          title: "Add New Session",
                          description: "Schedule a new study session or class",
                          variant: "default",
                        });
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Study Session
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <BookMarked className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      Weekly Study Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg space-y-3">
                      <h4 className="font-medium text-white dark:text-card-foreground">Monday</h4>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/70 dark:text-card-foreground/70">Python Programming</span>
                        <span className="text-white/70 dark:text-card-foreground/70">1 hour</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg space-y-3">
                      <h4 className="font-medium text-white dark:text-card-foreground">Wednesday</h4>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/70 dark:text-card-foreground/70">Web Development</span>
                        <span className="text-white/70 dark:text-card-foreground/70">2 hours</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg space-y-3">
                      <h4 className="font-medium text-white dark:text-card-foreground">Friday</h4>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/70 dark:text-card-foreground/70">Database Management</span>
                        <span className="text-white/70 dark:text-card-foreground/70">1.5 hours</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 dark:bg-foreground/5 p-4 rounded-lg space-y-3">
                      <h4 className="font-medium text-white dark:text-card-foreground">Weekend Review</h4>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-white/70 dark:text-card-foreground/70">All Topics</span>
                        <span className="text-white/70 dark:text-card-foreground/70">2 hours</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full border-white/20 dark:border-foreground/20 text-white dark:text-card-foreground hover:bg-white/10 dark:hover:bg-foreground/10"
                      onClick={() => {
                        toast({
                          title: "Optimize Study Plan",
                          description: "AI will analyze your schedule and suggest optimizations",
                          variant: "default",
                        });
                      }}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      AI Study Optimization
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="bg-nexacore-blue-dark/50 dark:bg-card border-white/10 dark:border-border">
                  <CardHeader>
                    <CardTitle className="text-white dark:text-card-foreground flex items-center">
                      <Award className="mr-2 text-nexacore-teal dark:text-primary" size={20} />
                      Study Streaks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-white/5 dark:bg-foreground/5 rounded-lg">
                      <div className="text-4xl font-bold text-nexacore-teal dark:text-primary">0</div>
                      <p className="text-sm text-white/70 dark:text-card-foreground/70">Day Streak</p>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                        <div key={day + i} className="flex flex-col items-center">
                          <div className="text-xs text-white/50 dark:text-card-foreground/50 mb-1">{day}</div>
                          <div className="w-8 h-8 rounded-full bg-white/5 dark:bg-foreground/5 flex items-center justify-center text-white/30 dark:text-card-foreground/30">
                            -
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <p className="text-sm text-white/70 dark:text-card-foreground/70 text-center">
                      Start studying daily to build your streak!
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EducationPage;
