import { ArrowDown } from "lucide-react";
import { profile } from "@/data/profile";

// Hero — first paint, LCP candidate (§3.6). Server Component on purpose:
// the <h1> ships in initial HTML so LCP isn't gated on client hydration or
// any entrance animation. The starfield behind provides the only motion in
// this region, which keeps §5.1 ("≤ 2 accents per screen") trivially true.
//
// Typography per §1.2:
//   eyebrow → Caption (0.8125rem / 500 / 0.02em uppercase)
//   h1      → Display XL (clamp(3rem, 8vw, 6rem) / 1.05 / -0.02em)
//   lead    → Lead       (1.125→1.25rem / 1.55 / -0.005em)
//
// The open-to-work chip uses --accent-starlight per §6.6 (starlight gold is
// the "star" accent; plasma purple stays reserved for hover sparks elsewhere).
export function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[calc(100dvh-var(--nav-h))] max-w-6xl flex-col justify-center px-6">
      <p className="text-ink-muted text-[0.8125rem] font-medium uppercase leading-[1.4] tracking-[0.02em]">
        {profile.pronouns} · {profile.location.toLowerCase()}
      </p>

      <h1 className="font-display text-ink mt-6 text-[clamp(3rem,8vw,6rem)] font-normal leading-[1.05] tracking-[-0.02em]">
        {profile.name.toLowerCase()}
      </h1>

      <p className="text-ink-muted mt-6 max-w-2xl text-[1.125rem] leading-[1.55] tracking-[-0.005em] md:text-[1.25rem]">
        {profile.headline.toLowerCase()}
      </p>

      <div className="mt-8">
        <span className="border-orbit text-ink inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.8125rem]">
          <span
            aria-hidden="true"
            className="bg-starlight inline-block h-1.5 w-1.5 rounded-full"
          />
          {profile.locationOpen}
        </span>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about section"
        className="text-ink-muted hover:text-ink absolute bottom-8 left-1/2 -translate-x-1/2 rounded p-2 transition-colors duration-200"
      >
        <ArrowDown size={18} />
      </a>
    </section>
  );
}
