"use client";

import { useEffect, useRef } from "react";
import {
  cursorSlice,
  capabilitiesSlice,
  parallaxSlice,
  type CursorVariant,
} from "@/lib/motion-store";

// §9.1 — Custom cursor: 6 px filled dot (instant follow) + 32 px outline ring
// (lerps toward dot at 0.18/frame ≈ 80 ms ease-in feel). Variants are driven
// by the closest `data-cursor` ancestor under the pointer; defaults to
// "default". The component owns the single `pointermove` listener for the
// whole app per ARCHITECTURE motion-store contract.
//
// Hidden under §4.6 (`pointer: coarse`) and §1.4 (reduced motion). Strict
// `pointer-events: none` (§2.10) so it never blocks hit-testing or focus.

const RING_LERP = 0.18;

const VARIANT_STYLES: Record<
  CursorVariant,
  { ring: number; ringOpacity: number; dot: number; ringRadius: number; ringColorVar: string; mixBlend: string }
> = {
  default: { ring: 32, ringOpacity: 0.6, dot: 6, ringRadius: 9999, ringColorVar: "--accent-starlight", mixBlend: "normal" },
  link:    { ring: 64, ringOpacity: 0.9, dot: 6, ringRadius: 9999, ringColorVar: "--accent-plasma",    mixBlend: "difference" },
  card:    { ring: 80, ringOpacity: 0.8, dot: 6, ringRadius: 12,   ringColorVar: "--accent-plasma",    mixBlend: "normal" },
  text:    { ring: 4,  ringOpacity: 0.9, dot: 0, ringRadius: 2,    ringColorVar: "--accent-starlight", mixBlend: "normal" },
  pressed: { ring: 24, ringOpacity: 0.9, dot: 6, ringRadius: 9999, ringColorVar: "--accent-plasma",    mixBlend: "normal" },
};

export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const lastVariant = useRef<CursorVariant>("default");

  useEffect(() => {
    // Capability gates — match exactly the same media queries used elsewhere
    // (§9.1 + §1.4). Subscribe so cursor toggles live if the user changes
    // the OS setting mid-session.
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseMq = window.matchMedia("(pointer: coarse)");

    const recomputeCapabilities = () => {
      capabilitiesSlice.set({
        reducedMotion: reducedMq.matches,
        coarsePointer: coarseMq.matches,
      });
    };
    recomputeCapabilities();
    reducedMq.addEventListener("change", recomputeCapabilities);
    coarseMq.addEventListener("change", recomputeCapabilities);

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const setVariant = (variant: CursorVariant) => {
      if (lastVariant.current === variant) return;
      lastVariant.current = variant;
      const v = VARIANT_STYLES[variant];
      ring.style.width = `${v.ring}px`;
      ring.style.height = `${v.ring}px`;
      ring.style.opacity = String(v.ringOpacity);
      ring.style.borderRadius = `${v.ringRadius}px`;
      ring.style.borderColor = `var(${v.ringColorVar})`;
      ring.style.mixBlendMode = v.mixBlend;
      dot.style.opacity = v.dot > 0 ? "1" : "0";
      cursorSlice.patch({ variant }, true);
    };

    const onMove = (e: PointerEvent) => {
      // Hidden state: don't process moves while disabled.
      const caps = capabilitiesSlice.get();
      if (caps.reducedMotion || caps.coarsePointer) return;

      cursorSlice.patch({
        x: e.clientX,
        y: e.clientY,
        visible: true,
      });

      // Update parallax (normalized -1..1 from viewport center).
      const nx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const ny = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      parallaxSlice.patch({ nx, ny });

      // Variant detection — closest decorated ancestor. Explicit
      // `data-cursor` wins; otherwise <a>/<button>/role=button default to
      // "link" so existing components auto-trigger the link variant
      // without any decoration.
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const variantEl = target?.closest<HTMLElement>(
        "[data-cursor], a, button, [role='button']",
      );
      let v: CursorVariant = "default";
      if (variantEl) {
        v = (variantEl.dataset.cursor as CursorVariant | undefined) ?? "link";
      }
      setVariant(cursorSlice.get().pressed ? "pressed" : v);

      // Dot follows immediately.
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    };

    const onDown = () => {
      cursorSlice.patch({ pressed: true }, true);
      setVariant("pressed");
    };
    const onUp = () => {
      cursorSlice.patch({ pressed: false }, true);
      // Recompute variant from current hovered element.
      const c = cursorSlice.get();
      const target = document.elementFromPoint(c.x, c.y);
      const variantEl = target?.closest<HTMLElement>(
        "[data-cursor], a, button, [role='button']",
      );
      let v: CursorVariant = "default";
      if (variantEl) {
        v = (variantEl.dataset.cursor as CursorVariant | undefined) ?? "link";
      }
      setVariant(v);
    };

    const onLeave = () => {
      cursorSlice.patch({ visible: false }, true);
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      cursorSlice.patch({ visible: true }, true);
      dot.style.opacity = "1";
      ring.style.opacity = String(VARIANT_STYLES[lastVariant.current].ringOpacity);
    };

    // Ring lerp loop — reads cursorSlice each frame, eases ring toward dot.
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      const { x, y } = cursorSlice.get();
      ringPos.current.x += (x - ringPos.current.x) * RING_LERP;
      ringPos.current.y += (y - ringPos.current.y) * RING_LERP;
      ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
    };
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      reducedMq.removeEventListener("change", recomputeCapabilities);
      coarseMq.removeEventListener("change", recomputeCapabilities);
    };
  }, []);

  return (
    <>
      {/* Dot — instant follow, 6 px disc */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[100] hidden h-1.5 w-1.5 rounded-full opacity-0 will-change-transform [@media(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:block"
        style={{ background: "var(--accent-starlight)" }}
      />
      {/* Ring — lerp follow, variant-driven size/color */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[100] hidden border opacity-0 will-change-transform transition-[width,height,opacity,border-radius,border-color,background-color,mix-blend-mode] duration-200 ease-out [@media(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:block"
        style={{ borderColor: "var(--accent-starlight)", borderWidth: 1 }}
      />
    </>
  );
}
