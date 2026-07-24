import { ExternalLink } from "lucide-react";

const socials = [
  {
    label: "YouTube",
    handle: "@soham-hd",
    href: "https://youtube.com/@soham-hd",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M22.5 6.9a2.8 2.8 0 0 0-2-2C18.7 4.5 12 4.5 12 4.5s-6.7 0-8.5.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1 12a29 29 0 0 0 .5 5.1 2.8 2.8 0 0 0 2 2c1.8.4 8.5.4 8.5.4s6.7 0 8.5-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 23 12a29 29 0 0 0-.5-5.1ZM9.8 15.3V8.7l6 3.3-6 3.3Z" />
      </svg>
    ),
  },
  {
    label: "X",
    handle: "@ronaldogoatsfc",
    href: "https://x.com/ronaldogoatsfc",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.9 2h3.4l-7.4 8.5L23.6 22h-6.8l-5.3-6.9L5.4 22H2l7.9-9L1.6 2h7l4.8 6.3L18.9 2Zm-1.2 18h1.9L7.4 4h-2l12.3 16Z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    handle: "@sohamftbl",
    href: "https://tiktok.com/@sohamftbl",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M16.6 5.2c-.8-.8-1.3-1.9-1.3-3.2h-3.2v13.4c0 1.5-1.2 2.7-2.7 2.7a2.7 2.7 0 0 1-2.7-2.7 2.7 2.7 0 0 1 2.7-2.7c.3 0 .6 0 .9.1v-3.3a6 6 0 0 0-.9-.1A6 6 0 0 0 3.4 15.4a6 6 0 0 0 6 6 6 6 0 0 0 6-6V8.6a8.3 8.3 0 0 0 4.6 1.4V6.8a5 5 0 0 1-3.4-1.6Z" />
      </svg>
    ),
  },
];

const LINKTREE_URL = "https://linktr.ee/ronaldogoatsfc";

export default function SocialLinks() {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-3">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-paper-dim transition hover:border-gold hover:text-gold"
          >
            {s.icon}
            <span className="text-sm">{s.handle}</span>
          </a>
        ))}
      </div>

      <a
        href={LINKTREE_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-sm text-paper-dim underline underline-offset-2 hover:text-gold"
      >
        <ExternalLink size={14} />
        More links (Linktree)
      </a>
    </div>
  );
}