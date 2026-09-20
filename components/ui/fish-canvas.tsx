"use client";
import { useEffect, useRef, useState } from "react";

interface Fish {
  x: number;
  y: number;
  size: number;
  angle: number;
  flip: number;
  opacity: number;
  targetOpacity: number;
  hue: number;
  wiggle: number;
  wiggleSpeed: number;
}

const FISH_COUNT = 120;
const REVEAL_RADIUS = 110;

function makeFish(i: number, W: number, H: number): Fish {
  const cols = Math.ceil(Math.sqrt(FISH_COUNT * (W / H)));
  const rows = Math.ceil(FISH_COUNT / cols);
  const col = i % cols;
  const row = Math.floor(i / cols);
  const jx = (Math.random() - 0.5) * (W / cols) * 0.7;
  const jy = (Math.random() - 0.5) * (H / rows) * 0.7;

  return {
    x: ((col + 0.5) / cols) * W + jx,
    y: ((row + 0.5) / rows) * H + jy,
    size: 18 + Math.random() * 22,
    angle: (Math.random() - 0.5) * 0.4,
    flip: Math.random() > 0.5 ? 1 : -1,
    opacity: 0,
    targetOpacity: 0,
    hue: 190 + Math.random() * 50,
    wiggle: Math.random() * Math.PI * 2,
    wiggleSpeed: 0.6 + Math.random() * 0.8,
  };
}

function drawFish(ctx: CanvasRenderingContext2D, f: Fish, t: number) {
  if (f.opacity < 0.005) return;

  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(f.angle + Math.sin(t * f.wiggleSpeed + f.wiggle) * 0.08);
  ctx.scale(f.flip, 1);

  const s = f.size;
  const alpha = f.opacity;

  ctx.shadowColor = `hsla(${f.hue}, 80%, 70%, ${alpha * 0.6})`;
  ctx.shadowBlur = 12;

  // Body
  ctx.beginPath();
  ctx.ellipse(0, 0, s, s * 0.38, 0, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(${f.hue}, 65%, 62%, ${alpha * 0.85})`;
  ctx.fill();

  // Tail
  ctx.beginPath();
  ctx.moveTo(-s, 0);
  ctx.lineTo(-s - s * 0.55, -s * 0.3);
  ctx.lineTo(-s - s * 0.55, s * 0.3);
  ctx.closePath();
  ctx.fillStyle = `hsla(${f.hue}, 60%, 55%, ${alpha * 0.75})`;
  ctx.fill();

  // Eye
  ctx.beginPath();
  ctx.arc(s * 0.45, -s * 0.08, s * 0.07, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(10,15,30,${alpha})`;
  ctx.fill();

  // Scales / lines
  ctx.beginPath();
  for (let j = 0; j < 3; j++) {
    const lx = s * 0.2 - j * s * 0.22;
    ctx.moveTo(lx, -s * 0.3);
    ctx.quadraticCurveTo(lx - s * 0.05, 0, lx, s * 0.3);
  }
  ctx.strokeStyle = `hsla(${f.hue}, 50%, 80%, ${alpha * 0.25})`;
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.restore();
}

export default function FishCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const fishRef = useRef<Fish[]>([]);
  const rafRef = useRef<number>(0);
  const [, setCursorPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let W = 0;
    let H = 0;
    let lastTime = 0;

    function resize() {
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.scale(dpr, dpr);
      fishRef.current = Array.from({ length: FISH_COUNT }, (_, i) => makeFish(i, W, H));
    }

    function loop(ts: number) {
      const t = ts / 1000;
      const dt = Math.min(t - lastTime, 0.05);
      lastTime = t;

      ctx!.clearRect(0, 0, W, H);

      for (const f of fishRef.current) {
        const dx = f.x - mouseRef.current.x;
        const dy = f.y - mouseRef.current.y;
        const d = Math.hypot(dx, dy);
        f.targetOpacity = d < REVEAL_RADIUS ? Math.pow(1 - d / REVEAL_RADIUS, 0.6) : 0;
        f.opacity += (f.targetOpacity - f.opacity) * Math.min(dt * 6, 1);
        drawFish(ctx!, f, t);
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    resize();
    rafRef.current = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setCursorPos({ x: e.clientX, y: e.clientY });
    }

    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        setCursorPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchstart", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 size-full" />;
}
