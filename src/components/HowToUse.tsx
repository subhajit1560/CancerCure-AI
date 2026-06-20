import React from "react";
import { motion } from "motion/react";
import { UploadCloud, MessageSquare, Activity, CheckCircle2 } from "lucide-react";
import { playHoverBeep } from "./AudioEngine";

const steps = [
  {
    id: 1,
    title: "Upload Lesion Media",
    description: "Securely upload a high-resolution dermoscopic image to our encrypted clinical network.",
    icon: UploadCloud,
    avatarName: "Step 01",
    avatarRole: "Image Capture"
  },
  {
    id: 2,
    title: "Input Clinical Notes",
    description: "Provide optional patient queries or observational notes to add context to the AI analysis.",
    icon: MessageSquare,
    avatarName: "Step 02",
    avatarRole: "Data Entry"
  },
  {
    id: 3,
    title: "Initiate Core Scan",
    description: "Trigger the Tri-Stream Fusion Transformer to process spatial and geometric features.",
    icon: Activity,
    avatarName: "Step 03",
    avatarRole: "AI Processing"
  },
  {
    id: 4,
    title: "Receive Diagnosis",
    description: "Instantly retrieve highly sensitive predictions alongside Explainable AI (XAI) attention maps.",
    icon: CheckCircle2,
    avatarName: "Step 04",
    avatarRole: "Clinical Review"
  }
];

export default function HowToUse() {
  return (
    <section className="bg-[#D3D1CE] text-[#090F15] py-16 md:py-24 border-b border-[#090F15]/10 relative overflow-hidden" id="how-to-use-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="text-center mb-16">
          <span className="font-mono text-[9px] uppercase text-[#090F15] font-bold tracking-[0.25em]">
            ■ SYSTEM WORKFLOW
          </span>
          <h2 className="font-serif text-3xl md:text-[40px] font-normal tracking-tight text-[#090F15] mt-4 leading-[1.12]">
            How to use <span className="italic font-light text-[#090F15]/90">Our AI</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#090F15]/60 mt-4 max-w-xl mx-auto font-light leading-relaxed">
            Follow these streamlined steps to initiate a high-precision melanoma scan using our clinical-grade infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              initial="initial"
              whileHover="hover"
              onMouseEnter={playHoverBeep}
              className="relative rounded-[2rem] border border-white max-w-sm mx-auto shadow-xl shadow-[#090F15]/[-0.05] hover:-translate-y-1 hover:shadow-[#090F15]/10 bg-white/40 backdrop-blur-md p-8 h-[340px] flex flex-col justify-between overflow-hidden group cursor-default transition-all duration-300 w-full"
            >
              <div className="relative z-10">
                <step.icon className="w-8 h-8 text-[#090F15] mb-6 transition-colors duration-300" />
                <h3 className="font-serif text-2xl font-normal tracking-tight text-[#090F15] mb-3 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="font-sans text-xs text-[#090F15]/60 leading-relaxed font-light transition-colors duration-300">
                  {step.description}
                </p>
              </div>

              <div className="relative z-10 flex items-center space-x-3 mt-8">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#090F15]/10 shadow-sm transition-colors duration-300">
                  <span className="font-mono text-[10px] text-[#090F15] font-bold">{step.id}</span>
                </div>
                <div>
                  <span className="block font-serif text-sm font-bold text-[#090F15]">{step.avatarName}</span>
                  <span className="block font-sans text-[10px] text-[#090F15]/50">{step.avatarRole}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
