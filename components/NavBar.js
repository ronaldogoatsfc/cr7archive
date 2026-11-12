"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Search, Menu, X } from "lucide-react";

const primaryLinks = [{ href: "/", label: "Home" }];

const matchLogsMenu = [
  { href: "/match-logs", label: "Match Logs", description: "Filterable match-by-match log" },
  { href: "/match-logs/unofficial", label: "Unofficial", description: "Match-by-match log for friendly matches" },
];

const secondaryLinks = [
  { href: "/timeline", label: "Timeline" },
  { href: "/articles", label: "Articles" },
  { href: "/visualizations", label: "Visualizations" },
  { href: "/comparisons", label: "Comparisons" },
  { href: "/community", label: "Community" },
  { href: "/trophies", label: "Trophies" },
  { href: "/honors", label: "Individual Honors" },
  { href: "/records", label: "Records" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSidebarOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

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
      <div className="mx-auto flex max-w-7xl items-center gap-x-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-baseline gap-2 whitespace-nowrap">
          <span className="font-display text-base font-semibold tracking-tight text-paper sm:text-xl xl:text-2xl">
            THE RONALDO ARCHIVE
          </span>
        </Link>

        <nav aria-label="Main navigation" className="ml-auto flex min-w-0 flex-1 items-center justify-start gap-0.5 overflow-x-auto overscroll-x-contain whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full px-2 py-2 text-sm text-paper-dim transition hover:bg-pitch-raised hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              {link.label}
            </Link>
          ))}

          <div className="relative shrink-0" ref={containerRef}>
            <div className="flex items-center rounded-full transition hover:bg-pitch-raised">
              <Link
                href="/match-logs"
                className="shrink-0 rounded-l-full py-2 pl-2 pr-1 text-sm text-paper-dim transition hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              >
                Match Logs
              </Link>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-label="Toggle match logs menu"
                className="shrink-0 rounded-r-full py-2 pl-1 pr-3 text-paper-dim transition hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
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
              className="shrink-0 whitespace-nowrap rounded-full px-2 py-2 text-sm text-paper-dim transition hover:bg-pitch-raised hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/search"
            aria-label="Search the archive"
            title="Search the archive"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-2 text-sm text-paper-dim transition hover:bg-pitch-raised hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
            <Search size={16} />
            <span>Search</span>
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={sidebarOpen}
          className="ml-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gold transition hover:bg-pitch-raised hover:text-gold-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          <Menu size={27} strokeWidth={2.5} />
        </button>
      </div>

      {sidebarOpen && (
          <div className="fixed inset-0 z-[100]">
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 cursor-default bg-black/65 backdrop-blur-[2px]"
            />
            <aside
              id="site-navigation-drawer"
              aria-label="Site navigation"
              className="fixed right-0 top-0 flex h-[100dvh] w-[min(88vw,420px)] flex-col border-l border-line bg-pitch-raised shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <span className="font-display text-lg font-semibold tracking-wide text-paper">THE RONALDO ARCHIVE</span>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close navigation menu"
                  className="rounded-lg p-2 text-paper-dim transition hover:bg-pitch hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                >
                  <X size={21} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-4 py-5" aria-label="Sidebar navigation">
                <div className="mb-5">
                  <Link href="/search" onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 rounded-lg border border-line bg-pitch px-4 py-3 text-sm text-paper-dim transition hover:border-gold hover:text-gold">
                    <Search size={17} /> Search the archive
                  </Link>
                </div>
                <div className="space-y-1">
                  {[...primaryLinks, ...secondaryLinks.slice(0, 1)].map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-paper-dim transition hover:bg-pitch hover:text-gold">
                      {link.label}
                    </Link>
                  ))}
                  <div className="rounded-lg px-3 py-2">
                    <Link href="/match-logs" onClick={() => setSidebarOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-paper-dim transition hover:bg-pitch hover:text-gold">Match Logs</Link>
                    <div className="space-y-1 pb-2 pl-4">
                      <Link href="/match-logs" onClick={() => setSidebarOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-paper-dim transition hover:bg-pitch hover:text-gold">Official matches</Link>
                      <Link href="/match-logs/unofficial" onClick={() => setSidebarOpen(false)} className="block rounded-lg px-3 py-2 text-sm text-paper-dim transition hover:bg-pitch hover:text-gold">Unofficial matches</Link>
                    </div>
                  </div>
                  {secondaryLinks.slice(1).map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setSidebarOpen(false)} className="block rounded-lg px-3 py-3 text-sm text-paper-dim transition hover:bg-pitch hover:text-gold">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
              <div className="mt-auto border-t border-line px-6 py-5">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-paper-dim">Follow the archive</p>
                <div className="flex items-center gap-5">
                  <a href="https://youtube.com/@soham-hd" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube" className="text-paper-dim transition hover:text-gold">
                    <svg viewBox="0 0 24 24" width="23" height="23" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"/></svg>
                  </a>
                  <a href="https://x.com/ronaldogoatsfc" target="_blank" rel="noopener noreferrer" aria-label="X" title="X" className="text-paper-dim transition hover:text-gold">
                    <svg viewBox="0 0 24 24" width="21" height="21" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.6 22H2.4l7.3-8.4L1.9 2h6.5l4.5 6.8L18.9 2Zm-1.1 18h1.7L7.4 3.9H5.6L17.8 20Z"/></svg>
                  </a>
                  <a href="https://tiktok.com/@sohamftbl" target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok" className="text-paper-dim transition hover:text-gold">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M19.6 6.2a5.5 5.5 0 0 1-3.4-1.1A5.6 5.6 0 0 1 14.4 2h-3.5v13.7a2.8 2.8 0 1 1-2.8-2.8c.3 0 .6 0 .9.1v-3.6a6.4 6.4 0 1 0 5.4 6.3V8.6a9 9 0 0 0 5.2 1.7V6.8c-.0 0 0-.4 0-.6Z"/></svg>
                  </a>
                </div>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-paper-dim">The Statistical Archive of Cristiano Ronaldo</p>
              </div>
            </aside>
          </div>
      )}
    </header>
  );
}
