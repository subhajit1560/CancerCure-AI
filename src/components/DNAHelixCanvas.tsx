import React, { useRef, useEffect } from "react";

interface DNAHelixCanvasProps {
  className?: string;
  speed?: number;
  interactive?: boolean;
}

export default function DNAHelixCanvas({
  className = "",
  speed = 1.0,
  interactive = true,
}: DNAHelixCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let baseTime = 0;

    // Handle Resize
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = (rect?.width || 500) * window.devicePixelRatio;
      canvas.height = (rect?.height || 600) * window.devicePixelRatio;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse coordinates relative to canvas center
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseRef.current = { x: x * 0.05, y: y * 0.05 };
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Helper functions for 3D projections
    const project = (x: number, y: number, z: number, thetaX: number, thetaY: number) => {
      // Rotation Y
      let x1 = x * Math.cos(thetaY) - z * Math.sin(thetaY);
      let z1 = x * Math.sin(thetaY) + z * Math.cos(thetaY);

      // Rotation X
      let y2 = y * Math.cos(thetaX) - z1 * Math.sin(thetaX);
      let z2 = y * Math.sin(thetaX) + z1 * Math.cos(thetaX);

      // Simple perspective
      const distance = 400;
      const scale = distance / (distance + z2);
      return {
        x: x1 * scale,
        y: y2 * scale,
        z: z2,
        scale,
      };
    };

    // Render loop
    const render = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;
      
      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      baseTime += 0.012 * speed;

      // Mouse control dampening
      const rotationYOffset = mouseRef.current.x * 0.05;
      const rotationXOffset = mouseRef.current.y * 0.05;

      const rotX = 0.15 + rotationXOffset;
      const rotY = 0.4 + rotationYOffset;

      const numNodes = 36;
      const helixRadius = 55;
      const verticalSpacing = h / (numNodes - 4);
      
      const nodes1: { x: number; y: number; z: number; proj: any }[] = [];
      const nodes2: { x: number; y: number; z: number; proj: any }[] = [];

      for (let i = 0; i < numNodes; i++) {
        const y = -h / 2 + i * verticalSpacing;
        const angle = baseTime + i * 0.22;

        // Helix strand 1
        const x1 = helixRadius * Math.cos(angle);
        const z1 = helixRadius * Math.sin(angle);

        // Helix strand 2 (opposite phase)
        const x2 = helixRadius * Math.cos(angle + Math.PI);
        const z2 = helixRadius * Math.sin(angle + Math.PI);

        // Project
        const proj1 = project(x1, y, z1, rotX, rotY);
        const proj2 = project(x2, y, z2, rotX, rotY);

        nodes1.push({ x: x1, y, z: z1, proj: proj1 });
        nodes2.push({ x: x2, y, z: z2, proj: proj2 });
      }

      const centerX = w * 0.5;
      const centerY = h * 0.5;

      // 1. Draw connections (rungs)
      for (let i = 0; i < numNodes; i++) {
        if (i % 2 === 0) {
          const p1 = nodes1[i].proj;
          const p2 = nodes2[i].proj;

          const screenX1 = centerX + p1.x;
          const screenY1 = centerY + p1.y;
          const screenX2 = centerX + p2.x;
          const screenY2 = centerY + p2.y;

          // Compute color based on average Z depth
          const avgZ = (p1.z + p2.z) / 2;
          const opacity = Math.max(0.08, 0.5 * (1 - avgZ / (helixRadius * 2)));

          // Gradient for the ladders
          const gradient = ctx.createLinearGradient(screenX1, screenY1, screenX2, screenY2);
          gradient.addColorStop(0, `rgba(113, 113, 122, ${opacity * 0.95})`); // zinc-500
          gradient.addColorStop(0.5, `rgba(161, 161, 170, ${opacity * 0.5})`); // zinc-400
          gradient.addColorStop(1, `rgba(244, 244, 245, ${opacity * 0.95})`); // zinc-100

          ctx.beginPath();
          ctx.moveTo(screenX1, screenY1);
          ctx.lineTo(screenX2, screenY2);
          ctx.lineWidth = 1.8 * ((p1.scale + p2.scale) / 2);
          ctx.strokeStyle = gradient;
          ctx.stroke();
        }
      }

      // 2. Draw nodes for Strand 1 & 2
      const drawStrandNodes = (nodes: typeof nodes1, glowColor: string, baseColor: string) => {
        nodes.forEach((node, i) => {
          const p = node.proj;
          const screenX = centerX + p.x;
          const screenY = centerY + p.y;

          // Depth styling
          const size = Math.max(2.5, (4.5 + Math.sin(baseTime + i * 0.3) * 1.5) * p.scale);
          const opacity = Math.max(0.15, 0.95 * (1 - p.z / (helixRadius * 2.2)));

          // Glow backdrop
          ctx.beginPath();
          ctx.arc(screenX, screenY, size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `${glowColor}${Math.floor(opacity * 40).toString(16).padStart(2, "0")}`;
          ctx.fill();

          // Core node
          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fillStyle = `${baseColor}${Math.floor(opacity * 255).toString(16).padStart(2, "0")}`;
          ctx.fill();

          // Subtle reflective white dot
          ctx.beginPath();
          ctx.arc(screenX - size * 0.3, screenY - size * 0.3, size * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
          ctx.fill();
        });
      };

      // Sort and render (draw back nodes first, front nodes last)
      // For simplicity, we just paint strand 1 then strand 2 as gradient blends depth natively
      drawStrandNodes(nodes1, "#71717a", "#e4e4e7"); // Gray/white strand
      drawStrandNodes(nodes2, "#52525b", "#fafafa"); // Slate/silver strand

      // 3. Floating DNA ambient sparkles
      const ambientCount = 18;
      for (let j = 0; j < ambientCount; j++) {
        const t = baseTime * 0.5 + j * 10.3;
        const offset = Math.sin(t) * 15;
        const xSp = centerOffset(j) + offset;
        const ySp = -h / 2 + (j * (h / ambientCount)) + Math.cos(t) * 12;
        const zSp = Math.sin(t * 1.5) * 40;

        const pSp = project(xSp, ySp, zSp, rotX, rotY);
        if (pSp.scale > 0.1) {
          const sX = centerX + pSp.x;
          const sY = centerY + pSp.y;
          const size = 1.2 * pSp.scale;
          const op = Math.max(0.08, 0.45 * (1 - pSp.z / 100));

          ctx.beginPath();
          ctx.arc(sX, sY, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(161, 161, 170, ${op})`;
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    const centerOffset = (index: number) => {
      // Alternate ambient coordinates
      return index % 2 === 0 ? -90 : 90;
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [speed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full pointer-events-none ${className}`}
      id="dna-helix-canvas"
    />
  );
}
