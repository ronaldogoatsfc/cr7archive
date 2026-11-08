const exploreLinks = [
  { label: "Match Logs", href: "/match-logs" },
  { label: "Visualizations", href: "/visualizations" },
  { label: "Trophies & Honors", href: "/trophies" },
  { label: "Articles", href: "/articles" },
  { label: "Community", href: "/community" },
];

const informationLinks = [
  { label: "About & Sources", href: "/about" },
  { label: "Privacy Policy", href: "/privacy" },
];

function FooterLink({ href, children }) {
  return (
    <a
      href={href}
      className="w-fit text-sm text-paper-dim transition-colors hover:text-gold"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-pitch-raised/30">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-16">
          <div>
            <a href="/" className="inline-block" aria-label="The Ronaldo Archive home">
              <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.35em] text-paper-dim">
                The
              </span>
              <span className="mt-0.5 block font-display text-3xl font-bold uppercase leading-none tracking-wide text-gold">
                Ronaldo
              </span>
              <span className="mt-0.5 block font-display text-xl font-semibold uppercase leading-none tracking-[0.2em] text-paper">
                Archive
              </span>
            </a>
            <p className="mt-5 max-w-sm text-sm leading-6 text-paper-dim">
              A statistical archive of Cristiano Ronaldo&apos;s career.
              Every appearance, goal, and milestone — documented in one place.
            </p>
          </div>

          <nav aria-label="Explore">
            <h2 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
              Explore
            </h2>
            <div className="flex flex-col items-start gap-3">
              {exploreLinks.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </div>
          </nav>

          <nav aria-label="Information">
            <h2 className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
              Information
            </h2>
            <div className="flex flex-col items-start gap-3">
              {informationLinks.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-10 border-t border-line pt-5">
          <div className="flex flex-col gap-3 text-xs text-paper-dim/70 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} The Ronaldo Archive. Created by Soham.</p>
            <p className="max-w-2xl leading-5 sm:text-right">
              Fan-made project. Not affiliated with Cristiano Ronaldo, any club,
              league, or federation. All data is independently maintained for
              reference purposes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
