// Shared Framer Motion variants per ALIGNMENT_SPEC §1.4 + §7.3.
// Components import from here — no inline initial/animate objects allowed.

import type { Transition, Variants } from "framer-motion";

export const easeOutSoft: Transition["ease"] = [0.22, 1, 0.36, 1];
export const easeHover: Transition["ease"] = [0.2, 0, 0, 1];

// Used for section entrance on scroll-into-view.
// See EVENT_MODEL SECTION_ENTER.
export const fadeRiseVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutSoft },
  },
};

// Stagger children inside a section (e.g., project cards).
export const staggerParent = (stagger = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: 0.1 },
  },
});

// Hover lift for project cards. Subtle per §1.4 + §5.1.
export const hoverLift = {
  scale: 1.015,
  transition: { duration: 0.2, ease: easeHover },
} as const;

// Default viewport options for scroll-in animations — once only.
export const viewportOnce = { once: true, amount: 0.25 } as const;
