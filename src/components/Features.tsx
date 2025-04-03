
import { BookOpen, Heart, PiggyBank, FileText, LineChart, Camera } from "lucide-react";
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
      "glass-card bg-gradient-nexacore-card text-white border-white/10 overflow-hidden card-highlight animate-fade-in-up dark:bg-foreground/5 dark:border-border dark:text-foreground hover:scale-105 transition-all duration-300",
      className
    )} style={{ animationDelay: `${delay}s` }}>
      <CardHeader>
        <div className="h-12 w-12 rounded-full bg-nexacore-teal/20 flex items-center justify-center mb-4 dark:bg-primary/20 group-hover:scale-110 transition-all duration-300">
          {icon}
        </div>
        <CardTitle className="text-xl group-hover:text-nexacore-teal transition-colors duration-300 dark:group-hover:text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-white/80 dark:text-foreground/80 group-hover:text-white dark:group-hover:text-foreground transition-colors duration-300">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-20 bg-gradient-nexacore-dark dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white dark:text-foreground animate-fade-in-up">
            Complete <span className="text-gradient">Life Management</span> Platform
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto dark:text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            NexaCore combines education, health, and finance into one seamless platform with AI-driven recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="Education Insights"
            description="Get AI-powered recommendations for courses, certifications, and skills based on your current education and career goals."
            icon={<BookOpen className="text-nexacore-teal dark:text-primary" size={24} />}
            delay={0.1}
            className="group hover:shadow-nexacore-teal/30 dark:hover:shadow-primary/30"
          />
          
          <FeatureCard
            title="Health Analysis"
            description="Receive personalized health recommendations including nutrition, exercise routines, and wellness tips based on your profile."
            icon={<Heart className="text-nexacore-orange dark:text-destructive" size={24} />}
            delay={0.2}
            className="group hover:shadow-nexacore-orange/30 dark:hover:shadow-destructive/30"
          />
          
          <FeatureCard
            title="Financial Planning"
            description="Track expenses, set budgets, and get advice on saving and investment opportunities tailored to your financial situation."
            icon={<PiggyBank className="text-nexacore-pink dark:text-accent" size={24} />}
            delay={0.3}
            className="group hover:shadow-nexacore-pink/30 dark:hover:shadow-accent/30"
          />
          
          <FeatureCard
            title="Comprehensive Reports"
            description="Generate detailed PDF reports summarizing your progress and insights across all three areas for easy reference."
            icon={<FileText className="text-nexacore-teal-light dark:text-secondary" size={24} />}
            delay={0.4}
            className="group hover:shadow-nexacore-teal-light/30 dark:hover:shadow-secondary/30"
          />
          
          <FeatureCard
            title="Progress Tracking"
            description="Visualize your progress with charts and graphs to stay motivated and see your growth over time."
            icon={<LineChart className="text-nexacore-orange dark:text-warning" size={24} />}
            delay={0.5}
            className="group hover:shadow-nexacore-orange/30 dark:hover:shadow-warning/30"
          />
          
          <FeatureCard
            title="Facial Analysis"
            description="Advanced AI technology that analyzes facial expressions to provide wellness metrics and mental state insights."
            icon={<Camera className="text-nexacore-teal dark:text-primary" size={24} />}
            delay={0.6}
            className="group hover:shadow-nexacore-teal/30 dark:hover:shadow-primary/30"
          />
        </div>
      </div>
    </section>
  );
};

export default Features;
