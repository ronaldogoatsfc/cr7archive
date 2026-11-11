import Link from "next/link";
import { notFound } from "next/navigation";
import articles from "@/data/articles";
import seasonMatches from "@/data/matches/2011-12.json";
import madridLaDecimaMatches from "@/data/matches/2013-14.json";
import unitedCupMatches from "@/data/matches/2003-04.json";
import unitedUclMatches from "@/data/matches/2007-08.json";
import portugalEuroMatches from "@/data/matches/2015-16.json";
import unitedPremierLeagueMatches from "@/data/matches/2006-07.json";
import { getArticleBySlug, estimateReadingTime } from "@/lib/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(articles, slug);
  if (!article) return { title: "Article not found — The Ronaldo Archive" };
  return { title: `${article.title} — The Ronaldo Archive` };
}

const MATCH_STAT_GROUPS = [
  {
    title: "Shooting",
    fields: [["shots", "Shots"], ["shotsOnTarget", "On target"], ["xG", "xG"], ["freeKickAttempts", "FK attempts"]]
  },
  {
    title: "Creation",
    fields: [["keyPasses", "Key passes"], ["bigChancesCreated", "Big chances created"], ["xA", "xA"], ["accurateThroughballs", "Throughballs"]]
  },
  {
    title: "Other",
    fields: [["successfulDribbles", "Dribbles"], ["aerialDuelsWon", "Aerial duels won"]]
  }
];

