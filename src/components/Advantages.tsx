import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, CheckCircle, Award, Sparkles, Heart } from "lucide-react";
import { playSelectBeep, playHoverBeep } from "./AudioEngine";
import { AdvantageItem } from "../types";

export default function Advantages() {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const advantages: AdvantageItem[] = [
    {
      id: "adv-1",
      index: "01",
      title: "0.9327 Mean AUC-ROC",
      description: "Achieved excellent discrimination ability across all 7 disease classes on the highly imbalanced HAM10000 dataset, proving the robustness of the Tri-Stream architecture.",
      tags: ["Metrics", "HAM10000", "Multi-class"],
    },
    {
      id: "adv-2",
      index: "02",
      title: "Transformer-Based XAI",
      description: "Transparent diagnostics powered by multi-head self-attention. The model generates interpretable attention maps, revealing exactly which clinical features drove the final prediction.",
      tags: ["XAI", "Self-Attention", "Interpretability"],
    },
    {
      id: "adv-3",
      index: "03",
      title: "Resilient Tri-Stream Fusion",
      description: "Severe class imbalance mitigated via targeted augmentation and weighted sampling. Fusing spatial, spectral, and edge-based features significantly outperforms traditional single-domain CNNs.",
      tags: ["Weighted Sampling", "Ablation Verified", "Multi-Domain"],
    },
  ];

  return (
    <section className="bg-[#D3D1CE] py-16 md:py-24 border-b border-[#090F15]/10 px-6 md:px-12 lg:px-20 overflow-hidden relative" id="advantages-section">
      
      {/* Full-Screen Background Video with Zoom Breathe */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <video
          src="/videos/2.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover animate-video-zoom-breathe"
        />
      </div>

      {/* Light elegant overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D3D1CE]/70 via-[#D3D1CE]/40 to-[#D3D1CE]/80 z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#D3D1CE]/30 via-transparent to-[#D3D1CE]/30 z-[1] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER BLOCK */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-[#090F15]/15 pb-8">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#090F15] font-bold block mb-2">
              ● VERIFIED PROJECT PERFORMANCE FOUNDATIONS
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-normal text-[#090F15] leading-none">
              Engineering Benchmarks
            </h2>
          </div>
          <div>
            <span className="font-mono text-[10px] tracking-[0.2em] font-bold text-[#090F15] bg-white/40 border border-[#090F15]/15 px-4 py-2 rounded-none block uppercase backdrop-blur-md">
              Core Outcomes
            </span>
          </div>
        </div>

        {/* THREE GRID BLOCKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" id="advantages-grid-container">
          {advantages.map((adv) => {
            const isHovered = hoveredCardId === adv.id;

            return (
              <motion.div
                key={adv.id}
                onMouseEnter={() => {
                  playHoverBeep();
                  setHoveredCardId(adv.id);
                }}
                onMouseLeave={() => setHoveredCardId(null)}
                className={`p-8 rounded-[1.5rem] border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[380px] h-full ${
                  isHovered
                    ? "bg-white/60 text-[#090F15] border-white/80 shadow-[0_16px_48px_rgba(9,15,21,0.12)] -translate-y-1"
                    : "bg-white/40 text-[#090F15] border-white/60 shadow-[0_8px_32px_rgba(9,15,21,0.06)] hover:border-white/80"
                } backdrop-blur-xl`}
                id={`advantage-card-${adv.id}`}
              >
                {/* Top index and category block */}
                <div className="flex items-center justify-between">
                  <span className={`font-serif text-4xl sm:text-5xl font-light italic tracking-tight ${isHovered ? "text-[#090F15]/60" : "text-[#090F15]/20"}`}>
                    {adv.index}
                  </span>
                  
                  <span className={`font-mono text-[9px] tracking-[0.15em] uppercase font-bold border px-3 py-1 rounded-full ${
                    isHovered ? "text-[#090F15] border-[#090F15]/20 bg-white/80" : "text-[#090F15]/60 border-[#090F15]/10 bg-white/30"
                  }`}>
                    Benchmark
                  </span>
                </div>

                {/* Core Title and descriptive body */}
                <div className="space-y-4 text-left">
                  <h3 className="font-serif text-xl sm:text-2xl font-light italic leading-snug text-[#090F15]">
                    {adv.title}
                  </h3>
                  
                  <p className={`font-sans text-xs font-light leading-relaxed ${
                    isHovered ? "text-[#090F15]/90" : "text-[#090F15]/75"
                  }`}>
                    {adv.description}
                  </p>
                  
                  {/* Dynamic mini tags list */}
                  {adv.tags && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {adv.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`font-mono text-[8px] tracking-[0.12em] py-0.5 px-3 rounded-full border uppercase ${
                            isHovered
                              ? "bg-[#090F15]/10 border-[#090F15]/15 text-[#090F15]"
                              : "bg-[#090F15]/5 border-[#090F15]/10 text-[#090F15]/60 shadow-none"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom interactive explore pill */}
                <div className={`pt-6 border-t flex justify-between items-center ${isHovered ? "border-[#090F15]/15" : "border-[#090F15]/10"} w-full`}>
                  {adv.id === "adv-1" ? (
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        playSelectBeep();
                        const target = document.getElementById("timeline-section");
                        if (target) target.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`font-mono text-[9px] tracking-[0.2em] uppercase font-bold px-4 py-2 border rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#090F15]/30 focus:ring-offset-2 ${
                        isHovered 
                          ? "bg-white border-[#090F15]/20 text-[#090F15] hover:bg-white/80" 
                          : "bg-white/50 border-[#090F15]/10 text-[#090F15]/80 hover:opacity-90"
                      }`}
                    >
                      Pipeline specs
                    </motion.button>
                  ) : (
                    <span className={`font-mono text-[9px] tracking-[0.2em] uppercase font-bold transition-all ${
                      isHovered ? "translate-x-1 text-[#090F15]" : "text-[#090F15]/40"
                    }`}>
                      {adv.id === "adv-2" ? "view model insights" : "explore math design"}
                    </span>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 45 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      playSelectBeep();
                      const targetSec = adv.id === "adv-2" 
                        ? document.getElementById("xai-section")
                        : document.getElementById("timeline-section");
                      if (targetSec) targetSec.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-9 h-9 border flex items-center justify-center transition-all cursor-pointer rounded-full relative z-10 focus:outline-none focus:ring-2 focus:ring-[#090F15]/30 focus:ring-offset-2 ${
                      isHovered
                        ? "bg-white border-[#090F15]/20 text-[#090F15]"
                        : "bg-white/50 border-[#090F15]/10 text-[#090F15]/60 hover:text-[#090F15] hover:border-[#090F15]/25"
                    }`}
                    aria-label={`Explore benchmark ${adv.title}`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
