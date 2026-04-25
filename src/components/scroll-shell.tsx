"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { capabilitiesSlice, scrollSlice } from "@/lib/motion-store";

// §9.3 — Lenis smooth scroll. Mounts at the root layout level. Disabled on
// `pointer: coarse` (touch users get native momentum scroll) and under
// `prefers-reduced-motion: reduce`. Even when Lenis is disabled, this
// component still owns the single global scroll listener and writes
// progress + velocity into scrollSlice for downstream consumers
// (scroll progress bar, reactive starfield, section reveals).
//
// Velocity is normalized 0..1 against a 5000 px/s cap (§EVENT_MODEL.md).

const VELOCITY_CAP_PX_PER_SEC = 5000;
const VELOCITY_DECAY_PER_FRAME = 0.92; // ~80 ms half-life at 60 FPS

export function ScrollShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseMq = window.matchMedia("(pointer: coarse)");

    let lenis: Lenis | null = null;
    let rafId: number | null = null;
    let lastScrollY = window.scrollY;
    let lastTs = performance.now();
    let velocity = 0;
    let scrollIdleTimer: ReturnType<typeof setTimeout> | null = null;

    const writeProgress = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      const direction =
        velocity > 0.01 ? "down" : velocity < -0.01 ? "up" : "idle";
      scrollSlice.set({
        progress,
        velocity: Math.min(1, Math.abs(velocity)),
        direction,
      });
    };

    const onAnyScroll = () => {
      const now = performance.now();
      const dt = Math.max(1, now - lastTs);
      const dy = window.scrollY - lastScrollY;
      const v = dy / (dt / 1000); // px/s, signed
      velocity = Math.max(-1, Math.min(1, v / VELOCITY_CAP_PX_PER_SEC));
      lastScrollY = window.scrollY;
      lastTs = now;
      writeProgress();

      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(() => {
        velocity = 0;
        writeProgress();
      }, 200);
    };

    const tick = (t: number) => {
      rafId = requestAnimationFrame(tick);
      if (lenis) lenis.raf(t);
      // Decay velocity each frame so reactive consumers get a smooth tail.
      velocity *= VELOCITY_DECAY_PER_FRAME;
      if (Math.abs(velocity) < 0.001) velocity = 0;
      writeProgress();
    };

    const init = () => {
      const reduced = reducedMq.matches;
      const coarse = coarseMq.matches;
      capabilitiesSlice.set({ reducedMotion: reduced, coarsePointer: coarse });

      // Bypass Lenis when the user has opted out of motion or when on touch.
      // Native scroll still fires here; we just don't smooth it.
      if (!reduced && !coarse) {
        lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
          smoothWheel: true,
        });
        lenis.on("scroll", onAnyScroll);
      } else {
        window.addEventListener("scroll", onAnyScroll, { passive: true });
      }

      rafId = requestAnimationFrame(tick);
    };

    const teardown = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      if (lenis) {
        lenis.destroy();
        lenis = null;
      } else {
        window.removeEventListener("scroll", onAnyScroll);
      }
    };

    const onCapabilityChange = () => {
      teardown();
      init();
    };

    init();

    reducedMq.addEventListener("change", onCapabilityChange);
    coarseMq.addEventListener("change", onCapabilityChange);
    return () => {
      teardown();
      reducedMq.removeEventListener("change", onCapabilityChange);
      coarseMq.removeEventListener("change", onCapabilityChange);
    };
  }, []);

  return <>{children}</>;
}
