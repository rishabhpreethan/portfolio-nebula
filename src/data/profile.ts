// Single source of truth for all copy. No hard-coded strings in components.
// Edit this file to update the portfolio — do not edit components.

export type Role = {
  title: string;
  company: string;
  companyUrl?: string;
  type: "full-time" | "internship" | "contract";
  location: string;
  mode: "on-site" | "remote" | "hybrid";
  start: string; // "Mon YYYY"
  end: string | "Present";
  description?: string;
  stack?: string[];
};

export type Education = {
  school: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  logo?: string;
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  description: string;
  stack: string[];
  links: { label: string; href: string }[];
};

export type Skill = {
  name: string;
  group: "languages" | "frameworks" | "data" | "infra" | "ml";
};

export type Profile = {
  name: string;
  pronouns: string;
  headline: string;
  location: string;
  locationOpen: string;
  about: string;
  links: {
    github: string;
    linkedin: string;
    email: string;
    resume?: string;
  };
  experience: Role[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
};

export const profile: Profile = {
  name: "Rishabh Preethan",
  pronouns: "he/him",
  headline: "Founding Engineer @ Zupple Labs",
  location: "Bengaluru, India",
  locationOpen: "open to Abu Dhabi + 7 more · on-site / remote / hybrid",
  about:
    "i build fast, useful software across the stack — from search engines and AI-augmented dev tools to financial dashboards. currently founding engineering at Zupple Labs, previously shipping production systems at Third Ray.",
  links: {
    github: "https://github.com/rishabhpreethan",
    linkedin: "https://www.linkedin.com/in/rishabhpreethan/",
    email: "mailto:rishabhp@zupple.technology",
  },
  experience: [
    {
      title: "Founding Engineer",
      company: "Zupple Labs",
      type: "full-time",
      location: "Bengaluru, Karnataka, India",
      mode: "hybrid",
      start: "Feb 2026",
      end: "Present",
      description:
        "building from zero — product, infra, and the habits that will compound.",
    },
    {
      title: "Software Engineer",
      company: "Third Ray, Inc.",
      type: "full-time",
      location: "Bangalore Urban, Karnataka, India",
      mode: "on-site",
      start: "Jul 2024",
      end: "Jan 2026",
      description:
        "shipped production systems across the full stack. agentic AI for banking, LLM-driven transaction monitoring, and the usual tectonics of a growing startup.",
      stack: ["Svelte", "PostgreSQL", "Python", "TypeScript", "LLMs"],
    },
    {
      title: "Software Engineer Intern",
      company: "Third Ray, Inc.",
      type: "internship",
      location: "Bangalore Urban, Karnataka, India",
      mode: "on-site",
      start: "Sep 2023",
      end: "Jul 2024",
      description:
        "early engineer — built, broke, learned. earned the conversion to full-time.",
    },
  ],
  education: [
    {
      school: "Indian Institute of Technology, Madras",
      degree: "BS",
      field: "Programming & Data Science",
      start: "Jan 2021",
      end: "Dec 2026",
    },
    {
      school: "New Horizon College of Engineering",
      degree: "BTech",
      field: "Computer and Information Sciences",
      start: "Sep 2020",
      end: "Jun 2024",
    },
  ],
  projects: [
    {
      slug: "zapsearch",
      name: "ZapSearch",
      tagline: "sub-second search over 10k documents",
      year: "2025",
      description:
        "a high-performance search engine with a Rust/Axum backend and Next.js frontend. TF-IDF inverted index, polite crawler respecting robots.txt, dockerized micro-services with CI/CD.",
      stack: ["Rust", "Axum", "Next.js", "Docker", "TF-IDF"],
      links: [
        { label: "github", href: "https://github.com/rishabhpreethan/zapsearch" },
      ],
    },
    {
      slug: "graphlint",
      name: "GraphLint",
      tagline: "ai-powered code review, inline on your PRs",
      year: "2025",
      description:
        "a GitHub integration that runs AST parsing, control-flow analysis, and LLM suggestions on JS/TS/Python PRs — serverless, with runtime GitHub PAT integration for inline comments.",
      stack: ["TypeScript", "AST", "Serverless", "LLMs", "GitHub API"],
      links: [
        { label: "github", href: "https://github.com/rishabhpreethan/graphlint" },
      ],
    },
    {
      slug: "algolens",
      name: "AlgoLens",
      tagline: "multi-timeframe chart analysis for day-trading",
      year: "2025",
      description:
        "ingests 4h / 1h / 15m / 5m charts, identifies trend direction, EMA positions, Fibonacci retracements, RSI confluence. Outputs structured trade recommendations with contextual Q&A.",
      stack: ["Next.js", "TypeScript", "Vision LLMs"],
      links: [
        { label: "github", href: "https://github.com/rishabhpreethan/AlgoLens" },
      ],
    },
    {
      slug: "f1-insider",
      name: "F1 Insider",
      tagline: "real-time formula 1 dashboards",
      year: "2025",
      description:
        "driver & constructor stats, live race data, historical analysis. React + Ergast F1 API + PostgreSQL, visualized with Apache ECharts across responsive dashboards.",
      stack: ["React", "PostgreSQL", "Apache ECharts", "Serverless"],
      links: [
        { label: "github", href: "https://github.com/rishabhpreethan/f1" },
      ],
    },
    {
      slug: "gesture-guided",
      name: "Gesture Guided Interaction",
      tagline: "asl interpreter with real-time speech output",
      year: "2024",
      description:
        "a custom CNN over Mediapipe hand-tracking translates ASL gestures into full sentences, then speaks them aloud — with support for user-defined gestures.",
      stack: ["Python", "TensorFlow", "Mediapipe", "OpenCV", "Flask"],
      links: [
        {
          label: "github",
          href: "https://github.com/rishabhpreethan/Sign-Language-Interpretor",
        },
      ],
    },
    {
      slug: "spotify-playlist",
      name: "Spotify Playlist Generator",
      tagline: "personalized discovery without the algorithm fatigue",
      year: "2022",
      description:
        "uses the Spotify API to create playlists of 50 unheard tracks based on the user's listening habits and genre affinities.",
      stack: ["Python", "Spotify API"],
      links: [],
    },
  ],
  skills: [
    { name: "TypeScript", group: "languages" },
    { name: "Python", group: "languages" },
    { name: "Rust", group: "languages" },
    { name: "Next.js", group: "frameworks" },
    { name: "React", group: "frameworks" },
    { name: "Svelte", group: "frameworks" },
    { name: "Axum", group: "frameworks" },
    { name: "Flask", group: "frameworks" },
    { name: "PostgreSQL", group: "data" },
    { name: "MySQL", group: "data" },
    { name: "SQLite", group: "data" },
    { name: "Docker", group: "infra" },
    { name: "Kubernetes", group: "infra" },
    { name: "Vercel", group: "infra" },
    { name: "AWS", group: "infra" },
    { name: "TensorFlow", group: "ml" },
    { name: "Scikit-Learn", group: "ml" },
    { name: "Mediapipe", group: "ml" },
    { name: "OpenCV", group: "ml" },
    { name: "LLMs", group: "ml" },
  ],
};

export const navSections = [
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "projects", label: "projects" },
  { id: "skills", label: "skills" },
  { id: "education", label: "education" },
  { id: "contact", label: "contact" },
] as const;
