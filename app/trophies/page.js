"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import trophies from "@/data/trophies.json";
import {
  filterTrophies,
  trophyTotal,
  getYearsSorted,
  getSeasonsSorted,
  getUniqueValues,
} from "@/lib/stats";

const DEFAULT_FILTERS = {
  year: "All",
  season: "All",
  club: "All",
  competition: "All",
  domestic: "All",
  includeFriendlies: false,
};

const CLUB_ORDER = [
  "Sporting CP",
  "Manchester United",
  "Real Madrid",
  "Juventus",
  "Al-Nassr",
  "Portugal",
];

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-widest text-paper-dim">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-pitch px-3 py-2 text-sm text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      >
        <option value="All">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function TrophyGroup({ club, items }) {
  const groupedTrophies = [...items.reduce((groups, trophy) => {
    const key = [trophy.name, trophy.competitionType, trophy.domestic, trophy.isFriendly].join("|");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(trophy);
    return groups;
  }, new Map()).values()].map((group) => ({
    ...group[0],
    wins: [...group].sort((a, b) => a.year - b.year),
    count: group.length,
  }));

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-paper">
          {club}
        </h2>
        <span className="font-mono text-xs uppercase tracking-wider text-paper-dim">
          {items.length} {items.length === 1 ? "trophy" : "trophies"}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groupedTrophies.map((t) => (
            <article
              key={t.id}
              id={`trophy-${t.id}`}
              className="scroll-mt-28 target:border-gold/80 flex flex-col rounded-2xl border border-line bg-pitch-raised p-5 transition hover:border-gold/50"
            >
              {t.wins.slice(1).map((win) => (
                <span key={win.id} id={`trophy-${win.id}`} className="scroll-mt-28" />
              ))}
              <div className="flex items-start justify-between gap-3">
                <span className="font-display text-lg font-semibold leading-snug text-paper">
                  {t.name}
                </span>
              </div>
              <div className="mt-4 border-t border-line pt-3">
                <div className="flex flex-col gap-3">
                  {t.wins.map((win) => (
                    <div key={win.id} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="stat-number text-xl leading-relaxed text-gold">
                          {win.year}
                        </span>
                        <span className="text-xs text-paper-dim">{win.season}</span>
                      </div>
                      {win.articleSlug && (
                        <Link
                          href={`/articles/${win.articleSlug}`}
                          className="text-xs font-semibold text-gold transition hover:text-gold-bright"
                        >
                          Read article →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {t.isFriendly && (
                  <span className="rounded-full border border-goal-red px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-goal-red">
                    Friendly — not counted
                  </span>
                )}
                <span className="rounded-full bg-pitch px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-paper-dim">
                  {t.domestic ? "Domestic" : "International"}
                </span>
                {t.count > 1 && (
                  <span className="rounded-full bg-pitch px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-paper-dim">
                    {t.count} wins
                  </span>
                )}
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}

export default function TrophiesPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const years = useMemo(() => getYearsSorted(trophies), []);
  const seasons = useMemo(() => getSeasonsSorted(trophies), []);
  const clubs = useMemo(() => getUniqueValues(trophies, "club"), []);
  const competitions = useMemo(() => getUniqueValues(trophies, "name"), []);

  const filtered = useMemo(
    () => filterTrophies(trophies, filters).sort((a, b) => b.year - a.year),
    [filters]
  );

  const officialCount = useMemo(() => trophyTotal(filtered), [filtered]);
  const friendlyCount = filtered.filter((t) => t.isFriendly).length;

  const grouped = useMemo(() => {
    const groups = new Map();
    for (const trophy of filtered) {
      if (!groups.has(trophy.club)) groups.set(trophy.club, []);
      groups.get(trophy.club).push(trophy);
    }
    return [...groups.entries()].sort(([a], [b]) => {
      const aIndex = CLUB_ORDER.indexOf(a);
      const bIndex = CLUB_ORDER.indexOf(b);
      return (aIndex === -1 ? CLUB_ORDER.length : aIndex) -
        (bIndex === -1 ? CLUB_ORDER.length : bIndex);
    });
  }, [filtered]);

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="font-mono text-xl uppercase tracking-[0.3em] text-gold">
        Trophy cabinet
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-paper">
        {officialCount} official trophies
      </h1>
      <p className="mt-2 max-w-2xl text-paper-dim">
        Filter by year, season, club, competition, or domestic vs.
        international. Trophies are organized by team. Friendly and exhibition
        trophies are shown separately and never count toward the official total.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl border border-line bg-pitch-raised p-5 sm:grid-cols-3 lg:grid-cols-5">
        <Select label="Year" value={filters.year} onChange={(v) => updateFilter("year", v)} options={years} />
        <Select label="Season" value={filters.season} onChange={(v) => updateFilter("season", v)} options={seasons} />
        <Select label="Club" value={filters.club} onChange={(v) => updateFilter("club", v)} options={clubs} />
        <Select label="Competition" value={filters.competition} onChange={(v) => updateFilter("competition", v)} options={competitions} />
        <Select label="Domestic" value={filters.domestic} onChange={(v) => updateFilter("domestic", v)} options={["Domestic", "International"]} />
        <label className="col-span-2 flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-paper-dim sm:col-span-1">
          <input
            type="checkbox"
            checked={filters.includeFriendlies}
            onChange={(e) => updateFilter("includeFriendlies", e.target.checked)}
            className="accent-[color:var(--gold)]"
          />
          Include friendlies
        </label>
        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="rounded-lg border border-line px-3 py-2 text-sm text-paper-dim transition hover:bg-pitch hover:text-paper"
        >
          Reset filters
        </button>
      </div>

      {filters.includeFriendlies && (
        <p className="mt-4 font-mono text-xs text-paper-dim">
          Showing {friendlyCount} friendly/exhibition {friendlyCount === 1 ? "trophy" : "trophies"} below, marked and excluded from the count above.
        </p>
      )}

      {grouped.length > 0 ? (
        grouped.map(([club, items]) => <TrophyGroup key={club} club={club} items={items} />)
      ) : (
        <div className="mt-6 rounded-2xl border border-line bg-pitch-raised px-5 py-10 text-center text-paper-dim">
          No trophies fit these filters. Try resetting them.
        </div>
      )}
    </div>
  );
}