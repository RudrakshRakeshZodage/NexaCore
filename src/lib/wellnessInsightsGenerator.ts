
interface MetricInsight {
  description: string;
  interpretation: (score: number) => string;
  recommendations: (score: number) => string[];
}

export const wellnessMetricsInsights: Record<string, MetricInsight> = {
  happiness: {
    description: "Measures the level of positive emotions and overall contentment detected in your facial expressions.",
    interpretation: (score) => {
      if (score >= 80) return "Your expressions indicate a high level of happiness and contentment.";
      if (score >= 60) return "You appear to be in a generally positive mood.";
      if (score >= 40) return "Your happiness level is moderate, suggesting a neutral emotional state.";
      return "Your expressions suggest you may be experiencing lower levels of positive emotions.";
    },
    recommendations: (score) => {
      if (score < 50) return [
        "Practice gratitude by noting three positive things daily",
        "Engage in activities you enjoy, even if briefly",
        "Connect with supportive friends or family members",
        "Consider mindfulness meditation to improve mood"
      ];
      return [
        "Continue activities that contribute to your positive mood",
        "Share your positive energy with others",
        "Document what works well for your happiness for future reference"
      ];
    }
  },
  anxiety: {
    description: "Assesses signs of worry, nervousness, or unease in your facial expressions and features.",
    interpretation: (score) => {
      if (score >= 70) return "Your expressions indicate significant anxiety levels.";
      if (score >= 50) return "You're showing moderate signs of anxiety.";
      if (score >= 30) return "Your anxiety level appears mild but present.";
      return "Your expressions suggest minimal anxiety.";
    },
    recommendations: (score) => {
      if (score >= 50) return [
        "Practice deep breathing exercises (4-7-8 technique)",
        "Consider limiting caffeine and alcohol",
        "Try progressive muscle relaxation",
        "Maintain a regular sleep schedule",
        "Consider speaking with a mental health professional"
      ];
      return [
        "Continue your effective stress management techniques",
        "Maintain awareness of early anxiety symptoms",
        "Practice preventative self-care regularly"
      ];
    }
  },
  stress: {
    description: "Evaluates tension and pressure signs visible in your facial expressions.",
    interpretation: (score) => {
      if (score >= 70) return "Your facial expressions suggest high stress levels.";
      if (score >= 50) return "You're showing signs of moderate stress.";
      if (score >= 30) return "Your stress level appears mild.";
      return "Your expressions indicate minimal stress.";
    },
    recommendations: (score) => {
      if (score >= 50) return [
        "Schedule short breaks during your day",
        "Practice mindfulness meditation for 5-10 minutes daily",
        "Prioritize and delegate tasks when possible",
        "Engage in physical activity to release tension",
        "Set boundaries on work hours and screen time"
      ];
      return [
        "Maintain your effective stress management practices",
        "Continue balancing activity with rest",
        "Stay aware of your personal stress triggers"
      ];
    }
  },
  fatigue: {
    description: "Measures signs of tiredness and energy depletion in your facial features.",
    interpretation: (score) => {
      if (score >= 70) return "Your expressions suggest significant fatigue.";
      if (score >= 50) return "You're showing moderate signs of tiredness.";
      if (score >= 30) return "You appear slightly tired but functional.";
      return "Your expressions suggest good energy levels.";
    },
    recommendations: (score) => {
      if (score >= 50) return [
        "Prioritize 7-9 hours of quality sleep",
        "Consider a 20-minute power nap during the day",
        "Review your caffeine intake timing",
        "Stay hydrated throughout the day",
        "Assess your workload for potential adjustments"
      ];
      return [
        "Maintain your healthy sleep routine",
        "Continue balancing activity with rest",
        "Monitor evening screen time to maintain good sleep quality"
      ];
    }
  },
  energy: {
    description: "Assesses your vigor and vitality levels based on facial expressions.",
    interpretation: (score) => {
      if (score >= 80) return "Your expressions indicate excellent energy levels.";
      if (score >= 60) return "You appear to have good energy.";
      if (score >= 40) return "Your energy levels seem moderate.";
      return "Your expressions suggest lower energy levels.";
    },
    recommendations: (score) => {
      if (score < 50) return [
        "Incorporate brief physical activity throughout your day",
        "Assess your nutrition for balanced energy input",
        "Consider checking iron levels and vitamin D with your doctor",
        "Implement a consistent sleep schedule",
        "Stay hydrated with water rather than sugary drinks"
      ];
      return [
        "Continue your effective energy management practices",
        "Balance periods of activity with proper recovery",
        "Maintain your healthy nutrition and hydration habits"
      ];
    }
  },
  focus: {
    description: "Evaluates your concentration and attention levels from facial cues.",
    interpretation: (score) => {
      if (score >= 80) return "Your expressions indicate excellent focus.";
      if (score >= 60) return "You appear to have good concentration abilities.";
      if (score >= 40) return "Your focus levels seem moderate.";
      return "Your expressions suggest some challenges with concentration.";
    },
    recommendations: (score) => {
      if (score < 60) return [
        "Try the Pomodoro technique (25 minutes of focus followed by 5-minute breaks)",
        "Minimize distractions in your work environment",
        "Practice mindfulness meditation to train attention",
        "Ensure adequate sleep and physical activity",
        "Consider brain-training exercises"
      ];
      return [
        "Continue prioritizing deep work sessions",
        "Maintain your effective focus techniques",
        "Consider sharing your concentration strategies with others"
      ];
    }
  },
  calmness: {
    description: "Measures your level of tranquility and composure based on facial expressions.",
    interpretation: (score) => {
      if (score >= 80) return "Your expressions indicate excellent calmness and composure.";
      if (score >= 60) return "You appear generally calm and collected.";
      if (score >= 40) return "Your calmness levels seem moderate with some tension visible.";
      return "Your expressions suggest challenges maintaining calmness.";
    },
    recommendations: (score) => {
      if (score < 60) return [
        "Practice deep breathing for 5 minutes daily",
        "Consider gentle yoga or tai chi",
        "Create moments of silence in your day",
        "Try progressive muscle relaxation before bed",
        "Limit exposure to stressful media content"
      ];
      return [
        "Continue your effective relaxation practices",
        "Share your calmness techniques with others who might benefit",
        "Consider deeper meditation practices to enhance your natural composure"
      ];
    }
  },
  motivation: {
    description: "Assesses your drive and determination levels from facial expressions.",
    interpretation: (score) => {
      if (score >= 80) return "Your expressions indicate high motivation and drive.";
      if (score >= 60) return "You appear to have good motivation levels.";
      if (score >= 40) return "Your motivation seems moderate.";
      return "Your expressions suggest lower motivation levels currently.";
    },
    recommendations: (score) => {
      if (score < 60) return [
        "Set small, achievable goals to build momentum",
        "Connect with your core values and purpose",
        "Create a visual progress tracker for your goals",
        "Find an accountability partner",
        "Reward yourself for completing tasks"
      ];
      return [
        "Continue setting meaningful goals aligned with your values",
        "Maintain your accountability systems",
        "Consider mentoring others to strengthen your own motivation"
      ];
    }
  },
  relaxation: {
    description: "Evaluates the ease and absence of tension in your facial features.",
    interpretation: (score) => {
      if (score >= 80) return "Your expressions indicate excellent relaxation.";
      if (score >= 60) return "You appear generally relaxed.";
      if (score >= 40) return "Your relaxation level seems moderate with some tension visible.";
      return "Your expressions suggest significant tension.";
    },
    recommendations: (score) => {
      if (score < 60) return [
        "Schedule daily relaxation time, even if brief",
        "Try guided relaxation audio sessions",
        "Practice progressive muscle relaxation",
        "Consider gentle stretching before bed",
        "Create a calming bedtime routine"
      ];
      return [
        "Continue your effective relaxation practices",
        "Maintain your healthy balance between activity and rest",
        "Consider sharing your relaxation techniques with others"
      ];
    }
  },
  concentration: {
    description: "Measures your mental focus and sustained attention through facial cues.",
    interpretation: (score) => {
      if (score >= 80) return "Your expressions indicate excellent concentration abilities.";
      if (score >= 60) return "You appear to have good concentration.";
      if (score >= 40) return "Your concentration seems moderate.";
      return "Your expressions suggest some challenges with sustained attention.";
    },
    recommendations: (score) => {
      if (score < 60) return [
        "Practice single-tasking rather than multitasking",
        "Use the Pomodoro technique for focused work periods",
        "Minimize digital distractions during important tasks",
        "Create a dedicated workspace with minimal distractions",
        "Try concentration-building exercises like reading for increasing periods"
      ];
      return [
        "Continue your effective concentration practices",
        "Consider advanced focus techniques like flow state training",
        "Maintain regular breaks to sustain your excellent concentration"
      ];
    }
  },
  sleepQuality: {
    description: "Assesses signs of rest and recovery in your facial features.",
    interpretation: (score) => {
      if (score >= 80) return "Your expressions suggest excellent sleep quality.";
      if (score >= 60) return "You appear to be getting good quality sleep.";
      if (score >= 40) return "Your sleep quality seems adequate but could improve.";
      return "Your expressions suggest poor sleep quality.";
    },
    recommendations: (score) => {
      if (score < 60) return [
        "Maintain a consistent sleep schedule, even on weekends",
        "Create a relaxing bedtime routine",
        "Limit screen time 1-2 hours before bed",
        "Ensure your bedroom is dark, quiet, and cool",
        "Avoid caffeine after midday and limit alcohol"
      ];
      return [
        "Continue your effective sleep hygiene practices",
        "Maintain your consistent sleep schedule",
        "Consider optimizing your bedroom environment further"
      ];
    }
  },
  mood: {
    description: "Evaluates your overall emotional state based on facial expressions.",
    interpretation: (score) => {
      if (score >= 80) return "Your expressions indicate an excellent mood.";
      if (score >= 60) return "You appear to be in a good mood.";
      if (score >= 40) return "Your mood seems neutral.";
      return "Your expressions suggest a low mood.";
    },
    recommendations: (score) => {
      if (score < 60) return [
        "Engage in activities you typically enjoy, even if briefly",
        "Connect with supportive people in your life",
        "Practice gratitude by noting three positive things daily",
        "Get some sunlight and physical activity",
        "Consider speaking with a mental health professional if consistently low"
      ];
      return [
        "Continue activities that maintain your positive mood",
        "Share your positive energy with others",
        "Note what contributes to your good mood for future reference"
      ];
    }
  }
};

