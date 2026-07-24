"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const primaryLinks = [{ href: "/", label: "Home" }];

const matchLogsMenu = [
  { href: "/match-logs", label: "Match Logs", description: "Filterable match-by-match log" },
  { href: "/match-logs/unofficial", label: "Unofficial", description: "Match-by-match log for friendly matches" },
];

const secondaryLinks = [
  { href: "/visualizations", label: "Visualizations" },
  { href: "/trophies", label: "Trophies" },
  { href: "/honors", label: "Individual Honors" },
  { href: "/records", label: "Records" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-pitch/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-2 px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-paper">
            THE CR7 ARCHIVE
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-1">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-paper-dim transition hover:bg-pitch-raised hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              {link.label}
            </Link>
          ))}

          <div className="relative" ref={containerRef}>
            <div className="flex items-center rounded-full transition hover:bg-pitch-raised">
              <Link
                href="/match-logs"
                className="rounded-l-full py-2 pl-4 pr-1 text-sm text-paper-dim transition hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              >
                Match Logs
              </Link>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-label="Toggle match logs menu"
                className="rounded-r-full py-2 pl-1 pr-3 text-paper-dim transition hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              >
                <ChevronDown
                  size={16}
                  className={`transition-transform ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-pitch-raised shadow-xl">
                {matchLogsMenu.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 transition hover:bg-pitch"
                  >
                    <p className="text-sm font-medium text-paper">{item.label}</p>
                    <p className="mt-0.5 text-xs text-paper-dim">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {secondaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm text-paper-dim transition hover:bg-pitch-raised hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
