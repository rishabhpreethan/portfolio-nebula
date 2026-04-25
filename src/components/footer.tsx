import { Mail } from "lucide-react";
import { GithubMark, LinkedInMark } from "@/components/brand-icons";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-orbit mt-32">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center">
        <p className="text-ink-muted text-sm">
          made by {profile.name.toLowerCase()} · {new Date().getFullYear()}
        </p>
        <ul className="flex items-center gap-5">
          <li>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-ink-muted hover:text-ink transition-colors duration-200"
            >
              <GithubMark width={18} height={18} />
            </a>
          </li>
          <li>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-ink-muted hover:text-ink transition-colors duration-200"
            >
              <LinkedInMark width={18} height={18} />
            </a>
          </li>
          <li>
            <a
              href={profile.links.email}
              aria-label="Email"
              className="text-ink-muted hover:text-ink transition-colors duration-200"
            >
              <Mail size={18} />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
