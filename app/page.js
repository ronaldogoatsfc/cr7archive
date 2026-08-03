import Link from "next/link";
import matches from "@/data/all-matches";
import trophies from "@/data/trophies.json";
import { careerTotals, trophyTotal } from "@/lib/stats";
import StatCard from "@/components/StatCard";

const GOAL_TARGET = 1000;

const sections = [
  {
    title: "Match Logs",
    description:
      "Explore a complete, searchable database of every official and unofficial appearance—filterable by season, competition, venue, and detailed performance metrics.",
    href: "/match-logs",
    cta: "Open match logs",
  },
  {
    title: "Articles",
    description:
      "Original writing on Ronaldo's game — tactics, technique, and how his career has evolved over time.",
    href: "/articles",
    cta: "Read the articles",
  },
  {
    title: "Visualizations",
    description:
      "Interactive statistical breakdowns detailing goal trends, efficiency metrics, and more.",
    href: "/visualizations",
    cta: "See visualizations",
  },
  {
    title: "Trophies",
    description:
      "Every piece of silverware lifted with club and country.",
    href: "/trophies",
    cta: "View trophy cabinet",
  },
  {
    title: "Individual Honors & Awards",
    description:
      "Ballon d'Or placements, Golden Boots, and other recognition awards across two decades.",
    href: "/honors",
    cta: "See honors & awards",
  },
  {
    title: "Records",
    description:
      "I don't follow the records, the records follow me. - Cristiano Ronaldo",
    href: "/records",
    cta: "Browse records",
  },
  {
    title: "About",
    description:
      "Why this archive exists, future plans, and how to get in touch.",
    href: "/about",
    cta: "Read more",
  },
];

export default function Home() {
  const totals = careerTotals(matches);
  const trophyCount = trophyTotal(trophies);
  const progress = Math.min(100, (totals.goals / GOAL_TARGET) * 100);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 text-center">
        <h2 className="font-display text-4xl font-semibold text-paper sm:text-5xl md:text-6xl">
          Welcome to The CR7 Archive.
        </h2>
        <p className="mt-6 font-mono text-xl uppercase tracking-[0.3em] text-gold">
          The race to 1,000 is on
        </p>
        <h1 className="stat-number mt-4 text-[clamp(4rem,14vw,10rem)] font-semibold leading-none text-paper">
          {totals.goals}
          <span className="text-gold"></span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-lg text-paper-dim">
          Career goals, on the way to {GOAL_TARGET.toLocaleString()}.
        </p>

        <div className="mx-auto mt-6 max-w-xl">

          <div className="h-3 w-full overflow-hidden rounded-full bg-pitch-raised">
            <div
              className="h-full rounded-full bg-gold transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between font-mono text-xs text-paper-dim">
            <span>0</span>
            <span className="text-gold">
              {progress.toFixed(1)}% there
            </span>
            <span>{GOAL_TARGET.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/match-logs"
            className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-pitch transition hover:bg-gold-bright"
          >
            Browse the match logs
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="font-display text-2xl font-semibold text-paper">
          Career at a glance
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Matches" value={totals.matches} />
          <StatCard label="Goals" value={totals.goals} />
          <StatCard label="Assists" value={totals.assists} accent="turf" />
          <StatCard label="Trophies" value={trophyCount} accent="turf" />
        </div>
      </section>

      {sections.map((section) => (
        <section
          key={section.href}
          className="border-t border-line px-6 py-12"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <h3 className="font-display text-xl font-semibold text-paper">
                {section.title}
              </h3>
              <p className="mt-2 text-paper-dim">{section.description}</p>
            </div>
            <Link
              href={section.href}
              className="shrink-0 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-pitch-raised hover:border-gold"
            >
              {section.cta}
            </Link>
          </div>
        </section>
      ))}
    </div>
  );
}
