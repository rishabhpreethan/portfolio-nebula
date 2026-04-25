"use client";

import { useSyncExternalStore } from "react";

// Single client-side state spine for live motion values per ARCHITECTURE.md.
// One pointermove listener, one scroll listener — every cinematic component
// reads from these slices instead of attaching its own. High-frequency
// consumers (cursor follow, ring lerp, parallax, gravity-well) read via
// `slice.get()` inside their own rAF loop and write to the DOM directly,
// avoiding 60 Hz React re-renders. Low-frequency consumers (variant flags,
// reduced-motion gates) subscribe via `useSlice`.

type Listener = () => void;

class Slice<T> {
  private value: T;
  private listeners = new Set<Listener>();

  constructor(initial: T) {
    this.value = initial;
  }

  get(): T {
    return this.value;
  }

  set(next: T): void {
    if (Object.is(this.value, next)) return;
    this.value = next;
    this.listeners.forEach((l) => l());
  }

  // Mutate in place when the consumer doesn't need React re-render notification —
  // useful for cursor.x/y at 60 Hz where listeners read in rAF.
  patch(partial: Partial<T>, notify = false): void {
    this.value = { ...this.value, ...partial };
    if (notify) this.listeners.forEach((l) => l());
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
}

export type CursorVariant = "default" | "link" | "card" | "text" | "pressed";

export type CursorState = {
  x: number;
  y: number;
  variant: CursorVariant;
  pressed: boolean;
  visible: boolean;
};

export type ScrollState = {
  progress: number; // 0..1
  velocity: number; // 0..1 normalized against 5000 px/s cap
  direction: "up" | "down" | "idle";
};

export type ParallaxState = {
  // Mouse parallax offsets normalized to ±1 from viewport center.
  // Components multiply by their own `depth` (0..1) and target ±8 px range (§9.5).
  nx: number;
  ny: number;
};

export const cursorSlice = new Slice<CursorState>({
  x: 0,
  y: 0,
  variant: "default",
  pressed: false,
  visible: false,
});

export const scrollSlice = new Slice<ScrollState>({
  progress: 0,
  velocity: 0,
  direction: "idle",
});

export const parallaxSlice = new Slice<ParallaxState>({ nx: 0, ny: 0 });

// Capability flags — read once at mount, exposed for low-frequency reads
// (e.g., cursor visibility decision, Lenis enable/disable). Updated by
// scroll-shell.tsx on `change` events from the underlying media queries.
export type CapabilitiesState = {
  reducedMotion: boolean;
  coarsePointer: boolean;
};

export const capabilitiesSlice = new Slice<CapabilitiesState>({
  reducedMotion: false,
  coarsePointer: false,
});

// React adapter for low-frequency reads. High-frequency consumers should
// `slice.get()` directly inside their own rAF loop.
export function useSlice<T>(slice: Slice<T>): T {
  return useSyncExternalStore(
    slice.subscribe,
    () => slice.get(),
    () => slice.get(),
  );
}
