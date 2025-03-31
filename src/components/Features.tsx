
import { BookOpen, Heart, PiggyBank, FileText, LineChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay: number;
}

const FeatureCard = ({ title, description, icon, className, delay }: FeatureCardProps) => {
  return (
    <Card className={cn(
      "glass-card bg-gradient-nexacore-card text-white border-white/10 overflow-hidden card-highlight animate-fade-in-up",
      className
    )} style={{ animationDelay: `${delay}s` }}>
      <CardHeader>
        <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-white/80">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gradient-nexacore-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Complete <span className="text-gradient">Life Management</span> Platform
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto">
            NexaCore combines education, health, and finance into one seamless platform with AI-driven recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Education Insights"
            description="Get AI-powered recommendations for courses, certifications, and skills based on your current education and career goals."
            icon={<BookOpen className="text-nexacore-teal" size={24} />}
            delay={0.1}
          />
          
          <FeatureCard
            title="Health Analysis"
            description="Receive personalized health recommendations including nutrition, exercise routines, and wellness tips based on your profile."
            icon={<Heart className="text-nexacore-orange" size={24} />}
            delay={0.2}
          />
          
          <FeatureCard
            title="Financial Planning"
            description="Track expenses, set budgets, and get advice on saving and investment opportunities tailored to your financial situation."
            icon={<PiggyBank className="text-nexacore-pink" size={24} />}
            delay={0.3}
          />
          
          <FeatureCard
            title="Comprehensive Reports"
            description="Generate detailed PDF reports summarizing your progress and insights across all three areas for easy reference."
            icon={<FileText className="text-nexacore-teal-light" size={24} />}
            delay={0.4}
          />
          
          <FeatureCard
            title="Progress Tracking"
            description="Visualize your progress with charts and graphs to stay motivated and see your growth over time."
            icon={<LineChart className="text-nexacore-orange" size={24} />}
            delay={0.5}
            className="md:col-span-2 lg:col-span-2"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
