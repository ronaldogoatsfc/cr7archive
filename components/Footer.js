export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-paper-dim sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p>
            The Archive is not affiliated with, endorsed by, or connected to Cristiano Ronaldo, any club, league, or federation. All data is community-maintained for reference purposes.
          </p>
          <p className="mt-2 font-mono text-xs text-paper-dim/70">
            Created by Soham.
          </p>
        </div>
        <a
          href="/privacy"
          className="shrink-0 font-mono text-xs text-paper-dim transition-colors hover:text-gold underline underline-offset-4"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
