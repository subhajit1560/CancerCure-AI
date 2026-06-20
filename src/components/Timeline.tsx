import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Layers, Cpu, Zap, HeartPulse } from "lucide-react";
import { playSelectBeep, playHoverBeep } from "./AudioEngine";

interface TimelineStep {
  id: number;
  nodeLabel: string;
  cardMicroLabel: string;
  cardTitle: string;
  cardBody: string;
}

export default function Timeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const steps: TimelineStep[] = [
    {
      id: 0,
      nodeLabel: "IMAGE PREPARATION",
      cardMicroLabel: "STEP 01 // IMAGE PREPARATION",
      cardTitle: "Cleaning the Image",
      cardBody: "Your photo is auto-corrected for lighting, hair, and skin artifacts before analysis begins \u2014 like a lab tech preparing a slide before it goes under the microscope.",
    },
    {
      id: 1,
      nodeLabel: "THREE-WAY ANALYSIS",
      cardMicroLabel: "STEP 02 // THREE-WAY VISUAL ANALYSIS",
      cardTitle: "Three Experts, One Image",
      cardBody: "Three AI modules scan simultaneously \u2014 one reads shape & edges, one reads colour & texture, one checks against real dermatology rules. Together, they catch what any single approach would miss.",
    },
    {
      id: 2,
      nodeLabel: "COMBINING FINDINGS",
      cardMicroLabel: "STEP 03 // COMBINING THE FINDINGS",
      cardTitle: "Bringing It All Together",
      cardBody: "A Transformer AI reads all three experts\u2019 findings at once and cross-references their signals \u2014 the same way a senior specialist reviews notes from multiple doctors before making a final call.",
    },
    {
      id: 3,
      nodeLabel: "FINAL VERDICT",
      cardMicroLabel: "STEP 04 // FINAL VERDICT",
      cardTitle: "Your Diagnostic Result",
      cardBody: "You get a clear diagnosis, a confidence score, and a visual heatmap showing exactly which part of the image drove the result \u2014 so you always know the why, not just the what.",
    },
  ];

  const getStepIcon = (id: number) => {
    switch (id) {
      case 0: return <Layers className="w-5 h-5 text-[#090F15]" />;
      case 1: return <Cpu className="w-5 h-5 text-[#090F15]" />;
      case 2: return <Zap className="w-5 h-5 text-[#090F15]" />;
      case 3: return <HeartPulse className="w-5 h-5 text-[#090F15]" />;
      default: return <Sparkles className="w-5 h-5 text-[#090F15]" />;
    }
  };

  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    let mm = gsap.matchMedia();

    // Only configure horizontal scrolljacking for viewport widths wider than 768px (Desktop/Tablet)
    mm.add("(min-width: 768px)", () => {
      if (containerRef.current && sectionRef.current) {
        gsap.to(containerRef.current, {
          x: () => {
            const scrollDistance = containerRef.current!.scrollWidth - window.innerWidth;
            return -scrollDistance;
          },
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            // The scrolling duration is proportional to total card content size minus viewport width
            end: () => `+=${containerRef.current!.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
          }
        });
      }
    });

    // Cleanup when component unmounts or viewport resizes to small/mobile widths
    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="bg-[#D3D1CE] text-[#090F15] py-16 md:py-0 md:h-screen md:overflow-hidden relative flex flex-col md:justify-around border-b border-[#090F15]/10" 
      id="timeline-section"
    >
      {/* Full-Screen Background Video with Zoom Breathe */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <video
          src="/videos/3.mp4"
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

      {/* Subtle high-tech background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(9,15,21,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(9,15,21,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-[2]" />

      {/* HEADER AREA - Aligned elegantly at the top of the pinned container */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 z-10 shrink-0 md:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center border-b border-[#090F15]/15 pb-6 md:pb-8">
          <div className="lg:col-span-7 space-y-3 text-left">
            <span className="font-mono text-[9px] uppercase text-[#090F15] font-bold tracking-[0.25em] flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-[#090F15] rounded-full animate-pulse" />
              <span>● ■ HOW IT WORKS</span>
            </span>
            <span className="text-[12px] opacity-40 font-mono tracking-widest block uppercase text-[#090F15]">SECTION // THE DIAGNOSTIC JOURNEY</span>
            <h2 className="font-serif text-3xl md:text-[36px] font-normal tracking-tight text-[#090F15] leading-[1.12]">
              The Science Behind <br />
              <span className="italic font-light text-[#090F15]/80">TRISPECT AI</span>
            </h2>
          </div>
          <div className="lg:col-span-5 space-y-4 md:space-y-6 text-left">
            <p className="text-[#090F15]/70 font-sans text-xs font-light leading-relaxed">
              Most AI tools give you an answer without explaining why. TRISPECT AI works the way a specialist doctor does &mdash; examining your skin image from three different angles at once, then combining everything it sees to reach a confident, explainable conclusion.
            </p>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  playSelectBeep();
                  const xaiPortal = document.getElementById("xai-section");
                  if (xaiPortal) xaiPortal.scrollIntoView({ behavior: "smooth" });
                }}
                onMouseEnter={playHoverBeep}
                className="px-6 py-3 bg-white/40 hover:bg-white/60 text-[#090F15] font-mono text-[10px] tracking-[0.2em] uppercase font-bold border border-[#090F15]/20 rounded-full transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-[#090F15] focus:ring-offset-2 hover:shadow-md backdrop-blur-md"
                id="try-scanner-cta"
              >
                TRY THE SCANNER
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* PIPELINE CARDS WRAPPER */}
      {/* On mobile: standard structural grid / vertical block stack. On desktop: scrolls horizontally */}
      <div className="w-full z-10 overflow-hidden md:flex-1 md:flex md:items-center">
        <div 
          ref={containerRef}
          className="px-6 md:px-24 py-8 md:py-0 flex flex-col md:flex-row md:flex-nowrap md:w-[200vw] gap-8 md:gap-16 items-stretch md:items-center"
        >
          {steps.map((st, idx) => (
            <div
              key={st.id}
              className="w-full md:w-[450px] md:min-w-[420px] lg:w-[500px] lg:min-w-[460px] bg-white/50 backdrop-blur-xl border border-white/80 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden flex-shrink-0 select-none shadow-[0_12px_36px_rgba(9,15,21,0.06)] rounded-3xl hover:shadow-[0_16px_48px_rgba(9,15,21,0.1)] transition-all duration-300 hover:-translate-y-1"
              id={`pipeline-step-card-${st.id}`}
            >
              {/* Vertical side active indicator accent line */}
              <div className="absolute top-0 left-0 bottom-0 w-[4px] bg-[#090F15] opacity-80" />

              {/* CARD TOP ROW */}
              <div className="flex items-center justify-between border-b border-[#090F15]/10 pb-4 mb-4">
                <span className="font-mono text-[9px] tracking-[0.2em] text-[#090F15]/90 uppercase font-bold">
                  {st.cardMicroLabel}
                </span>
                <div className="w-9 h-9 rounded-full bg-[#090F15]/5 border border-[#090F15]/10 flex items-center justify-center shadow-sm">
                  <div className="text-[#090F15]">{getStepIcon(idx)}</div>
                </div>
              </div>

              {/* CARD DATA AND DESCRIPTIONS */}
              <div className="space-y-4 flex-1 mb-6">
                <h3 className="font-serif text-2xl font-light italic text-[#090F15] leading-tight">
                  <span className="font-mono text-sm mr-3 text-[#090F15]/40 not-italic">[{String(idx + 1).padStart(2, '0')}]</span>
                  {st.cardTitle}
                </h3>
                <p className="font-sans text-xs md:text-sm text-[#090F15]/75 leading-relaxed font-light">
                  {st.cardBody}
                </p>
              </div>

              {/* CARD SYSTEM TELEMETRY */}
              <div className="border-t border-[#090F15]/10 pt-4 flex items-center justify-between text-[#090F15]/50 font-mono text-[9px]">
                <span className="uppercase tracking-[0.12em]">
                  NODE: TRISPECT-X0{idx + 1}
                </span>
                <span className="tracking-[0.15em] uppercase font-bold text-[#090F15]/40">
                  CLINICAL VERIFIED
                </span>
              </div>
            </div>
          ))}

          {/* Connector one-liner beneath all cards */}
          <div className="w-full md:w-auto md:min-w-[420px] flex-shrink-0 flex items-center justify-center py-4 md:py-0">
            <p className="font-sans text-sm italic text-[#090F15]/50 text-center leading-relaxed max-w-md">
              No medical background needed. Upload an image &mdash; TRISPECT AI handles the rest.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
