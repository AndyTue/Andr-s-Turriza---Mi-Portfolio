/**
 * Non-translatable content: links, assets, tech names, numbers.
 * Every human-readable sentence lives in messages/{en,es}.json and is
 * looked up by the ids below.
 */

export const profile = {
  email: "andres.turrizae@hotmail.com",
  phone: "+52 986 106 3215",
  phoneHref: "tel:+529861063215",
  github: "https://github.com/AndyTue",
  githubUser: "AndyTue",
  linkedin: "https://www.linkedin.com/in/andresturriza",
  instagram: "https://www.instagram.com/andy_tue/",
  cv: { en: "/cv/Andres-Turriza-CV-EN.pdf", es: "/cv/Andres-Turriza-CV-ES.pdf" },
  images: {
    portrait: "/images/andres-portrait.jpg",
    headshot: "/images/andres-headshot.jpg",
    avatar: "/images/andres-avatar.jpg",
  },
  // Tizimín, Yucatán
  coords: { lat: 21.1425, lon: -88.1647 },
  timeZone: "America/Merida",
} as const;

/** Rotating hero greeting: India, México/Colombia, USA, Montréal. */
export const greetings = [
  { word: "नमस्ते", lang: "hi" },
  { word: "Hola", lang: "es" },
  { word: "Hello", lang: "en" },
  { word: "Bonjour", lang: "fr" },
] as const;

/**
 * About carousel, in story order: portrait, Yucatán, UNM, Colombia, Canada, India.
 * Files come from scripts/prepare-about-photos.mjs; alt texts live in
 * `about.carousel.alts` (same order). `contain` shows a landscape photo whole.
 */
const about = (n: number, slug: string) => `/images/about/${String(n).padStart(2, "0")}-${slug}.jpg`;

export const aboutPhotos: { src: string | null; position?: string; fit?: "contain" }[] = [
  { src: "/images/andres-portrait.jpg", position: "50% 30%" },
  { src: about(1, "uady-council") },
  { src: about(2, "yucatan-colonial") },
  { src: about(3, "unm-certificate") },
  { src: about(4, "colombia-flag") },
  { src: about(5, "colombia-group"), fit: "contain" },
  { src: about(6, "llama") },
  { src: about(7, "mexico-flag-group") },
  { src: about(8, "google-office") },
  { src: about(9, "neoclassical-campus") },
  { src: about(10, "city-terrace") },
  { src: about(11, "canada-legislature") },
  { src: about(12, "niagara-window") },
  { src: about(13, "niagara-falls") },
  { src: about(14, "ballpark-leones") },
  { src: about(15, "infosys-dome") },
  { src: about(16, "infosys-badge") },
  { src: about(17, "uady-banner-pyramid") },
  { src: about(18, "campus-bench") },
  { src: about(19, "palace-group") },
  { src: about(20, "palace") },
  { src: about(21, "golden-temple") },
  { src: about(22, "white-temple") },
  { src: about(23, "taj-mahal") },
  { src: about(24, "taj-mahal-bench") },
  { src: about(25, "taj-mahal-view") },
];

/** Favourite song for the "Now playing" widget. */
export const nowPlaying = {
  title: "Ghost Town",
  artist: "Kanye West",
  durationSec: 271,
  startAtSec: 88,
  // Album: ye (2018). Cover © its rights holders, shown to identify the song.
  cover: "/images/cover-ye.jpg",
};

/** Personal widgets in the About "smart stacks". Labels live in messages (about.widgets). */
export const hobbies = [
  { id: "basketball", color: "#f97316" },
  { id: "gym", color: "var(--fg)" },
  { id: "soccer", color: "var(--fg)" },
  { id: "baseball", color: "#ef4444" },
] as const;

export const showcase = [
  { id: "ctf", object: "medal" },
  { id: "secihti", object: "scroll" },
  { id: "unm", object: "pennant" },
  { id: "google", object: "certificate" },
] as const;

export type ProjectId = "ekyc" | "mazza" | "hunter" | "agent" | "petsride" | "katas";

