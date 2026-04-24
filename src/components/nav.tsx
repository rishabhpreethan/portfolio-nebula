"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navSections, profile } from "@/data/profile";

// Sticky nav per EVENT_MODEL:
//   SCROLL_START → adds backdrop blur
//   NAV_MOBILE_OPEN / _CLOSE → toggles mobile drawer, locks body scroll
//   SECTION_ENTER → highlights active section link
//   NAV_LINK_CLICK → smooth-scrolls to anchor
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // SCROLL_START — add blur after 40px.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // SECTION_ENTER — IntersectionObserver tracks which section is in view.
  useEffect(() => {
    const sections = navSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // NAV_MOBILE_OPEN/CLOSE — body scroll lock + Escape to close.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
          scrolled
            ? "border-b border-orbit bg-void/70 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        ].join(" ")}
        style={{ height: "var(--nav-h)" }}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-full max-w-6xl items-center justify-between px-6"
        >
          <a
            href="#top"
            className="font-display text-ink text-lg tracking-tight md:text-xl"
          >
            {profile.name.split(" ")[0].toLowerCase()}
          </a>

          <ul className="hidden items-center gap-7 md:flex">
            {navSections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={activeId === s.id ? "true" : undefined}
                  className={[
                    "text-sm transition-colors duration-200",
                    activeId === s.id
                      ? "text-ink"
                      : "text-ink-muted hover:text-ink",
                  ].join(" ")}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="text-ink rounded p-2 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Mobile menu — full-screen overlay, covers content */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuOpen}
        className={[
          "fixed inset-0 z-40 flex flex-col md:hidden",
          "bg-void/95 backdrop-blur-lg transition-opacity duration-300",
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        <div
          className="flex items-center justify-end px-6"
          style={{ height: "var(--nav-h)" }}
        />
        <ul className="flex flex-1 flex-col items-start justify-center gap-6 px-8">
          {navSections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={() => setMenuOpen(false)}
                className="font-display text-ink text-4xl"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
