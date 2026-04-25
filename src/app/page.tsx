import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Section } from "@/components/section";
import { Starfield } from "@/components/starfield";
import { profile, navSections } from "@/data/profile";

// Epic 1.2 placeholder page — shows the layout shell: fixed Nav, scaffolded
// sections (one per nav link), Footer. Each Section gets real content in
// Epic 2 (hero + starfield) and Epic 3 (about through contact).
export default function Home() {
  return (
    <>
      <Starfield />
      <Nav />
      <main id="top" className="pt-[var(--nav-h)]">
        {/* Hero placeholder — Epic 2.2 will replace with the real hero. */}
        <section className="mx-auto flex min-h-[calc(100dvh-var(--nav-h))] max-w-6xl flex-col justify-center px-6">
          <p className="text-ink-muted mb-6 text-xs uppercase tracking-[0.18em]">
            portfolio · coming online
          </p>
          <h1 className="font-display text-ink text-6xl md:text-8xl">
            {profile.name.toLowerCase()}
          </h1>
          <p className="text-ink-muted mt-4 max-w-xl text-lg md:text-xl">
            {profile.headline.toLowerCase()}
          </p>
        </section>

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
