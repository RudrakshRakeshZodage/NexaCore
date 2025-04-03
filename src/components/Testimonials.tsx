
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Quote } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const testimonials = [
  {
    id: 1,
    name: "Rudraksh Zodage",
    role: "Product Designer",
    company: "DesignCore Studios",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80",
    content: "NexaCore has revolutionized how I manage my personal development. The AI recommendations are incredibly accurate, and the facial analysis feature provides insights I never expected.",
    rating: 5,
  },
  {
    id: 2,
    name: "Adarsh Mishra",
    role: "Software Engineer",
    company: "TechSprint Inc.",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80",
    content: "The all-in-one approach of NexaCore for education, health, and finance is exactly what I needed to stay organized. The attendance tracking feature has been a game-changer for my classes.",
    rating: 5,
  },
  {
    id: 3,
    name: "Atharva Bari",
    role: "Data Scientist",
    company: "AnalyticsFusion",
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&q=80",
    content: "I've tried many personal development apps, but NexaCore's AI insights are unmatched. It's transformed my daily routine and helped me achieve a much better work-life balance.",
    rating: 4,
  },
  {
    id: 4,
    name: "Hemangi Tandel",
    role: "Healthcare Professional",
    company: "Wellness Partners",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80",
    content: "The health metrics and face analysis features are surprisingly accurate. I use them daily to track my wellness and recommend NexaCore to all my colleagues and patients.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useTheme();

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-nexacore-teal dark:text-primary" : "text-gray-300 dark:text-gray-600"
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      ));
  };

  return (
    <section className={`py-20 ${
      theme === 'dark' 
        ? 'bg-gradient-to-t from-gray-900 to-gray-800' 
        : 'bg-gradient-to-t from-white to-gray-50'
    }`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animation-trigger">
          <Badge className={`mb-4 ${
            theme === 'dark' 
              ? 'bg-primary/20 text-primary' 
              : 'bg-nexacore-teal/20 text-nexacore-teal'
          }`}>Testimonials</Badge>
          <h2 className={`text-3xl md:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            What Our <span className="text-gradient">Users Say</span>
          </h2>
          <p className={`max-w-3xl mx-auto ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Hear from our users about how NexaCore has helped them achieve their goals and improve their lives.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="min-w-full p-4">
                    <Card className={`hover-lift transition-all duration-300 ${
                      theme === 'dark'
                        ? 'bg-gray-800/50 border-gray-700'
                        : 'bg-white/90 border-gray-200'
                    }`}>
                      <CardContent className="p-6 md:p-8">
                        <div className="flex items-center mb-4">
                          <div className="h-14 w-14 rounded-full overflow-hidden mr-4 border-2 border-nexacore-teal dark:border-primary">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className={`text-lg font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>{testimonial.name}</h4>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>{testimonial.role} | {testimonial.company}</p>
                          </div>
                          <div className="ml-auto flex">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                        <div className="relative">
                          <Quote className={`absolute -top-2 -left-2 w-8 h-8 ${
                            theme === 'dark' ? 'text-primary/20' : 'text-nexacore-teal/20'
                          }`} />
                          <p className={`pl-6 leading-relaxed italic ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            "{testimonial.content}"
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <button 
              onClick={handlePrev}
              className={`absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 h-10 w-10 rounded-full flex items-center justify-center transition-all focus:outline-none z-10 ${
                theme === 'dark'
                  ? 'bg-primary/80 hover:bg-primary text-background'
                  : 'bg-nexacore-teal/80 hover:bg-nexacore-teal text-white'
              }`}
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={handleNext}
              className={`absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 h-10 w-10 rounded-full flex items-center justify-center transition-all focus:outline-none z-10 ${
                theme === 'dark'
                  ? 'bg-primary/80 hover:bg-primary text-background'
                  : 'bg-nexacore-teal/80 hover:bg-nexacore-teal text-white'
              }`}
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex 
                    ? `w-6 ${theme === 'dark' ? 'bg-primary' : 'bg-nexacore-teal'}` 
                    : `w-2 ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