function ArticleMatchLog({ date, team = "Real Madrid", competition = "La Liga" }) {
  const matchSource = team === "Real Madrid" && competition === "UEFA Champions League"
    ? madridLaDecimaMatches
    : team === "Manchester United" && competition === "FA Cup"
    ? unitedCupMatches
    : team === "Manchester United" && competition === "UEFA Champions League"
      ? unitedUclMatches
      : team === "Manchester United" && competition === "Premier League"
        ? unitedPremierLeagueMatches
        : team === "Portugal" && competition === "UEFA European Championship"
          ? portugalEuroMatches
          : seasonMatches;
  const match = matchSource.find(
    (item) => item.date === date && item.team === team && item.competition === competition
  );

  if (!match) {
    return <p className="my-4 text-sm text-paper-dim">Match data is not available for this entry.</p>;
  }

  const hasRating = match.stats?.rating !== undefined && match.stats?.rating !== null;
  const opponentScore = match.scoreAgainst;
  const events = [
    ...(match.goalEvents || []).map((event) => ({ ...event, eventType: "Goal" })),
    ...(match.assistEvents || []).map((event) => ({ ...event, eventType: event.optaAssist === false ? "Non-Opta contribution" : "Assist" }))
  ].sort((a, b) => Number(a.minute) - Number(b.minute));

  return (
    <details className="my-4 overflow-hidden rounded-xl border border-line bg-pitch-raised/70 open:border-gold/50">
      <summary className="cursor-pointer list-none px-4 py-4 marker:hidden [&::-webkit-details-marker]:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">{match.date} · {match.venue}</p>
            <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
              <span className="truncate font-display text-sm font-semibold text-paper">{match.team}</span>
              <span className="data-mono text-xl font-bold text-paper">{match.scoreFor}–{opponentScore}</span>
              <span className="truncate text-right font-display text-sm font-semibold text-paper">{match.opponent}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-paper-dim">{match.minutesPlayed}&apos;</span>
            <span className="text-gold">{match.goals} G</span>
            <span className="text-turf-bright">{match.assists} A</span>
            {hasRating && <span className="rounded-sm bg-pitch px-2 py-1 font-bold text-paper">{Number(match.stats.rating).toFixed(1)}{match.stats.motm ? " ★" : ""}</span>}
            <span className="text-gold">+</span>
          </div>
        </div>
      </summary>
      <div className="border-t border-line/70 px-4 py-5">
        <div className="grid gap-5 sm:grid-cols-3">
          {MATCH_STAT_GROUPS.map((group) => {
            const fields = group.fields.filter(([key]) => match.stats?.[key] !== undefined && match.stats?.[key] !== null);
            if (!fields.length && !(group.title === "Other" && match.stats?.motm)) return null;
            return (
              <section key={group.title} className="min-w-0">
                <h3 className="mb-2 border-b border-gold/60 pb-2 font-mono text-[10px] uppercase tracking-widest text-gold">{group.title}</h3>
                <dl className="space-y-2">
                  {fields.map(([key, label]) => (
                    <div key={key} className="flex items-start justify-between gap-2">
                      <dt className="text-xs text-paper-dim">{label}</dt>
                      <dd className="data-mono text-sm font-medium text-paper">{typeof match.stats[key] === "number" && ["xG", "xA"].includes(key) ? match.stats[key].toFixed(2) : match.stats[key]}</dd>
                    </div>
                  ))}
                </dl>
                {group.title === "Other" && match.stats?.motm && <p className="mt-3 border-t border-line pt-2 font-mono text-[10px] uppercase tracking-wider text-gold">★ Man of the Match</p>}
              </section>
            );
          })}
        </div>
        {(match.goals > 0 || match.assists > 0 || (match.assistEvents || []).length > 0) && (
          <div className="mt-5 border-t border-line/70 pt-4">
            <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-gold">Goal involvements</h3>
            {events.length > 0 ? (
              <ul className="space-y-2">
                {events.map((event) => (
                  <li key={event.id} className="flex flex-wrap gap-x-3 text-xs">
                    <span className="data-mono w-8 text-paper-dim">{event.minute}&apos;</span>
                    <span className={event.eventType === "Goal" ? "font-semibold text-gold" : "font-semibold text-turf-bright"}>{event.eventType}</span>
                    <span className="text-paper">{event.eventType === "Goal" ? [event.goalType, event.bodyPart].filter(Boolean).join(" · ") : `For ${event.assistedPlayer}`}{event.assistClarification ? ` · ${event.assistClarification}` : ""}</span>
                    {event.assistedBy && <span className="text-paper-dim">Assist: {event.assistedBy}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-paper-dim">Event-by-event details have not been added; the recorded totals above remain the source for goals and assists.</p>
            )}
          </div>
        )}
        {(match.hasMatchComp && match.matchCompUrl) || (match.hasFullMatch && match.fullMatchUrl) ? (
          <div className="mt-4 flex flex-wrap gap-4 border-t border-line/70 pt-4 font-mono text-[10px] uppercase tracking-wider">
            {match.hasMatchComp && match.matchCompUrl && <a className="text-gold hover:underline" href={match.matchCompUrl} target="_blank" rel="noreferrer">Match compilation ↗</a>}
            {match.hasFullMatch && match.fullMatchUrl && <a className="text-gold hover:underline" href={match.fullMatchUrl} target="_blank" rel="noreferrer">Full match ↗</a>}
          </div>
        ) : null}
      </div>
    </details>
  );
}

function ArticleCompetitionStats({ team, competition }) {
  const isLaDecimaSeason = team === "Real Madrid" && competition === "UEFA Champions League";
  const isPremierLeagueSeason = team === "Manchester United" && competition === "Premier League";
  const matchSource = isLaDecimaSeason
    ? madridLaDecimaMatches
    : isPremierLeagueSeason
    ? unitedPremierLeagueMatches
    : team === "Portugal" && competition === "UEFA European Championship"
      ? portugalEuroMatches
      : unitedUclMatches;
  const matches = matchSource.filter(
    (match) => match.team === team && match.competition === competition
  );

  if (!matches.length) {
    return <p className="my-4 text-sm text-paper-dim">Competition statistics are not available for this entry.</p>;
  }

  const sum = (key) => matches.reduce(
    (total, match) => total + (typeof match.stats?.[key] === "number" ? match.stats[key] : 0),
    0
  );
  const ratedMatches = matches.filter((match) => typeof match.stats?.rating === "number");
  const averageRating = ratedMatches.length
    ? ratedMatches.reduce((total, match) => total + match.stats.rating, 0) / ratedMatches.length
    : null;
  const optaAssists = matches.reduce(
    (total, match) => total + (match.assistEvents || []).filter((event) => event.optaAssist !== false).length,
    0
  );
  const nonOptaContributions = matches.reduce(
    (total, match) => total + (match.assistEvents || []).filter((event) => event.optaAssist === false).length,
    0
  );
  const totalArchiveContributions = optaAssists + nonOptaContributions;

  const groups = isPremierLeagueSeason
    ? [
        {
          title: "Overall",
          fields: [
            ["Appearances", matches.length],
            ["Minutes played", matches.reduce((total, match) => total + match.minutesPlayed, 0)],
            ["Goals", matches.reduce((total, match) => total + match.goals, 0)],
            ["Opta assists", optaAssists],
            ["Non-Opta contributions", nonOptaContributions],
            ["Total archive goal contributions", totalArchiveContributions]
          ]
        }
      ]
    : [
        {
          title: "Overall",
          fields: [
            ["Appearances", matches.length],
            ["Minutes played", matches.reduce((total, match) => total + match.minutesPlayed, 0)],
            ["Goals", matches.reduce((total, match) => total + match.goals, 0)],
            ["Assists", matches.reduce((total, match) => total + match.assists, 0)],
            ["Man of the Match awards", matches.filter((match) => match.stats?.motm).length]
          ]
        },
        {
          title: "Shooting",
          fields: [["Shots", sum("shots")], ["On target", sum("shotsOnTarget")], ["Free-kick attempts", sum("freeKickAttempts")]]
        },
        {
          title: "Creation",
          fields: [["Key passes", sum("keyPasses")], ["Big chances created", sum("bigChancesCreated")], ["Accurate throughballs", sum("accurateThroughballs")]]
        },
        {
          title: "Other",
          fields: [
            ["Successful dribbles", sum("successfulDribbles")],
            ["Aerial duels won", sum("aerialDuelsWon")],
            ...(averageRating !== null ? [["Average rating", averageRating.toFixed(1)]] : [])
          ]
        }
      ];

  return (
    <section className="my-4 overflow-hidden rounded-xl border border-line bg-pitch-raised/70">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">{isLaDecimaSeason ? "2013/14 UEFA Champions League" : isPremierLeagueSeason ? "2006/07 Premier League" : team === "Portugal" ? "2015/16 UEFA European Championship" : "2007/08 UEFA Champions League"}</p>
          <p className="mt-1 font-display text-base font-semibold text-paper">Cristiano Ronaldo · Competition totals</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <span className="text-gold">{matches.reduce((total, match) => total + match.goals, 0)} G</span>
          <span className="text-turf-bright">{isPremierLeagueSeason ? `${totalArchiveContributions} contributions` : `${matches.reduce((total, match) => total + match.assists, 0)} A`}</span>
        </div>
      </div>
      <div className="border-t border-line/70 px-4 py-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {groups.map((group) => (
            <section key={group.title} className="min-w-0">
              <h3 className="mb-2 border-b border-gold/60 pb-2 font-mono text-[10px] uppercase tracking-widest text-gold">{group.title}</h3>
              <dl className="space-y-2">
                {group.fields.map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <dt className="text-xs text-paper-dim">{label}</dt>
                    <dd className="data-mono text-sm font-medium text-paper">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
        <p className="mt-4 border-t border-line/70 pt-3 text-[11px] leading-relaxed text-paper-dim">
          Totals are calculated from {matches.length} recorded appearances. Metrics unavailable in the match data are omitted.
        </p>
      </div>
    </section>
  );
}

function ArticleBlock({ block }) {
  if (block.type === "scoreline") {
    return (
      <div className="my-5 flex items-center justify-between gap-3 rounded-xl border border-line bg-pitch-raised/70 px-4 py-3">
        <span className="min-w-0 flex-1 truncate font-display text-sm font-semibold text-paper">{block.home}</span>
        <span className="data-mono shrink-0 text-xl font-bold text-gold">{block.homeScore}–{block.awayScore}</span>
        <span className="min-w-0 flex-1 truncate text-right font-display text-sm font-semibold text-paper">{block.away}</span>
      </div>
    );
  }

  if (block.type === "matchLog") {
    return <ArticleMatchLog date={block.date} team={block.team} competition={block.competition} />;
  }

  if (block.type === "competitionStats") {
    return <ArticleCompetitionStats team={block.team} competition={block.competition} />;
  }

  if (block.type === "table") {
    return (
      <div className="my-8 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <thead className="bg-pitch-raised font-mono text-[10px] uppercase tracking-wider text-paper-dim">
            <tr>{block.headers.map((header) => <th key={header} className="px-3 py-3 text-right first:text-left">{header}</th>)}</tr>
          </thead>
          <tbody>
            {block.rows.map((row, index) => (
              <tr key={row[0]} className={index < 2 ? "border-t border-line bg-gold/5 text-paper" : "border-t border-line/70 text-paper-dim"}>
                {row.map((cell, cellIndex) => <td key={cellIndex} className={`px-3 py-2.5 text-right tabular-nums ${cellIndex === 1 ? "text-left font-medium" : ""} ${index === 0 && cellIndex === 1 ? "font-semibold text-gold" : ""}`}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === "heading") {
    return (
      <h2 className="mt-8 font-display text-2xl font-semibold text-paper">
        {block.text}
      </h2>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote className="my-6 border-l-2 border-gold pl-4 font-display text-xl text-gold">
        {block.text}
      </blockquote>
    );
  }

  if (block.type === "stats") {
    return (
      <div className="my-8 rounded-2xl border border-line bg-pitch-raised p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {block.items.map((item) => (
            <div key={item.label} className="rounded-xl border border-line bg-pitch p-3">
              <p className="font-display text-2xl font-semibold tabular-nums text-paper">
                {item.value}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-paper-dim">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <figure className="my-8">
        <img
          src={block.src}
          alt={block.alt || ""}
          className="h-auto w-full rounded-xl border border-line"
          loading="lazy"
        />
        {block.caption && (
          <figcaption className="mt-3 text-center text-sm text-paper-dim">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <p className="mt-4 leading-relaxed text-paper-dim">
      {block.text}
    </p>
  );
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(articles, slug);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/articles"
        className="font-mono text-xs uppercase tracking-widest text-paper-dim hover:text-gold"
      >
        ← Back to articles
      </Link>

      {article.tags && article.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-pitch-raised px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h1 className="mt-4 font-display text-4xl font-semibold text-paper">
        {article.title}
      </h1>

      <div className="mt-3 font-mono text-xs text-paper-dim">
        {article.author} · {article.datePublished} ·{" "}
        {estimateReadingTime(article)}
      </div>

      <div className="mt-8">
        {article.content.map((block, i) => (
          <div key={i} id={`article-section-${i}`} className="scroll-mt-28 target:rounded-lg target:bg-gold/5">
            <ArticleBlock block={block} />
          </div>
        ))}
      </div>
    </div>
  );
}