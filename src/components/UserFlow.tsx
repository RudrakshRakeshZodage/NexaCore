
import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, LayoutDashboard, FileInput, Sparkles, MessageSquare, LineChart, FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlowStepProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const FlowStep = ({ title, description, icon, isActive, onClick }: FlowStepProps) => {
  return (
    <div 
      className={`relative flex flex-col items-center ${isActive ? 'scale-110 z-10' : 'opacity-70'} transition-all duration-300 cursor-pointer`}
      onClick={onClick}
    >
      <div className={`h-16 w-16 rounded-full flex items-center justify-center mb-3 ${
        isActive 
          ? 'bg-gradient-to-r from-nexacore-teal to-nexacore-pink text-white'
          : 'bg-white/10 text-white/70'
      }`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-1 text-white">{title}</h3>
      <p className="text-sm text-white/70 text-center max-w-[180px]">{description}</p>
      
      {/* Connector Line */}
      <div className="hidden md:block absolute top-8 -right-1/2 w-full h-0.5 bg-white/20"></div>
    </div>
  );
};

const steps = [
  {
    title: "Registration",
    description: "Sign up via Google or email with OAuth authentication",
    icon: <UserPlus size={28} />
  },
  {
    title: "Dashboard",
    description: "Access education, health, and finance sections",
    icon: <LayoutDashboard size={28} />
  },
  {
    title: "Data Input",
    description: "Enter your information in each relevant section",
    icon: <FileInput size={28} />
  },
  {
    title: "AI Analysis",
    description: "Our AI processes your data to generate insights",
    icon: <Sparkles size={28} />
  },
  {
    title: "Recommendations",
    description: "Receive personalized recommendations in all areas",
    icon: <MessageSquare size={28} />
  },
  {
    title: "Progress Tracking",
    description: "Track your goals with visual representations",
    icon: <LineChart size={28} />
  },
  {
    title: "Report Generation",
    description: "Download a detailed PDF summary of insights",
    icon: <FileText size={28} />
  },
  {
    title: "Logout",
    description: "Securely log out after your session",
    icon: <LogOut size={28} />
  }
];

const UserFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  // Descriptions for the detail view
  const stepDetails = [
    {
      title: "User Registration",
      points: [
        "Create an account with your email or Google",
        "Secure authentication through OAuth",
        "Set up your basic profile information"
      ]
    },
    {
      title: "Main Dashboard",
      points: [
        "Access your personalized dashboard",
        "Navigate between Education, Health, and Finance sections",
        "View your overall progress and stats"
      ]
    },
    {
      title: "Data Input",
      points: [
        "Enter education details like current studies and career goals",
        "Input health information including medical conditions and lifestyle",
        "Add financial data such as income, expenses, and goals"
      ]
    },
    {
      title: "AI Processing",
      points: [
        "Advanced AI analyzes your input data",
        "Cross-references information across all three sections",
        "Prepares personalized insights and recommendations"
      ]
    },
    {
      title: "Smart Recommendations",
      points: [
        "Education: Course suggestions and skill development paths",
        "Health: Personalized nutrition, exercise, and wellness tips",
        "Finance: Budgeting advice and investment opportunities"
      ]
    },
    {
      title: "Progress Visualization",
      points: [
        "Interactive charts and graphs track your progress",
        "Set and monitor goals in all three areas",
        "Celebrate achievements and milestones"
      ]
    },
    {
      title: "Comprehensive Reports",
      points: [
        "Generate detailed PDF reports of your journey",
        "Include all insights, recommendations, and progress",
        "Save and share your reports as needed"
      ]
    },
    {
      title: "Secure Logout",
      points: [
        "End your session securely",
        "Protect your personal data and privacy",
        "Return anytime to continue your journey"
      ]
    }
  ];

  // Auto-advance the active step
  React.useEffect(() => {
    if (!autoplayEnabled) return;
    
    const timer = setTimeout(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [activeStep, autoplayEnabled]);

  return (
    <section id="flow" className="py-20 bg-nexacore-blue-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 right-10 w-64 h-64 rounded-full bg-nexacore-pink/10 blur-3xl"></div>
      <div className="absolute bottom-1/3 left-10 w-80 h-80 rounded-full bg-nexacore-teal/10 blur-3xl"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Your <span className="text-gradient">Journey</span> with NexaCore
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto">
            Explore the seamless user experience from registration to detailed insights
          </p>
        </div>

        {/* Flow Steps - Desktop Version */}
        <div className="hidden md:flex justify-between mb-16 relative">
          {steps.map((step, index) => (
            <FlowStep
              key={index}
              title={step.title}
              description={step.description}
              icon={step.icon}
              isActive={activeStep === index}
              onClick={() => {
                setActiveStep(index);
                setAutoplayEnabled(false);
              }}
            />
          ))}
        </div>

        {/* Flow Steps - Mobile Version */}
        <div className="md:hidden flex overflow-x-auto pb-6 gap-4 mb-10">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex-shrink-0 w-32 flex flex-col items-center ${activeStep === index ? '' : 'opacity-50'}`}
              onClick={() => {
                setActiveStep(index);
                setAutoplayEnabled(false);
              }}
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${
                activeStep === index 
                  ? 'bg-gradient-to-r from-nexacore-teal to-nexacore-pink text-white'
                  : 'bg-white/10 text-white/70'
              }`}>
                {step.icon}
              </div>
              <h3 className="text-sm font-medium text-white text-center">{step.title}</h3>
            </div>
          ))}
        </div>

        {/* Step Details */}
        <div className="glass-card p-8 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-gradient">{stepDetails[activeStep].title}</h3>
          <ul className="space-y-3">
            {stepDetails[activeStep].points.map((point, index) => (
              <motion.li 
                key={index} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 text-white"
              >
                <div className="h-6 w-6 rounded-full bg-nexacore-teal/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-nexacore-teal"></div>
                </div>
                <span>{point}</span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-6 flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm"
              className="border-nexacore-teal text-white hover:bg-nexacore-teal/20"
              onClick={() => setAutoplayEnabled(!autoplayEnabled)}
            >
              {autoplayEnabled ? "Pause Autoplay" : "Enable Autoplay"}
            </Button>
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    activeStep === index ? "bg-nexacore-teal" : "bg-white/30"
                  }`}
                  onClick={() => {
                    setActiveStep(index);
                    setAutoplayEnabled(false);
                  }}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserFlow;
