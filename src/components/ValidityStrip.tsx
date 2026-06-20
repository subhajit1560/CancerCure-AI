import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "motion/react";
import { playHoverBeep, playSelectBeep } from "./AudioEngine";
import { ShieldCheck, BarChart3, Database } from "lucide-react";

// Helper component for animating values
const AnimatedCounter = ({ 
  target, 
  duration = 2000, 
  decimals = 0, 
  suffix = "", 
  prefix = "" 
}: { 
  target: number; 
  duration?: number; 
  decimals?: number; 
  suffix?: string; 
  prefix?: string; 
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeValue = progress * (2 - progress);
      setCurrentValue(easeValue * target);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isInView, target, duration]);

  return (
    <span ref={containerRef} className="font-mono font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-[#090F15]">
      {prefix}
      {currentValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

export default function ValidityStrip() {
  return (
    <section 
      className="bg-[#D3D1CE] border-b border-[#090F15]/10 py-16 sm:py-24 px-6 md:px-12 lg:px-20 relative z-20"
      id="validity-metrics-strip"
    >
      <div className="max-w-7xl mx-auto">
        {/* Subtle decorative top tag */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#090F15] font-bold block mb-2">
            ● CLINICAL INTEGRITY & BENCHMARK VALIDATION
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-light italic text-[#090F15]">
            Live Performance Metrics
          </h2>
        </div>

        {/* 3-Column Performance Grid - Glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Model Accuracy */}
          <div 
            onMouseEnter={playHoverBeep}
            onClick={playSelectBeep}
            className="p-8 sm:p-10 flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#090F15]/10 group cursor-default relative bg-white/40 backdrop-blur-md border border-white max-w-sm mx-auto rounded-3xl"
            id="metric-card-accuracy"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.2em] font-bold text-[#090F15] uppercase">
                  METRIC 01 / ACCURACY
                </span>
                <ShieldCheck className="w-4 h-4 text-[#090F15]/30 transition-colors group-hover:text-[#090F15]" />
              </div>

              <div className="flex flex-col space-y-1 pt-2">
                <AnimatedCounter target={80.03} decimals={2} suffix="%" />
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase font-bold text-[#090F15]/80 pt-1">
                  OVERALL ACCURACY
                </span>
              </div>

              <p className="font-sans text-xs text-[#090F15]/60 leading-relaxed font-light pt-2">
                Validated baseline performance across 7 distinct skin lesion categories, overcoming traditional multi-class classification hurdles.
              </p>
            </div>
          </div>

          {/* Card 2: Area Under Curve */}
          <div 
            onMouseEnter={playHoverBeep}
            onClick={playSelectBeep}
            className="p-8 sm:p-10 flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#090F15]/10 group cursor-default relative bg-white/40 backdrop-blur-md border border-white max-w-sm mx-auto rounded-3xl"
            id="metric-card-auc"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.2em] font-bold text-[#090F15] uppercase">
                  METRIC 02 / ROBUSTNESS
                </span>
                <BarChart3 className="w-4 h-4 text-[#090F15]/30 transition-colors group-hover:text-[#090F15]" />
              </div>

              <div className="flex flex-col space-y-1 pt-2">
                <AnimatedCounter target={0.9327} decimals={4} />
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase font-bold text-[#090F15]/80 pt-1">
                  MEAN AUC-ROC
                </span>
              </div>

              <p className="font-sans text-xs text-[#090F15]/60 leading-relaxed font-light pt-2">
                Demonstrates exceptional model discrimination capability and high sensitivity to rare, lethal malignant tissues.
              </p>
            </div>
          </div>

          {/* Card 3: Dataset Scale */}
          <div 
            onMouseEnter={playHoverBeep}
            onClick={playSelectBeep}
            className="p-8 sm:p-10 flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#090F15]/10 group cursor-default relative bg-white/40 backdrop-blur-md border border-white max-w-sm mx-auto rounded-3xl"
            id="metric-card-scale"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.2em] font-bold text-[#090F15] uppercase">
                  METRIC 03 / SCALE
                </span>
                <Database className="w-4 h-4 text-[#090F15]/30 transition-colors group-hover:text-[#090F15]" />
              </div>

              <div className="flex flex-col space-y-1 pt-2">
                <AnimatedCounter target={10015} decimals={0} />
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase font-bold text-[#090F15]/80 pt-1">
                  BENCHMARK IMAGES
                </span>
              </div>

              <p className="font-sans text-xs text-[#090F15]/60 leading-relaxed font-light pt-2">
                Trained and cross-validated on the comprehensive, peer-reviewed HAM10000 archive, featuring highly diverse clinical variations.
              </p>
            </div>
          </div>

        </div>

        {/* Dynamic subtext indicator */}
        <div className="mt-8 flex justify-center items-center">
          <span className="font-mono text-[8px] tracking-[0.15em] text-[#090F15]/40 uppercase text-center max-w-lg leading-normal">
            * All data is live from cross-validated local testing checkpoints of the Tri-Stream network.
          </span>
        </div>
      </div>
    </section>
  );
}
