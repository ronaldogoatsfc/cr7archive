"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Film, Video } from "lucide-react";

const STAT_GROUPS = [
  {
    title: "Shooting",
    fields: [
      ["shots", "Shots"],
      ["shotsOnTarget", "Shots on target"],
      ["xG", "Expected goals (xG)", 2],
      ["freeKickAttempts", "Free-kick attempts"],
    ],
  },
  {
    title: "Creation",
    fields: [
      ["keyPasses", "Key passes"],
      ["bigChancesCreated", "Big chances created"],
      ["xA", "Expected assists (xA)", 2],
      ["accurateThroughballs", "Accurate throughballs"],
    ],
  },
  {
    title: "Other",
    fields: [
      ["successfulDribbles", "Successful dribbles"],
      ["aerialDuelsWon", "Aerial duels won"],
    ],
  },
];

function ratingColor(rating) {
  if (rating <= 5.9) return "bg-goal-red text-white";
  if (rating < 7) return "bg-orange-500 text-white";
  if (rating < 8) return "bg-green-600 text-white";
  if (rating < 9) return "bg-sky-300 text-slate-950";
  return "bg-blue-600 text-white";
}

function Result({ result }) {
  const color =
    result === "W" ? "text-turf-bright" :
    result === "L" ? "text-goal-red" : "text-paper-dim";
  return <span className={`font-mono text-xs font-bold ${color}`}>
    {result === "W" ? "WIN" : result === "L" ? "LOSS" : "DRAW"}
  </span>;
}

export default function TimelinePerformanceCard({ event, match, presentation }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(event.date + "T00:00:00");
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });
  const stats = match.stats || {};
  const hasStats = STAT_GROUPS.some((group) =>
    group.fields.some(([key]) => stats[key] !== undefined && stats[key] !== null)
  ) || stats.rating !== undefined && stats.rating !== null || stats.motm;

  return (
    <article className="relative grid gap-3 sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-6">
      <div className="relative z-10 flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1 sm:pt-5">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">{month}</span>
        <span className="stat-number text-3xl font-semibold leading-none text-paper sm:text-4xl">{day}</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-pitch-raised/80 transition duration-300 hover:border-gold/40">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="block w-full p-5 text-left transition hover:bg-pitch-raised sm:p-6"
        >
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
              Performance
            </span>
            {presentation.highlights.map((highlight) => (
              <span key={highlight.label} className="rounded-full border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-paper-dim">
                <span className="text-paper">{highlight.value}</span> {highlight.label}
              </span>
            ))}
            <span className="ml-auto flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-gold">
              {expanded ? "Hide details" : "View details"}
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="font-display text-xl font-semibold text-paper sm:text-2xl">
                {match.team} <span className="text-paper-dim">vs</span> {match.opponent}
              </h3>
              <p className="mt-1 text-xs text-paper-dim">
                {match.competition}{match.stage ? ` · ${match.stage}` : ""} · {match.venue || "Venue not recorded"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4 sm:gap-5">
              <div className="text-right">
                <p className="stat-number text-2xl font-semibold text-paper sm:text-3xl">
                  {match.scoreFor}–{match.scoreAgainst}
                </p>
                <Result result={match.result} />
              </div>
              <div className="h-10 w-px bg-line" />
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="stat-number text-lg font-semibold text-paper">{match.goals ?? 0}</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-paper-dim">Goals</p>
                </div>
                <div>
                  <p className="stat-number text-lg font-semibold text-paper">{match.assists ?? 0}</p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-paper-dim">Assists</p>
                </div>
                <div>
                  <p className="stat-number text-lg font-semibold text-paper">{match.minutesPlayed ?? "—"}<span className="text-xs">′</span></p>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-paper-dim">Minutes</p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 border-t border-line/70 pt-3 text-sm leading-6 text-paper-dim">
            {event.description}
          </p>
        </button>

        {expanded && (
          <div className="border-t border-line bg-pitch px-5 py-5 sm:px-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-gold">Detailed performance</h4>
              {stats.rating !== undefined && stats.rating !== null && (
                <span className={`rounded-lg px-3 py-1.5 font-mono text-sm font-bold ${ratingColor(stats.rating)}`}>
                  {Number(stats.rating).toFixed(1)} Rating
                </span>
              )}
            </div>

            {hasStats ? (
              <div className="grid gap-5 sm:grid-cols-3">
                {STAT_GROUPS.map((group) => {
                  const fields = group.fields
                    .map(([key, label, decimals]) => {
                      const value = stats[key];
                      if (value === undefined || value === null) return null;
                      return { key, label, value: decimals ? Number(value).toFixed(decimals) : value };
                    })
                    .filter(Boolean);
                  if (group.title === "Other") {
                    if (match.yellowCard !== undefined && match.yellowCard !== null) {
                      fields.push({ key: "yellowCard", label: "Yellow cards", value: match.yellowCard ? 1 : 0 });
                    }
                    if (match.redCard !== undefined && match.redCard !== null) {
                      fields.push({ key: "redCard", label: "Red cards", value: match.redCard ? 1 : 0 });
                    }
                  }
                  if (!fields.length && !(group.title === "Other" && stats.motm)) return null;
                  return (
                    <section key={group.title} className="min-w-0">
                      <h5 className="mb-2 border-b border-gold/60 pb-2 font-mono text-[10px] uppercase tracking-widest text-gold">{group.title}</h5>
                      <dl className="space-y-2">
                        {fields.map((field) => (
                          <div key={field.key} className="flex items-start justify-between gap-2">
                            <dt className="text-xs leading-5 text-paper-dim">{field.label}</dt>
                            <dd className="data-mono text-sm font-medium text-paper">{field.value}</dd>
                          </div>
                        ))}
                      </dl>
                      {group.title === "Other" && stats.motm && (
                        <p className="mt-3 border-t border-line pt-2 font-mono text-[10px] uppercase tracking-wider text-gold">★ Man of the Match</p>
                      )}
                    </section>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-paper-dim">Detailed statistics have not been recorded for this match yet.</p>
            )}

            {(match.hasMatchComp || match.hasFullMatch) && (
              <div className="mt-5 flex flex-wrap gap-3 border-t border-line pt-4">
                {match.hasMatchComp && match.matchCompUrl && (
                  <a href={match.matchCompUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-paper transition hover:border-gold hover:text-gold">
                    <Film size={14} /> Watch compilation
                  </a>
                )}
                {match.hasFullMatch && match.fullMatchUrl && (
                  <a href={match.fullMatchUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-paper transition hover:border-gold hover:text-gold">
                    <Video size={14} /> Watch full match
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <span className="absolute left-[7px] top-0 hidden h-full w-px bg-gradient-to-b from-gold/50 via-line to-transparent sm:block" />
    </article>
  );
}
