"use client";

import { useEffect, useRef, useState } from "react";

export function useAnimatedCounter(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;
    
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      
      // easeOutExpo for smooth deceleration
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      
      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [target, duration]);

  return count;
}

export function AnimatedNumber({ value, className }: { value: number | string; className?: string }) {
  const numericValue = typeof value === "string" ? parseInt(value.replace(/\D/g, ""), 10) || 0 : value;
  const animated = useAnimatedCounter(numericValue);
  const formatted = animated.toLocaleString("ru-RU");

  // If original was a string with non-numeric suffix, preserve it
  if (typeof value === "string") {
    const suffix = value.replace(/[\d\s.,]/g, "").trim();
    return <span className={className}>{formatted}{suffix ? ` ${suffix}` : ""}</span>;
  }

  return <span className={className}>{formatted}</span>;
}
