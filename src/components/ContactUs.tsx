import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Send, Globe, CheckCircle } from "lucide-react";
import { playSelectBeep, playHoverBeep } from "./AudioEngine";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  // 3D Card tilt calculation
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardTransform, setCardTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate inside element
    const y = e.clientY - rect.top;  // y coordinate inside element

    // Normalize coordinates around element center
    const tiltX = (y - rect.height / 2) / (rect.height / 2) * -12; // max tilt 12 deg
    const tiltY = (x - rect.width / 2) / (rect.width / 2) * 12;

    setCardTransform(`perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`);
  };

  const handleCardMouseLeave = () => {
    setCardTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSelectBeep();

    // Simulate API transport node locking
    setIsSubmitSuccess(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => {
      setIsSubmitSuccess(false);
    }, 6000);
  };

  return (
    <section className="bg-[#D3D1CE] text-[#090F15] py-16 md:py-24 pb-0 md:pb-0 border-t border-[#090F15]/10 relative overflow-hidden" id="contact-section">

      {/* Decorative futuristic micro grid line overlay */}
      <div className="absolute inset-x-0 h-px bg-[#090F15]/10 bottom-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">

        {/* Giant header typography matching the video */}
        <div className="text-center md:text-left mb-16 border-b border-[#090F15]/10 pb-10">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#090F15] font-bold block mb-3">
            ● Academic Inquiries Node
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#090F15] uppercase">
            CONTACT
          </h2>
        </div>

        {/* SECTION SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* LEFT: THE INTERACTIVE TILT BUSINESS CARD AND WIDGETS */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-center">

            <p className="font-mono text-[9px] uppercase text-[#090F15]/40 font-bold tracking-[0.18em] text-left">
              Secure Laboratory Info Card // (Hover to tilt in 3D)
            </p>

            {/* Glowing 3D Tilt Card in Cream Frame */}
            <div
              ref={cardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onMouseEnter={playHoverBeep}
              style={{
                transform: cardTransform,
                transition: "transform 0.1s ease-out, box-shadow 0.25s ease-out",
              }}
              className="bg-white/60 backdrop-blur-md p-8 rounded-3xl text-left relative overflow-hidden group select-none flex flex-col justify-between aspect-[1.6/1] outline-none border border-white shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_48px_rgba(139,133,232,0.1)] cursor-crosshair text-[#090F15]"
              id="tilt-contact-card"
            >
              {/* Shimmer overlay effects */}
              <div className="absolute inset-0 bg-[#090F15]/0 transition-colors group-hover:bg-[#090F15]/5 duration-300 pointer-events-none" />

              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.15em] text-[#090F15] bg-white border border-white px-3 py-1 rounded-full shadow-sm font-bold">
                    CC // Proudly Engineered in India 🇮🇳
                  </span>
                  <h3 className="font-serif font-bold text-xl sm:text-2xl italic tracking-tight text-[#090F15] mt-4 uppercase leading-none">
                    CANCERCURE AI LAB
                  </h3>
                </div>

                <div className="w-9 h-9 bg-white border border-[#090F15]/10 text-[#090F15] flex items-center justify-center font-bold text-xs font-mono rounded-full overflow-hidden shadow-sm">
                  CC
                </div>
              </div>

              {/* Secure terminal contacts list */}
              <div className="space-y-2 pt-6 font-mono text-[10px] text-[#090F15]/70 border-t border-[#090F15]/10 relative z-10">
                <div className="flex items-center space-x-3">
                  <Phone className="w-3.5 h-3.5 text-[#090F15]" />
                  <span>PROJECT CELL</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-3.5 h-3.5 text-[#090F15]" />
                  <span>cancercureai@gmail.com</span>
                </div>
                <div className="flex items-start space-x-3 font-semibold text-[#090F15]">
                  <MapPin className="w-3.5 h-3.5 text-[#090F15] mt-0.5 shrink-0" />
                  <span className="leading-tight">Kolkata, West Bengal, India</span>
                </div>
              </div>
            </div>

            {/* Remote portal guidelines */}
            <div className="bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white flex items-start space-x-4 text-left shadow-sm">
              <div className="p-2 w-10 h-10 bg-white rounded-full border border-[#090F15]/10 shadow-sm flex items-center justify-center shrink-0">
                <Globe className="w-4.5 h-4.5 text-[#090F15]" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-serif font-bold text-sm text-[#090F15] italic tracking-wide">
                  Academic & Research Repository
                </h4>
                <p className="font-sans text-[11px] text-[#090F15]/70 leading-normal font-light">
                  For access to the trained model weight distributions, custom Loss architecture configurations, or collaboration on multi-stream spectral-spatial fusion datasets, please issue an institutional request via the form.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className="lg:col-span-7 bg-white/40 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white shadow-[0_8px_32px_rgba(0,0,0,0.04)] relative flex flex-col justify-between h-full">

            <AnimatePresence mode="wait">
              {!isSubmitSuccess ? (
                <motion.form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 text-left"
                >
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#090F15] font-bold mb-4">
                    TRISPECT AI CORE INSTANCE INQUIRIES
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="contact-name" className="block text-[8px] font-mono tracking-[0.18em] text-[#090F15]/50 uppercase font-bold mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="contact-name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Juliet Walker"
                        className="w-full bg-white/60 border border-white focus:border-[#090F15] rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#090F15]/30 transition-all font-sans text-[#090F15] text-left shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="contact-email" className="block text-[8px] font-mono tracking-[0.18em] text-[#090F15]/50 uppercase font-bold mb-1">
                        Email address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="contact-email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. walker@labs.com"
                        className="w-full bg-white/60 border border-white focus:border-[#090F15] rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#090F15]/30 transition-all font-sans text-[#090F15] text-left shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-subject" className="block text-[8px] font-mono tracking-[0.18em] text-[#090F15]/50 uppercase font-bold mb-1">
                      Inquiry Subject *
                    </label>
                    <select
                      name="subject"
                      id="contact-subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-white/60 border border-white focus:border-[#090F15] rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#090F15]/30 transition-all font-sans text-[#090F15] appearance-none text-left shadow-sm"
                    >
                      <option value="" disabled className="text-[#090F15]/40">-- Select Inquiry Type --</option>
                      <option value="Request Architecture Codebase Access" className="bg-white text-[#090F15]">Request Architecture Codebase Access</option>
                      <option value="Model Evaluation & Weights Download" className="bg-white text-[#090F15]">Model Evaluation & Weights Download</option>
                      <option value="Academic Research Collaboration" className="bg-white text-[#090F15]">Academic Research Collaboration</option>
                      <option value="General Project Feedback" className="bg-white text-[#090F15]">General Project Feedback</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact-message" className="block text-[8px] font-mono tracking-[0.18em] text-[#090F15]/50 uppercase font-bold mb-1">
                      Message Details *
                    </label>
                    <textarea
                      name="message"
                      id="contact-message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      placeholder="Tell us about your inquiry regarding the Tri-Stream Melanoma AI project..."
                      className="w-full bg-white/60 border border-white focus:border-[#090F15] rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#090F15]/30 transition-all font-sans text-[#090F15] resize-none text-left shadow-sm"
                    />
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">

                    <span className="font-mono text-[8px] text-[#090F15]/40 tracking-widest uppercase">
                      🔒 SECURE TRANSPORT END-TO-END
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 450, damping: 18 }}
                      type="submit"
                      onMouseEnter={playHoverBeep}
                      className="px-8 py-3 rounded-full bg-white text-[#090F15] font-mono text-[10px] tracking-[0.2em] uppercase font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#090F15]/10 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#090F15]/50 focus:ring-offset-2"
                      id="submit-contact-btn"
                    >
                      <span>Submit message</span>
                      <Send className="w-3.5 h-3.5 text-[#090F15]" />
                    </motion.button>
                  </div>

                </motion.form>
              ) : (
                <motion.div
                  key="submit-success-state"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col items-center justify-center text-center p-8 space-y-5 py-16"
                  id="submit-success-banner"
                >
                  <div className="w-14 h-14 bg-white border-2 border-white shadow-sm text-[#090F15] flex items-center justify-center rounded-full">
                    <CheckCircle className="w-6 h-6" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-2xl italic text-[#090F15]">
                      Message Nodes Locked!
                    </h3>
                    <p className="font-sans text-xs text-[#090F15]/70 leading-relaxed font-light max-w-sm mx-auto">
                      Your inquiry has been successfully transmitted over secure pipelines to our research faculty coordinators. A response cell will verify your request within 24-48 enterprise hours.
                    </p>
                  </div>

                  <span className="font-mono text-[9px] text-[#090F15] uppercase tracking-[0.16em] font-bold">
                    System Node: ENCRYPTED // TX_OK
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>

      {/* COMPREHENSIVE INDUSTRIAL FOOTER */}
      <footer className="relative w-full bg-[#D3D1CE] pt-20 pb-0 border-t border-[#090F15]/10 overflow-hidden" id="primary-footer">

        {/* Massive Brand Watermark */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center z-0 pointer-events-none overflow-hidden leading-none">
          <span className="text-[12vw] font-sans font-black uppercase text-[#090F15]/[0.02] select-none tracking-tighter leading-none translate-y-3">
            CANCERCURE
          </span>
        </div>

        {/* Floating Footer Card */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 mb-0">
          <div className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-8 md:p-12 shadow-sm">
            {/* Left Side (Brand & Mission) & Right Side (The 2 Link Columns) */}
            <div className="flex flex-col lg:flex-row justify-between gap-12 text-left">

              {/* Left Column (Brand & Mission) */}
              <div className="space-y-4 max-w-sm">
                <span className="text-2xl font-serif font-bold italic text-[#090F15] tracking-tight block">
                  CancerCure
                </span>
                <p className="font-sans leading-relaxed text-[#090F15]/60 text-sm mt-4">
                  A high-precision biomedical deep learning interface mapping multi-stream classification metrics for early clinical melanoma detection.
                </p>
              </div>

              {/* Right Side (The 2 Link Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-16">

                {/* Column 1 (RESEARCH) */}
                <div className="space-y-4">
                  <span className="text-[#090F15] font-mono uppercase tracking-[0.15em] text-xs font-semibold block">Research</span>
                  <ul className="space-y-2.5 font-sans leading-relaxed text-[#090F15]/60 text-sm">
                    <li>
                      <a href="https://sites.google.com/view/priyasenpurkaitrcciit/home" target="_blank" rel="noopener noreferrer" className="hover:text-[#090F15] transition-colors focus:outline-none focus:ring-2 focus:ring-[#090F15]/50 focus:ring-offset-2">Our Scientific Faculty</a>
                    </li>
                    <li>
                      <a href="https://github.com/subhajit1560/Tri-Stream-Spectral-Spatial-Fusion-Transformer-for-Automated-Melanoma-Detection" target="_blank" rel="noopener noreferrer" className="hover:text-[#090F15] transition-colors cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#090F15]/50 focus:ring-offset-2">Core Model</a>
                    </li>
                    <li>
                      <a href="https://www.kaggle.com/datasets/kmader/skin-cancer-mnist-ham10000" target="_blank" rel="noopener noreferrer" className="hover:text-[#090F15] transition-colors cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#090F15]/50 focus:ring-offset-2">HAM10000 Benchmark</a>
                    </li>
                  </ul>
                </div>

                {/* Column 2 (RESOURCES) */}
                <div className="space-y-4">
                  <span className="text-[#090F15] font-mono uppercase tracking-[0.15em] text-xs font-semibold block">Resources</span>
                  <ul className="space-y-2.5 font-sans leading-relaxed text-[#090F15]/60 text-sm">

                    <li>
                      <button className="hover:text-[#090F15] transition-colors cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#090F15]/50 focus:ring-offset-2">Research Paper Link</button>
                    </li>
                    <li>
                      <a href="https://www.kaggle.com/datasets/salviohexia/isic-2019-skin-lesion-images-for-classification" target="_blank" rel="noopener noreferrer" className="hover:text-[#090F15] transition-colors cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#090F15]/50 focus:ring-offset-2">ISIC Archive Portal</a>
                    </li>
                  </ul>
                </div>

              </div>

            </div>

            {/* Bottom Inner Layout Section */}
            <div className="border-t border-[#090F15]/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="font-sans text-[#090F15]/40 text-xs text-center md:text-left">
                © 2026 CancerCure AI Labs. All rights reserved.
              </span>
              <span className="font-mono text-[#090F15] font-bold text-[10px] tracking-wider uppercase text-center md:text-left">
                CancerCure (CC) Systems — Powered by TRISPECT AI Engine v1.0
              </span>
              <span className="text-[#090F15]/40 text-xs tracking-widest font-mono uppercase">
                Proudly Made in India 🇮🇳
              </span>
            </div>

          </div>
        </div>

      </footer>
    </section>
  );
}