export type Project = {
  id: ProjectId;
  slug: string;
  year: number;
  tech: string;
  stack: string[];
  repo: string;
  monogram: string;
  layout: "wide" | "wide-reverse" | "tall";
  /** Screenshot under /public/projects; null renders the labelled placeholder. */
  image: string | null;
  tint: string;
};

export const projects: Project[] = [
  {
    id: "ekyc",
    slug: "ekyc-mosip",
    year: 2026,
    tech: "OpenCV",
    stack: ["Python", "OpenCV", "OCR", "FastAPI", "MOSIP"],
    repo: "https://github.com/julianvent/api-doc-fraud",
    monogram: "IS",
    layout: "wide",
    image: null,
    tint: "#1d2a6b",
  },
  {
    id: "mazza",
    slug: "dj-mazza-press-kit",
    year: 2026,
    tech: "Three.js",
    stack: ["React 19", "TypeScript", "Tailwind 4", "Motion", "Three.js", "Playwright"],
    repo: "https://github.com/AndyTue/Mazza-Presskit",
    monogram: "DM",
    layout: "tall",
    image: "/projects/mazza.jpg",
    tint: "#3b1d4a",
  },
  {
    id: "hunter",
    slug: "hunter-barbershop",
    year: 2026,
    tech: "React 19",
    stack: ["React 19", "TypeScript", "Tailwind 4", "Netlify"],
    repo: "https://github.com/AndyTue/hunter-barbershop",
    monogram: "HB",
    layout: "tall",
    image: "/projects/hunter.jpg",
    tint: "#4a3417",
  },
  {
    id: "agent",
    slug: "ai-browser-agent",
    year: 2026,
    tech: "RAG",
    stack: ["Python", "Playwright", "FAISS", "Groq", "LLaMA 3.3", "FastAPI", "Gradio"],
    repo: "https://github.com/AndyTue/AI-Browser-Agent",
    monogram: "IS",
    layout: "wide-reverse",
    image: null,
    tint: "#123a3a",
  },
  {
    id: "petsride",
    slug: "pets-ride",
    year: 2025,
    tech: "PostgreSQL",
    stack: ["Node.js", "Express", "PostgreSQL", "JWT", "React", "Vite", "Material-UI", "Axios"],
    repo: "https://github.com/ArmandoCanche/Pets-ride",
    monogram: "UA",
    layout: "tall",
    image: null,
    tint: "#1d3a24",
  },
  {
    id: "katas",
    slug: "dj-katas-press-kit",
    year: 2026,
    tech: "Vanilla JS",
    stack: ["HTML5", "CSS3", "JavaScript", "Search Console"],
    repo: "https://github.com/AndyTue/Katas-Presskit",
    monogram: "DK",
    layout: "tall",
    image: "/projects/katas.jpg",
    tint: "#3d1d1d",
  },
];

/** Two marquee rows, opposite directions. `icon` is a simple-icons slug or null for a monogram. */
export type Tech = { name: string; icon: string | null; color?: string };

export const marqueeRows: Tech[][] = [
  [
    { name: "Python", icon: "python" },
    { name: "TypeScript", icon: "typescript" },
    { name: "JavaScript", icon: "javascript" },
    { name: "Java", icon: "openjdk" },
    { name: "C", icon: "c" },
    { name: "C++", icon: "cplusplus" },
    { name: "Dart", icon: "dart" },
    { name: "HTML5", icon: "html5" },
    { name: "CSS3", icon: "css" },
    { name: "PostgreSQL", icon: "postgresql" },
    { name: "Node.js", icon: "nodedotjs" },
    { name: "Express", icon: "express" },
    { name: "FastAPI", icon: "fastapi" },
    { name: "JWT", icon: "jsonwebtokens" },
    { name: "Gradio", icon: "gradio" },
  ],
  [
    { name: "React", icon: "react" },
    { name: "Vite", icon: "vite" },
    { name: "Tailwind CSS", icon: "tailwindcss" },
    { name: "Three.js", icon: "threedotjs" },
    { name: "Motion", icon: null },
    { name: "PyTorch", icon: "pytorch" },
    { name: "OpenCV", icon: "opencv" },
    { name: "LangChain", icon: "langchain" },
    { name: "Ollama", icon: "ollama" },
    { name: "Playwright", icon: null },
    { name: "Linux", icon: "linux" },
    { name: "Git", icon: "git" },
    { name: "GitHub", icon: "github" },
    { name: "Material-UI", icon: "mui" },
    { name: "Axios", icon: "axios" },
    { name: "NumPy", icon: "numpy" },
    { name: "Groq", icon: null },
    { name: "Meta LLaMA", icon: "meta" },
  ],
];

