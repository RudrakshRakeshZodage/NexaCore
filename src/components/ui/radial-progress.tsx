
import * as React from "react";
import { cn } from "@/lib/utils";

interface RadialProgressProps {
  value: number;
  size?: number;
  thickness?: number;
  strokeLinecap?: "round" | "square" | "butt";
  color?: string;
  bgColor?: string;
  className?: string;
  showValue?: boolean;
  valueClassName?: string;
  min?: number;
  max?: number;
  children?: React.ReactNode;
}

export const RadialProgress = React.forwardRef<HTMLDivElement, RadialProgressProps>(
  ({
    value,
    size = 100,
    thickness = 8,
    strokeLinecap = "round",
    color = "var(--primary)",
    bgColor = "rgba(255, 255, 255, 0.1)",
    className,
    showValue = false,
    valueClassName,
    min = 0,
    max = 100,
    children,
    ...props
  }, ref) => {
    const radius = size / 2 - thickness / 2;
    const circumference = 2 * Math.PI * radius;
    const normalizedValue = Math.min(Math.max(value, min), max);
    const percentage = ((normalizedValue - min) / (max - min)) * 100;
    const progress = (circumference * (100 - percentage)) / 100;

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={bgColor}
            strokeWidth={thickness}
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap={strokeLinecap}
          />
        </svg>
        
        {showValue && (
          <div className={cn("absolute inset-0 flex items-center justify-center", valueClassName)}>
            {Math.round(percentage)}%
          </div>
        )}
        
        {children && (
          <div className="absolute inset-0 flex items-center justify-center">
            {children}
          </div>
        )}
      </div>
    );
  }
);

RadialProgress.displayName = "RadialProgress";
