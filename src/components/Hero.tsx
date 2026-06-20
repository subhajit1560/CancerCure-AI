import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import NavigationOverlay from "./NavigationOverlay";
import { playSelectBeep, playHoverBeep, setSoundState, getSoundState } from "./AudioEngine";

interface HeroProps {
  onSearchToggle: () => void;
  onLaunchScanner: () => void;
}

export default function Hero({ onSearchToggle, onLaunchScanner }: HeroProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);

  // Synchronize audio engine state with UI
  useEffect(() => {
    setIsSoundOn(getSoundState());
  }, []);

  const toggleSound = () => {
    const newState = !isSoundOn;
    setIsSoundOn(newState);
    setSoundState(newState);
    playSelectBeep();
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black text-white flex flex-col justify-between px-6 md:px-12 lg:px-20 py-6" id="purpose-section">

      {/* 2. Full-Screen Background Video */}
      <video
        src="/videos/hero-dna.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Subtle overlay behind text */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 z-[1] pointer-events-none" />

      {/* Decorative top editorial line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#090F15]/10 z-10" />

      {/* Top Blur Overlay Mask */}
      <div
        className="absolute top-0 left-0 w-full h-[10vh] pointer-events-none z-[5]"
        style={{
          backdropFilter: "blur(25px) saturate(1.5)",
          WebkitBackdropFilter: "blur(25px) saturate(1.5)",
          maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
        }}
      />

      {/* Bottom Blur Overlay Mask */}
      <div
        className="absolute bottom-0 left-0 w-full h-[10vh] pointer-events-none z-[5]"
        style={{
          backdropFilter: "blur(25px) saturate(1.5)",
          WebkitBackdropFilter: "blur(25px) saturate(1.5)",
          maskImage: "linear-gradient(to top, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 70%, transparent 100%)",
        }}
      />

      {/* HEADER ROW - Glassmorphism */}
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between w-full relative z-40 py-3 px-6 mt-4 mx-auto max-w-7xl border border-white/40 bg-white/20 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-2xl shrink-0"
        id="hero-header"
      >
        {/* Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          onMouseEnter={playHoverBeep}
          className="flex items-center space-x-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#090F15]/50 focus:ring-offset-2"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          id="brand-logo-container"
        >
          <div className="w-9 h-9 bg-white/40 backdrop-blur-md border border-white/50 shadow flex items-center justify-center text-[#090F15] font-bold text-sm tracking-tighter rounded-full">
            CC
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="font-serif text-2xl font-bold tracking-tighter uppercase italic text-[#090F15] flex items-start">
              CancerCure<sup className="text-[9px] font-sans not-italic font-bold ml-0.5 mt-0.5 text-[#090F15]/60">TM</sup>
            </span>
            <span className="font-mono text-[7px] tracking-[0.25em] uppercase text-zinc-500 font-extrabold mt-0.5">
              POWERED BY TRISPECT AI
            </span>
          </div>
        </div>

        {/* Menu Indicator Button */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            playSelectBeep();
            setIsMenuOpen(true);
          }}
          onMouseEnter={playHoverBeep}
          className="group flex items-center space-x-3 text-[#090F15] border border-white/50 bg-white/30 hover:bg-white/50 backdrop-blur-md transition-all uppercase tracking-[0.2em] font-mono text-[10px] py-2 px-5 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#090F15]/50 focus:ring-offset-2"
          id="nav-menu-btn"
          aria-label="Toggle Navigation Menu"
        >
          <div className="flex flex-col space-y-1 w-4">
            <span className="h-[1.5px] w-4 bg-[#090F15] rounded-full group-hover:translate-x-0.5 transition-transform duration-200" />
            <span className="h-[1.5px] w-4 bg-[#090F15] rounded-full group-hover:-translate-x-0.5 transition-transform duration-200" />
          </div>
          <span className="font-bold">Menu</span>
        </motion.button>

        {/* Header Right Utilities */}
        <div className="flex items-center space-x-3" id="header-utilities">
          {/* Clinical Sound Wave Mute/Unmute */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={toggleSound}
            onMouseEnter={playHoverBeep}
            className={`flex items-center space-x-2 p-2 px-4 border transition-all rounded-full font-mono text-[9px] tracking-widest uppercase cursor-pointer backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#090F15]/50 focus:ring-offset-2 ${isSoundOn ? "bg-white/80 border-white text-[#090F15] shadow-sm" : "bg-white/30 border-white/50 text-[#090F15] hover:bg-white/50"
              }`}
            id="sound-wave-btn"
            aria-label="Toggle sound and audio synths"
          >
            {isSoundOn ? (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>OFF</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.header>

      {/* NAVIGATION DRAWER */}
      <AnimatePresence>
        {isMenuOpen && (
          <NavigationOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        )}
      </AnimatePresence>

      {/* HERO HERO MAIN GRID CONTENT - CENTERED TEXT LAYER OVER BACKGROUND */}
      <div className="flex-1 flex flex-col items-center justify-center text-center mx-auto w-full relative z-10 py-6 px-4">

        <div className="max-w-4xl p-6 flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.1] mb-6"
          >
            <span className="italic font-light text-white/95">TRISPECT AI</span> <br />

          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-sm md:text-base text-white/80 leading-relaxed font-sans max-w-2xl mb-8"
          >
            A high-precision biomedical deep learning interface. Upload standard dermoscopic lesion imagery to deploy TRISPECT AI—our multi-domain spatial, spectral, and geometric fusion engine.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 w-full"
          >
            <motion.button
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 18 }}
              onClick={() => {
                playSelectBeep();
                onLaunchScanner();
              }}
              onMouseEnter={playHoverBeep}
              className="px-10 py-4 bg-white/75 backdrop-blur-md border border-white text-black hover:bg-white hover:shadow-[0_0_25px_rgba(255,255,255,0.7)] transition-all font-mono text-[11px] tracking-[0.2em] font-bold rounded-full text-center cursor-pointer uppercase shadow-[0_8px_32px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2"
              id="hero-cta-btn"
            >
              Launch Core Scanner →
            </motion.button>
          </motion.div>
        </div>

      </div>

    </section>
  );
}
