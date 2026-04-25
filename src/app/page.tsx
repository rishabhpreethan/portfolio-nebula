import { profile } from "@/data/profile";

// Epic 1.1 placeholder page — exercises the design system (tokens, fonts,
// reduced-motion, backdrop). Will be replaced in Epic 2 by the real hero +
// subsequent sections.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-6 py-24">
      <p className="text-ink-muted mb-6 text-xs uppercase tracking-[0.18em]">
        portfolio · coming online
      </p>
      <h1 className="font-display text-ink text-6xl md:text-8xl">
        {profile.name.toLowerCase()}
      </h1>
      <p className="text-ink-muted mt-4 max-w-xl text-lg md:text-xl">
        {profile.headline.toLowerCase()}
      </p>
      <p className="text-ink-dim mt-12 max-w-md text-sm">
        this page currently renders only the foundation layer (tokens, fonts,
        base styles). sections land in the next feature branches.
      </p>
    </main>
  );
}
