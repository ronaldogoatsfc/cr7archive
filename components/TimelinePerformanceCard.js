"use client";

import { useEffect, useState } from "react";
import { X, Film, Video } from "lucide-react";
import TimelineDetailsPanel from "@/components/TimelineDetailsPanel";

const STAT_GROUPS = [
  { title: "Shooting", fields: [["shots", "Shots"], ["shotsOnTarget", "Shots on target"], ["xG", "Expected goals (xG)", 2], ["freeKickAttempts", "Free-kick attempts"]] },
  { title: "Creation", fields: [["keyPasses", "Key passes"], ["bigChancesCreated", "Big chances created"], ["xA", "Expected assists (xA)", 2], ["accurateThroughballs", "Accurate throughballs"]] },
  { title: "Other", fields: [["successfulDribbles", "Successful dribbles"], ["aerialDuelsWon", "Aerial duels won"]] },
];

function ratingColor(rating) {
  if (rating <= 5.9) return "bg-goal-red text-white";
  if (rating < 7) return "bg-orange-500 text-white";
  if (rating < 8) return "bg-green-600 text-white";
  if (rating < 9) return "bg-sky-300 text-slate-950";
  return "bg-blue-600 text-white";
}

function Result({ result }) {
  const color = result === "W" ? "text-turf-bright" : result === "L" ? "text-goal-red" : "text-paper-dim";
  return <span className={`font-mono text-xs font-bold ${color}`}>{result === "W" ? "WIN" : result === "L" ? "LOSS" : "DRAW"}</span>;
}

function MatchStats({ match }) {
  const stats = match.stats || {};
  const hasStats = STAT_GROUPS.some((group) => group.fields.some(([key]) => stats[key] !== undefined && stats[key] !== null)) ||
    (stats.rating !== undefined && stats.rating !== null) || stats.motm;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-gold">Detailed performance</h3>
        {stats.rating !== undefined && stats.rating !== null && (
          <span className={`rounded-lg px-3 py-1.5 font-mono text-sm font-bold ${ratingColor(stats.rating)}`}>{Number(stats.rating).toFixed(1)} Rating</span>
        )}
      </div>
      {hasStats ? (
        <div className="grid gap-5 sm:grid-cols-3">
          {STAT_GROUPS.map((group) => {
            const fields = group.fields.map(([key, label, decimals]) => {
              const value = stats[key];
              if (value === undefined || value === null) return null;
              return { key, label, value: decimals ? Number(value).toFixed(decimals) : value };
            }).filter(Boolean);
            if (group.title === "Other") {
              if (match.yellowCard !== undefined && match.yellowCard !== null) fields.push({ key: "yellowCard", label: "Yellow cards", value: match.yellowCard ? 1 : 0 });
              if (match.redCard !== undefined && match.redCard !== null) fields.push({ key: "redCard", label: "Red cards", value: match.redCard ? 1 : 0 });
            }
            if (!fields.length && !(group.title === "Other" && stats.motm)) return null;
            return (
              <section key={group.title} className="min-w-0">
                <h4 className="mb-2 border-b border-gold/60 pb-2 font-mono text-[10px] uppercase tracking-widest text-gold">{group.title}</h4>
                <dl className="space-y-2">
                  {fields.map((field) => (
                    <div key={field.key} className="flex items-start justify-between gap-2">
                      <dt className="text-xs leading-5 text-paper-dim">{field.label}</dt>
                      <dd className="data-mono text-sm font-medium text-paper">{field.value}</dd>
                    </div>
                  ))}
                </dl>
                {group.title === "Other" && stats.motm && <p className="mt-3 border-t border-line pt-2 font-mono text-[10px] uppercase tracking-wider text-gold">★ Man of the Match</p>}
              </section>
            );
          })}
        </div>
      ) : <p className="text-sm text-paper-dim">Detailed statistics have not been recorded for this match yet.</p>}
    </>
  );
}

