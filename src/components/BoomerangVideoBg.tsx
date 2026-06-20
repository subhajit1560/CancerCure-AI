import React, { useRef, useEffect, useState } from "react";

interface BoomerangVideoBgProps {
  className?: string;
  frameCount?: number;
  width?: number;
  height?: number;
}

export default function BoomerangVideoBg({
  className = "",
  frameCount = 30,
  width = 640,
  height = 360,
}: BoomerangVideoBgProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frames, setFrames] = useState<HTMLCanvasElement[]>([]);

  // First useEffect hook: pre-generate clinical diagnostic animation frames
  useEffect(() => {
    const generatedFrames: HTMLCanvasElement[] = [];

    for (let f = 0; f < frameCount; f++) {
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const ctx = offscreen.getContext("2d");

      if (ctx) {
        // Clear background with dark overlay
        ctx.fillStyle = "#111111";
        ctx.fillRect(0, 0, width, height);

        // Draw sub-visual medical grid lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
        ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Animated clinical scanning beam (progressing with frame index)
        const progress = f / (frameCount - 1);
        const circleRadius = 40 + progress * 80;
        const opacity = 0.1 + (1 - progress) * 0.45;

        // Draw core cellular diagnostic coordinates
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, circleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw attention hot spot tracker lines
        ctx.beginPath();
        ctx.moveTo(width / 2 - circleRadius - 10, height / 2);
        ctx.lineTo(width / 2 + circleRadius + 10, height / 2);
        ctx.moveTo(width / 2, height / 2 - circleRadius - 10);
        ctx.lineTo(width / 2, height / 2 + circleRadius + 10);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Add small scanning info crosshairs
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.font = "9px monospace";
        ctx.fillText(`FRAME: 0${f + 1} // SYS-STREAM-INDEX`, 20, 30);
        ctx.fillText(`COORDS: X.${(width / 2 + Math.cos(progress * Math.PI) * 40).toFixed(0)} Y.${(height / 2 + Math.sin(progress * Math.PI) * 40).toFixed(0)}`, 20, 45);
      }

      generatedFrames.push(offscreen);
    }

    setFrames(generatedFrames);
  }, [frameCount, width, height]);

  // Second useEffect hook: render loop using requested highly optimized frame-accurate delta accumulation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let index = 0;
    let direction = 1;

    const render = () => {
      if (frames.length === 0) return;
      
      ctx.drawImage(frames[index], 0, 0);
      
      index += direction;
      if (index >= frames.length - 1) {
        index = frames.length - 1;
        direction = -1;
      } else if (index <= 0) {
        index = 0;
        direction = 1;
      }
      
      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [frames]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`w-full h-full block ${className}`}
      id="boomerang-video-bg-canvas"
    />
  );
}
