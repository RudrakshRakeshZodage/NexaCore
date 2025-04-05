import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon, MessageSquareIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase"; // Import your Firebase database
import { collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";

const Education = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State variables
  const [educationLevel, setEducationLevel] = useState("");
  const [institution, setInstitution] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [careerPath, setCareerPath] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [completedCourses, setCompletedCourses] = useState<
    { name: string; provider: string; completionDate: string; certificate: boolean }[]
  >([]);
  const [newCourse, setNewCourse] = useState({
    name: "",
    provider: "",
    completionDate: "",
    certificate: false,
  });
  const [recommendations, setRecommendations] = useState<
    {
      courses: { name: string; provider: string; estimatedFee: string; duration: string }[];
      resources: { name: string; type: string; link: string }[];
      skillsToLearn: string[];
    }
  >({
    courses: [
      { name: "Machine Learning Fundamentals", provider: "Coursera", estimatedFee: "$49", duration: "3 months" },
      { name: "Full Stack Web Development", provider: "Udemy", estimatedFee: "$19.99", duration: "4 months" },
      { name: "Data Structures & Algorithms", provider: "edX", estimatedFee: "$99", duration: "2 months" },
    ],
    resources: [
      { name: "Clean Code", type: "Book", link: "https://example.com/cleancode" },
      { name: "Tech Career Workshop", type: "Workshop", link: "https://example.com/workshop" },
      { name: "Coding Interview Prep", type: "Course", link: "https://example.com/interview" },
    ],
    skillsToLearn: ["React.js", "Data Analysis with Python", "UI/UX Design Principles", "System Design"],
  });

  const [educationDocId, setEducationDocId] = useState<string | null>(null);

  // Fetch education data from Firebase on component mount
  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "education"));
        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0];
          const data = docSnapshot.data();
          setEducationDocId(docSnapshot.id);
          setEducationLevel(data.educationLevel || "");
          setInstitution(data.institution || "");
          setFieldOfStudy(data.fieldOfStudy || "");
          setGraduationYear(data.graduationYear || "");
          setCareerPath(data.careerPath || "");
          setCareerGoals(data.careerGoals || "");
          setSkills(data.skills || []);
          setCompletedCourses(data.completedCourses || []);
        }
      } catch (error) {
        console.error("Error fetching education data:", error);
        toast({ title: "Error", description: "Failed to load education data.", variant: "destructive" });
      }
    };

    fetchEducationData();
  }, [toast]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleAddCourse = () => {
    if (newCourse.name.trim() && newCourse.provider.trim()) {
      setCompletedCourses([...completedCourses, newCourse]);
      setNewCourse({ name: "", provider: "", completionDate: "", certificate: false });
    }
  };

  const handleRemoveCourse = (index: number) => {
    setCompletedCourses(completedCourses.filter((_, i) => i !== index));
  };

  const generateRecommendations = () => {
    toast({
      title: "Recommendations Updated",
      description: "AI has analyzed your profile and updated your recommendations.",
    });
  };

  const saveEducationDetails = async () => {
    try {
      const educationData = {
        educationLevel,
        institution,
        fieldOfStudy,
        graduationYear,
        careerPath,
        careerGoals,
        skills,
        completedCourses,
      };

      if (educationDocId) {
        await updateDoc(doc(db, "education", educationDocId), educationData);
      } else {
        const docRef = await addDoc(collection(db, "education"), educationData);
        setEducationDocId(docRef.id);
      }

      toast({ title: "Education Details Saved", description: "Your education details have been successfully saved." });
    } catch (error) {
      console.error("Error saving education details:", error);
      toast({ title: "Error", description: "Failed to save education details.", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Education</h1>
          <p className="text-muted-foreground">Manage your education details and get personalized recommendations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={generateRecommendations}
            className="flex items-center gap-2"
          >
            <MessageSquareIcon size={16} />
            Generate Recommendations
          </Button>
          <Button onClick={saveEducationDetails}>Save Details</Button>
        </div>
      </div>
      
      <Tabs defaultValue="education" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="education">Education Details</TabsTrigger>
          <TabsTrigger value="skills">Skills & Courses</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>
        
        {/* Education Details Tab */}
        <TabsContent value="education" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Education</CardTitle>
              <CardDescription>
                Enter details about your current or highest level of education
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="educationLevel">Level of Education</Label>
                  <Select value={educationLevel} onValueChange={setEducationLevel}>
                    <SelectTrigger id="educationLevel">
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high_school">High School</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="associate">Associate Degree</SelectItem>
                      <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                      <SelectItem value="master">Master's Degree</SelectItem>
                      <SelectItem value="doctorate">Doctorate/PhD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input 
                    id="institution" 
                    placeholder="Enter institution name" 
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fieldOfStudy">Field of Study</Label>
                  <Input 
                    id="fieldOfStudy" 
                    placeholder="E.g. Computer Science, Biology" 
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Expected/Completed Graduation Year</Label>
                  <Input 
                    id="graduationYear" 
                    placeholder="YYYY" 
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Career Information</CardTitle>
              <CardDescription>
                Tell us about your career aspirations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="careerPath">Career Path</Label>
                  <Input 
                    id="careerPath" 
                    placeholder="E.g. Software Developer, Data Scientist" 
                    value={careerPath}
                    onChange={(e) => setCareerPath(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="careerGoals">Career Goals</Label>
                  <Textarea 
                    id="careerGoals" 
                    placeholder="Describe your short and long-term career goals" 
                    value={careerGoals}
                    onChange={(e) => setCareerGoals(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Skills & Courses Tab */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
              <CardDescription>
                List your relevant skills and competencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a skill" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                  />
                  <Button onClick={handleAddSkill} size="icon">
                    <PlusIcon size={16} />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {skill}
                      <button 
                        className="ml-2 text-xs hover:text-destructive"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  {skills.length === 0 && (
                    <p className="text-sm text-muted-foreground">No skills added yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Completed Courses & Certifications</CardTitle>
              <CardDescription>
                Add courses and certifications you've completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseName">Course Name</Label>
                    <Input 
                      id="courseName" 
                      placeholder="E.g. Introduction to Python" 
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Input 
                      id="provider" 
                      placeholder="E.g. Coursera, University" 
                      value={newCourse.provider}
                      onChange={(e) => setNewCourse({...newCourse, provider: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="completionDate">Completion Date</Label>
                    <Input 
                      id="completionDate" 
                      type="date" 
                      value={newCourse.completionDate}
                      onChange={(e) => setNewCourse({...newCourse, completionDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox 
                      id="certificate" 
                      checked={newCourse.certificate}
                      onCheckedChange={(checked) => 
                        setNewCourse({...newCourse, certificate: checked as boolean})
                      }
                    />
                    <label
                      htmlFor="certificate"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I have a certificate for this course
                    </label>
                  </div>
                </div>
                
                <Button onClick={handleAddCourse} className="flex items-center gap-2">
                  <PlusIcon size={16} />
                  Add Course
                </Button>
                
                {completedCourses.length > 0 ? (
                  <div className="space-y-4 mt-6">
                    <h3 className="text-lg font-medium">Your Courses</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {completedCourses.map((course, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">{course.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {course.provider} • {course.completionDate ? new Date(course.completionDate).toLocaleDateString() : 'N/A'}
                            </p>
                            {course.certificate && (
                              <Badge variant="outline" className="mt-1">Certificate</Badge>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveCourse(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-4">No courses added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* AI Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Courses</CardTitle>
              <CardDescription>
                Based on your profile, we recommend these courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.courses.map((course, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{course.name}</h3>
                      <Badge>{course.estimatedFee}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{course.provider}</p>
                    <p className="text-sm">Duration: {course.duration}</p>
                    <Button variant="link" className="p-0 h-auto mt-2">View Details</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Learning Resources</CardTitle>
              <CardDescription>
                Additional resources to enhance your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.resources.map((resource, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{resource.name}</h3>
                      <Badge variant="outline">{resource.type}</Badge>
                    </div>
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View Resource
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Skills to Develop</CardTitle>
              <CardDescription>
                These skills will help you advance in your career path
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.skillsToLearn.map((skill, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <h3 className="font-medium">{skill}</h3>
                    <p className="text-sm text-muted-foreground">Highly relevant to your career path</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => navigate('/reports')}>
                Generate Detailed Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </DashboardLayout>
  );
};

export default Education;






