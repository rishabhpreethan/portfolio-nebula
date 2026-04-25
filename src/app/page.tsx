import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Section } from "@/components/section";
import { Starfield } from "@/components/starfield";
import { Hero } from "@/components/sections/hero";
import { navSections } from "@/data/profile";

// Landing page composition. Sections after Hero remain placeholders until
// Epic 3 fills them in (about, experience, projects, skills, education,
// contact). Hero ships its <h1> in SSR HTML for §3.6 LCP.
export default function Home() {
  return (
    <>
      <Starfield />
      <Nav />
      <main id="top" className="pt-[var(--nav-h)]">
        <Hero />

        {navSections.map((s) => (
          <Section key={s.id} id={s.id} eyebrow={s.label} heading={s.label}>
            <p className="text-ink-muted max-w-xl">
              {s.label} content lands in a future feature branch.
            </p>
          </Section>
        ))}
      </main>
      <Footer />
    </>
  );
}
