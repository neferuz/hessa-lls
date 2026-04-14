"use client";

import Hero from "@/components/Hero";
import TickerBanner from "@/components/TickerBanner";
import Benefits from "@/components/Benefits";
import HomeAnalysisBlock from "@/components/HomeAnalysisBlock";
import DoctorsBlock from "@/components/DoctorsBlock";
import ReviewsBlock from "@/components/ReviewsBlock";
import TelegramBanner from "@/components/TelegramBanner";
import DifferenceCarousel from "@/components/DifferenceCarousel";
import NewArrivals from "@/components/NewArrivals";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import LegalTicker from "@/components/LegalTicker";
import Footer from "@/components/Footer";
import styles from "./page.module.css";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, ReactNode, useState, useEffect } from "react";

// Premium RevealSection for sections appearance
const RevealSection = ({ children }: { children: ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.98 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

// Decorative Floating Capsule Component (Fixed Hydration)
const FloatingCapsule = ({ className, delay = 0 }: { className: string; delay?: number }) => {
  const [coords, setCoords] = useState<{ x: number, y: number, r: number, left: string } | null>(null);

  useEffect(() => {
    // Generate random values only on the client to avoid hydration mismatch
    setCoords({
      x: Math.random() * 50,
      y: Math.random() * 500,
      r: Math.random() * 360,
      left: `${Math.random() * 95}%`
    });
  }, []);

  if (!coords) return null;

  return (
    <motion.div
      className={`${styles.capsule} ${className}`}
      initial={{
        y: coords.y,
        rotate: coords.r,
        x: coords.x
      }}
      animate={{
        y: [0, -40, 0],
        rotate: [0, 15, -15, 0],
        x: [0, 20, -10, 0]
      }}
      transition={{
        duration: 12 + Math.random() * 8,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay
      }}
      style={{
        left: coords.left,
        opacity: 0.12
      }}
    />
  );
};

// Botanical Leaf Component
const FloatingLeaf = ({ delay = 0 }: { delay?: number }) => {
  const [coords, setCoords] = useState<{ left: string, top: string, rotate: number } | null>(null);

  useEffect(() => {
    setCoords({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      rotate: Math.random() * 360
    });
  }, []);

  if (!coords) return null;

  return (
    <motion.div
      className={`${styles.floatingLeaf} ${styles.botanicalPulse}`}
      style={{ left: coords.left, top: coords.top }}
      animate={{
        y: [0, -30, 0],
        rotate: [coords.rotate, coords.rotate + 20, coords.rotate],
      }}
      transition={{
        duration: 15 + Math.random() * 10,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
        <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
      </svg>
    </motion.div>
  );
};

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Parallax transforms for background elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -600]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 800]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const yScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      <div className={styles.grain} />

      <main className={cn(styles.main, "overflow-x-hidden max-w-full")}>
        {/* BACKGROUND & PARALLAX DECORATIONS (Protected to prevent page stretch) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className={styles.molecularPattern} />
          
          <motion.div style={{ y: y1 }} className={`${styles.bgBlob} ${styles.blob1}`} />
          <motion.div style={{ y: y2 }} className={`${styles.bgBlob} ${styles.blob2}`} />
          <motion.div style={{ y: y3 }} className={`${styles.bgBlob} ${styles.blob3}`} />
          <motion.div style={{ scale: yScale }} className={`${styles.bgBlob} ${styles.blob4}`} />
          <motion.div style={{ opacity: 0.4 }} className={`${styles.bgBlob} ${styles.blob5}`} />

          <FloatingCapsule className={styles.capsuleBlue} delay={0} />
          <FloatingCapsule className={styles.capsuleRed} delay={2} />
          <FloatingLeaf delay={1} />
          <FloatingLeaf delay={4} />
          <FloatingCapsule className={styles.capsuleYellow} delay={5} />
          <FloatingLeaf delay={7} />
          <FloatingCapsule className={styles.capsuleBlue} delay={8} />
          <FloatingLeaf delay={10} />
        </div>

        {/* Home Sections */}
        <Hero />

        <div className={styles.contentWrapper}>
          <RevealSection><Benefits /></RevealSection>
          <RevealSection><DifferenceCarousel /></RevealSection>
          <RevealSection><NewArrivals /></RevealSection>
          <RevealSection><HomeAnalysisBlock /></RevealSection>
          <RevealSection><DoctorsBlock /></RevealSection>
          <RevealSection><ReviewsBlock /></RevealSection>
          <RevealSection><TelegramBanner /></RevealSection>
          <RevealSection><Newsletter /></RevealSection>
          <RevealSection><FAQ /></RevealSection>
          <LegalTicker />
          <Footer />
        </div>
      </main>
    </div>
  );
}
