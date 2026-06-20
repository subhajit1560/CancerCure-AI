import React from "react";

export default function Marquee() {
  const words = [
    "SPATIAL EXPERT",
    "SPECTRAL EXPERT",
    "GEOMETRIC EXPERT",
    "TRANSFORMER FUSION",
    "XAI HEATMAPS",
    "CLINICAL DECISION",
    "MELANOMA CLASSIFICATION",
    "DEEP PATHOLOGY"
  ];

  // We multiply the lists slightly to ensure it fills any wide display comfortably
  const itemsRow1 = [...words, ...words, ...words];
  const itemsRow2 = [...words, ...words, ...words].reverse();

  return (
    <section 
      className="bg-[#D3D1CE] py-8 border-b border-[#090F15]/10 overflow-hidden relative select-none" 
      id="marquee-section"
      aria-label="Clinical AI Expert Streams"
    >
      {/* Soft overlay gradients on sides for high-end luxury fading effect */}
      <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#D3D1CE] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#D3D1CE] to-transparent z-10 pointer-events-none" />

      <div className="flex flex-col space-y-4 hover-pause">
        {/* Row 1: Moving leftwards */}
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="flex space-x-12 animate-infinite-scroll shrink-0 pr-12">
            {itemsRow1.map((word, idx) => (
              <div key={`row1-${idx}`} className="flex items-center space-x-6">
                <span className="font-mono text-[10px] tracking-[0.25em] text-[#090F15]/80 font-medium uppercase">
                  {word}
                </span>
                <span className="text-[#090F15] font-mono text-xs">•</span>
              </div>
            ))}
          </div>
          {/* Main stream copy for seamless wrap loop support */}
          <div className="flex space-x-12 animate-infinite-scroll shrink-0 pr-12" aria-hidden="true">
            {itemsRow1.map((word, idx) => (
              <div key={`row1-clone-${idx}`} className="flex items-center space-x-6">
                <span className="font-mono text-[10px] tracking-[0.25em] text-[#090F15]/80 font-medium uppercase">
                  {word}
                </span>
                <span className="text-[#090F15] font-mono text-xs">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Moving rightwards (reverse) */}
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="flex space-x-12 animate-infinite-scroll-reverse shrink-0 pr-12">
            {itemsRow2.map((word, idx) => (
              <div key={`row2-${idx}`} className="flex items-center space-x-6">
                <span className="font-mono text-[10px] tracking-[0.25em] text-[#090F15]/60 font-medium uppercase">
                  {word}
                </span>
                <span className="text-[#090F15]/60 font-mono text-xs">•</span>
              </div>
            ))}
          </div>
          {/* Main stream copy for seamless wrap loop support */}
          <div className="flex space-x-12 animate-infinite-scroll-reverse shrink-0 pr-12" aria-hidden="true">
            {itemsRow2.map((word, idx) => (
              <div key={`row2-clone-${idx}`} className="flex items-center space-x-6">
                <span className="font-mono text-[10px] tracking-[0.25em] text-[#090F15]/60 font-medium uppercase">
                  {word}
                </span>
                <span className="text-[#090F15]/60 font-mono text-xs">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
