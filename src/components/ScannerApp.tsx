import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud, ChevronLeft, Download,
  RefreshCcw, Activity, ArrowLeftRight
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

// ─── API BASE URL CONFIGURATION ──────────────────────────────────────────────
const API_BASE = "https://papaig100-melanoma-detection-api.hf.space";
// ────────────────────────────────────────────────────────────────────────────

interface ClassProbability {
  class: string;
  probability: number;
}

interface DiagnosticResult {
  prediction: string;
  confidence: number;
  risk_level: 'HIGH RISK' | 'LOW RISK';
  pred_index: number;
  all_probabilities: ClassProbability[];
  asymmetry_score: number;
  border_score: number;
  quality: {
    hair_ratio: number;
    blur_score: number;
  };
}

const ImageComparisonSlider = ({ baseImage }: { baseImage: string }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleMove(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square bg-white border border-[#1A1A1A]/10 rounded-xl overflow-hidden shadow-sm group select-none touch-none cursor-ew-resize"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img src={baseImage} alt="Raw Dermoscopic Lesion" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
        <img src={baseImage} alt="Processed" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-80 mix-blend-multiply">
          <div className="absolute top-[38%] left-[42%] w-[38%] h-[38%] rounded-full bg-red-500 blur-2xl opacity-75 animate-pulse" />
          <div className="absolute top-[48%] left-[34%] w-[48%] h-[48%] rounded-full bg-yellow-500 blur-3xl opacity-60" />
          <div className="absolute top-[28%] left-[52%] w-[28%] h-[28%] rounded-full bg-orange-500 blur-xl opacity-70" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(26,26,26,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      </div>
      <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none flex flex-col items-center justify-center" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
        <div className="w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center pointer-events-auto">
          <ArrowLeftRight className="w-4 h-4 text-[#1A1A1A]" />
        </div>
      </div>
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md text-[#1A1A1A] font-mono text-xs tracking-widest uppercase font-bold border border-white/40 px-3 py-1.5 rounded-full shadow-sm z-10 pointer-events-none">
        XAI Heatmap Output
      </div>
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md text-white font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full pointer-events-none transition-opacity duration-300 shadow-sm" style={{ opacity: (100 - sliderPos) / 100 }}>
        HEATMAP
      </div>
      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full pointer-events-none transition-opacity duration-300 shadow-sm" style={{ opacity: sliderPos / 100 }}>
        RAW
      </div>
    </div>
  );
};

type ScannerState = 'upload' | 'processing' | 'results' | 'error';

interface ScannerAppProps {
  onBack: () => void;
}

export default function ScannerApp({ onBack }: ScannerAppProps) {
  const [scannerState, setScannerState] = useState<ScannerState>('upload');
  const [loadingText, setLoadingText] = useState('Extracting Spatial Features...');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const generatePDF = async () => {
    if (!reportRef.current || isGeneratingPDF) return;
    try {
      setIsGeneratingPDF(true);
      const element = reportRef.current;

      const dataUrl = await toPng(element, { quality: 0.95, pixelRatio: 2 });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

      pdf.addImage(dataUrl, 'PNG', 10, 10, pdfWidth - 20, pdfHeight - 20);
      pdf.save('CancerCure-Diagnostic-Report.pdf');
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const loadingMessages = [
    'Extracting Spatial Features...',
    'Processing Multi-Stream Tensors...',
    'Running Geometric ABCD Analysis...',
    'Cross-Referencing HAM10000 Benchmark...',
    'Finalizing Result Generation...'
  ];

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  // ── REAL API CALL ──────────────────────────────────────────────────────────
  const startScan = async () => {
    if (!uploadedImage || !uploadedFile) return;

    setScannerState('processing');
    setErrorMsg('');

    // Cycle loading messages while the API runs
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[msgIdx]);
    }, 700);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Unknown server error' }));
        throw new Error(err.error || `Server error ${response.status}`);
      }

      const data: DiagnosticResult = await response.json();
      setResult(data);
      setScannerState('results');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to reach the backend. Is Cell 19 running?');
      setScannerState('error');
    } finally {
      clearInterval(interval);
    }
  };
  // ──────────────────────────────────────────────────────────────────────────

  const resetScan = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setResult(null);
    setErrorMsg('');
    setScannerState('upload');
  };

  // Helper: label text for asymmetry/border scores
  const scoreLabel = (val: number) => {
    if (val >= 0.75) return 'Critical';
    if (val >= 0.50) return 'Elevated';
    if (val >= 0.25) return 'Moderate';
    return 'Normal';
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans flex flex-col relative overflow-hidden">
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#1A1A1A]/10 relative z-20">
        <button onClick={onBack} className="flex items-center space-x-2 text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/50 focus:ring-offset-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-mono text-xs tracking-widest uppercase">Back to Hub</span>
        </button>
        <div className="font-serif italic font-bold tracking-tight text-xl text-[#1A1A1A]">CancerCure Scanner</div>
        <div className="w-[100px]" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative z-10 w-full max-w-6xl mx-auto">
        <AnimatePresence mode="wait">

          {/* ── STATE: UPLOAD ─────────────────────────────────────────────── */}
          {scannerState === 'upload' && (
            <motion.div key="upload-state" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}
              className="w-full max-w-2xl bg-white/60 backdrop-blur-2xl border border-white/60 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col"
            >
              <div className="mb-6">
                <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[#1A1A1A]">Initialize Core Scan</h2>
                <p className="font-sans text-sm text-[#888888] leading-relaxed max-w-md">Upload a high-resolution dermoscopic image to begin tri-stream pipeline classification.</p>
              </div>

              <div
                className={`w-full h-48 md:h-64 border-2 border-dashed ${uploadedImage ? 'border-[#1A1A1A]/40' : 'border-[#1A1A1A]/20 hover:border-[#1A1A1A]/50'} bg-white/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors mb-6 relative overflow-hidden`}
                onClick={handleUploadClick} onDrop={handleDrop} onDragOver={handleDragOver} tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleUploadClick(); }}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                {uploadedImage ? (
                  <div className="relative w-full h-full p-2 flex items-center justify-center">
                    <div className="relative w-full h-full max-w-sm rounded-xl overflow-hidden border-2 border-[#1A1A1A]/20 shadow-md bg-white flex items-center justify-center">
                      <img src={uploadedImage} alt="Uploaded lesion" className="max-w-full max-h-full object-contain p-2 block" />
                      <div className="absolute top-2 right-2 bg-[#1A1A1A] text-white font-mono text-[9px] uppercase tracking-widest px-2.5 py-1.5 rounded-full shadow-sm flex items-center space-x-1.5 z-20">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        <span>✓ Image ready</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-2xl">
                      <span className="font-mono text-xs tracking-widest uppercase text-white shadow-lg">Replace Image</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-[#1A1A1A]/60 mb-3" />
                    <span className="font-mono text-xs tracking-widest uppercase text-[#1A1A1A]/70 font-bold">Drag & Drop Lesion Media</span>
                    <span className="font-sans text-[10px] text-[#1A1A1A]/50 mt-2">or click to browse local files</span>
                  </>
                )}
              </div>

              <div className="w-full space-y-2 mb-8">
                <label htmlFor="clinical-notes" className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/70 block">Clinical Query / Patient Notes (Optional)</label>
                <textarea id="clinical-notes" rows={3} className="w-full bg-white/60 border border-white rounded-xl focus:border-[#1A1A1A] p-4 text-xs font-sans text-[#1A1A1A] resize-none focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/30 transition-all shadow-sm" placeholder="e.g. Asymmetrical border observed in left anterior..." />
              </div>

              <button onClick={startScan} disabled={!uploadedImage}
                className={`w-full py-4 rounded-full flex items-center justify-center space-x-2 font-mono text-[11px] tracking-[0.2em] font-bold uppercase transition-all focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/50 focus:ring-offset-2 ${uploadedImage ? 'bg-[#1A1A1A] text-white hover:bg-[#1A1A1A]/90 cursor-pointer shadow-sm hover:shadow-md' : 'bg-[#1A1A1A]/10 text-[#1A1A1A]/30 cursor-not-allowed'}`}
              >
                <span>Initiate AI Scan</span>
              </button>
            </motion.div>
          )}

          {/* ── STATE: PROCESSING ─────────────────────────────────────────── */}
          {scannerState === 'processing' && (
            <motion.div key="processing-state" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-8"
            >
              <div className="relative flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }} className="w-24 h-24 rounded-full border-t-2 border-b-2 border-[#1A1A1A] border-l-2 border-l-transparent border-r-2 border-r-transparent" />
                <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} className="absolute w-16 h-16 rounded-full border-t-2 border-b-2 border-[#1A1A1A]/40 border-l-2 border-l-transparent border-r-2 border-r-transparent" />
                <Activity className="absolute w-6 h-6 text-[#1A1A1A]" />
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <h3 className="font-mono text-sm tracking-[0.2em] font-bold uppercase text-[#1A1A1A] animate-pulse">System Analyzing</h3>
                <motion.p key={loadingText} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="font-sans text-xs text-[#1A1A1A]/60 max-w-xs">{loadingText}</motion.p>
              </div>
            </motion.div>
          )}

          {/* ── STATE: ERROR ──────────────────────────────────────────────── */}
          {scannerState === 'error' && (
            <motion.div key="error-state" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-md bg-white/60 backdrop-blur-2xl border border-red-200 rounded-[2rem] p-10 flex flex-col items-center text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-5">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="font-serif text-xl font-bold mb-2 text-[#1A1A1A]">Analysis Failed</h3>
              <p className="font-sans text-sm text-[#888888] mb-8 leading-relaxed">{errorMsg}</p>
              <button onClick={resetScan} className="w-full py-3 rounded-full bg-[#1A1A1A] text-white font-mono text-[10px] uppercase font-bold tracking-[0.15em] hover:bg-[#1A1A1A]/90 transition-colors">
                Try Again
              </button>
            </motion.div>
          )}

          {/* ── STATE: RESULTS ────────────────────────────────────────────── */}
          {scannerState === 'results' && result && (
            <motion.div key="results-state" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto"
              ref={reportRef}
            >
              {/* Left: XAI Heatmap */}
              <div className="bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <ImageComparisonSlider baseImage={uploadedImage!} />

                {/* All-class probability bars */}
                <div className="w-full mt-6 space-y-2">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold text-[#1A1A1A]/60 mb-3">All Class Probabilities</p>
                  {result.all_probabilities
                    .sort((a, b) => b.probability - a.probability)
                    .map((item) => (
                      <div key={item.class} className="flex items-center gap-3">
                        <span className="font-mono text-[9px] text-[#888888] w-36 shrink-0 truncate">{item.class}</span>
                        <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.probability}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${item.class === result.prediction ? 'bg-[#1A1A1A]' : 'bg-[#1A1A1A]/30'}`}
                          />
                        </div>
                        <span className="font-mono text-[9px] text-[#1A1A1A] w-10 text-right shrink-0">{item.probability.toFixed(1)}%</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Right: Diagnostic Data */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
                initial="hidden" animate="visible"
                className="bg-white/60 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mb-8 border-b border-[#1A1A1A]/10 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs tracking-widest text-[#888888] font-bold uppercase">Diagnostic Result</span>
                      <span className={`font-mono text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest ${result.risk_level === 'HIGH RISK' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                        {result.risk_level}
                      </span>
                    </div>
                    <h2 className="font-serif text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1A1A] uppercase leading-tight mb-4">
                      {result.prediction}
                    </h2>
                    <p className="font-sans text-sm text-[#888888] leading-relaxed">
                      {result.risk_level === 'HIGH RISK'
                        ? 'Tri-Stream architecture predicts high probabilistic variance indicative of malignant characteristics. Immediate clinical follow-up recommended.'
                        : 'Tri-Stream architecture indicates low malignancy probability. Routine monitoring is advised.'}
                    </p>
                  </motion.div>

                  <div className="space-y-6">
                    {/* Confidence Bar */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="space-y-2">
                      <div className="flex justify-between items-end font-mono text-xs tracking-widest uppercase">
                        <span className="text-[#888888]">Model Confidence</span>
                        <span className="text-[#1A1A1A] font-bold">{result.confidence.toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1 bg-black/10 rounded-full relative overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} transition={{ duration: 1.2, ease: 'easeOut' }} className="absolute top-0 left-0 h-full bg-[#1A1A1A] rounded-full" />
                      </div>
                    </motion.div>

                    {/* ABCD Metric Cards */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-white/80 p-4 border border-white rounded-xl shadow-sm">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#888888] block mb-1">Asymmetry Score</span>
                        <span className="font-sans font-medium text-sm text-[#1A1A1A]">
                          {scoreLabel(result.asymmetry_score)} ({result.asymmetry_score.toFixed(2)})
                        </span>
                      </div>
                      <div className="bg-white/80 p-4 border border-white rounded-xl shadow-sm">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#888888] block mb-1">Border Irregularity</span>
                        <span className="font-sans font-medium text-sm text-[#1A1A1A]">
                          {scoreLabel(result.border_score)} ({result.border_score.toFixed(2)})
                        </span>
                      </div>
                      <div className="bg-white/80 p-4 border border-white rounded-xl shadow-sm">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#888888] block mb-1">Image Quality</span>
                        <span className="font-sans font-medium text-sm text-[#1A1A1A]">
                          Focus {result.quality.blur_score.toFixed(0)}
                        </span>
                      </div>
                      <div className="bg-white/80 p-4 border border-white rounded-xl shadow-sm">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#888888] block mb-1">Hair Artifact</span>
                        <span className="font-sans font-medium text-sm text-[#1A1A1A]">
                          {result.quality.hair_ratio < 0.2 ? 'Minimal' : result.quality.hair_ratio < 0.5 ? 'Moderate' : 'Heavy'} ({result.quality.hair_ratio.toFixed(2)})
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Action Buttons */}
                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mt-10 flex flex-col sm:flex-row gap-4">
                  <button onClick={generatePDF} disabled={isGeneratingPDF} className={`flex-1 py-3 rounded-full bg-[#1A1A1A] text-white font-mono text-[10px] uppercase font-bold tracking-[0.15em] flex items-center justify-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]/50 focus:ring-offset-2 ${isGeneratingPDF ? 'opacity-70 cursor-wait' : 'hover:bg-[#1A1A1A]/90'}`}>
                    <Download className="w-4 h-4 text-white" />
                    <span>{isGeneratingPDF ? 'Generating...' : 'Download PDF Report'}</span>
                  </button>
                  <button onClick={resetScan} className="flex-1 py-3 rounded-full bg-white border border-black/10 text-[#1A1A1A] font-mono text-[10px] uppercase font-bold tracking-[0.15em] flex items-center justify-center space-x-2 hover:bg-black/5 transition-colors focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2">
                    <RefreshCcw className="w-4 h-4" />
                    <span>Scan Another Lesion</span>
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}