export type WellnessMetric = keyof typeof wellnessMetricsInsights;

export const getMetricCategory = (metric: WellnessMetric): 'mental' | 'wellness' => {
  if (['happiness', 'anxiety', 'stress', 'calmness', 'mood'].includes(metric)) {
    return 'mental';
  }
  return 'wellness';
};

export const formatMetricName = (metric: string): string => {
  return metric
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/Quality/, ' Quality');
};

export const getMetricColor = (value: number): string => {
  // For metrics where higher is better (most metrics)
  if (value >= 80) return 'text-green-500';
  if (value >= 60) return 'text-emerald-400';
  if (value >= 40) return 'text-yellow-400';
  if (value >= 20) return 'text-orange-400';
  return 'text-red-500';
};

export const getProgressColor = (metric: string, value: number): string => {
  // For metrics where lower is better (anxiety, stress, fatigue)
  if (['anxiety', 'stress', 'fatigue'].includes(metric)) {
    if (value <= 20) return 'bg-green-500';
    if (value <= 40) return 'bg-emerald-400';
    if (value <= 60) return 'bg-yellow-400';
    if (value <= 80) return 'bg-orange-400';
    return 'bg-red-500';
  }
  
  // For metrics where higher is better
  if (value >= 80) return 'bg-green-500';
  if (value >= 60) return 'bg-emerald-400';
  if (value >= 40) return 'bg-yellow-400';
  if (value >= 20) return 'bg-orange-400';
  return 'bg-red-500';
};