export const stackGroups: { id: "languages" | "backend" | "frontend" | "ai" | "tools"; items: string[] }[] = [
  { id: "languages", items: ["Python", "TypeScript", "JavaScript", "Java", "C", "C++", "Dart", "HTML5", "CSS3"] },
  { id: "backend", items: ["PostgreSQL", "Node.js", "Express", "FastAPI", "JWT", "Gradio"] },
  { id: "frontend", items: ["React", "Vite", "Tailwind CSS", "Material-UI", "Axios", "Three.js", "Motion"] },
  { id: "ai", items: ["PyTorch", "LangChain", "Ollama", "OpenCV", "NumPy", "Groq", "Meta LLaMA"] },
  { id: "tools", items: ["Playwright", "Chromium", "Linux", "Git", "GitHub"] },
];

export type TimelineId = "freelance" | "infosys" | "mcgill" | "upb" | "unm" | "council" | "uady";

/** `logo`: file in /public/images/logos (null → generic freelance icon); `wide` for horizontal wordmarks. */
export const timeline: { id: TimelineId; logo: { src: string; w: number; h: number; wide?: boolean } | null; current?: boolean; tags?: string[] }[] = [
  { id: "freelance", logo: null, current: true, tags: ["React", "TypeScript", "Tailwind", "Three.js", "Playwright"] },
  { id: "infosys", logo: { src: "/images/logos/infosys-instep.png", w: 390, h: 85, wide: true }, tags: ["Python", "OCR", "OpenCV", "RAG", "FastAPI"] },
  { id: "mcgill", logo: { src: "/images/logos/mcgill.png", w: 1044, h: 256, wide: true } },
  { id: "upb", logo: { src: "/images/logos/upb.png", w: 239, h: 256 } },
  { id: "unm", logo: { src: "/images/logos/unm.png", w: 1203, h: 256, wide: true } },
  { id: "council", logo: { src: "/images/logos/fmat.png", w: 256, h: 256 } },
  { id: "uady", logo: { src: "/images/logos/uady.png", w: 841, h: 499 } },
];

export type ServiceId = "web" | "fullstack" | "ai" | "vision" | "delivery";

export const services: { id: ServiceId; tags: string[]; preview: ProjectId }[] = [
  { id: "web", tags: ["React 19", "TypeScript", "Tailwind 4", "Motion", "Three.js"], preview: "mazza" },
  { id: "fullstack", tags: ["Node.js", "Express", "FastAPI", "PostgreSQL", "JWT/RBAC"], preview: "petsride" },
  { id: "ai", tags: ["FAISS", "LangChain", "LLaMA", "Ollama", "Groq"], preview: "agent" },
  { id: "vision", tags: ["OpenCV", "PyTorch", "OCR"], preview: "ekyc" },
  { id: "delivery", tags: ["Playwright", "Git/GitHub", "Linux"], preview: "hunter" },
];

export type AwardId = "projectfest" | "embassy" | "ctf" | "secihti" | "google";

export const awards: { id: AwardId; icon: "trophy" | "flag" | "shield" | "plane" | "certificate" }[] = [
  { id: "projectfest", icon: "trophy" },
  { id: "embassy", icon: "flag" },
  { id: "ctf", icon: "shield" },
  { id: "secihti", icon: "plane" },
  { id: "google", icon: "certificate" },
];
