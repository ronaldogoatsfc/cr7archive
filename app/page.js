import Link from "next/link";
import matches from "@/data/all-matches";
import trophies from "@/data/trophies.json";
import honors from "@/data/honors.json";
import records from "@/data/records.json";
import {
  careerTotals,
  trophyTotal,
  goalsAndAssistsBySeason,
  goalsByCompetition,
  goalsPer90BySeason,
} from "@/lib/stats";
import StatCard from "@/components/StatCard";

const GOAL_TARGET = 1000;

const sections = [
  {
    title: "Visualizations",
    description:
      "Explore interactive breakdowns of Ronaldo's goals, assists, scoring efficiency, results, ratings, opponents, clubs, and competitions.",
    href: "/visualizations",
    cta: "See visualizations",
  },
  {
    title: "Articles",
    description:
      "Original analysis of Ronaldo's career, performances, statistics, and evolution as a player.",
    href: "/articles",
    cta: "Read the articles",
  },
  {
    title: "About",
    description:
      "Learn how The Ronaldo Archive is researched, maintained, and built, along with information about its sources and methodology.",
    href: "/about",
    cta: "Learn more",
  },
];

export default function Home() {
  const totals = careerTotals(matches);
  const trophyCount = trophyTotal(trophies);
  const ballonDorWins = honors.filter(
    (h) => h.name === "Ballon d'Or"
  ).length;

  const fifaBestWins = honors.filter(
    (h) => h.name === "The Best FIFA Men's Player"
  ).length;

  const championsLeagueTopScorerWins = honors.filter(
    (h) => h.name === "UEFA Champions League top scorer"
  ).length;

  const europeanGoldenShoes = honors.filter(
    (h) => h.name === "European Golden Shoe"
  ).length;
  const featuredRecordIds = [
    "most-mens-international-caps",
    "most-goals-uefa-champions-league",
    "most-goals-single-saudi-pro-league-season",
  ];

  const featuredRecords = featuredRecordIds.map((id) =>
    records.find((record) => record.id === id)
  );
  const trophyCounts = {
    championsLeague: trophies.filter(
      (t) => !t.isFriendly && t.name === "UEFA Champions League"
    ).length,
    premierLeague: trophies.filter(
      (t) => !t.isFriendly && t.name === "Premier League"
    ).length,
    laLiga: trophies.filter(
      (t) => !t.isFriendly && t.name === "La Liga"
    ).length,
    serieA: trophies.filter(
      (t) => !t.isFriendly && t.name === "Serie A"
    ).length,
    europeanChampionship: trophies.filter(
      (t) => !t.isFriendly && t.name === "UEFA European Championship"
    ).length,
  };
  const seasonStats = goalsAndAssistsBySeason(matches);

  const mostProlificSeason = [...seasonStats].sort(
    (a, b) => b.goals - a.goals
  )[0];

  const scoringRateSeasons = goalsPer90BySeason(matches).filter(
    (season) => season.minutes >= 900
  );

  const bestScoringRate = [...scoringRateSeasons].sort(
    (a, b) => b.goalsPer90 - a.goalsPer90
  )[0];

  const leadingCompetition = goalsByCompetition(matches)[0];
  const progress = Math.min(100, (totals.goals / GOAL_TARGET) * 100);
  const goalsRemaining = Math.max(0, GOAL_TARGET - totals.goals);
  

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-16 text-center">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-gold">
          The Statistical Archive of Cristiano Ronaldo
        </p>

        <h1 className="mx-auto mt-5 max-w-4xl font-display text-5xl font-semibold leading-tight text-paper sm:text-6xl md:text-7xl">
          Explore the career of football's greatest ever player.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-paper-dim">
          Explore Cristiano Ronaldo's career match by match — from his earliest
          appearances to the pursuit of 1,000 goals. Browse detailed statistics,
          career trends, trophies, records, honors, visualizations, and more.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/match-logs"
            className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-pitch transition hover:bg-gold-bright"
          >
            Explore the match logs
          </Link>

          <Link
            href="/visualizations"
            className="rounded-full border border-line px-7 py-3 text-sm font-semibold text-paper transition hover:border-gold hover:bg-pitch-raised"
          >
            Explore the data
          </Link>
        </div>

        {/* Road to 1,000 */}
        <div className="mx-auto mt-16 max-w-3xl">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-gold">
            The Road to 1,000
          </p>

          <h2 className="stat-number mt-3 text-[clamp(5rem,16vw,11rem)] font-semibold leading-none text-paper">
            {totals.goals}
          </h2>

          <p className="mt-2 font-display text-2xl text-paper sm:text-3xl">
            career goals
          </p>

          <p className="mx-auto mt-4 max-w-xl text-paper-dim">
            Just{" "}
            <span className="font-semibold text-gold">
              {goalsRemaining}
            </span>{" "}
            goals remain on the road to {GOAL_TARGET.toLocaleString()}.
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
                {progress.toFixed(1)}%
              </span>
              <span>{GOAL_TARGET.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Career at a glance */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-2xl font-semibold text-paper">
              Career at a glance
            </h2>
            <p className="mt-2 max-w-2xl text-paper-dim">
              A snapshot of Cristiano Ronaldo's career, calculated from the
              matches and trophies in the archive.
            </p>
          </div>

          <Link
            href="/match-logs"
            className="text-sm font-semibold text-gold transition hover:text-gold-bright"
          >
            Explore all matches →
          </Link>
        </div>

        {/* Main career totals */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Matches" value={totals.matches} />
          <StatCard label="Goals" value={totals.goals} />
          <StatCard label="Assists" value={totals.assists} accent="turf" />
          <StatCard label="Trophies" value={trophyCount} accent="turf" />
        </div>

        {/* Derived career statistics */}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-line bg-pitch-raised p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">
              Goals / Match
            </p>
            <p className="mt-3 font-display text-3xl font-semibold text-paper">
              {totals.matches > 0
                ? (totals.goals / totals.matches).toFixed(2)
                : "0.00"}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-pitch-raised p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">
              Assists / Match
            </p>
            <p className="mt-3 font-display text-3xl font-semibold text-paper">
              {totals.matches > 0
                ? (totals.assists / totals.matches).toFixed(2)
                : "0.00"}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-pitch-raised p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">
              G+A / Match
            </p>
            <p className="mt-3 font-display text-3xl font-semibold text-paper">
              {totals.matches > 0
                ? ((totals.goals + totals.assists) / totals.matches).toFixed(2)
                : "0.00"}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-pitch-raised p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">
              Win Rate
            </p>
            <p className="mt-3 font-display text-3xl font-semibold text-paper">
              {totals.matches > 0
                ? `${((totals.wins / totals.matches) * 100).toFixed(1)}%`
                : "0.0%"}
            </p>
          </div>
        </div>
      </section>
      <section className="border-t border-line px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
              Explore the numbers
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-paper">
              What the data reveals
            </h2>
            <p className="mt-2 text-paper-dim">
              A closer look at some of the biggest statistical trends in
              Ronaldo's career, calculated from the archive's match data.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-line bg-pitch-raised p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">
                Most prolific season
              </p>

              <p className="mt-4 font-display text-3xl font-semibold text-paper">
                {mostProlificSeason.season}
              </p>

              <p className="mt-2 text-paper-dim">
                <span className="font-semibold text-gold">
                  {mostProlificSeason.goals} goals
                </span>{" "}
                and {mostProlificSeason.assists} assists across{" "}
                {mostProlificSeason.matches} appearances.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-pitch-raised p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">
                Best scoring rate
              </p>

              <p className="mt-4 font-display text-3xl font-semibold text-paper">
                {bestScoringRate.goalsPer90.toFixed(2)}
              </p>

              <p className="mt-2 text-paper-dim">
                goals per 90 in{" "}
                <span className="font-semibold text-gold">
                  {bestScoringRate.season}
                </span>
                , based on {bestScoringRate.minutes.toLocaleString()} logged
                minutes.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-pitch-raised p-6">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">
                Leading competition
              </p>

              <p className="mt-4 font-display text-3xl font-semibold text-paper">
                {leadingCompetition.goals}
              </p>

              <p className="mt-2 text-paper-dim">
                goals in{" "}
                <span className="font-semibold text-gold">
                  {leadingCompetition.name}
                </span>
                .
              </p>
            </div>
          </div>

          <div className="mt-5">
            <Link
              href="/visualizations"
              className="text-sm font-semibold text-gold transition hover:text-gold-bright"
            >
              Explore the full visualizations →
            </Link>
          </div>
        </div>
      </section>
      {/* Trophy cabinet */}
      <section className="border-t border-line px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
                Trophy cabinet
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-paper">
                35 official trophies
              </h2>
              <p className="mt-2 max-w-2xl text-paper-dim">
                A snapshot of some of the most significant team trophies won
                throughout Ronaldo&apos;s career.
              </p>
            </div>

            <Link
              href="/trophies"
              className="text-sm font-semibold text-gold transition hover:text-gold-bright"
            >
              Explore the full trophy cabinet →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="rounded-2xl border border-line bg-pitch-raised p-5">
              <p className="font-display text-3xl font-semibold text-gold">
                {trophyCounts.championsLeague}
              </p>
              <p className="mt-2 text-sm text-paper">Champions League</p>
            </div>

            <div className="rounded-2xl border border-line bg-pitch-raised p-5">
              <p className="font-display text-3xl font-semibold text-gold">
                {trophyCounts.premierLeague}
              </p>
              <p className="mt-2 text-sm text-paper">Premier League</p>
            </div>

            <div className="rounded-2xl border border-line bg-pitch-raised p-5">
              <p className="font-display text-3xl font-semibold text-gold">
                {trophyCounts.laLiga}
              </p>
              <p className="mt-2 text-sm text-paper">La Liga</p>
            </div>

            <div className="rounded-2xl border border-line bg-pitch-raised p-5">
              <p className="font-display text-3xl font-semibold text-gold">
                {trophyCounts.serieA}
              </p>
              <p className="mt-2 text-sm text-paper">Serie A</p>
            </div>

            <div className="rounded-2xl border border-line bg-pitch-raised p-5">
              <p className="font-display text-3xl font-semibold text-gold">
                {trophyCounts.europeanChampionship}
              </p>
              <p className="mt-2 text-sm text-paper">
                European Championship
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Honors and awards */}
      <section className="border-t border-line px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
                Individual excellence
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-paper">
                Honors &amp; Awards
              </h2>
              <p className="mt-2 max-w-2xl text-paper-dim">
                From football&apos;s biggest individual prizes to sustained
                dominance in Europe&apos;s premier club competition.
              </p>
            </div>

            <Link
              href="/honors"
              className="text-sm font-semibold text-gold transition hover:text-gold-bright"
            >
              Explore all honors →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-line bg-pitch-raised p-6">
              <p className="font-display text-4xl font-semibold text-gold">
                {ballonDorWins}
              </p>
              <h3 className="mt-3 font-semibold text-paper">Ballon d&apos;Or</h3>
              <p className="mt-1 text-sm text-paper-dim">
                Wins of football&apos;s renowned individual award.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-pitch-raised p-6">
              <p className="font-display text-4xl font-semibold text-gold">
                {fifaBestWins}
              </p>
              <h3 className="mt-3 font-semibold text-paper">
                The Best FIFA Men&apos;s Player
              </h3>
              <p className="mt-1 text-sm text-paper-dim">
                Wins of FIFA&apos;s individual player award.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-pitch-raised p-6">
              <p className="font-display text-4xl font-semibold text-gold">
                {championsLeagueTopScorerWins}
              </p>
              <h3 className="mt-3 font-semibold text-paper">
                Champions League Top Scorer
              </h3>
              <p className="mt-1 text-sm text-paper-dim">
                Seasons finishing as the competition&apos;s leading scorer.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-pitch-raised p-6">
              <p className="font-display text-4xl font-semibold text-gold">
                {europeanGoldenShoes}
              </p>
              <h3 className="mt-3 font-semibold text-paper">
                European Golden Shoe
              </h3>
              <p className="mt-1 text-sm text-paper-dim">
                Wins recognizing Europe&apos;s leading league goalscorer.
              </p>
            </div>
          </div>
        </div>
      </section>
      
{/* Featured records */}
      <section className="border-t border-line px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
                A career of records
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-paper">
                Records that define a career
              </h2>
              <p className="mt-2 max-w-2xl text-paper-dim">
                From international longevity to European dominance and
                record-breaking scoring in Saudi Arabia.
              </p>
            </div>

            <Link
              href="/records"
              className="text-sm font-semibold text-gold transition hover:text-gold-bright"
            >
              Explore all records →
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {featuredRecords.map((record) => (
              <div
                key={record.id}
                className="rounded-2xl border border-line bg-pitch-raised p-6"
              >
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
                  {record.category}
                </p>

                <p className="mt-4 font-display text-5xl font-semibold text-paper">
                  {record.id === "most-mens-international-caps"
                    ? "233"
                    : record.id === "most-goals-uefa-champions-league"
                      ? "140"
                      : "35"}
                </p>

                <h3 className="mt-3 font-semibold leading-snug text-paper">
                  {record.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-paper-dim">
                  {record.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Archive sections */}
      {sections.map((section) => (
        <section
          key={section.href}
          className="border-t border-line px-6 py-12"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-xl font-semibold text-paper">
                {section.title}
              </h2>

              <p className="mt-2 text-paper-dim">
                {section.description}
              </p>
            </div>

            <Link
              href={section.href}
              className="shrink-0 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-paper transition hover:border-gold hover:bg-pitch-raised"
            >
              {section.cta}
            </Link>
          </div>
        </section>
      ))}
    </div>
  );
}