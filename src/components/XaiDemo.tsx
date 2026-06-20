import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { HelpCircle, Sparkles, Sliders, ShieldCheck, Eye, RefreshCw, ChevronLeft, ChevronRight, Activity, Cpu } from "lucide-react";
import { playHoverBeep, playSelectBeep } from "./AudioEngine";

interface SampleCase {
  id: string;
  name: string;
  type: string;
  image: string;
  risk: string;
  attentionLabel: string;
  heatmapGradient: string;
  hotspots: { cx: string; cy: string; r: string; opacity: string }[];
}

/** Inline SVG data URI used when an image fails to load */
const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" fill="#e4e4e7"><rect width="800" height="600" fill="#d4d4d8"/><text x="400" y="280" text-anchor="middle" fill="#71717a" font-family="monospace" font-size="14" letter-spacing="2">IMAGE UNAVAILABLE</text><text x="400" y="310" text-anchor="middle" fill="#a1a1aa" font-family="monospace" font-size="11">Clinical scan data could not be loaded</text></svg>`
)}`;

export default function XaiDemo() {
  const [activeCaseId, setActiveCaseId] = useState<string>("case-1");
  const containerRef = useRef<HTMLDivElement>(null);
  const rangeInputRef = useRef<HTMLInputElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [imageError, setImageError] = useState(false);

  const dragX = useMotionValue(0);

  useEffect(() => {
    if (!containerRef.current) return;
    let prevWidth = containerRef.current.offsetWidth;
    setContainerWidth(prevWidth);
    dragX.set(prevWidth / 2);

    const updateWidth = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.offsetWidth;
        if (newWidth > 0 && prevWidth > 0) {
          const currentRatio = dragX.get() / prevWidth;
          dragX.set(currentRatio * newWidth);
        } else if (newWidth > 0) {
          dragX.set(newWidth / 2);
        }
        setContainerWidth(newWidth);
        prevWidth = newWidth;
      }
    };
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Reset slider position and image error state when the active case changes
  useEffect(() => {
    setImageError(false);
    if (containerWidth > 0) {
      dragX.set(containerWidth / 2);
      if (rangeInputRef.current) {
        rangeInputRef.current.value = "50";
      }
    }
  }, [activeCaseId]);

  const clipPathStyle = useTransform(dragX, (val) => {
    if (!containerWidth) return "inset(0 50% 0 0)";
    const pct = Math.max(0, Math.min(100, (val / containerWidth) * 100));
    return `inset(0 ${100 - pct}% 0 0)`;
  });

  useEffect(() => {
    const unsubscribe = dragX.on("change", (latest) => {
      if (containerWidth > 0 && rangeInputRef.current) {
        const pct = Math.max(0, Math.min(100, (latest / containerWidth) * 100));
        rangeInputRef.current.value = Math.round(pct).toString();
      }
    });
    return () => unsubscribe();
  }, [dragX, containerWidth]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = Number(e.target.value);
    const targetX = (pct / 100) * containerWidth;
    dragX.set(targetX);
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
    const targetX = (percentage / 100) * containerWidth;
    dragX.set(targetX);
  };

  const cases: SampleCase[] = [
    {
      id: "case-1",
      name: "Dermatologic Lesion Segment A",
      type: "Superficial Spreading Phase",
      image: "/images/xai/lesion-case-a.png",
      risk: "Elevated Risk",
      attentionLabel: "Atypical Chromatin Clustering Spot",
      heatmapGradient: "from-white/60 via-zinc-500/30 to-transparent",
      hotspots: [
        { cx: "45%", cy: "40%", r: "75", opacity: "0.8" },
        { cx: "52%", cy: "48%", r: "45", opacity: "0.55" },
        { cx: "38%", cy: "55%", r: "30", opacity: "0.4" }
      ],
    },
    {
      id: "case-2",
      name: "Subcutaneous Mass Segment B",
      type: "Nodular Cell Progression",
      image: "/images/xai/lesion-case-b.png",
      risk: "Moderate Risk",
      attentionLabel: "Cellular Border Expansion Border",
      heatmapGradient: "from-zinc-300/60 via-zinc-500/25 to-transparent",
      hotspots: [
        { cx: "60%", cy: "55%", r: "60", opacity: "0.75" },
        { cx: "65%", cy: "45%", r: "40", opacity: "0.5" }
      ],
    }
  ];

  const currentCase = cases.find(c => c.id === activeCaseId) || cases[0];

  return (
    <section className="bg-[#D3D1CE] py-16 md:py-24 px-6 md:px-12 lg:px-20 border-b border-[#090F15]/10 overflow-hidden" id="xai-section">
      {/* Image preloader: hidden images to warm up browser cache on case switch */}
      <div className="hidden">
        {cases.map(c => (
          <img key={c.id} src={c.image} alt="" />
        ))}
      </div>
      <div className="max-w-7xl mx-auto">
        
        {/* Header and metadata title */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-[#090F15]/10 pb-12 mb-16" id="xai-header-wrapper">
          <div className="lg:col-span-7 space-y-3 text-left">
            <span className="font-mono text-[9px] uppercase text-[#090F15] font-bold tracking-[0.25em] flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-[#090F15] rounded-full animate-pulse" />
              <span>Diagnostic Interpretability</span>
            </span>
            <h2 className="font-serif text-3xl md:text-[40px] font-normal tracking-tight text-[#090F15] leading-[1.12]">
              Explainable AI <br />
              <span className="italic font-light opacity-80">Insights Portal</span>
            </h2>
          </div>
          <div className="lg:col-span-5 text-left">
            <p className="text-[#090F15]/75 font-sans text-xs font-light leading-relaxed max-w-md">
              Demystifying the black box. Our AI doesn't just produce automated diagnostics — it visualizes exactly what cell coordinates and anomalous tissue matrices triggered the predictive index.
            </p>
          </div>
        </div>

        {/* Explainable AI Interactive Panel Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch" id="xai-interactive-panel">
          
          {/* LEFT SIDE DETAILS: CASE SELECTOR & CRITICAL STATS */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left space-y-8">
            
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-[#090F15]">
                <Cpu className="w-4.5 h-4.5" />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold">
                  Heatmap Coordinate Index
                </span>
              </div>
              
              <h3 className="font-serif text-2xl font-light italic text-[#090F15] tracking-tight leading-snug">
                Transparent cell clustering maps
              </h3>
              
              <p className="text-xs text-[#090F15]/75 leading-relaxed font-light">
                Utilizing state-of-the-art Grad-CAM and integrated gradients pipelines, we compute attention scores across multi-scale microscopic features. Hover or drag the slider relative to the canvas to pinpoint exact malignant indicators.
              </p>
            </div>

            {/* Case selector controls */}
            <div className="space-y-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#090F15]/40 font-bold block mb-2">
                Select Clinical Tissue Scan
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cases.map((cs) => {
                  const isActive = cs.id === activeCaseId;
                  return (
                    <motion.button
                      key={cs.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        playSelectBeep();
                        setActiveCaseId(cs.id);
                      }}
                      onMouseEnter={playHoverBeep}
                      className={`text-left p-4 rounded-[1.5rem] border transition-all cursor-pointer bg-white/40 backdrop-blur-md flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#090F15]/50 focus:ring-offset-2 ${
                        isActive 
                          ? "border-[#090F15] shadow-md shadow-[#090F15]/10" 
                          : "border-white/50 hover:border-[#090F15]/50 hover:shadow-sm"
                      }`}
                    >
                      <div>
                        <span className="font-mono text-[8px] uppercase tracking-wider text-[#090F15] block mb-1 font-bold">
                          {cs.id === "case-1" ? "CASE STANDARD A" : "CASE STANDARD B"}
                        </span>
                        <h4 className="font-serif text-sm font-semibold text-[#090F15] leading-tight">
                          {cs.name}
                        </h4>
                      </div>
                      <span className={`self-start font-mono text-[8.5px] mt-3 uppercase tracking-widest px-3 py-1 border font-semibold rounded-full ${
                        cs.risk.includes("Elevated") 
                          ? "border-[#090F15]/20 text-[#090F15] bg-[#090F15]/10" 
                          : "border-[#090F15]/10 text-[#090F15]/60 bg-white"
                      }`}>
                        {cs.risk}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Interactive metadata footer info */}
            <div className="p-5 bg-white/50 backdrop-blur-md border border-white shadow-sm rounded-2xl flex items-start space-x-3">
              <HelpCircle className="w-5 h-5 text-[#090F15] mt-0.5 shrink-0" />
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-[#090F15] font-bold uppercase tracking-wider">How to interact:</span>
                <p className="text-[10px] text-[#090F15]/70 font-light leading-relaxed">
                  Drag the slider handle or hover over the lesion scan to inspect the spatial expert heatmap coordinates.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE DETAILS: ACTIVE BEFORE & AFTER TRANSPARENT SLIDER */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center w-full">
            
            <div 
              ref={containerRef}
              className="relative w-full aspect-[4/3] max-w-2xl bg-[#D3D1CE] border-4 border-white shadow-[0_16px_48px_rgba(0,0,0,0.06)] rounded-3xl overflow-hidden select-none cursor-ew-resize group shadow-xs"
              onClick={handleContainerClick}
              id="slider-interactive-stage"
              key={activeCaseId}
            >
              {/* Image load error state */}
              {imageError && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#e4e4e7] text-[#71717a]">
                  <Eye className="w-8 h-8 mb-3 opacity-40" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">Scan Unavailable</span>
                  <span className="font-mono text-[9px] mt-1 opacity-60">Clinical image could not be loaded</span>
                </div>
              )}

              {/* THE BEFORE IMAGE (Always visible static base backdrop) */}
              <div className="absolute inset-0">
                <img
                  src={currentCase.image}
                  alt={currentCase.name}
                  className="w-full h-full object-cover pointer-events-none grayscale opacity-85"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== FALLBACK_IMAGE) {
                      target.src = FALLBACK_IMAGE;
                      setImageError(true);
                    }
                  }}
                />
                
                {/* Labels indicating "Before" Raw Scan */}
                <div className="absolute bottom-4 left-4 bg-[#090F15]/85 text-[#D3D1CE] font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-none border border-white/10 z-20">
                  Raw Scan: Grayscale Mode
                </div>
              </div>

              {/* THE AFTER IMAGE WITH DYNAMIC HEATMAP OVERLAY (Clipped layers) */}
              <motion.div 
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath: clipPathStyle,
                  willChange: "transform, clip-path",
                }}
              >
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={currentCase.image}
                    alt={`${currentCase.name} Heatmap`}
                    className="w-full h-full object-cover pointer-events-none"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== FALLBACK_IMAGE) {
                        target.src = FALLBACK_IMAGE;
                        setImageError(true);
                      }
                    }}
                  />
                  
                  {/* Glowing SVG Heatmap Attention Layer */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                      <radialGradient id={`heatgrad-${activeCaseId}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                        <stop offset="40%" stopColor="#d4d4d8" stopOpacity="0.6" />
                        <stop offset="70%" stopColor="#71717a" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#18181b" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Render hotspots dynamically */}
                    {currentCase.hotspots.map((h, hidx) => (
                      <g key={hidx}>
                        <circle
                          cx={h.cx}
                          cy={h.cy}
                          r={h.r}
                          fill={`url(#heatgrad-${activeCaseId})`}
                          className="animate-pulse"
                          style={{
                            transformOrigin: `${h.cx} ${h.cy}`,
                            animationDuration: `${3 + hidx}s`
                          }}
                        />
                        {/* Heatmap center warning coordinates indicator */}
                        {hidx === 0 && (
                          <>
                            <circle cx={h.cx} cy={h.cy} r="1.5" fill="#ffffff" />
                            <circle cx={h.cx} cy={h.cy} r="4" fill="none" stroke="#ffffff" strokeWidth="0.5" className="animate-ping" style={{ animationDuration: "2s" }} />
                          </>
                        )}
                      </g>
                    ))}
                  </svg>

                  {/* Top Layer indicator cards */}
                  <div className="absolute bottom-4 right-4 bg-zinc-950/90 text-[#D3D1CE] font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-none border border-white/20 z-20">
                    Grad-CAM Map Active
                  </div>
                </div>
              </motion.div>

              {/* SLIDER VERTICAL DIVIDER BAR */}
              <motion.div 
                className="absolute top-0 bottom-0 left-0 w-[40px] -ml-[20px] z-30 flex items-center justify-center cursor-ew-resize will-change-transform"
                style={{
                  x: dragX,
                }}
                drag="x"
                dragConstraints={{ left: 0, right: containerWidth }}
                dragElastic={0}
                dragMomentum={false}
              >
                {/* Visual line */}
                <div className="absolute top-0 bottom-0 w-[2px] bg-white shadow-md pointer-events-none" />
                
                {/* Horizontal draggable center handle hub */}
                <div className="w-[36px] h-[36px] rounded-full bg-white text-[#090F15] border border-[#090F15]/20 flex items-center justify-center shadow-lg pointer-events-none scale-100 group-hover:scale-110 transition-transform relative z-40">
                  <span className="font-mono text-[10px] font-bold tracking-tight select-none">↔</span>
                </div>
              </motion.div>

              {/* Diagnostic Active Alert Pin label */}
              <div className="absolute top-4 left-4 z-40 bg-white/80 backdrop-blur-md text-[#090F15] font-mono text-[8px] tracking-wider uppercase px-3 py-1.5 border border-white shadow-sm flex items-center space-x-2 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#090F15] animate-pulse" />
                <span className="font-bold">Focus: {currentCase.attentionLabel}</span>
              </div>

            </div>

            {/* Slider fine range input helper controller */}
            <div className="w-full max-w-2xl mt-4 flex items-center justify-between gap-4">
              <span className="font-mono text-[8.5px] text-[#090F15]/40 uppercase tracking-widest">
                RAW IMAGE
              </span>
              <div className="flex-1 flex items-center px-4">
                <input
                  ref={rangeInputRef}
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  onChange={handleSliderChange}
                  onMouseEnter={playHoverBeep}
                  className="w-full bg-[#090F15]/10 accent-[#090F15] h-1 focus:outline-none focus:ring-2 focus:ring-[#090F15]/50 focus:ring-offset-2"
                  aria-label="Before/After Slider Position Selector"
                  id="xai-slider-input"
                />
              </div>
              <span className="font-mono text-[8.5px] text-[#090F15]/40 uppercase tracking-widest">
                XAI HEATMAP
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
