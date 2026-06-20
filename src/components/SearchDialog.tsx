import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, X, ArrowRight, FlaskConical, CircleCheck } from "lucide-react";
import { playSelectBeep, playHoverBeep } from "./AudioEngine";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const laboratories = [
    { city: "Seattle", state: "WA", code: "SEA-PRIMARY", address: "678 Redwood Way, Seattle, WA 98101", phone: "(555) 123-4567" },
    { city: "Houston", state: "TX", code: "HOU-ONCOLOGY", address: "1002 Fannin St, Houston, TX 77002", phone: "(555) 987-6543" },
    { city: "Boston", state: "MA", code: "BOS-SEQUENCER", address: "400 Technology Square, Cambridge, MA 02139", phone: "(555) 456-7890" },
    { city: "London", state: "England", code: "LDN-EUROPE", address: "215 Euston Rd, London, NW1 2BE, UK", phone: "+44 20 7911 2000" },
  ];

  const filteredLabs = laboratories.filter(
    (lab) =>
      lab.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#090F15]/80 backdrop-blur-md"
      />

      {/* Dialog container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border text-[#090F15] rounded-3xl p-6 sm:p-8 max-w-lg w-full relative z-10 shadow-2xl text-left border-[#B3B7BA]"
        id="search-dialog-lightbox"
      >
        <button
          onClick={() => {
            playSelectBeep();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#D3D1CE] text-[#6C6D74] hover:text-[#262E36] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6C6D74] focus:ring-offset-2"
          aria-label="Close search dialogue"
        >
          <X className="w-5 h-5 pointer-events-none" />
        </button>

        <div className="space-y-6">
          <div>
            <span className="font-mono text-[9px] tracking-widest text-[#090F15] uppercase font-bold bg-[#D3D1CE] px-3 py-1 rounded-none shadow-xs">
              System Node Locator
            </span>
            <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#090F15] mt-3 leading-snug">
              Secure Lab Finder
            </h3>
            <p className="text-xs text-[#6C6D74] font-light mt-1">
              Locate any accredited CancerCure Clinical Research branch or sequencing intake hub instantly.
            </p>
          </div>

          {/* Search Input bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C6D74] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Seattle, Houston, Boston, London..."
              className="w-full bg-[#D3D1CE]/40 border border-[#B3B7BA] rounded-none pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-[#090F15] focus:ring-2 focus:ring-[#090F15]/30 focus:ring-offset-2 font-sans"
              id="dialog-search-input"
            />
          </div>
 
          {/* Laboratories grid / results */}
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {filteredLabs.length > 0 ? (
              filteredLabs.map((lab) => (
                <div
                  key={lab.code}
                  className="p-4 bg-[#D3D1CE]/30 border border-[#D3D1CE] rounded-none hover:border-[#090F15]/40 transition-colors flex items-center justify-between group"
                  onMouseEnter={playHoverBeep}
                >
                  <div className="space-y-1 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="font-sans text-sm font-bold text-[#090F15]">
                        {lab.city}, {lab.state}
                      </span>
                      <span className="font-mono text-[9px] px-2 py-0.5 bg-[#D3D1CE] text-[#090F15] rounded-none font-bold">
                        {lab.code}
                      </span>
                    </div>
                    <p className="font-sans text-[11px] text-[#6C6D74] leading-normal">
                      {lab.address}
                    </p>
                    <span className="block font-mono text-[10px] text-[#6C6D74] mt-1">
                      {lab.phone}
                    </span>
                  </div>
 
                  <button
                    onClick={() => {
                      playSelectBeep();
                      alert(`Dialing CancerCure ${lab.city} node via secure gateway line: ${lab.phone}`);
                    }}
                    className="p-2.5 rounded-none bg-white border border-[#B3B7BA] hover:border-[#090F15] hover:text-[#090F15] transition-colors cursor-pointer group-hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#090F15]/50 focus:ring-offset-2"
                  >
                    <MapPin className="w-4.5 h-4.5 pointer-events-none" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-[#6C6D74] font-sans text-xs space-y-2">
                <FlaskConical className="w-8 h-8 mx-auto stroke-1 animate-pulse" />
                <p>No accredited laboratory nodes found for "{searchQuery}"</p>
              </div>
            )}
          </div>
 
          {/* Quick info section below */}
          <div className="p-3.5 bg-[#D3D1CE] border border-[#B3B7BA] rounded-none flex items-center space-x-2 text-[10px] font-mono text-[#262E36] leading-normal">
            <CircleCheck className="w-4 h-4 shrink-0 text-[#090F15]/60" />
            <span>All nodes listed above hold active CLIA / IAM clinical certificates.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
