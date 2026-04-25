"use client";

import { useEffect, useRef } from "react";

// Starfield — canvas-based, low-cost, purposely subtle.
// Governed by ALIGNMENT_SPEC §3.3 (30 FPS cap, pause on hidden, count scales
// by viewport) and §6.1-§6.5 (no cartoons, desaturated, ≤ 12 px/s drift).
//
// EVENT_MODEL references:
//   APP_MOUNTED          → init canvas, seed stars
//   PREFERS_REDUCED_MOTION → static render only, no rAF loop
//   VIEWPORT_RESIZE      → resize + reseed density
//   STARFIELD_TAB_HIDDEN → cancelAnimationFrame
//   STARFIELD_TAB_VISIBLE → requestAnimationFrame resumes

type Star = {
  x: number;
  y: number;
  r: number; // radius, px
  a: number; // base alpha
  vx: number; // drift px/s
  vy: number;
  tw: number; // twinkle phase 0..1
  tws: number; // twinkle speed (rad/s)
};

// Star colors read from CSS custom properties at mount so tokens remain the
// single source (§1.1). No hex literals here — tokens.css is loaded before
// the canvas mounts, so getPropertyValue always resolves.
const FPS_CAP = 30;
const MIN_FRAME_MS = 1000 / FPS_CAP;

function readTokenColors() {
  const styles = getComputedStyle(document.documentElement);
  const ink = styles.getPropertyValue("--ink").trim();
  const starlight = styles.getPropertyValue("--accent-starlight").trim();
  return { ink, starlight };
}

function densityFor(width: number): number {
  // §3.3: ≤ 200 on ≤ 1280, ≤ 350 otherwise.
  if (width <= 640) return 90;
  if (width <= 1024) return 140;
  if (width <= 1280) return 190;
  return 330;
}

function seedStars(count: number, w: number, h: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const r = Math.random() < 0.92 ? Math.random() * 1.1 + 0.2 : Math.random() * 1.8 + 1.2;
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r,
      a: 0.35 + Math.random() * 0.5,
      // Drift: tiny, mostly horizontal, max ~10px/s per §6.4.
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 2,
      tw: Math.random() * Math.PI * 2,
      tws: 0.5 + Math.random() * 1.5,
    });
  }
  return stars;
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const lastTsRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const { ink: STAR_COLOR, starlight: BIG_STAR_COLOR } = readTokenColors();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      starsRef.current = seedStars(densityFor(w), w, h);
      // Draw once immediately so the field is visible even before rAF.
      drawStatic();
    };

    const drawStatic = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (const s of starsRef.current) {
        ctx.globalAlpha = s.a;
        ctx.fillStyle = s.r > 1.2 ? BIG_STAR_COLOR : STAR_COLOR;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = mq.matches;

    const tick = (ts: number) => {
      rafRef.current = requestAnimationFrame(tick);
      const w = window.innerWidth;
      const h = window.innerHeight;
      // FPS cap.
      if (ts - lastTsRef.current < MIN_FRAME_MS) return;
      const dt = Math.min((ts - (lastTsRef.current || ts)) / 1000, 0.1);
      lastTsRef.current = ts;

      ctx.clearRect(0, 0, w, h);
      for (const s of starsRef.current) {
        // Drift (wrap around edges).
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        if (s.x < -2) s.x = w + 2;
        if (s.x > w + 2) s.x = -2;
        if (s.y < -2) s.y = h + 2;
        if (s.y > h + 2) s.y = -2;
        // Twinkle.
        s.tw += s.tws * dt;
        const alpha = s.a * (0.75 + 0.25 * Math.sin(s.tw));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.r > 1.2 ? BIG_STAR_COLOR : STAR_COLOR;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const start = () => {
      if (rafRef.current !== null) return;
      lastTsRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (!reduced) start();
    };

    const onMqChange = (e: MediaQueryListEvent) => {
      reduced = e.matches;
      if (reduced) {
        stop();
        drawStatic();
      } else {
        start();
      }
    };

    // Debounced resize.
    let resizeT: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeT) clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        resize();
        if (!reduced && !document.hidden) {
          stop();
          start();
        }
      }, 150);
    };

    resize();
    if (!reduced && !document.hidden) start();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    mq.addEventListener("change", onMqChange);

    return () => {
      stop();
      if (resizeT) clearTimeout(resizeT);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      mq.removeEventListener("change", onMqChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-dvh w-screen"
    />
  );
}
