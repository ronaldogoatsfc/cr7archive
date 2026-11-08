import Link from "next/link";
import { Search, ArrowUpRight } from "lucide-react";
import matches from "@/data/all-matches";
import unofficialMatches from "@/data/unofficial-matches.json";
import articles from "@/data/articles";
import trophies from "@/data/trophies.json";
import honors from "@/data/honors.json";
import records from "@/data/records.json";
import { getTimelineEvents } from "@/lib/timeline";

export const metadata = {
  title: "Search the Archive | The Ronaldo Archive",
  description: "Search Cristiano Ronaldo's matches, articles, trophies, honors, records, and career timeline.",
};

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9/.-]+/g, " ")
    .trim();
}

function buildSearchIndex() {
  const matchEntries = [...matches, ...unofficialMatches].map((match) => {
    const isUnofficial = unofficialMatches.includes(match);
    const date = match.date || "";
    const score = Number.isFinite(match.scoreFor) && Number.isFinite(match.scoreAgainst)
      ? `${match.scoreFor}-${match.scoreAgainst}`
      : "";
    const details = [
      date,
      match.season,
      match.competition,
      match.stage,
      match.venue,
      score,
      match.goals ? `${match.goals} goals ${match.goals === 3 ? "hat trick" : ""}` : "",
      match.assistEvents?.map((event) => `${event.minute || ""} ${event.assistedPlayer || ""}`).join(" "),
    ].filter(Boolean).join(" ");
    const query = match.opponent || match.competition || match.team || "";

    return {
      id: `match-${isUnofficial ? "unofficial-" : ""}${match.id}-${match.opponent}`,
      type: "Match",
      title: `${match.team} vs. ${match.opponent}`,
      subtitle: [date, match.competition, match.season].filter(Boolean).join(" · "),
      description: [
        score,
        match.stage,
        match.goals ? `${match.goals} Ronaldo ${match.goals === 1 ? "goal" : "goals"}` : "",
        match.assists ? `${match.assists} assists` : "",
      ].filter(Boolean).join(" · "),
      href: `/match-logs${isUnofficial ? "/unofficial" : ""}?search=${encodeURIComponent(query)}&dateFrom=${date}&dateTo=${date}`,
      searchText: normalize([
        match.team,
        match.opponent,
        match.competition,
        match.stage,
        match.season,
        date,
        match.venue,
        match.result,
        score,
        details,
      ].join(" ")),
    };
  });

  const articleEntries = articles.map((article) => ({
    id: `article-${article.slug}`,
    type: "Article",
    title: article.title,
    subtitle: [article.author, article.datePublished].filter(Boolean).join(" · "),
    description: article.description || (article.tags || []).join(" · "),
    href: `/articles/${article.slug}`,
    searchText: normalize([
      article.title,
      article.description,
      ...(article.tags || []),
      ...(article.content || []).flatMap((block) => [block.text, block.alt, block.caption]),
    ].join(" ")),
  }));

  const trophyEntries = trophies.map((trophy) => ({
    id: `trophy-${trophy.id}`,
    type: "Trophy",
    title: trophy.name,
    subtitle: [trophy.season, trophy.club].filter(Boolean).join(" · "),
    description: trophy.competitionType || "",
    href: "/trophies",
    searchText: normalize([
      trophy.name,
      trophy.competitionType,
      trophy.club,
      trophy.season,
      trophy.year,
      trophy.id,
    ].join(" ")),
  }));

  const honorEntries = honors.map((honor) => ({
    id: `honor-${honor.id}`,
    type: "Honor",
    title: honor.name,
    subtitle: [honor.year, honor.season, honor.club].filter(Boolean).join(" · "),
    description: honor.category || "",
    href: "/honors",
    searchText: normalize([
      honor.name,
      honor.category,
      honor.club,
      honor.season,
      honor.year,
      honor.notes,
    ].join(" ")),
  }));

  const recordEntries = records.map((record) => ({
    id: `record-${record.id}`,
    type: "Record",
    title: record.name,
    subtitle: [record.category, record.period].filter(Boolean).join(" · "),
    description: [record.status, record.notes, record.brokenBy].filter(Boolean).join(" · "),
    href: "/records",
    searchText: normalize([
      record.name,
      record.category,
      record.period,
      record.status,
      record.notes,
      record.brokenBy,
      record.club,
    ].join(" ")),
  }));

  const visualizationEntries = [
    {
      title: "Goals & assists by season",
      description: "Season-by-season attacking contributions across all competitions.",
      keywords: "goals assists season contributions",
    },
    {
      title: "Goals by competition",
      description: "A breakdown of scoring output across domestic leagues, cups, and international competitions.",
      keywords: "scoring competition league cup champions europe",
    },
    {
      title: "Goals by club",
      description: "Compare Ronaldo's goal totals across his clubs.",
      keywords: "Manchester United Real Madrid Juventus Al Nassr Sporting",
    },
    {
      title: "Match rating distribution",
      description: "Explore the distribution of recorded match ratings.",
      keywords: "performance rating match",
    },
    {
      title: "Results breakdown",
      description: "A breakdown of wins, draws, and losses.",
      keywords: "results wins draws losses",
    },
    {
      title: "Goals by knockout phase",
      description: "Scoring output across tournament knockout rounds.",
      keywords: "round of 16 quarter-final semi-final final",
    },
    {
      title: "Most goals against",
      description: "The opponents against whom Ronaldo has scored the most.",
      keywords: "opponent teams",
    },
    {
      title: "Goals by venue",
      description: "Compare goals scored at home, away, and neutral venues.",
      keywords: "home away neutral",
    },
    {
      title: "Goals by month",
      description: "Career goals grouped by calendar month.",
      keywords: "January February March April May June July August September October November December",
    },
    {
      title: "Goals by age",
      description: "Scoring output at different ages throughout Ronaldo's career.",
      keywords: "age years old",
    },
    {
      title: "Goals per 90 by season",
      description: "Scoring efficiency adjusted for recorded minutes played.",
      keywords: "goals per 90 minutes scoring rate efficiency",
    },
    {
      title: "Win percentage by competition",
      description: "Win rate across competitions with sufficient match data.",
      keywords: "wins results percentage",
    },
    {
      title: "Appearances by club",
      description: "Logged appearances for each club.",
      keywords: "matches Manchester United Real Madrid Juventus Al Nassr Sporting",
    },
    {
      title: "Goals + assists by club",
      description: "Attacking contributions across Ronaldo's clubs.",
      keywords: "goals assists contributions Manchester United Real Madrid Juventus Al Nassr Sporting",
    },
    {
      title: "Goals per appearance by club",
      description: "Scoring output relative to appearances for each club.",
      keywords: "goals appearance ratio scoring rate",
    },
  ].map((visualization) => ({
    id: `visualization-${visualization.title}`,
    type: "Visualization",
    title: visualization.title,
    subtitle: "Career statistics · Interactive chart",
    description: visualization.description,
    href: `/visualizations#${normalize(visualization.title).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    searchText: normalize([
      visualization.title,
      visualization.description,
      visualization.keywords,
    ].join(" ")),
  }));

  const sectionEntries = [
    {
      id: "section-comparisons",
      title: "Career Comparisons",
      description: "Compare seasons, clubs, competitions, and custom date ranges using appearances, goals, assists, scoring rates, and detailed performance statistics.",
      href: "/comparisons",
      keywords: "compare season club competition calendar year goals assists minutes shots key passes xG xA",
    },
    {
      id: "section-community",
      title: "Community & Games",
      description: "Test your knowledge with Ronaldo quizzes and interactive statistical games.",
      href: "/community",
      keywords: "Ronaldo vs Who Guess the Season Higher or Lower daily challenge quiz",
    },
    {
      id: "section-about",
      title: "About & Methodology",
      description: "Learn how the archive is researched and maintained, including its sources, calculations, and data limitations.",
      href: "/about",
      keywords: "sources methodology data research calculations statistics limitations",
    },
  ].map((section) => ({
    ...section,
    type: "Section",
    subtitle: "Explore the archive",
    searchText: normalize([section.title, section.description, section.keywords].join(" ")),
  }));

  const timelineEntries = getTimelineEvents().map((event) => ({
    id: `timeline-${event.date}-${event.description.slice(0, 30)}`,
    type: "Timeline",
    title: event.description,
    subtitle: event.date,
    description: event.details || "Career moment",
    href: "/timeline",
    searchText: normalize([event.date, event.year, event.description, event.details].join(" ")),
  }));

  return [
    ...matchEntries,
    ...articleEntries,
    ...trophyEntries,
    ...honorEntries,
    ...recordEntries,
    ...visualizationEntries,
    ...sectionEntries,
    ...timelineEntries,
  ];
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = typeof params?.q === "string" ? params.q.trim() : "";
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const index = buildSearchIndex();

  const results = tokens.length
    ? index
        .filter((item) => tokens.every((token) => item.searchText.includes(token)))
        .sort((a, b) => {
          const aTitle = normalize(a.title);
          const bTitle = normalize(b.title);
          const aScore = aTitle.startsWith(normalizedQuery) ? 2 : aTitle.includes(normalizedQuery) ? 1 : 0;
          const bScore = bTitle.startsWith(normalizedQuery) ? 2 : bTitle.includes(normalizedQuery) ? 1 : 0;
          if (bScore !== aScore) return bScore - aScore;
          if (a.type === "Match" && b.type === "Match") {
            return b.subtitle.localeCompare(a.subtitle);
          }
          return a.title.localeCompare(b.title);
        })
    : [];

  const typeCounts = {};
  const visibleResults = results.filter((item) => {
    typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
    return typeCounts[item.type] <= 8;
  }).slice(0, 30);

  return (
    <main className="mx-auto max-w-5xl px-6 py-14 sm:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold">
        Search the archive
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-paper sm:text-5xl">
        Find something in Ronaldo&apos;s career.
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-paper-dim">
        Search match logs, articles, trophies, individual honors, records, and career timeline moments.
      </p>

      <form action="/search" method="GET" className="mt-8">
        <label htmlFor="archive-search" className="sr-only">Search the archive</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-line bg-pitch-raised px-4 focus-within:border-gold">
            <Search size={19} className="shrink-0 text-paper-dim" />
            <input
              id="archive-search"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Try an opponent, season, competition, trophy, or milestone..."
              className="min-w-0 flex-1 bg-transparent py-4 text-sm text-paper outline-none placeholder:text-paper-dim/60"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gold px-7 py-3 text-sm font-semibold text-pitch transition hover:bg-gold-bright"
          >
            Search
          </button>
        </div>
      </form>

      {tokens.length > 0 ? (
        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-xl font-semibold text-paper">
              {results.length.toLocaleString("en-US")} {results.length === 1 ? "result" : "results"}
            </h2>
            <p className="font-mono text-xs text-paper-dim">
              Showing up to 30 results
            </p>
          </div>

          {visibleResults.length > 0 ? (
            <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-pitch-raised">
              {visibleResults.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group flex items-start justify-between gap-4 px-5 py-4 transition hover:bg-pitch"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
                      {item.type}
                    </p>
                    <h3 className="mt-1 font-semibold leading-snug text-paper group-hover:text-gold">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="mt-1 text-xs text-paper-dim">{item.subtitle}</p>
                    )}
                    {item.description && (
                      <p className="mt-2 text-sm leading-6 text-paper-dim">{item.description}</p>
                    )}
                  </div>
                  <ArrowUpRight size={17} className="mt-1 shrink-0 text-paper-dim transition group-hover:text-gold" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-line bg-pitch-raised px-5 py-12 text-center">
              <p className="font-semibold text-paper">No results found</p>
              <p className="mt-2 text-sm text-paper-dim">
                Try a different name, opponent, season, or keyword.
              </p>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-12 rounded-2xl border border-line bg-pitch-raised p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-paper">Explore the archive</h2>
          <p className="mt-2 text-sm text-paper-dim">
            Search by opponent, season, club, competition, award, trophy, record, or a memorable career moment.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Real Madrid", "Barcelona", "2011/12", "Champions League", "Ballon d'Or", "hat trick"].map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-line px-3 py-2 text-xs text-paper-dim transition hover:border-gold hover:text-gold"
              >
                {term}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
