import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageSrc: string;
}

const defaultMembers: TeamMember[] = [
  {
    name: "Subhajit Mondal",
    role: "Research, Frontend, AI/ML",
    bio: "Engineering multi-modal neural fusion architecture, CNN backbone fine-tuning, and Grad-CAM spatial mappings.",
    imageSrc: "/images/team/Subhajit Mondal.png"
  },
  {
    name: "Agniva Ghosh Roy",
    role: "AI/ML & Backend Dev",
    bio: "Pioneering hybrid mathematical classifiers integrated with 2D Fast Fourier Transforms and discrete wavelet multi-frequency decompositions.",
    imageSrc: "/images/team/Agniva Ghosh Roy.png"
  },
  {
    name: "Pratyush Ghosh",
    role: "Research & Backend Dev",
    bio: "Integrating clinical ABCD indicators with fractal dimensioning, Orientation Histograms, and asymmetrical bounds.",
    imageSrc: "/images/team/Pratyush Ghosh.png"
  },
  {
    name: "Debanjan Paul",
    role: "Support Developer",
    bio: "Refining self-attention representations, model calibration weights, unified diagnostic reporting, and multi-class clinical heads.",
    imageSrc: "/images/team/Debanjan Paul.png"
  }
];

export default function Team({ members = defaultMembers }: { members?: TeamMember[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const controls = useAnimation(); // included as requested

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const next = () => {
    setActiveIndex((prev) => Math.min(prev + 1, members.length - 1));
  };

  const prev = () => {
    setActiveIndex((prev) => Math.max(prev - 1, 0));
  };

  const DRAG_BUFFER = 50;
  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -DRAG_BUFFER || info.velocity.x < -500) {
      if (activeIndex < members.length - 1) setActiveIndex((i) => i + 1);
    } else if (info.offset.x > DRAG_BUFFER || info.velocity.x > 500) {
      if (activeIndex > 0) setActiveIndex((i) => i - 1);
    }
  };

  const cardWidth = isMobile ? 220 : 280;
  const cardHeight = isMobile ? 300 : 380;
  const offsetDistance = isMobile ? 40 : 80;
  const rotateConst = isMobile ? 8 : 12;

  return (
    <section
      className="bg-[#090F15] py-24 md:py-32 border-b border-t border-[#6C6D74]/20 relative overflow-hidden flex flex-col items-center min-h-[700px]"
      id="team-section"
    >
      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-20 relative z-10 flex flex-col h-full">

        {/* HEADER & CONTROLS */}
        <div className="flex items-center justify-between w-full mb-12 select-none">
          <h2 className="font-serif text-[32px] md:text-[44px] font-normal tracking-tight text-[#D3D1CE] leading-none">
            Our Team
          </h2>

          <div className="flex space-x-3">
            <button
              onClick={prev}
              disabled={activeIndex === 0}
              className="w-[36px] h-[36px] rounded-full border border-[#B3B7BA] bg-transparent text-[#262E36] hover:bg-[#090F15] hover:text-[#D3D1CE] hover:border-[#D3D1CE] transition-colors flex items-center justify-center outline-none focus:ring-2 focus:ring-[#D3D1CE] disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous Team Member"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={activeIndex === members.length - 1}
              className="w-[36px] h-[36px] rounded-full border border-[#B3B7BA] bg-transparent text-[#262E36] hover:bg-[#090F15] hover:text-[#D3D1CE] hover:border-[#D3D1CE] transition-colors flex items-center justify-center outline-none focus:ring-2 focus:ring-[#D3D1CE] disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next Team Member"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CAROUSEL ARENA */}
        <div className="relative w-full h-[400px] flex items-center justify-center">
          <AnimatePresence initial={false}>
            {members.map((member, index) => {
              const offset = index - activeIndex;
              if (Math.abs(offset) > 3) return null; // performance optimization

              const isActive = offset === 0;
              const x = offset * offsetDistance;
              const rotate = offset * rotateConst;
              const zIndex = 20 - Math.abs(offset);
              const opacity = isActive ? 1 : 0.55;

              return (
                <motion.div
                  key={index}
                  drag={isActive ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={isActive ? handleDragEnd : undefined}
                  className="absolute cursor-grab active:cursor-grabbing rounded-[24px] overflow-hidden bg-[#D3D1CE] border border-[#B3B7BA] shadow-[0_6px_24px_rgba(9,15,21,0.18)]"
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                  }}
                  animate={{ x, rotate, opacity }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onClick={() => !isActive && setActiveIndex(index)}
                >
                  {/* Photo Top Half */}
                  <div className="w-full h-[140px] md:h-[180px] border-b border-[#B3B7BA]/30 bg-[#262E36] shrink-0">
                    <img
                      src={member.imageSrc}
                      alt={member.name}
                      draggable="false"
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                  </div>

                  {/* Info Bottom Half with Mount/Unmount Animation for active content */}
                  <div className="p-4 md:p-5 flex flex-col h-[160px] md:h-[200px] relative">
                    <AnimatePresence>
                      {isActive ? (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                          className="flex flex-col h-full"
                        >
                          <div className="flex items-center space-x-2">
                            <h3 className="text-[#090F15] text-[16px] md:text-[18px] font-medium tracking-tight">
                              {member.name}
                            </h3>
                            <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-[#6C6D74]" />
                          </div>

                          <span className="text-[#6C6D74] text-[12px] md:text-[13px] mt-0.5">
                            {member.role}
                          </span>

                          <p className="text-[#262E36] text-[12px] md:text-[13px] leading-[1.6] mt-3 line-clamp-2 md:line-clamp-none overflow-hidden">
                            {member.bio}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="flex flex-col h-full justify-center text-center opacity-40 select-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <h3 className="text-[#090F15] text-[16px] md:text-[18px] font-medium tracking-tight">
                            {member.name}
                          </h3>
                          <span className="text-[#6C6D74] text-[12px] md:text-[13px] mt-1">
                            {member.role}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* INDICATOR DOTS */}
        <div className="flex items-center justify-center space-x-[6px] mt-12 w-full z-20">
          {members.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Jump to slide ${i + 1}`}
              className={`w-[8px] h-[8px] rounded-full transition-colors outline-none focus:ring-2 focus:ring-[#D3D1CE] focus:ring-offset-2 focus:ring-offset-[#090F15] ${i === activeIndex
                ? "bg-[#090F15] border border-[#090F15]"
                : "bg-transparent border border-[#B3B7BA]"
                }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

