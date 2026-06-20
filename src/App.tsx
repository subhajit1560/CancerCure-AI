import React, { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import Lenis from "@studio-freight/lenis";
import Hero from "./components/Hero";
import ValidityStrip from "./components/ValidityStrip";
import Marquee from "./components/Marquee";
import HowToUse from "./components/HowToUse";
import Timeline from "./components/Timeline";
import XaiDemo from "./components/XaiDemo";
import Advantages from "./components/Advantages";
import Team from "./components/Team";
import ContactUs from "./components/ContactUs";
import SearchDialog from "./components/SearchDialog";
import ScannerApp from "./components/ScannerApp";

type ViewState = 'landing' | 'scanner';

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('landing');

  useEffect(() => {
    // Accessibility check: disables Lenis if prefers-reduced-motion is true
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    // Initialize Lenis with smooth options as requested
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo easing curve
      smoothWheel: true
    });

    let rafId: number;
    const updateLoop = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(updateLoop);
    };

    // Start requestAnimationFrame loop
    rafId = requestAnimationFrame(updateLoop);

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  if (currentView === 'scanner') {
    return <ScannerApp onBack={() => setCurrentView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-[#D3D1CE] text-[#090F15] font-sans selection:bg-[#090F15] selection:text-[#FDFCFB]" id="main-landing-scaffold">
      
      {/* 1. Main Hero layout (Header, navigation handles, DNA canvas) */}
      <Hero onSearchToggle={() => setIsSearchOpen(true)} onLaunchScanner={() => setCurrentView('scanner')} />

      {/* 1.5 Live high-contrast performance metrics (The Validity Strip) */}
      <ValidityStrip />

      {/* CSS-only infinite scrolling expert stream marquee */}
      <Marquee />

      {/* 4. How to use our AI workflow */}
      <HowToUse />

      {/* 5. Process stepper with horizontal clinical progress trackers */}
      <Timeline />

      {/* 5b. Explainable AI (XAI) transparent attention maps slider */}
      <XaiDemo />

      {/* 6. Advantages index numbers grid details */}
      <Advantages />

      {/* 9. Clinical team specialist cards */}
      <Team />

      {/* 11. Custom 3D Business Card coordinate tilts and Encrypted Contact Forms */}
      <ContactUs />

      {/* 12. Modal Security Search Dialogue Locator Portal */}
      <AnimatePresence>
        {isSearchOpen && (
          <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
