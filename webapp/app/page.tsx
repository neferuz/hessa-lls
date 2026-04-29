"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FilterTabs from "@/components/FilterTabs";
import ProductCard from "@/components/ProductCard";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Все товары");

  return (
    <main className="min-h-screen pb-24 relative max-w-md mx-auto overflow-hidden">
      {/* Decorative Brand Blobs - Subtle */}
      <div className="absolute top-[10%] right-[-15%] w-80 h-80 bg-[#C497A0]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-15%] w-80 h-80 bg-[#C497A0]/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <Header />
        <Hero />
        <FilterTabs active={activeCategory} setActive={setActiveCategory} />
        <ProductCard activeCategory={activeCategory} />
        
        {/* Footer Credit */}
        <div className="pb-20 pt-0 flex flex-col items-center justify-center opacity-60 transition-opacity hover:opacity-100 cursor-default">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#1a1a1a]">
            powered by <span className="text-[#C497A0]">pixel studio</span>
          </p>
          <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#C497A0]/40 to-transparent mt-1.5" />
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