export default function TimelinePerformanceCard({ event, match, presentation, details }) {
  const [open, setOpen] = useState(false);
  const date = new Date(event.date + "T00:00:00");
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.toLocaleDateString("en-US", { day: "2-digit" });

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (keyEvent) => { if (keyEvent.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      <article className="relative grid gap-3 sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-6">
        <div className="relative z-10 flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1 sm:pt-5">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper-dim">{month}</span>
          <span className="stat-number text-3xl font-semibold leading-none text-paper sm:text-4xl">{day}</span>
        </div>
        <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog"
          className="group/card w-full rounded-2xl border border-line bg-pitch-raised/80 p-5 text-left transition duration-300 hover:border-gold/50 hover:bg-pitch-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:p-6">
          <div className="mb-4 flex justify-end">
            <span className="font-mono text-[10px] uppercase tracking-wider text-gold opacity-80 transition group-hover/card:opacity-100">Click to view full performance ↗</span>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h3 className="font-display text-xl font-semibold text-paper sm:text-2xl">{match.team} <span className="text-paper-dim">vs</span> {match.opponent}</h3>
              <p className="mt-1 text-xs text-paper-dim">{match.competition}{match.stage ? ` · ${match.stage}` : ""} · {match.venue || "Venue not recorded"}{match.dataSource === "unofficial" && <span className="ml-2 font-mono text-[9px] uppercase tracking-wider text-gold">· Unofficial match data</span>}</p>
            </div>
            <div className="flex shrink-0 items-center gap-4 sm:gap-5">
              <div className="text-right"><p className="stat-number text-2xl font-semibold text-paper sm:text-3xl">{match.scoreFor}–{match.scoreAgainst}</p><Result result={match.result} /></div>
              <div className="h-10 w-px bg-line" />
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="stat-number text-lg font-semibold text-paper">{match.goals ?? 0}</p><p className="font-mono text-[9px] uppercase tracking-wider text-paper-dim">Goals</p></div>
                <div><p className="stat-number text-lg font-semibold text-paper">{match.assists ?? 0}</p><p className="font-mono text-[9px] uppercase tracking-wider text-paper-dim">Assists</p></div>
                <div><p className="stat-number text-lg font-semibold text-paper">{match.minutesPlayed ?? "—"}<span className="text-xs">′</span></p><p className="font-mono text-[9px] uppercase tracking-wider text-paper-dim">Minutes</p></div>
              </div>
            </div>
          </div>
          <p className="mt-4 border-t border-line/70 pt-3 text-sm leading-6 text-paper-dim">{event.description}</p>
          {(() => {
            const preview = [
              ["Rating", match.stats?.rating != null ? Number(match.stats.rating).toFixed(1) : null],
              ["Shots", match.stats?.shots],
              ["On target", match.stats?.shotsOnTarget],
              ["Key passes", match.stats?.keyPasses],
              ["xG", match.stats?.xG != null ? Number(match.stats.xG).toFixed(2) : null],
            ].filter(([, value]) => value !== undefined && value !== null).slice(0, 3);
            return preview.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {preview.map(([label, value]) => (
                  <span key={label} className="inline-flex items-center gap-2 rounded-lg border border-line bg-pitch px-3 py-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-paper-dim">{label}</span>
                    <span className="data-mono text-sm font-semibold text-paper">{value}</span>
                  </span>
                ))}
              </div>
            ) : null;
          })()}
        </button>
        <span className="absolute left-[7px] top-0 hidden h-full w-px bg-gradient-to-b from-gold/50 via-line to-transparent sm:block" />
      </article>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
          <button type="button" aria-label="Close moment details" onClick={() => setOpen(false)} className="absolute inset-0 cursor-default bg-black/75 backdrop-blur-sm" />
          <section role="dialog" aria-modal="true" aria-labelledby="timeline-performance-title" className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gold/25 bg-pitch-raised shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-pitch-raised/95 px-5 py-4 backdrop-blur sm:px-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">{date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close details" className="rounded-full border border-line p-2 text-paper-dim transition hover:border-gold hover:text-gold"><X size={17} /></button>
            </div>
            <div className="p-5 sm:p-7">
              <h2 id="timeline-performance-title" className="font-display text-2xl font-semibold text-paper sm:text-3xl">{match.team} <span className="text-paper-dim">vs</span> {match.opponent}</h2>
              <p className="mt-2 text-xs leading-5 text-paper-dim">{match.competition}{match.stage ? ` · ${match.stage}` : ""} · {match.venue || "Venue not recorded"}{match.dataSource === "unofficial" && <span className="ml-2 font-mono text-[9px] uppercase tracking-wider text-gold">· Unofficial match data</span>}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-5 rounded-xl border border-line bg-pitch px-4 py-4 sm:px-5">
                <div><p className="stat-number text-3xl font-semibold text-paper">{match.scoreFor}–{match.scoreAgainst}</p><Result result={match.result} /></div>
                <div className="grid grid-cols-3 gap-5 text-center">
                  <div><p className="stat-number text-xl font-semibold text-paper">{match.goals ?? 0}</p><p className="font-mono text-[9px] uppercase tracking-wider text-paper-dim">Goals</p></div>
                  <div><p className="stat-number text-xl font-semibold text-paper">{match.assists ?? 0}</p><p className="font-mono text-[9px] uppercase tracking-wider text-paper-dim">Assists</p></div>
                  <div><p className="stat-number text-xl font-semibold text-paper">{match.minutesPlayed ?? "—"}′</p><p className="font-mono text-[9px] uppercase tracking-wider text-paper-dim">Minutes</p></div>
                </div>
              </div>
              <p className="mt-5 text-sm leading-7 text-paper-dim">{event.description}</p>
              <TimelineDetailsPanel details={details} />
              {match.dataSource === "unofficial" && <p className="mt-4 rounded-lg border border-gold/20 bg-pitch px-3 py-2 text-[11px] leading-5 text-paper-dim">Unofficial match data: score, minutes, goals, and assists are taken from manually recorded match logs. Detailed performance metrics are not available for this entry.</p>}
              <div className="mt-7 border-t border-line pt-5"><MatchStats match={match} /></div>
              {(match.hasMatchComp || match.hasFullMatch) && (
                <div className="mt-6 flex flex-wrap gap-3 border-t border-line pt-5">
                  {match.hasMatchComp && match.matchCompUrl && <a href={match.matchCompUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-paper transition hover:border-gold hover:text-gold"><Film size={14} /> Watch compilation</a>}
                  {match.hasFullMatch && match.fullMatchUrl && <a href={match.fullMatchUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs text-paper transition hover:border-gold hover:text-gold"><Video size={14} /> Watch full match</a>}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
