
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rudraksh Zodage",
    role: "Product Designer",
    content: "NexaCore has revolutionized how I manage my personal development. The AI recommendations are incredibly accurate.",
    rating: 5,
  },
  {
    id: 2,
    name: "Adarsh Mishra",
    role: "Software Engineer",
    content: "The all-in-one approach of NexaCore for education, health, and finance is exactly what I needed to stay organized.",
    rating: 5,
  },
  {
    id: 3,
    name: "Atharva Bari",
    role: "Data Scientist",
    content: "I've tried many personal development apps, but NexaCore's AI insights are unmatched. It's transformed my daily routine.",
    rating: 4,
  },
  {
    id: 4,
    name: "Hemangi Tandel",
    role: "Healthcare Professional",
    content: "The health metrics and face analysis features are surprisingly accurate. I use them daily to track my wellness.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

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
            i < rating ? "text-nexacore-teal dark:text-primary" : "text-white/20 dark:text-muted-foreground"
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
    <section className="py-20 bg-gradient-to-t from-nexacore-blue-dark/90 to-nexacore-blue-dark dark:from-background dark:to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 reveal-animation">
          <Badge className="mb-4 bg-nexacore-teal/20 text-nexacore-teal dark:bg-primary/20 dark:text-primary">Testimonials</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white dark:text-foreground">
            What Our <span className="text-gradient">Users Say</span>
          </h2>
          <p className="text-white/70 dark:text-muted-foreground max-w-3xl mx-auto">
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
                    <Card className="bg-white/5 backdrop-blur-lg border-white/10 hover:bg-white/10 transition-all duration-300 dark:bg-foreground/5 dark:border-border dark:hover:bg-foreground/10">
                      <CardContent className="p-6 md:p-8">
                        <div className="flex items-center mb-4">
                          <div className="h-12 w-12 bg-nexacore-teal/20 dark:bg-primary/20 rounded-full flex items-center justify-center mr-4">
                            <User className="text-nexacore-teal dark:text-primary" />
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-white dark:text-foreground">{testimonial.name}</h4>
                            <p className="text-white/60 dark:text-muted-foreground text-sm">{testimonial.role}</p>
                          </div>
                          <div className="ml-auto flex">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                        <div className="relative">
                          <Quote className="absolute -top-2 -left-2 w-8 h-8 text-nexacore-teal/20 dark:text-primary/20" />
                          <p className="text-white/80 dark:text-foreground/80 italic pl-6 leading-relaxed">
                            {testimonial.content}
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
              className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 bg-nexacore-teal/80 dark:bg-primary/80 hover:bg-nexacore-teal dark:hover:bg-primary text-nexacore-blue-dark dark:text-background h-10 w-10 rounded-full flex items-center justify-center transition-all focus:outline-none"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={handleNext}
              className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 bg-nexacore-teal/80 dark:bg-primary/80 hover:bg-nexacore-teal dark:hover:bg-primary text-nexacore-blue-dark dark:text-background h-10 w-10 rounded-full flex items-center justify-center transition-all focus:outline-none"
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
                className={`h-2 w-2 rounded-full transition-all ${
                  index === activeIndex 
                    ? 'bg-nexacore-teal w-6 dark:bg-primary' 
                    : 'bg-white/30 dark:bg-foreground/30 hover:bg-white/50 dark:hover:bg-foreground/50'
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
