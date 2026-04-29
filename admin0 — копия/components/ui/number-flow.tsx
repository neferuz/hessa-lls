"use client";
import { useState, useEffect } from "react";

export function NumberFlow({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    const isCurrency = value.startsWith('$');
    const isPercentage = value.endsWith('%');
    const numericPart = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    const currentNumericPart = parseFloat(displayValue.replace(/[^0-9.-]+/g, ""));
    
    if (isNaN(numericPart) || isNaN(currentNumericPart)) {
      setDisplayValue(value);
      return;
    }

    let start = currentNumericPart;
    let end = numericPart;
    let duration = 600;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = start + (end - start) * progress;
      
      let formatted = current.toLocaleString('en-US', {
        maximumFractionDigits: isPercentage ? 1 : 0,
        minimumFractionDigits: isPercentage ? 1 : 0
      });
      
      if (isCurrency) formatted = '$' + formatted;
      if (isPercentage) formatted = formatted + '%';
      
      setDisplayValue(formatted);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, displayValue]);

  return <span>{displayValue}</span>;
}
