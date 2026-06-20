import React from "react";
import { motion } from "motion/react";
import { X, Send, Network, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { playSelectBeep, playHoverBeep } from "./AudioEngine";

interface NavigationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationOverlay({ isOpen, onClose }: NavigationOverlayProps) {
  if (!isOpen) return null;

  const handleLinkClick = (selectorId: string) => {
    playSelectBeep();
    onClose();
    const element = document.getElementById(selectorId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const menuLinks = [
    { name: "System Architecture", id: "timeline-section" },
    { name: "Performance Metrics", id: "advantages-section" },
    { name: "Explainable AI (XAI) Demo", id: "xai-section" },
    { name: "Our Team", id: "team-section" },
    { name: "Contact Us", id: "contact-section" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: "-100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 h-screen w-screen z-50 bg-white/90 backdrop-blur-xl text-[#090F15] flex flex-col justify-between p-8 md:p-16 overflow-y-auto"
      id="navigation-overlay"
    >
      {/* Wave Accent Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(26,26,26,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between w-full relative z-10">
        <span className="font-mono text-xs tracking-widest text-[#090F15] font-bold">
          ● CANCERCURE LABS DIRECTORY
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            playSelectBeep();
            onClose();
          }}
          onMouseEnter={playHoverBeep}
          className="p-3 rounded-full border border-[#090F15]/10 transition-colors cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#090F15]/50 focus:ring-offset-2 hover:bg-[#090F15]/10 shadow-sm"
          id="close-menu-btn"
          aria-label="Close Navigation Menu"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 text-[#090F15]" />
        </motion.button>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto w-full my-auto relative z-10 py-12">

        {/* Navigation Columns */}
        <div className="lg:col-span-8 flex flex-col justify-center">
          <p className="font-mono text-[10px] text-[#090F15]/40 uppercase tracking-[0.2em] mb-6">
            Navigation Index
          </p>
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
            {menuLinks.map((link, idx) => (
              <motion.div
                key={link.id}
                whileHover={{ x: 6 }}
                role="button"
                tabIndex={0}
                onClick={() => handleLinkClick(link.id)}
                onMouseEnter={playHoverBeep}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleLinkClick(link.id);
                  }
                }}
                className="group flex items-baseline space-x-4 py-2.5 border-b border-[#090F15]/10 hover:border-[#090F15] cursor-pointer transition-all outline-none focus:outline-none focus:ring-2 focus:ring-[#090F15]/50 focus:ring-offset-2"
              >
                <span className="font-mono text-[10px] text-[#090F15]/30 group-hover:text-[#090F15] transition-colors font-bold">
                  {(idx + 1).toString().padStart(2, "0")}
                </span>
                <span className="font-serif text-lg md:text-xl font-normal tracking-tight text-[#090F15]/70 group-hover:text-[#090F15] transition-colors">
                  {link.name}
                </span>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Brand Information & Interactive Widget */}
        <div className="lg:col-span-4 flex flex-col justify-between border-l border-[#090F15]/10 pl-0 lg:pl-12 space-y-8">
          <div>
            <div className="flex items-center space-x-2 text-[#090F15] mb-4">
              <Network className="w-4.5 h-4.5 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider font-bold">
                System Capabilities
              </span>
            </div>
            <h3 className="font-serif italic text-2xl font-light text-[#090F15] tracking-tight mb-3">
              Decoding Life, Creating Hope
            </h3>
            <p className="text-xs text-[#090F15]/70 leading-relaxed font-light font-sans">
              At the absolute frontier of cancer oncology diagnostic technology, CancerCure employs advanced clinical research mechanisms and precision genomic analysis vectors to optimize diagnostic accuracy.
            </p>
          </div>

          <div className="p-5 bg-white/60 backdrop-blur-md border border-white shadow-sm rounded-2xl flex flex-col space-y-3">
            <div className="flex items-center space-x-2 text-[#090F15]">
              <ShieldCheck className="w-4 h-4 text-[#090F15]" />
              <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-[#090F15]">
                TRISPECT AI Engine
              </span>
            </div>
            <p className="text-[11px] text-[#090F15]/70 leading-normal font-sans font-light">
              Highly sensitive multi-stream dynamic neural networks providing real-time, explainable diagnostic screening parameters globally.
            </p>
          </div>

          <div className="text-[11px] text-[#090F15]/60 space-y-2 font-mono">
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-[#090F15]" />
              <span>cancercureai@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-[#090F15]" />
              <span>Made in India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer copyright stamp */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full pt-8 border-t border-[#090F15]/10 relative z-10 text-[10px] text-[#090F15]/40 font-mono tracking-widest uppercase">
        <span>© 2026 CANCERCURE CLINICAL RESEARCH LABS CO.</span>
        <span className="mt-2 sm:mt-0 font-bold text-[#090F15]">SECURE SHELL PROTOCOL ONLINE</span>
      </div>
    </motion.div>
  );
}
